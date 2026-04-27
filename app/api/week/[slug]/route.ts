import { NextResponse, NextRequest } from "next/server";
import { prismaCore } from "@/lib/prisma-core";
import { logApiError } from "@/lib/logger";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;

  try {
    const week = await prismaCore.eventWeek.findUnique({
      where: { slug: slug },
      include: {
        events: {
          where: { isActive: true },
          select: {
            id: true,
            name: true,
            slug: true,
            imageUrl: true,
          },
        },
      },
    });

    if (!week) {
      return NextResponse.json({ error: "Event week not found" }, { status: 404 });
    }

    return NextResponse.json(week);
  } catch (error: any) {
    await logApiError({
      endpoint: `/api/weeks/${slug}`,
      method: "GET",
      message: `Failed to fetch event week: ${error.message}`,
      payload: { slug },
      status: 500
    });

    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}