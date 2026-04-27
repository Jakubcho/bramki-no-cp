import { NextRequest, NextResponse } from "next/server";
import { prismaActivation } from "@/lib/prisma-activation";
import { prismaCore } from "@/lib/prisma-core";

export async function POST(req: NextRequest) {
  try {
    const { qr, eventSlugs } = await req.json();

    if (!qr || !eventSlugs || !Array.isArray(eventSlugs)) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    const qrLower = qr.toLowerCase();

    const eventsData = await prismaCore.event.findMany({
      where: {
        slug: { in: eventSlugs }
      },
      include: {
        partitions: true
      }
    });

    const tasks: { searchTable: string, returnSlug: string }[] = [];

    for (const event of eventsData) {
      const allowedPrefixes = event.qrPrefixes || [];
      const isMatch = allowedPrefixes.length === 0 || allowedPrefixes.some(p =>
        qrLower.startsWith(p.toLowerCase())
      );

      if (isMatch) {
        if (event.partitions.length > 0) {
          event.partitions.forEach(p => {
            tasks.push({ searchTable: p.partitionSlug, returnSlug: event.slug });
          });
        } else {
          tasks.push({ searchTable: event.slug, returnSlug: event.slug });
        }
      }
    }

    if (tasks.length === 0) {
      return NextResponse.json({ error: "Invalid badge for these events" }, { status: 400 });
    }

    for (const task of tasks) {
      const safeSlug = task.searchTable.replace(/-/g, "_");
      const tableName = `ActivationEntry_${safeSlug}`;

      try {
        // Sprawdzamy najpierw czy tabela w ogóle istnieje i czy bilet tam jest
        const result = await prismaActivation.$queryRawUnsafe<any[]>(
          `SELECT * FROM "${tableName}" WHERE "qrCode" = $1 LIMIT 1`,
          qr
        );

        if (result && result.length > 0) {
          const entry = result[0];

          // Szukamy kolumny od aktywacji - sprawdź czy u Ciebie to na pewno "activatedAt"
          // Jeśli pole nazywa się inaczej w DB, np. "activated_at", zmień entry.activatedAt
          if (entry.activatedAt || entry.activated_at) {
            return NextResponse.json({
              error: "ALREADY_ACTIVATED",
              foundSlug: task.returnSlug
            }, { status: 409 });
          }

          return NextResponse.json({ foundSlug: task.returnSlug });
        }
      } catch (dbErr: any) {
        continue;
      }
    }

    return NextResponse.json({ error: "QR not found in any related partition" }, { status: 404 });

  } catch (error: any) {
    console.error("Critical error in check-qr:", error.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}