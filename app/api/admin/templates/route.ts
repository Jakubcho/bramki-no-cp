import { prismaCore } from "@/lib/prisma-core";
import { NextResponse } from "next/server";
import { logApiError } from "@/lib/logger";

export async function GET() {
  try {
    const templates = await prismaCore.eventTemplate.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(templates);
  } catch (error: any) {
    await logApiError({
      endpoint: "/api/admin/templates",
      method: "GET",
      message: `Failed to fetch templates: ${error.message}`,
      status: 500
    });

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}