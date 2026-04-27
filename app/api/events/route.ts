import { prismaCore } from "@/lib/prisma-core";
import { NextResponse } from "next/server";
import { logApiError } from "@/lib/logger";

export async function GET() {
  try {
    const events = await prismaCore.event.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(events);
  } catch (error: any) {
    await logApiError({
      endpoint: "/api/admin/events",
      method: "GET",
      message: `Failed to fetch event list: ${error.message}`,
      status: 500
    });

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}