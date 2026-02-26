import { prismaData } from "@/lib/prisma-data";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const count = await prismaData.positions.count();
    return NextResponse.json({ ok: true, count });
  } catch (e: any) {
    return NextResponse.json({
      ok: false,
      error: e.message,
    });
  }
}
