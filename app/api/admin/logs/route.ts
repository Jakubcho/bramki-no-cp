import { prismaCore } from "@/lib/prisma-core";
import { NextResponse } from "next/server";
import { logApiError } from "@/lib/logger";

export async function GET() {
  try {
    const logs = await prismaCore.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 200,
    });

    return NextResponse.json(logs);
  } catch (error: any) {
    await logApiError({
      endpoint: "/api/admin/audit-logs",
      method: "GET",
      message: `Failed to fetch audit logs: ${error.message}`,
      status: 500
    });

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}