import { NextRequest, NextResponse } from "next/server";
import { prismaCore } from "@/lib/prisma-core";
import { prismaActivation } from "@/lib/prisma-activation";

export async function GET(req: NextRequest) {
  const authKey = req.nextUrl.searchParams.get("key");
  if (authKey !== process.env.INTERNAL_SECRET) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const endpoint = "/api/cron/sync-all-catalogs";

  try {
    const now = new Date();
    const marginStart = new Date();
    marginStart.setDate(now.getDate() + 3);

    const activeEvents = await prismaCore.event.findMany({
      where: {
        externalDirectoryID: { not: null },
        startDate: { lte: marginStart },
        endDate: { gte: now }
      }
    });

    if (activeEvents.length === 0) {
      return NextResponse.json({ message: "Brak aktywnych eventów do synchronizacji." });
    }

    const report = [];
    let hasErrors = false;

    for (const event of activeEvents) {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
        const syncRes = await fetch(`${baseUrl}/api/sync-catalog/${event.id}`, {
          method: 'POST',
          headers: {
            'Internal-Auth': process.env.INTERNAL_SECRET || '',
            'Content-Type': 'application/json'
          }
        });

        const result = await syncRes.json();

        if (!syncRes.ok) hasErrors = true;

        report.push({
          name: event.name,
          status: syncRes.status,
          imported: result.count || 0
        });
      } catch (err: any) {
        hasErrors = true;
        report.push({ name: event.name, status: "error", error: err.message });
      }
    }

    if (hasErrors) {
      await prismaActivation.apiError.create({
        data: {
          endpoint,
          method: "CRON_SYNC_ISSUE",
          message: `Wykryto problemy podczas automatycznej synchronizacji katalogów.`,
          payload: report as any,
          status: 500
        }
      });
    }

    return NextResponse.json({ success: true, processed: report, loggedToDb: hasErrors });

  } catch (error: any) {
    console.error("CRON ALL SYNC ERROR:", error);

    await prismaActivation.apiError.create({
      data: {
        endpoint,
        method: "CRON_CRITICAL",
        message: `Krytyczny błąd głównej pętli CRON: ${error.message}`,
        status: 500
      }
    });

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}