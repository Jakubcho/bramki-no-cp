import { NextRequest, NextResponse } from "next/server";
import { prismaCore } from "@/lib/prisma-core";
import { prismaActivation } from "@/lib/prisma-activation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: eventId } = await params;

  // 1. Autoryzacja
  const session = await getServerSession(authOptions);
  const incomingKey = req.headers.get("Internal-Auth");
  const isInternal = incomingKey === process.env.INTERNAL_SECRET && !!process.env.INTERNAL_SECRET;
  const isAdmin = session?.user?.role === "ADMIN";

  if (!isInternal && !isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const event = await prismaCore.event.findUnique({
      where: { id: eventId },
      include: { partitions: true }
    });

    if (!event || !event.externalDirectoryID) return NextResponse.json({ error: "Brak Ext ID" }, { status: 400 });

    const basePartition = event.partitions[0]?.partitionSlug || "UNKNOWN";
    const catalogSlug = basePartition.replace(/_(\d{4})$/, "_CATALOG_$1");

    // 2. Pobierz dane z API
    const response = await fetch(`${process.env.NEXT_PUBLIC_CATALOG_URL}/${event.externalDirectoryID}`);
    const apiResult = await response.json();
    if (!apiResult.success) throw new Error("API External Error");

    const apiRecords = apiResult.data.qrCodes;

    // 3. OPTYMALIZACJA: Pobierz listę ID już istniejących w tej partycji
    const existingEntries = await prismaActivation.activationEntry.findMany({
      where: { slug: catalogSlug },
      select: { id: true, qrCode: true } // Pobieramy tylko ID i kod QR do porównania
    });

    // Tworzymy Mapę dla błyskawicznego wyszukiwania (O(1))
    const existingMap = new Map(existingEntries.map(e => [e.id, e.qrCode]));

    // 4. Filtrujemy tylko NOWE lub ZMIENIONE rekordy
    const recordsToUpsert = apiRecords.filter((item: any) => {
      const dbId = `ext_${item.personId}`;
      const existingQr = existingMap.get(dbId);

      // Jeśli nie ma w bazie LUB kod QR się zmienił -> dodaj do listy do zapisu
      return !existingQr || existingQr !== item.accessCode;
    });

    if (recordsToUpsert.length === 0) {
      return NextResponse.json({ success: true, count: 0, message: "Wszystko aktualne" });
    }

    // 5. Wykonaj zapis tylko dla różnic (Delta)
    let importedCount = 0;
    for (const item of recordsToUpsert) {
      const customEntryId = `0${event.externalDirectoryID}${item.personId}`;
      await prismaActivation.activationEntry.upsert({
        where: { id_slug: { id: `ext_${item.personId}`, slug: catalogSlug } },
        update: {
          fullName: item.fullName,
          email: item.email,
          qrCode: item.accessCode,
          formName: `Katalog: ${item.position}`,
        },
        create: {
          id: `ext_${item.personId}`,
          slug: catalogSlug,
          entryId: customEntryId,
          qrCode: item.accessCode,
          fullName: item.fullName,
          email: item.email,
          formName: `Katalog: ${item.position}`,
          formId: parseInt(`${event.externalDirectoryID}`),
          ticketType: "EXHIBITOR",
          domain: event.domain,
          fairYear: String(new Date(apiResult.data.exhibition.startDate).getFullYear())
        }
      });
      importedCount++;
    }

    // Upewnij się, że partycja jest w Core
    await prismaCore.eventPartition.upsert({
      where: { eventId_partitionSlug: { eventId, partitionSlug: catalogSlug } },
      update: {},
      create: { eventId, partitionSlug: catalogSlug }
    });

    return NextResponse.json({ success: true, count: importedCount, totalInApi: apiRecords.length });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}