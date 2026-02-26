import { prismaCore } from "@/lib/prisma-core";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();

  const template = await prismaCore.eventTemplate.findUnique({
    where: { id: body.templateId },
  });

  if (!template) {
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
  });

  return NextResponse.json({ ok: true });
}