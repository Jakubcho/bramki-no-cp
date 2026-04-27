import { prismaCore } from "@/lib/prisma-core";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { logAction } from "@/lib/audit";
import { logApiError } from "@/lib/logger";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  let bodyData = {};

  try {
    const body = await req.json();
    bodyData = body;

    if (!body.name?.trim() || !body.slug?.trim()) {
      return new NextResponse("Invalid data", { status: 400 });
    }

    const event = await prismaCore.event.create({
      data: {
        name: body.name,
        slug: body.slug,
      },
    });

    await logAction({
      action: "CREATE_EVENT",
      entity: "EVENT",
      entityId: event.id,
      meta: {
        event: event,
      },
      session,
    });

    return NextResponse.json(event);
  } catch (error: any) {
    await logApiError({
      endpoint: "/api/admin/events",
      method: "POST_CREATE",
      message: `Failed to create event: ${error.message}`,
      payload: { ...bodyData, userId: session?.user?.id },
      status: 500
    });

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const events = await prismaCore.event.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        slug: true,
        imageUrl: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(events);
  } catch (error: any) {
    await logApiError({
      endpoint: "/api/admin/events",
      method: "GET",
      message: `Failed to fetch active events: ${error.message}`,
      status: 500
    });

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}