import { prismaCore } from "@/lib/prisma-core";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

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

  return NextResponse.json(event);
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const body = await request.json();

  const event = await prismaCore.event.update({
    where: { id },
    data: {
      name: body.name,
      slug: body.slug,
      isActive: body.isActive,
    },
  });

  return NextResponse.json(event);
}
