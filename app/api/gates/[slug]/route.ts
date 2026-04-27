import { NextRequest, NextResponse } from "next/server";
import { prismaCore } from "@/lib/prisma-core";
import { prismaActivation } from "@/lib/prisma-activation";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;

  try {
    // 1. Znajdź event i jego partycje
    const event = await prismaCore.event.findUnique({
      where: { slug },
      include: { partitions: true }
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // 2. Przygotuj listę tabel do sprawdzenia
    // Jeśli brak partycji, szukamy w tabeli o nazwie slug
    const partitions = event.partitions.length > 0
      ? event.partitions.map(p => p.partitionSlug)
      : [slug];

    // 3. Budujemy wydajne zapytanie SQL łączące dane z wielu tabel (UNION ALL)
    // Pobieramy tylko 3 kolumny: qrCode, ticketType, isActivated
    const queries = partitions.map(p => {
      const tableName = `ActivationEntry_${p.replace(/-/g, "_")}`;
      return `
        SELECT "qrCode", "ticketType", "isActivated"
        FROM "${tableName}"
        WHERE "qrCode" IS NOT NULL
      `;
    });

    const finalQuery = queries.join(" UNION ALL ");

    // 4. Wykonujemy zapytanie
    // Używamy raw query, aby uniknąć narzutu ORM przy 100k rekordów
    const data = await prismaActivation.$queryRawUnsafe<any[]>(finalQuery);

    // 5. Nagłówki Cache (Ważne!)
    // s-maxage=10 oznacza, że przez 10 sekund serwer będzie serwował tę samą wersję,
    // a w tle ją odświeży. To zapobiega przeciążeniu przy jednoczesnym odpytywaniu przez 20 bramek.
    return NextResponse.json(data, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=59',
      }
    });

  } catch (error: any) {
    console.error("GATES API ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}