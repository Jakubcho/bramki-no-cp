import { prismaCore } from "@/lib/prisma-core";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { logAction } from "@/lib/audit";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const body = await req.json();

  if (!body.name?.trim() || !body.slug?.trim()) {
    return new NextResponse("Invalid data", { status: 400 });
  }
  const event = await prismaCore.event.create({
    data: {
      name: body.name,
      slug: body.slug,
    },
  });
  await logAction({
    action: "CREATE_EVENT",
    entity: "EVENT",
    entityId: event.id,
    meta: {
      event: event,
    },
    session,
  });
  return NextResponse.json(event);
}
