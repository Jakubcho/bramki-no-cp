import { prismaCore } from "@/lib/prisma-core";
import { NextRequest, NextResponse } from "next/server";
import { logAction } from "@/lib/audit";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { updates } = await req.json();
    const session = await getServerSession(authOptions);

    const transition = await prismaCore.$transaction(
      updates.map((u: { id: string, order: number }) =>
        prismaCore.step.update({
          where: { id: u.id },
          data: { order: u.order }
        })
      )
    );

    await logAction({
      action: "TRANSITION_CHANGE",
      entity: "TRANSITION",
      meta: {
        update: transition,
      },
      session,
    });

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}