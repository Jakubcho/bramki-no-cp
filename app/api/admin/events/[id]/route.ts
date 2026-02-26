import { prismaCore } from "@/lib/prisma-core";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { logAction } from "@/lib/audit";

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const { id } = await params;

  const event = await prismaCore.event.findUnique({
    where: { id },
  });

  if (!event) {
    return new NextResponse("Not found", { status: 404 });
  }

  const mediaPath = path.join(process.cwd(), "public/media", event.slug);
  await fs.rm(mediaPath, { recursive: true, force: true });

  const deleteEvent = await prismaCore.event.findUnique({
    where: { id },
  });

  await prismaCore.event.delete({
    where: { id },
  });

  await logAction({
    action: "DELETE_EVENT",
    entity: "EVENT",
    entityId: id,
    meta: {
      name: deleteEvent,
    },
    session,
  });

  return NextResponse.json({ ok: true });
}
