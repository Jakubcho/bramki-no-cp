import { NextResponse } from "next/server";
import { prismaCore } from "@/lib/prisma-core";
import { authOptions } from "@/lib/auth";
import { logAction } from "@/lib/audit";
import { logApiError } from "@/lib/logger";
import { getServerSession } from "next-auth";

export async function GET() {
  try {
    const hosts = await prismaCore.userHost.findMany({
      orderBy: { fullName: 'asc' }
    });
    return NextResponse.json(hosts);
  } catch (error: any) {
    await logApiError({
      endpoint: "/api/admin/hosts",
      method: "GET",
      message: `Failed to fetch user hosts: ${error.message}`,
      status: 500
    });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  let bodyData = {};

  try {
    const body = await req.json();
    bodyData = body;
    const { fullName } = body;

    if (!fullName) {
      return NextResponse.json({ error: "Full name is required" }, { status: 400 });
    }

    const host = await prismaCore.userHost.create({
      data: { fullName }
    });

    await logAction({
      action: "CREATE_USER_HOST",
      entity: "USER_HOST",
      entityId: host.id,
      meta: { name: fullName },
      session,
    });

    return NextResponse.json(host);
  } catch (error: any) {
    await logApiError({
      endpoint: "/api/admin/hosts",
      method: "POST_CREATE",
      message: `Failed to create user host: ${error.message}`,
      payload: { ...bodyData, userId: session?.user?.id },
      status: 500
    });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) return NextResponse.json({ error: "No ID provided" }, { status: 400 });

  try {
    const deleted = await prismaCore.userHost.delete({
      where: { id }
    });

    await logAction({
      action: "DELETE_USER_HOST",
      entity: "USER_HOST",
      entityId: id,
      meta: { name: deleted.fullName },
      session,
    });

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    await logApiError({
      endpoint: "/api/admin/hosts",
      method: "DELETE",
      message: `Failed to delete user host: ${error.message}`,
      payload: { id, userId: session?.user?.id },
      status: 500
    });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}