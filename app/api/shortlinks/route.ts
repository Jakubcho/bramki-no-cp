import { prismaCore } from "@/lib/prisma-core";
import { NextResponse, NextRequest } from "next/server";
import { logApiError } from "@/lib/logger";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) {
    return new NextResponse("Missing code parameter", { status: 400 });
  }

  try {
    const link = await prismaCore.shortLink.findUnique({
      where: { code: code.toLowerCase().trim() },
      select: { destination: true }
    });

    if (!link) {
      return new NextResponse("Short link not found", { status: 404 });
    }

    return NextResponse.json(link);
  } catch (error: any) {
    await logApiError({
      endpoint: "/api/shortlinks/resolve",
      method: "GET",
      message: `Failed to resolve shortlink: ${error.message}`,
      payload: { code },
      status: 500
    });

    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}