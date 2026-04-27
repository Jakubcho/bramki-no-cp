import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { prismaActivation } from "@/lib/prisma-activation";
import { prismaCore } from "@/lib/prisma-core";
import { logApiError } from "@/lib/logger";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  const { id: eventId } = await params;

  if (!session || session.user.role !== "ADMIN") {
    return new NextResponse("Forbidden", { status: 403 });
  }

  try {
    const assignedPartitions = await prismaCore.eventPartition.findMany({
      where: { eventId: eventId },
      select: { partitionSlug: true }
    });

    const slugs = assignedPartitions.map(p => p.partitionSlug);

    if (slugs.length === 0) {
      const event = await prismaCore.event.findUnique({
        where: { id: eventId },
        select: { slug: true }
      });
      if (event) slugs.push(event.slug);
    }

    if (slugs.length === 0) {
      return NextResponse.json([]);
    }

    const activations = await prismaActivation.activationEntry.findMany({
      where: { slug: { in: slugs } },
      select: {
        formId: true,
        formName: true,
        answers: true
      },
    });


    const nameToIdMap = new Map<string, string>();
    activations.forEach(entry => {
      if (entry.formName && entry.formId) {
        nameToIdMap.set(entry.formName, String(entry.formId));
      }
    });

    const uniqueForms = new Map<string, { id: string, name: string }>();


    activations.forEach(entry => {
      const answers = entry.answers as any;
      const baseName = entry.formName;

      if (!baseName) return;

      const finalId = entry.formId !== null
        ? String(entry.formId)
        : (nameToIdMap.get(baseName) || "unknown");

      let fName = baseName;

      if (fName.toLowerCase().includes("call centre")) {
        const sender = answers?.sender;
        if (sender) fName = `${fName} [SENDER: ${sender}]`;
      }
      else if (fName.toLowerCase().includes("badge generator")) {
        const bType = answers?.badgeType;
        if (bType) fName = `${fName} [BADGE: ${bType}]`;
      }
      if (!uniqueForms.has(fName)) {
        uniqueForms.set(fName, {
          id: finalId,
          name: fName
        });
      }
    });

    return NextResponse.json(Array.from(uniqueForms.values()));

  } catch (error: any) {
    await logApiError({
      endpoint: `/api/admin/events/${eventId}/form-names`,
      method: "GET_FORM_NAMES",
      message: `Failed: ${error.message}`,
      payload: { eventId },
      status: 500
    });
    return new NextResponse("Internal Error", { status: 500 });
  }
}