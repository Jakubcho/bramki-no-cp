import { NextRequest, NextResponse } from "next/server";
import { prismaCore } from "@/lib/prisma-core";
import { prismaActivation } from "@/lib/prisma-activation";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  // Usuwamy sprawdzanie authKey - zakładamy ochronę przez middleware/sesję

  const body = await req.json();
  const { slug } = body;

  if (!slug) return NextResponse.json({ error: "Missing slug" }, { status: 400 });

  try {
    const event = await prismaCore.event.findUnique({
      where: { slug },
      include: { partitions: true }
    });

    if (!event || !event.domain) {
      return NextResponse.json({ error: "Event or domain not found" }, { status: 404 });
    }

    const domain = event.domain;
    const partitions = event.partitions.length > 0 ? event.partitions : [{ partitionSlug: slug }];
    const results = [];

    for (const p of partitions) {
      const tableName = `ActivationEntry_${p.partitionSlug.replace(/-/g, "_")}`;

      const missingRecords = await prismaActivation.$queryRawUnsafe<any[]>(
        `SELECT "entryId" FROM "${tableName}" WHERE ("formName" IS NULL OR "formName" = '') LIMIT 1000`
      );

      if (missingRecords.length === 0) continue;

      const entryIds = missingRecords.map(r => parseInt(r.entryId, 10));

      const cleanDomain = domain.replace(/^https?:\/\//i, "").replace(/\/+$/, "");
      const externalUrl = `https://${cleanDomain}/wp-content/plugins/custom-element/pwe-cdb/activation_recheck.php`;

      const formattedDate = new Intl.DateTimeFormat("pl-PL", {
        timeZone: "Europe/Warsaw", day: "2-digit", month: "2-digit", year: "numeric",
      }).format(new Date()).replace(/\./g, "-");

      const token = crypto.createHmac("sha256", process.env.ACTIVATION_TOKEN || "")
        .update(formattedDate).digest("hex");

      console.log(entryIds);

      const externalRes = await fetch(externalUrl, {
        method: 'POST',
        headers: {
          'Authorization': token, // To zostaje, bo Marek tego wymaga
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(entryIds)
      });

      if (externalRes.ok) {
        const json = await externalRes.json();
        const remoteEntries = json?.data?.payload?.entries || {};



        for (const entryId of entryIds) {
          const data = remoteEntries[entryId];
          if (data && data.form_name) {
            await prismaActivation.$executeRawUnsafe(
              `UPDATE "${tableName}" SET
                "formName" = $1,
                "formId" = $2,
                "fullName" = $3,
                "streetAddress" = $4,
                "houseNumber" = $5,
                "city" = $6,
                "postalCode" = $7
               WHERE "entryId" = $8`,
              data.form_name,
              parseInt(data.form_id, 10),
              data.full_name,
              data.street_address,
              data.house_number,
              data.city,
              data.postal_code,
              entryId.toString()
            );
            results.push({ entryId, status: "updated" });
          }
        }
      }
    }

    return NextResponse.json({
      processedCount: results.length
    });

  } catch (error: any) {
    console.error("Reconciliation Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}