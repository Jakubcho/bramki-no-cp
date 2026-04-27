import { NextRequest, NextResponse } from "next/server";
import { prismaActivation } from "@/lib/prisma-activation";
import { logApiError } from "@/lib/logger";
import crypto from "crypto";
import { formatInTimeZone } from 'date-fns-tz';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");
    const secretKey = process.env.PWE_API_KEY_2 || "TEST_KEY";
    const timeString = formatInTimeZone(new Date(), 'Europe/Warsaw', 'dd-MM-yyyy-HH');
    const expectedToken = crypto.createHmac('sha256', secretKey).update(timeString).digest('hex');

    if (!authHeader || authHeader !== expectedToken) {
      await logApiError({
        endpoint: "/api/reconcile",
        method: "GET_AUTH",
        message: "Unauthorized reconciliation attempt: Invalid or missing token",
        payload: { provided: authHeader, expected: expectedToken },
        status: 401
      });
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const partitions: any[] = await prismaActivation.$queryRawUnsafe(
      `SELECT DISTINCT "slug" FROM "ActivationEntry"`
    );

    let totalProcessed = 0;

    for (const p of partitions) {
      const tableName = `ActivationEntry_${p.slug.replace(/-/g, "_")}`;

      const stuckRecords: any[] = await prismaActivation.$queryRawUnsafe(
        `SELECT * FROM "${tableName}" WHERE "isActivated" = true AND "dataCenter" = 'send' LIMIT 100`
      );

      if (stuckRecords.length === 0) continue;

      const pwePayload = stuckRecords.map(reg => ({
        user: {
          entryId: reg.entryId,
          qrCode: reg.qrCode,
          activatedAt: reg.activatedAt,
          firstName: String(reg.actFirstName || ""),
          lastName: String(reg.actLastName || ""),
          email: String(reg.actEmail || ""),
          phone: String(reg.actPhone || ""),
          partitionSlug: reg.slug
        },
        surveyAnswers: reg.surveyAnswers || [],
        event: {
          domain: reg.domain,
          badge: String(reg.badge || "")
        }
      }));

      try {
        const response = await fetch("https://pwe-cdb.warsawexpo.eu/api/zaaktywuj", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": expectedToken
          },
          body: JSON.stringify(pwePayload),
        });

        if (response.ok) {
          const entryIds = stuckRecords.map(r => String(r.entryId));
          await prismaActivation.$executeRawUnsafe(
            `UPDATE "${tableName}" SET "dataCenter" = 'add' WHERE "entryId" = ANY($1)`,
            entryIds
          );
          totalProcessed += entryIds.length;
        } else {
          const errorText = await response.text();
          await logApiError({
            endpoint: "/api/reconcile",
            method: "EXTERNAL_POST",
            message: `PWE-CDB rejected payload for ${tableName}: ${response.status} ${errorText}`,
            payload: { tableName, recordsCount: stuckRecords.length },
            status: response.status
          });
        }
      } catch (fetchErr: any) {
        await logApiError({
          endpoint: "/api/reconcile",
          method: "FETCH_EXCEPTION",
          message: `Network error reaching PWE-CDB: ${fetchErr.message}`,
          payload: { tableName },
          status: 500
        });
      }
    }

    return NextResponse.json({ success: true, processed: totalProcessed });

  } catch (error: any) {
    await logApiError({
      endpoint: "/api/reconcile",
      method: "CRITICAL_FAILURE",
      message: `Reconcile process crashed: ${error.message}`,
      status: 500
    });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}