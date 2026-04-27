import { prismaCore } from "@/lib/prisma-core";
import { NextRequest, NextResponse } from "next/server";
import { logApiError } from "@/lib/logger";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const event = await prismaCore.event.findUnique({
      where: { slug },
      include: {
        steps: {
          orderBy: { order: "asc" },
          include: {
            translations: true,
            options: {
              orderBy: { order: "asc" },
              include: {
                translations: true
              }
            }
          }
        },
        partitions: true
      }
    });

    if (!event || !event.isActive) {
      return new NextResponse("Event not found or inactive", { status: 404 });
    }

    return NextResponse.json(event);
  } catch (error: any) {
    await logApiError({
      endpoint: `/api/events/${slug}`,
      method: "GET",
      message: `Public event fetch failed: ${error.message}`,
      payload: { slug },
      status: 500
    });

    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}