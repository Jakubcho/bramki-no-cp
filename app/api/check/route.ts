import { NextRequest, NextResponse } from "next/server";
import { prismaActivation } from "@/lib/prisma-activation";
import { logApiError } from "@/lib/logger";
import crypto from "crypto";
import { formatInTimeZone } from 'date-fns-tz';

export async function POST(req: NextRequest) {
  let bodyData: any = {};

  try {
    const body = await req.json();
    bodyData = body;

    const authHeader = req.headers.get("Authorization");
    const secretKey = process.env.PWE_API_KEY_2 || "TEST_KEY";
    const timeString = formatInTimeZone(new Date(), 'Europe/Warsaw', 'dd-MM-yyyy-HH');
    const expectedToken = crypto.createHmac('sha256', secretKey).update(timeString).digest('hex');

    // 1. Walidacja Tokena
    if (!authHeader || authHeader !== expectedToken) {
      await logApiError({
        endpoint: "/api/check-sync",
        method: "POST_AUTH",
        message: "Unauthorized sync check: Token mismatch",
        payload: { provided: authHeader, expected: expectedToken },
        status: 401
      });
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Walidacja struktury danych
    const updatedIds = body.updated_ids;
    if (!updatedIds || typeof updatedIds !== 'object') {
      return NextResponse.json({ error: "Missing or invalid updated_ids object" }, { status: 400 });
    }

    const results = [];
    let totalUpdated = 0;

    // 3. Iteracja po partycjach (klucze w obiekcie updated_ids)
    for (const [partitionSlug, entryIds] of Object.entries(updatedIds)) {
      if (!Array.isArray(entryIds) || entryIds.length === 0) continue;

      // Budujemy nazwę tabeli (zamiana minusów na podkreślenia, tak jak w Twojej logice)
      const tableName = `ActivationEntry_${partitionSlug.replace(/-/g, "_")}`;
      const idsToUpdate = entryIds.map(String);

      try {
        // Wykonujemy update dla konkretnej tabeli
        const count = await prismaActivation.$executeRawUnsafe(
          `UPDATE "${tableName}"
           SET "dataCenter" = 'add'
           WHERE "entryId" = ANY($1)
           AND "isActivated" = true`,
          idsToUpdate
        );

        results.push({ partition: partitionSlug, updated: count });
        totalUpdated += count;
      } catch (dbErr: any) {
        // Logujemy błąd dla konkretnej tabeli, ale nie przerywamy pętli dla innych
        console.error(`Error updating table ${tableName}:`, dbErr.message);
        results.push({ partition: partitionSlug, error: dbErr.message });
      }
    }

    return NextResponse.json({
      success: true,
      totalUpdated,
      details: results
    });

  } catch (error: any) {
    await logApiError({
      endpoint: "/api/check-sync",
      method: "POST_BATCH_UPDATE",
      message: `Batch update failed: ${error.message}`,
      payload: bodyData,
      status: 500
    });

    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}