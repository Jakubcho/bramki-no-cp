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

export async function POST(req: NextRequest) {
  try {
    const auth = req.headers.get("authorization");
    const body = await req.json();

    const domain: string = body.domain;
    const meta: string = body.meta;
    const year: string = body.year;

    if (!domain || !meta || !year) {
      return NextResponse.json(
        { error: "Missing domain/meta/year" },
        { status: 400 }
      );
    }

    const token = generateToken(domain);

    if (!auth || auth !== token) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const slug = `${meta}-${year}`;

    await ensurePartition(slug);

    const entries = body.data || {};
    const entryKeys = Object.keys(entries);

    if (!entryKeys.length) {
      return NextResponse.json({ imported: 0 });
    }

    const BATCH_SIZE = 1000;
    const buffer: any[] = [];
    let imported = 0;

    for (const key of entryKeys) {
      const e = entries[key];

      buffer.push({
        eventSlug: slug,
        entryId: String(e.id),
        formId: e.form_id ? Number(e.form_id) : null,

        email: e.email ?? null,
        phone: e.telefon ?? null,
        fullName: e.dane ?? null,
        company: e.firma ?? null,

        qrCode: e.qrCode ?? null,
        qrCodeUrl: e.qrCodeUrl ?? null,

        sourceUrl: e.source_url ?? null,
        status: e.status ?? null,

        userAgent: e.user_agent ?? null,

        formData: e,

        /*
        pola aktywacji (na przyszłość)
        */
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
      eventSlug: slug
    });
  } catch (error: any) {
    console.error("STATS IMPORT ERROR:", error);

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}