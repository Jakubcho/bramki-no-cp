import { NextResponse } from "next/server";
import { prismaCore } from "@/lib/prisma-core";
import { authOptions } from "@/lib/auth";
import { logAction } from "@/lib/audit";
import { logApiError } from "@/lib/logger";
import { getServerSession } from "next-auth";

export async function GET() {
  try {
    const weeks = await prismaCore.eventWeek.findMany({
      include: {
        events: {
          select: { id: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const formattedWeeks = weeks.map(w => ({
      ...w,
      eventIds: w.events.map(e => e.id)
    }));

    return NextResponse.json(formattedWeeks);
  } catch (e: any) {
    await logApiError({
      endpoint: "/api/admin/event-weeks",
      method: "GET",
      message: `Failed to fetch event weeks: ${e.message}`,
      status: 500
    });
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  let bodyData = {};
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    bodyData = body;
    const { name, slug, eventIds } = body;

    const week = await prismaCore.eventWeek.upsert({
      where: { slug },
      update: {
        name,
        events: {
          set: [],
          connect: eventIds.map((id: string) => ({ id })),
        },
      },
      create: {
        name,
        slug,
        events: {
          connect: eventIds.map((id: string) => ({ id })),
        },
      },
      include: { events: true },
    });

    await logAction({
      action: "UPSERT_EVENT_WEEK",
      entity: "EVENT_WEEK",
      entityId: week.id,
      meta: {
        name: week.name,
        slug: week.slug,
        connectedEventsCount: eventIds.length,
        connectedEventsIds: eventIds,
      },
      session,
    });

    return NextResponse.json(week);
  } catch (e: any) {
    const session = await getServerSession(authOptions);

    await logApiError({
      endpoint: "/api/admin/event-weeks",
      method: "POST_UPSERT",
      message: `Upsert event week failure: ${e.message}`,
      payload: { ...bodyData, userId: session?.user?.id },
      status: 500
    });

    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}