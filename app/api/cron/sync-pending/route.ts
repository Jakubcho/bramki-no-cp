import { NextRequest, NextResponse } from "next/server";
import { prismaActivation } from "@/lib/prisma-activation";
import { prismaCore } from "@/lib/prisma-core";
import { logApiError } from "@/lib/logger";
import crypto from "crypto";
import { formatInTimeZone } from 'date-fns-tz';

export async function GET(req: NextRequest) {
  // --- ZABEZPIECZENIE ---
  const { searchParams } = new URL(req.url);
  const key = searchParams.get('key');

  const ADMIN_KEY = process.env.CRON_SECRET;

  if (!ADMIN_KEY || key !== ADMIN_KEY) {
    return NextResponse.json({ error: "Access Denied: Invalid Secret Key" }, { status: 401 });
  }
  // ----------------------

  let pwePayload: any = null;

  try {
    const activePartitions = await prismaCore.eventPartition.findMany({
      select: { partitionSlug: true },
      distinct: ['partitionSlug']
    });

    const allPendingEntries: any[] = [];
    const updateTasks: { tableName: string; ids: string[] }[] = [];

    for (const p of activePartitions) {
      const tableName = `ActivationEntry_${p.partitionSlug.replace(/-/g, "_")}`;

      try {
        const pending: any[] = await prismaActivation.$queryRawUnsafe(
          `SELECT * FROM "${tableName}"
           WHERE "dataCenter" = 'send' AND "isActivated" = true`
        );

        if (pending && pending.length > 0) {
          pending.map(entry => {
            allPendingEntries.push({
              user: {
                entryId: entry.entryId,
                qrCode: entry.qrCode,
                activatedAt: entry.activatedAt,
                firstName: entry.actFirstName,
                lastName: entry.actLastName,
                email: entry.actEmail,
                phone: entry.actPhone,
                street: entry.actStreet,
                buildingNumber: entry.actHouseNumber,
                city: entry.actCity,
                postalCode: entry.actPostalCode,
                country: entry.country || "Polska",
                partitionSlug: p.partitionSlug
              },
              surveyAnswers: (entry.answers as any)?.survey || [],
              event: {
                domain: entry.domain,
                badge: entry.badge,
                fairDate: entry.fairDate,
                fairYear: entry.fairYear
              }
            });
          });

          updateTasks.push({
            tableName,
            ids: pending.map(e => e.entryId)
          });
        }
      } catch (e: any) {
        if (!e.message.includes("does not exist")) {
          console.error(`Błąd w tabeli ${tableName}:`, e.message);
        }
      }
    }

    if (allPendingEntries.length === 0) {
      return NextResponse.json({ success: true, message: "No pending entries." });
    }

    pwePayload = { activation: allPendingEntries };

    const secretKey = process.env.PWE_API_KEY_2 || "TEST_KEY";
    const timeString = formatInTimeZone(new Date(), 'Europe/Warsaw', 'dd-MM-yyyy-HH');
    const token = crypto.createHmac('sha256', secretKey).update(timeString).digest('hex');

    const response = await fetch("https://pwe-cdb.warsawexpo.eu/api/zaaktywuj", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      },
      body: JSON.stringify(pwePayload),
    });

    const responseText = await response.text();

    if (response.ok) {
      let totalUpdated = 0;
      for (const task of updateTasks) {
        const count = await prismaActivation.$executeRawUnsafe(
          `UPDATE "${task.tableName}" SET "dataCenter" = 'add' WHERE "entryId" = ANY($1)`,
          task.ids
        );
        totalUpdated += Number(count);
      }

      return NextResponse.json({
        success: true,
        syncedCount: allPendingEntries.length,
        dbUpdatedCount: totalUpdated
      });
    } else {
      await logApiError({
        endpoint: "/api/cron/sync-pending",
        method: "POST_TO_CDB",
        message: `CDB API Error: ${responseText}`,
        status: response.status,
        payload: pwePayload,
        response: responseText
      });
      return NextResponse.json({ error: `External API Error: ${responseText}` }, { status: response.status });
    }

  } catch (error: any) {
    await logApiError({
      endpoint: "/api/cron/sync-pending",
      method: "CRON_GET_CRITICAL",
      message: `Critical: ${error.message}`,
      status: 500,
      payload: pwePayload || { info: "Payload not created" },
      stack: error.stack
    });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}