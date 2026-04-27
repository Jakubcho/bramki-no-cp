import { NextRequest, NextResponse } from "next/server";
import { prismaActivation } from "@/lib/prisma-activation";
import { prismaCore } from "@/lib/prisma-core"; // DODANE: import bazy głównej
import { logApiError } from "@/lib/logger";
import crypto from "crypto";

function generateToken() {
  const secret = process.env.ACTIVATION_TOKEN || "";
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("pl-PL", {
    timeZone: "Europe/Warsaw",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const formatted = formatter.format(now).replace(/\./g, "-");
  return crypto.createHmac("sha256", secret).update(formatted).digest("hex");
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
  let bodyData = {};

  try {
    const authHeader = req.headers.get("authorization");
    const expectedToken = generateToken();

    if (!authHeader || authHeader !== expectedToken) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const formData = await req.formData();
    const domain = formData.get("domain") as string;
    const badge = formData.get("badge") as string;
    const fairYear = formData.get("fairYear") as string;
    const fairDate = formData.get("fairDate") as string;

    if (!badge || !fairYear) {
      return NextResponse.json({ error: "Missing required event data" }, { status: 400 });
    }

    const slug = `${badge}_${fairYear}`.replace(/[^a-zA-Z0-9_]/g, "_");
    bodyData = { slug, domain, badge };

    await ensurePartition(slug);

    // --- NOWA LOGIKA: POBIERANIE MAPOWANIA TYPÓW BILETÓW ---
    const eventPartition = await prismaCore.eventPartition.findFirst({
      where: { partitionSlug: slug },
      include: { event: { select: { ticketRules: true } } }
    });

    const rules = eventPartition?.event?.ticketRules as any;
    const formToTypeMap: Record<string, string> = {};

    if (rules) {
      for (const [role, config] of Object.entries(rules)) {
        if (config && typeof config === 'object' && Array.isArray((config as any).forms)) {
          (config as any).forms.forEach((fName: string) => {
            formToTypeMap[fName] = role.toUpperCase();
          });
        }
      }
    }
    // -------------------------------------------------------

    // Mapowanie pól z tablicy entries[x][field]
    const entriesMap: Record<string, any> = {};
    formData.forEach((value, key) => {
      const match = key.match(/^entries\[(\d+)\]\[(.+?)\]$/);
      if (match) {
        const id = match[1];
        const field = match[2];
        if (!entriesMap[id]) entriesMap[id] = {};
        entriesMap[id][field] = value;
      }
    });

    const entriesArray = Object.values(entriesMap);
    const confirmedIds: string[] = [];

    for (const e of entriesArray) {
      const entryId = String(e.entry_id);
      const formName = e.form_name || null;

      // USTALANIE TYPU BILETU NA PODSTAWIE REGUŁ

      const finalPhone = e.phone || e.add_phone || null;
      const finalFormId = e.form_id ? parseInt(e.form_id, 10) : null;

      const answersData = {
        badgeType: e.badge || null,
        sender: e.sender || null,
        source_url: e.source_url || null,
        extra_meta: Object.keys(e)
          .filter(k => k.startsWith('add_'))
          .reduce((obj, key) => ({ ...obj, [key]: e[key] }), {})
      };

      let lookupKey = formName;
      if (formName?.toLowerCase().includes("call centre") && answersData.sender) {
        lookupKey = `${formName} [SENDER: ${answersData.sender}]`;
      } else if (formName?.toLowerCase().includes("badge generator") && answersData.badgeType) {
        lookupKey = `${formName} [BADGE: ${answersData.badgeType}]`;
      }

      const autoTicketType = lookupKey ? (formToTypeMap[lookupKey] || null) : null;

      await prismaActivation.activationEntry.upsert({
        where: {
          slug_entryId: { slug, entryId },
        },
        update: {
          ...(e.email !== undefined && { email: e.email }),
          ...(finalPhone !== null && { phone: finalPhone }),
          ...(e.full_name !== undefined && { fullName: e.full_name }),
          ...(e.street_address !== undefined && { streetAddress: e.street_address }),
          ...(e.house_number !== undefined && { houseNumber: e.house_number }),
          ...(e.postal_code !== undefined && { postalCode: e.postal_code }),
          ...(e.city !== undefined && { city: e.city }),
          ...(e.country !== undefined && { country: e.country }),
          ...(e.Qrcode !== undefined && { qrCode: e.Qrcode }),
          formId: finalFormId,
          formName: formName,
          fairDate,
          answers: answersData as any,
          // AKTUALIZACJA TYPU BILETU (tylko jeśli nie nadpisano ręcznie)
          ...(!e.manualOverride && { ticketType: autoTicketType })
        },
        create: {
          slug,
          entryId,
          qrCode: e.Qrcode || "",
          email: e.email || null,
          phone: finalPhone,
          fullName: e.full_name || null,
          streetAddress: e.street_address || null,
          houseNumber: e.house_number || null,
          postalCode: e.postal_code || null,
          city: e.city || null,
          country: e.country || null,
          domain,
          badge,
          fairYear,
          fairDate,
          formId: finalFormId,
          formName: formName,
          ticketType: autoTicketType, // PRZYPISANIE PRZY TWORZENIU
          answers: answersData as any,
          isActivated: false,
        },
      });

      confirmedIds.push(entryId);
    }

    return NextResponse.json({
      success: true,
      count: confirmedIds.length,
      ids: confirmedIds
    });

  } catch (error: any) {
    await logApiError({
      endpoint: "/api/activation/sync",
      method: "POST",
      message: `Activation sync failed: ${error.message}`,
      payload: bodyData,
      status: 500
    });

    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}