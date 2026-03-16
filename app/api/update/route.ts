import { NextRequest, NextResponse } from "next/server";
import { prismaActivation } from "@/lib/prisma-activation";
import crypto from "crypto";

function generateToken() {
  const secret = "zLCJN6Y6cT3cZG3L";

  const now = new Date();
  const formatter = new Intl.DateTimeFormat("pl-PL", {
    timeZone: "Europe/Warsaw",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const formatted = formatter.format(now).replace(/\./g, "-");

  return crypto
    .createHmac("sha256", secret)
    .update(formatted)
    .digest("hex");
}

async function ensurePartition(slug: string) {
  const safe = slug.replace(/[^a-zA-Z0-9_]/g, "_");

  await prismaActivation.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "ActivationEntry_${safe}"
    PARTITION OF "ActivationEntry"
    FOR VALUES IN ('${slug}');
  `);
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader || authHeader !== generateToken()) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const form = await req.formData();

    const domain = form.get("domain") as string;
    const badge = form.get("badge") as string;
    const fairYear = form.get("fairYear") as string;
    const fairDate = form.get("fairDate") as string;

    if (!badge || !fairYear) {
      return NextResponse.json({ error: "Missing event data" }, { status: 400 });
    }

    const slug = `${badge}-${fairYear}`;

    await ensurePartition(slug);

    const entries: Record<string, any> = {};

    for (const [key, value] of form.entries()) {
      const match = key.match(/^entries\[(.+?)\]\[(.+?)\]$/);
      if (!match) continue;

      const entryId = match[1];
      const field = match[2];

      if (!entries[entryId]) {
        entries[entryId] = {};
      }

      entries[entryId][field] = value;
    }

    if (!Object.keys(entries).length) {
      return NextResponse.json({ error: "No entries" }, { status: 400 });
    }

    const confirmedIds: string[] = [];

    for (const key of Object.keys(entries)) {
      const e = entries[key];

      await prismaActivation.activationEntry.upsert({
        where: {
          slug_entryId: {
            slug,
            entryId: String(e.entry_id),
          },
        },
        update: {
          email: e.email ?? null,
          phone: e.phone ?? null,
          fullName: e.full_name ?? null,
          streetAddress: e.street_address ?? null,
          houseNumber: e.house_number ?? null,
          apartmentNumber: e.apartment_number ?? null,
          postalCode: e.postal_code ?? null,
          city: e.city ?? null,
          country: e.country ?? null,
          qrCode: e.Qrcode ?? null,
          fairDate,
        },
        create: {
          slug,
          entryId: String(e.entry_id),
          qrCode: e.Qrcode ?? "",
          email: e.email ?? null,
          phone: e.phone ?? null,
          fullName: e.full_name ?? null,
          streetAddress: e.street_address ?? null,
          houseNumber: e.house_number ?? null,
          apartmentNumber: e.apartment_number ?? null,
          postalCode: e.postal_code ?? null,
          city: e.city ?? null,
          country: e.country ?? null,
          domain,
          badge,
          fairYear,
          fairDate,
        },
      });

      confirmedIds.push(String(e.entry_id));
    }

    return NextResponse.json(confirmedIds);
  } catch (error: any) {
    console.error("ACTIVATION API ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}