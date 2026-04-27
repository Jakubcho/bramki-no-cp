import { NextRequest, NextResponse } from "next/server";
import { prismaCore } from "@/lib/prisma-core";
import { prismaActivation } from "@/lib/prisma-activation"; // Upewnij się, że ścieżka jest poprawna
import { authOptions } from "@/lib/auth";
import { logAction } from "@/lib/audit";
import { logApiError } from "@/lib/logger";
import { getServerSession } from "next-auth";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const body = await req.json();
  const { eventId, partitions } = body;

  if (!eventId) {
    return NextResponse.json({ error: "No eventId" }, { status: 400 });
  }

  try {
    // 1. SKANOWANIE DANYCH PRZEZ PRISMA ACTIVATION
    let detectedQrPrefixes: string[] = [];

    console.log(`[DEBUG] Rozpoczynam skanowanie dla ${partitions?.length} partycji...`);

    if (partitions && partitions.length > 0) {
      const cleanPartitions = partitions.map((s: string) => s.replace(/^"|"$/g, '').trim());

      for (const slug of cleanPartitions) {
        try {
          // TU BYŁ BŁĄD: Poprawna nazwa tabeli to ActivationEntry_ + slug
          const tableName = `ActivationEntry_${slug}`;
          console.log(`[DEBUG] Próba pobrania prefixów z tabeli: "${tableName}"`);

          // TU BYŁ DRUGI BŁĄD: Kolumna nazywa się "qrCode" (pamiętaj o cudzysłowie dla wielkich liter!)
          const prefixes: any[] = await prismaActivation.$queryRawUnsafe(`
            SELECT DISTINCT LEFT(CAST("qrCode" AS TEXT), 4) as prefix
            FROM "${tableName}"
            WHERE "qrCode" IS NOT NULL AND "qrCode" != ''
            LIMIT 5
          `);

          console.log(`[DEBUG] Wynik z bazy dla ${tableName}:`, JSON.stringify(prefixes));

          if (prefixes && prefixes.length > 0) {
            prefixes.forEach(p => {
              if (p.prefix) {
                const val = p.prefix.toString().trim().toLowerCase();
                console.log(`[DEBUG] Wykryto prefix: ${val}`);
                detectedQrPrefixes.push(val);
              }
            });
          }
        } catch (e: any) {
          console.error(`[ERROR] Skanowanie partycji ${slug} (tabela ActivationEntry_${slug}) zawiodło:`, e.message);
        }
      }
    }

    // 2. ZAPIS KONFIGURACJI PRZEZ PRISMA CORE
    const result = await prismaCore.$transaction(async (tx) => {
      // Czyścimy stare powiązania partycji w Core
      const deleted = await tx.eventPartition.deleteMany({
        where: { eventId: eventId }
      });

      if (partitions && partitions.length > 0) {
        const cleanPartitions = partitions.map((s: string) => s.replace(/^"|"$/g, '').trim());

        // Tworzymy nowe powiązania w Core
        await tx.eventPartition.createMany({
          data: cleanPartitions.map((slug: any) => ({
            eventId: eventId,
            partitionSlug: slug
          }))
        });

        // Pobieramy aktualne prefiksy z Eventu (z Core)
        const currentEvent = await tx.event.findUnique({
          where: { id: eventId },
          select: { qrPrefixes: true }
        });

        const existingPrefixes = currentEvent?.qrPrefixes || [];
        // Łączymy istniejące z nowo wykrytymi przez prismaActivation
        const finalPrefixes = Array.from(new Set([...existingPrefixes, ...detectedQrPrefixes]));

        // Aktualizujemy Event w Core
        await tx.event.update({
          where: { id: eventId },
          data: { qrPrefixes: finalPrefixes }
        });
      }

      return { deletedCount: deleted.count, finalPrefixes: detectedQrPrefixes };
    });

    await logAction({
      action: "UPDATE_EVENT_PARTITIONS",
      entity: "EVENT",
      entityId: eventId,
      meta: {
        partitions,
        detectedPrefixes: result.finalPrefixes
      },
      session,
    });

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("Critical POST Error:", error);

    await logApiError({
      endpoint: "/api/admin/event-partitions",
      method: "POST",
      message: error.message,
      status: 500
    });

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}