import { prismaCore } from "@/lib/prisma-core";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { logAction } from "@/lib/audit";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (session?.user.role !== "ADMIN") {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const { email, password, role } = await req.json();
  const hash = await bcrypt.hash(password, 10);

  const user = await prismaCore.user.create({
    data: {
      email,
      password: hash,
      role,
    },
  });

  await logAction({
    action: "CREATE_USER",
    entity: "USER",
    entityId: user.id,
    meta: {
      createdEmail: user.email,
      createdRole: user.role,
    },
    session,
  });

  return NextResponse.json(user);
}