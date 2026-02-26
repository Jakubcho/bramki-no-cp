import { prismaCore } from "@/lib/prisma-core";
import { NextResponse } from "next/server";

export async function GET() {
  const templates = await prismaCore.eventTemplate.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(templates);
}
