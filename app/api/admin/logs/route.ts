import { prismaCore } from "@/lib/prisma-core";
import { NextResponse } from "next/server";

export async function GET() {
  const logs = await prismaCore.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return NextResponse.json(logs);
}