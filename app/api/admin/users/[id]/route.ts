import { prismaCore } from "@/lib/prisma-core";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { logAction } from "@/lib/audit";

export async function DELETE(
  _: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  const { id } = await context.params;

  if (!session || session.user.role !== "ADMIN") {
    return new NextResponse("Forbidden", { status: 403 });
  }

  if (session.user.id === id) {
    return new NextResponse("Cannot delete yourself", { status: 400 });
  }
  const deleteUser = await prismaCore.user.findUnique({ where: { id } });

  await prismaCore.user.delete({
    where: { id },
  });

  await logAction({
    action: "DELETE_USER",
    entity: "USER",
    entityId: id,
    meta: {
      user: deleteUser,
    },
    session,
  });

  return NextResponse.json({ ok: true });
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  const { id } = await context.params;

  if (!session || session.user.role !== "ADMIN") {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const { role } = await req.json();
  const old = await prismaCore.user.findUnique({ where: { id } });

  const updated = await prismaCore.user.update({
    where: { id },
    data: { role },
  });

  await logAction({
    action: "UPDATE_USER",
    entity: "USER",
    entityId: id,
    meta: {
      before: old,
      after: updated,
    },
    session,
  });
  return NextResponse.json({ ok: true });
}
