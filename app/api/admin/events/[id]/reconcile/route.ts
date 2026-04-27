import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { prismaCore } from "@/lib/prisma-core";
import { prismaActivation } from "@/lib/prisma-activation";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const { id: eventId } = await params;

  try {

    const event = await prismaCore.event.findUnique({
      where: { id: eventId },
      select: { ticketRules: true }
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }


    const assignedPartitions = await prismaCore.eventPartition.findMany({
      where: { eventId },
      select: { partitionSlug: true }
    });

    const allSlugs = assignedPartitions.map(p => p.partitionSlug);

    console.log(`[RECONCILE] Rozpoczynam aktualizację dla partycji: ${allSlugs.join(", ")}`);

    if (allSlugs.length === 0) {
      return NextResponse.json({
        error: "Brak przypisanych partycji do tego wydarzenia. Najpierw przypisz partycje w zakładce obok."
      }, { status: 400 });
    }

    const rules = event.ticketRules as any;
    if (!rules) {
      return NextResponse.json({ error: "Brak zdefiniowanych reguł biletów" }, { status: 400 });
    }

    let totalUpdated = 0;


    for (const [role, config] of Object.entries(rules)) {
      const forms = (config as any).forms || [];
      const targetType = role.toUpperCase();

      for (const form of forms) {
        const complexName = typeof form === 'string' ? form : String(form.name || "");

        if (!complexName) continue;

        let whereClause: any = {
          slug: { in: allSlugs },
          manualOverride: false
        };

        if (complexName.includes(" [SENDER: ")) {
          const [fName, senderPart] = complexName.split(" [SENDER: ");
          const sender = senderPart.replace("]", "");
          whereClause.formName = fName;
          whereClause.answers = { path: ['sender'], equals: sender };
        }
        else if (complexName.includes(" [BADGE: ")) {
          const [fName, badgePart] = complexName.split(" [BADGE: ");
          const bType = badgePart.replace("]", "");
          whereClause.formName = fName;
          whereClause.answers = { path: ['badgeType'], equals: bType };
        }
        else {
          whereClause.formName = complexName;
        }

        const result = await prismaActivation.activationEntry.updateMany({
          where: whereClause,
          data: { ticketType: targetType }
        });

        totalUpdated += result.count;
      }
    }

    console.log(`[RECONCILE] Zakończono sukcesem. Zaktualizowano rekordów: ${totalUpdated}`);

    return NextResponse.json({
      success: true,
      updatedCount: totalUpdated
    });

  } catch (error: any) {
    console.error("Reconcile error:", error);
    return NextResponse.json({
      error: error.message
    }, { status: 500 });
  }
}