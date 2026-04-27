import { prismaCore } from "@/lib/prisma-core";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { logAction } from "@/lib/audit";
import { logApiError } from "@/lib/logger";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  let bodyData: any = null;

  try {
    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    bodyData = { email: body.email, role: body.role };

    if (!body.email || !body.password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const hash = await bcrypt.hash(body.password, 10);

    const user = await prismaCore.user.create({
      data: {
        email: body.email.toLowerCase().trim(),
        password: hash,
        role: body.role || "OPERATOR",
      },
    });

    await logAction({
      action: "CREATE_USER",
      entity: "USER",
      entityId: user.id,
      meta: { createdEmail: user.email, createdRole: user.role },
      session,
    });

    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json(userWithoutPassword);

  } catch (error: any) {
    // Logowanie duplikatu (P2002)
    if (error.code === 'P2002') {
      await logApiError({
        endpoint: "/api/admin/users",
        method: "POST",
        message: `Duplicate user: ${bodyData?.email || 'unknown'}`,
        payload: bodyData, // Przekazujemy obiekt, nie string!
        status: 400
      });
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    // Logowanie innych błędów
    await logApiError({
      endpoint: "/api/admin/users",
      method: "POST",
      message: error.message,
      payload: bodyData,
      status: 500
    });

    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}