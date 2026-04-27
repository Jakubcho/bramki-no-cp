import { NextRequest, NextResponse } from "next/server";
import { prismaActivation } from "@/lib/prisma-activation";
import { prismaCore } from "@/lib/prisma-core";
import { logApiError } from "@/lib/logger";
import crypto from "crypto";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ slug: string; qr: string }> }
) {
  const { slug, qr } = await context.params;
  const { searchParams } = new URL(req.url);
  const domain = searchParams.get("domain");

  try {

    const event = await prismaCore.event.findUnique({
      where: { slug },
      include: { partitions: true }
    });

    if (!event) return NextResponse.json({ error: "Event not found" }, { status: 404 });

    const qrLower = qr.toLowerCase();
    const allowedPrefixes = event.qrPrefixes || [];
    if (allowedPrefixes.length > 0 && !allowedPrefixes.some(p => qrLower.startsWith(p.toLowerCase()))) {
      return NextResponse.json({ error: "Invalid badge prefix" }, { status: 400 });
    }

    const partitions = event.partitions.length > 0 ? event.partitions : [{ partitionSlug: slug }];
    for (const p of partitions) {
      const tableName = `ActivationEntry_${p.partitionSlug.replace(/-/g, "_")}`;
      try {
        const result = await prismaActivation.$queryRawUnsafe<any[]>(
          `SELECT * FROM "${tableName}" WHERE "qrCode" = $1 LIMIT 1`,
          qr
        );
        if (result?.[0]) {
          return NextResponse.json({ ...result[0], foundInPartition: p.partitionSlug });
        }
      } catch (e) { }
    }

    if (domain) {
      const qrPattern = /^([A-Z]{4})(?!999)(\d{3})(\d{5,6})rnd/i;
      const match = qr.match(qrPattern);

      if (match) {
        const extractedEntryId = match[3];

        const generateToken = () => {
          const secret = process.env.ACTIVATION_TOKEN || "";
          const formatted = new Intl.DateTimeFormat("pl-PL", {
            timeZone: "Europe/Warsaw", day: "2-digit", month: "2-digit", year: "numeric",
          }).format(new Date()).replace(/\./g, "-");
          return crypto.createHmac("sha256", secret).update(formatted).digest("hex");
        };

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        try {
          const cleanDomain = domain.replace(/^https?:\/\//i, "").replace(/\/+$/, "");
          const externalUrl = `https://${cleanDomain}/wp-content/plugins/custom-element/pwe-cdb/activation_recheck.php`;

          const externalRes = await fetch(externalUrl, {
            method: 'POST',
            signal: controller.signal,
            cache: 'no-store',
            headers: {
              'Authorization': generateToken(),
              'Content-Type': 'application/json',
            },
            body: JSON.stringify([parseInt(extractedEntryId, 10)])
          });

          clearTimeout(timeoutId);

          if (externalRes.ok) {
            const json = await externalRes.json();

            const remoteEntry = json?.data?.payload?.entries?.[extractedEntryId];

            if (remoteEntry) {

              return NextResponse.json({
                entryId: remoteEntry.entry_id,
                qrCode: remoteEntry.Qrcode,
                email: remoteEntry.email,
                phone: remoteEntry.phone,
                fullName: remoteEntry.full_name || "",

                location: remoteEntry.location || "",
                streetAddress: remoteEntry.street_address || "",
                houseNumber: remoteEntry.house_number || "",
                postalCode: remoteEntry.postal_code || "",
                city: remoteEntry.city || "",
                country: remoteEntry.country || "",

                domain: json?.data?.payload?.domain || domain,
                badge: json?.data?.payload?.badge || "",
                fairYear: json?.data?.payload?.fairYear || "",
                fairDate: json?.data?.payload?.fairDate || "",
                formName: remoteEntry.form_name,
                formId: remoteEntry.form_id,

                foundInPartition: "EXTERNAL_DOMAIN_FALLBACK",

                answers: {
                  ...remoteEntry,
                  source_url: remoteEntry.source_url
                }
              });
            }
          }
        } catch (err: any) {
          clearTimeout(timeoutId);
          if (err.name !== 'AbortError') {
            await logApiError({
              endpoint: `/api/qr/${slug}/${qr}`,
              method: "EXTERNAL_FALLBACK_FAILED",
              message: err.message,
              status: 500
            });
          }
        }
      }
    }

    return NextResponse.json({ error: "QR code not found" }, { status: 404 });

  } catch (error: any) {
    await logApiError({
      endpoint: `/api/qr/${slug}/${qr}`,
      method: "QR_GET_CRITICAL",
      message: error.message,
      status: 500
    });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}