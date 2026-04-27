import { prismaCore } from "@/lib/prisma-core";
import { NextRequest, NextResponse } from "next/server";
import { logAction } from "@/lib/audit";
import { logApiError } from "@/lib/logger";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  let bodyData = null;
  const session = await getServerSession(authOptions);

  try {
    const body = await req.json();
    bodyData = body;
    const { updates } = body;

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
    await logApiError({
      endpoint: "/api/admin/steps/reorder",
      method: "PATCH_TRANSACTION",
      message: `Reordering steps failed: ${error.message}`,
      payload: { updates: bodyData?.updates, userId: session?.user?.id },
      status: 500
    });

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}