import { prismaCore } from "@/lib/prisma-core";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { logAction } from "@/lib/audit";
import { logApiError } from "@/lib/logger";

export async function GET() {
  try {
    const links = await prismaCore.shortLink.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(links);
  } catch (error: any) {
    await logApiError({
      endpoint: "/api/admin/shortlinks",
      method: "GET",
      message: `Failed to fetch short links: ${error.message}`,
      status: 500
    });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  let bodyData = {};
  try {
    const body = await req.json();
    bodyData = body;
    const { code, destination, description } = body;

    if (!code || !destination) {
      return NextResponse.json({ error: "Code and destination are required" }, { status: 400 });
    }

    const link = await prismaCore.shortLink.create({
      data: {
        code: code.toLowerCase().trim(),
        destination: destination.trim(),
        description: description?.trim(),
      },
    });

    await logAction({
      action: "CREATE_SHORTLINK",
      entity: "SHORTLINK",
      entityId: link.id,
      session,
      meta: { code, destination },
    });

    return NextResponse.json(link);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: "This code already exists" }, { status: 400 });
    }

    await logApiError({
      endpoint: "/api/admin/shortlinks",
      method: "POST_CREATE",
      message: `Shortlink creation failed: ${error.message}`,
      payload: { ...bodyData, userId: session.user.id },
      status: 500
    });

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) return new NextResponse("Missing ID", { status: 400 });

  try {
    const link = await prismaCore.shortLink.findUnique({ where: { id } });
    if (!link) return new NextResponse("Not found", { status: 404 });

    await prismaCore.shortLink.delete({ where: { id } });

    await logAction({
      action: "DELETE_SHORTLINK",
      entity: "SHORTLINK",
      entityId: id,
      session,
      meta: { code: link.code },
    });

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    await logApiError({
      endpoint: "/api/admin/shortlinks",
      method: "DELETE",
      message: `Failed to delete shortlink: ${error.message}`,
      payload: { id, userId: session.user.id },
      status: 500
    });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}