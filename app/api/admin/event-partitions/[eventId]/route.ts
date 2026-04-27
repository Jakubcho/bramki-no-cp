import { NextResponse } from "next/server";
import { prismaCore } from "@/lib/prisma-core";
import { logApiError } from "@/lib/logger";

export const dynamic = 'force-dynamic';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  let id = "";
  try {
    const resolvedParams = await params;
    id = resolvedParams.eventId;

    if (!id) {
      return NextResponse.json({ error: "Missing eventId" }, { status: 400 });
    }

    const data = await prismaCore.eventPartition.findMany({
      where: { eventId: id },
      select: { partitionSlug: true }
    });

    const slugs = data.map(p => p.partitionSlug);

    return NextResponse.json(slugs);
  } catch (error: any) {
    await logApiError({
      endpoint: `/api/admin/events/${id}/partitions`,
      method: "GET",
      message: `Failed to fetch event partitions: ${error.message}`,
      payload: { eventId: id },
      status: 500
    });

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}