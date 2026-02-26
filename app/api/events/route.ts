import { prismaCore } from "@/lib/prisma-core";
import { NextResponse } from "next/server";

export async function GET() {
  const events = await prismaCore.event.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(events);
}