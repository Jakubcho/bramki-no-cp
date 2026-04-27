import { prismaCore } from "@/lib/prisma-core";
import { NextResponse } from "next/server";
import { startOfWeek, endOfWeek } from "date-fns";
import { logApiError } from "@/lib/logger";

export async function GET() {
  try {
    const now = new Date();

    // Define the current week window (Monday to Sunday)
    const start = startOfWeek(now, { weekStartsOn: 1 });
    const end = endOfWeek(now, { weekStartsOn: 1 });

    const events = await prismaCore.event.findMany({
      where: {
        OR: [
          { startDate: { gte: start, lte: end } },
          { endDate: { gte: start, lte: end } },
          {
            AND: [
              { startDate: { lte: start } },
              { endDate: { gte: end } }
            ]
          }
        ],
        isActive: true
      },
      include: {
        partitions: true
      }
    });

    const allGates = events.flatMap(e => e.entrances || []);
    const uniqueGates = Array.from(new Set(allGates)).sort();

    return NextResponse.json({
      gates: uniqueGates,
      events: events.map(e => ({
        id: e.id,
        name: e.name,
        slug: e.slug,
        entrances: e.entrances,
        partitions: e.partitions
      }))
    });
  } catch (error: any) {
    await logApiError({
      endpoint: "/api/access/active-gates",
      method: "GET",
      message: `Failed to fetch active gates for current week: ${error.message}`,
      status: 500
    });

    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}