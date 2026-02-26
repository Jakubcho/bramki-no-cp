import { prismaCore } from "@/lib/prisma-core";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();

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
}