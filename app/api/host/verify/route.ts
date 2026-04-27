import { prismaCore } from "@/lib/prisma-core";
import { NextResponse } from "next/server";
import { logApiError } from "@/lib/logger";

export async function POST(req: Request) {
  let bodyData = {};
  try {
    const body = await req.json();
    bodyData = body;
    const { hostId } = body;

    const host = await prismaCore.userHost.findUnique({
      where: { id: hostId }
    });

    if (!host) {
      return NextResponse.json({ error: "Host not found in database" }, { status: 404 });
    }

    return NextResponse.json({ name: host.fullName });
  } catch (error: any) {
    await logApiError({
      endpoint: "/api/hosts/verify",
      method: "POST",
      message: `Host verification lookup failed: ${error.message}`,
      payload: bodyData,
      status: 500
    });

    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}