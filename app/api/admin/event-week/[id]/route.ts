import { NextResponse } from "next/server";
import { prismaCore } from "@/lib/prisma-core";
import { authOptions } from "@/lib/auth";
import { logAction } from "@/lib/audit";
import { logApiError } from "@/lib/logger";
import { getServerSession } from "next-auth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  let weekId = "";
  try {
    const { id } = await params;
    weekId = id;

    const week = await prismaCore.eventWeek.findUnique({
      where: { id: id },
      include: {
        events: { select: { id: true } }
      }
    });

    if (!week) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({
      ...week,
      eventIds: week.events.map((e: any) => e.id)
    });
  } catch (e: any) {
    await logApiError({
      endpoint: `/api/admin/event-weeks/${weekId}`,
      method: "GET",
      message: `Fetch unique week failed: ${e.message}`,
      status: 500
    });
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  let weekId = "";
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;
    weekId = id;
    const body = await req.json();
    const { name, slug, eventIds } = body;

    const oldWeek = await prismaCore.eventWeek.findUnique({
      where: { id },
      include: { events: { select: { id: true, name: true } } }
    });

    if (!oldWeek) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const oldEventIds: string[] = oldWeek?.events.map(e => e.id) || [];
    const currentEventIds: string[] = eventIds || [];
    const oldEventNames = oldWeek?.events.map(e => e.name).join(", ") || "";

    const updated = await prismaCore.eventWeek.update({
      where: { id: id },
      data: {
        name,
        slug,
        events: {
          set: [],
          connect: eventIds.map((eventId: string) => ({ id: eventId })),
        },
      },
      include: { events: { select: { name: true } } }
    });

    const newEventNames = updated.events.map(e => e.name).join(", ");

    await logAction({
      action: "UPDATE_EVENT_WEEK",
      entity: "EVENT_WEEK",
      entityId: id,
      meta: {
        name: { from: oldWeek?.name, to: name },
        slug: { from: oldWeek?.slug, to: slug },
        events: {
          previousCount: oldEventIds.length,
          currentCount: currentEventIds.length,
          previousList: oldEventNames,
          currentList: newEventNames,
          removedIds: oldEventIds.filter((x: string) => !currentEventIds.includes(x)),
          addedIds: currentEventIds.filter((x: string) => !oldEventIds.includes(x))
        }
      },
      session,
    });

    return NextResponse.json(updated);
  } catch (e: any) {
    const session = await getServerSession(authOptions);
    await logApiError({
      endpoint: `/api/admin/event-weeks/${weekId}`,
      method: "PATCH",
      message: `Update week failed: ${e.message}`,
      payload: { userId: session?.user?.id, weekId },
      status: 500
    });
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  let weekId = "";
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;
    weekId = id;

    const weekToDelete = await prismaCore.eventWeek.findUnique({
      where: { id },
      select: { name: true, slug: true }
    });

    if (!weekToDelete) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await prismaCore.eventWeek.delete({ where: { id: id } });

    await logAction({
      action: "DELETE_EVENT_WEEK",
      entity: "EVENT_WEEK",
      entityId: id,
      meta: {
        deletedName: weekToDelete?.name,
        deletedSlug: weekToDelete?.slug
      },
      session,
    });

    return NextResponse.json({ success: true });
  } catch (e: any) {
    const session = await getServerSession(authOptions);
    await logApiError({
      endpoint: `/api/admin/event-weeks/${weekId}`,
      method: "DELETE",
      message: `Delete week failed: ${e.message}`,
      payload: { userId: session?.user?.id, weekId },
      status: 500
    });
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}