import { NextRequest, NextResponse } from "next/server";
import { prismaData } from "@/lib/prisma-data";
import crypto from "crypto";

const SECRET = process.env.BDG_SECRET || "";

function generateToken(domain: string) {
  return crypto
    .createHmac("sha256", SECRET)
    .update(domain)
    .digest("hex");
}

async function ensurePartition(slug: string) {
  const safe = slug.replace(/[^a-zA-Z0-9_]/g, "_");

  await prismaData.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "StatsEntry_${safe}"
    PARTITION OF "StatsEntry"
    FOR VALUES IN ('${slug}');
  `);
}

function domainToSlug(domain: string, year: string) {
  const clean = domain.replace(/^https?:\/\//, "").replace(/\./g, "-");
  return `${clean}-${year}`;
}

function safeString(v: any) {
  return typeof v === "string" ? v : null;
}

export async function GET(req: NextRequest) {
  try {

    const { searchParams } = new URL(req.url);

    const domain = searchParams.get("domain");
    const year = searchParams.get("year") || "2026";
    const limit = Number(searchParams.get("limit") || "1000");

    if (!domain) {
      return NextResponse.json(
        { error: "domain param required" },
        { status: 400 }
      );
    }

    const slug = domainToSlug(domain, year);

    await ensurePartition(slug);

    const token = generateToken(domain);

    const lastIdResult: any = await prismaData.$queryRawUnsafe(`
    SELECT "entryId" FROM "StatsEntry"
    WHERE "eventSlug" = '${slug}'
    ORDER BY CAST("entryId" AS INTEGER) DESC
    LIMIT 1
  `);

    const lastIdInDb = lastIdResult.length > 0 ? lastIdResult[0].entryId : "0";

    const response = await fetch(`https://${domain}/wp-content/plugins/custom-element/bdg_stats/new_bdg.php`, {
      method: 'POST',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        last_id: lastIdInDb,
        last_form: "0"
      }),
      cache: "no-store"
    });

    if (!response.ok) {
      const errorText = await response.text();

      return NextResponse.json(
        {
          error: "Remote API error",
          details: errorText,
          status: response.status
        },
        { status: 500 }
      );
    }

    const body = await response.json();

    const entries = body.data || {};
    const entryKeys = Object.keys(entries).slice(0, limit);

    if (!entryKeys.length) {
      return NextResponse.json({ imported: 0 });
    }

    const BATCH_SIZE = 1000;
    const buffer: any[] = [];
    let imported = 0;

    for (const key of entryKeys) {
      const e = entries[key];

      buffer.push({

        id: `${slug}_${e.id}`,

        eventSlug: slug,
        entryId: String(e.id),
        formId: e.form_id ? Number(e.form_id) : null,

        email: safeString(e.email),
        phone: safeString(e.telefon),
        fullName: safeString(e.dane),
        company: safeString(e.firma),

        qrCode: safeString(e.qrCode),
        qrCodeUrl: safeString(e.qrCodeUrl),

        sourceUrl: safeString(e.source_url),
        status: safeString(e.status),
        userAgent: safeString(e.user_agent),

        formData: e,

        firstNameActivation: null,
        lastNameActivation: null,
        emailActivation: null,
        phoneActivation: null,

        streetActivation: null,
        buildingActivation: null,
        postalCodeActivation: null,
        cityActivation: null,
        countryActivation: null,

        activationForm: null
      });

      if (buffer.length >= BATCH_SIZE) {
        await prismaData.statsEntry.createMany({
          data: buffer,
          skipDuplicates: true
        });

        imported += buffer.length;
        buffer.length = 0;
      }
    }

    if (buffer.length) {
      await prismaData.statsEntry.createMany({
        data: buffer,
        skipDuplicates: true
      });

      imported += buffer.length;
    }

    return NextResponse.json({
      imported,
      eventSlug: slug,
      limit
    });

  } catch (error: any) {

    console.error("IMPORT ERROR:", error);

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}