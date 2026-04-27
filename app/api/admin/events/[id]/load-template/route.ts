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
  let templateId = "";

  try {
    const body = await req.json();
    templateId = body.templateId;

    const template = await prismaCore.eventTemplate.findUnique({
      where: { id: templateId },
    });

    if (!template) {
      await logApiError({
        endpoint: `/api/admin/events/${id}/apply-template`,
        method: "POST",
        message: "Template selection failed: Template not found",
        payload: { eventId: id, templateId },
        status: 404
      });
      return new NextResponse("Template not found", { status: 404 });
    }

    const structure: any = template.structure;

    await prismaCore.$transaction(async (tx) => {
      for (const step of structure.steps) {
        const createdStep = await tx.step.create({
          data: {
            eventId: id,
            type: step.type,
            order: step.order,
            translations: {
              create: step.translations,
            },
          },
        });

        if (step.options && Array.isArray(step.options)) {
          for (const option of step.options) {
            await tx.option.create({
              data: {
                stepId: createdStep.id,
                value: option.value,
                iconUrl: option.iconUrl || null,
                order: option.order,
                translations: {
                  create: option.translations,
                },
              },
            });
          }
        }
      }
    });

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    await logApiError({
      endpoint: `/api/admin/events/${id}/apply-template`,
      method: "POST_TRANSACTION",
      message: `Template application transaction failed: ${error.message}`,
      payload: { eventId: id, templateId, userId: session?.user?.id },
      status: 500
    });

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}