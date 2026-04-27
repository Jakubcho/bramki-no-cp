import { NextRequest, NextResponse } from "next/server";
import { prismaData } from "@/lib/prisma-data";
import { logApiError } from "@/lib/logger";
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

  // Dynamically create PostgreSQL partition if it doesn't exist
  await prismaData.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "StatsEntry_${safe}"
    PARTITION OF "StatsEntry"
    FOR VALUES IN ('${slug}');
  `);
}

export async function POST(req: NextRequest) {
  let bodyData = { domain: "", meta: "", year: "" };

  try {
    const auth = req.headers.get("authorization");
    const body = await req.json();
    bodyData = { domain: body.domain, meta: body.meta, year: body.year };

    const { domain, meta, year, data: entries = {} } = body;

    if (!domain || !meta || !year) {
      return NextResponse.json(
        { error: "Missing required fields: domain, meta, or year" },
        { status: 400 }
      );
    }

    const token = generateToken(domain);

    if (!auth || auth !== token) {
      await logApiError({
        endpoint: "/api/stats/import",
        method: "POST_AUTH",
        message: "Unauthorized stats import attempt: Token mismatch",
        payload: { domain, providedToken: auth },
        status: 401
      });
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const slug = `${meta}-${year}`;

    try {
      await ensurePartition(slug);
    } catch (partitionErr: any) {
      await logApiError({
        endpoint: "/api/stats/import",
        method: "ENSURE_PARTITION",
        message: `Failed to create or verify partition table: ${partitionErr.message}`,
        payload: { slug },
        status: 500
      });
      throw partitionErr;
    }

    const entryKeys = Object.keys(entries);
    if (!entryKeys.length) {
      return NextResponse.json({ imported: 0 });
    }

    const BATCH_SIZE = 1000;
    let buffer: any[] = [];
    let imported = 0;

    for (const key of entryKeys) {
      const e = entries[key];

      buffer.push({
        eventSlug: slug,
        entryId: String(e.id),
        formId: e.form_id ? Number(e.form_id) : null,
        email: e.email ?? null,
        phone: e.telefon ?? null, // Mapping from source 'telefon'
        fullName: e.dane ?? null,   // Mapping from source 'dane'
        company: e.firma ?? null,   // Mapping from source 'firma'
        qrCode: e.qrCode ?? null,
        qrCodeUrl: e.qrCodeUrl ?? null,
        sourceUrl: e.source_url ?? null,
        status: e.status ?? null,
        userAgent: e.user_agent ?? null,
        formData: e,
        // Initialization of activation fields
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
        buffer = []; // Reset buffer
      }
    }

    if (buffer.length > 0) {
      await prismaData.statsEntry.createMany({
        data: buffer,
        skipDuplicates: true
      });
      imported += buffer.length;
    }

    return NextResponse.json({
      success: true,
      imported,
      eventSlug: slug
    });

  } catch (error: any) {
    await logApiError({
      endpoint: "/api/stats/import",
      method: "POST_IMPORT",
      message: `Stats import failed: ${error.message}`,
      payload: bodyData,
      status: 500
    });

    return NextResponse.json(
      { error: "Internal server error during stats import" },
      { status: 500 }
    );
  }
}