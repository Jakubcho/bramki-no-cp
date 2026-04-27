import { prismaCore } from "@/lib/prisma-core";
import { NextRequest, NextResponse } from "next/server";
import { logApiError } from "@/lib/logger";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  let bodyData = null;

  try {
    const body = await req.json();
    bodyData = body;

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
      await logApiError({
        endpoint: `/api/admin/events/${id}/create-template`,
        method: "POST",
        message: "Template source not found: Event does not exist",
        payload: { eventId: id },
        status: 404
      });
      return new NextResponse("Event not found", { status: 404 });
    }

    const template = await prismaCore.eventTemplate.create({
      data: {
        name: body.name || `${event.name} template`,
        structure: {
          steps: event.steps.map((s) => ({
            type: s.type,
            order: s.order,
            translations: s.translations.map(t => ({
              locale: t.locale,
              title: t.title
            })),
            options: s.options.map((o) => ({
              value: o.value,
              iconUrl: o.iconUrl,
              order: o.order,
              translations: o.translations.map(ot => ({
                locale: ot.locale,
                label: ot.label
              })),
            })),
          })),
        },
      },
    });

    return NextResponse.json(template);
  } catch (error: any) {
    await logApiError({
      endpoint: `/api/admin/events/${id}/create-template`,
      method: "POST_CREATE",
      message: `Failed to create template from event: ${error.message}`,
      payload: { eventId: id, body: bodyData, userId: session?.user?.id },
      status: 500
    });

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}