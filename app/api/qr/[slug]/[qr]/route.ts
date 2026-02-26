import { NextRequest, NextResponse } from "next/server";
import { prismaData } from "@/lib/prisma-data";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string; qr: string }> }
) {
  const { slug, qr } = await params;

  if (!slug || !qr) {
    return NextResponse.json({ error: "Missing params" }, { status: 400 });
  }

  try {
    const result = await prismaData.$queryRawUnsafe<any[]>(
      `SELECT * FROM \`${slug}\` WHERE qr_code = ? LIMIT 1`,
      qr
    );

    if (!result.length) {
      return NextResponse.json({ error: "QR not found" }, { status: 404 });
    }

    return NextResponse.json(result[0]);
  } catch (e) {
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}