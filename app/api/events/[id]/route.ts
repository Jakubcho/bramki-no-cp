import { prismaCore } from "@/lib/prisma-core";
import { NextRequest, NextResponse } from "next/server";
import { logApiError } from "@/lib/logger";
import { logAction } from "@/lib/audit";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    const event = await prismaCore.event.findUnique({
      where: { id },
      include: {
        steps: {
          orderBy: { order: "asc" },
          include: {
            translations: true,
            options: {
              orderBy: { order: "asc" },
              include: {
                translations: true,
              },
            },
          },
        },
      },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json(event);
  } catch (error: any) {
    await logApiError({
      endpoint: `/api/admin/events/${id}`,
      method: "GET",
      message: `Failed to fetch event details: ${error.message}`,
      status: 500
    });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  const { id } = await context.params;
  let bodyData = {};

  try {
    const body = await request.json();
    bodyData = body;

    const before = await prismaCore.event.findUnique({ where: { id } });
    if (!before) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const event = await prismaCore.event.update({
      where: { id },
      data: {
        name: body.name,
        slug: body.slug,
        isActive: body.isActive,
        version: { increment: 1 }
      },
    });

    await logAction({
      action: "UPDATE_EVENT",
      entity: "EVENT",
      entityId: id,
      session,
      meta: { before, after: event },
    });

    return NextResponse.json(event);
  } catch (error: any) {
    await logApiError({
      endpoint: `/api/admin/events/${id}`,
      method: "PUT",
      message: `Failed to update event: ${error.message}`,
      payload: { body: bodyData, userId: session?.user?.id },
      status: 500
    });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}