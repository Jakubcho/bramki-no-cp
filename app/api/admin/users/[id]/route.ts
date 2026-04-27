import { prismaCore } from "@/lib/prisma-core";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { logAction } from "@/lib/audit";
import { logApiError } from "@/lib/logger";

export async function DELETE(
  _: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  const { id } = await context.params;

  try {
    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    if (session.user.id === id) {
      return new NextResponse("Cannot delete yourself", { status: 400 });
    }

    const deleteUser = await prismaCore.user.findUnique({ where: { id } });
    if (!deleteUser) {
      return new NextResponse("User not found", { status: 404 });
    }

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
  } catch (error: any) {
    await logApiError({
      endpoint: `/api/admin/users/${id}`,
      method: "DELETE",
      message: `Failed to delete user: ${error.message}`,
      payload: { targetId: id, requesterId: session?.user?.id },
      status: 500
    });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  const { id } = await context.params;
  let bodyData = {};

  try {
    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const body = await req.json();
    bodyData = body;
    const { role } = body;

    const oldUser = await prismaCore.user.findUnique({ where: { id } });
    if (!oldUser) {
      return new NextResponse("User not found", { status: 404 });
    }

    const updated = await prismaCore.user.update({
      where: { id },
      data: { role },
    });

    await logAction({
      action: "UPDATE_USER",
      entity: "USER",
      entityId: id,
      meta: {
        before: oldUser,
        after: updated,
      },
      session,
    });

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    await logApiError({
      endpoint: `/api/admin/users/${id}`,
      method: "PUT_UPDATE",
      message: `Failed to update user role: ${error.message}`,
      payload: { targetId: id, body: bodyData, requesterId: session?.user?.id },
      status: 500
    });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}