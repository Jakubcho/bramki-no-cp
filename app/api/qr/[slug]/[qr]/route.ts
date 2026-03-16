import { NextRequest, NextResponse } from "next/server";
import { prismaActivation } from "@/lib/prisma-activation";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string; qr: string }> }
) {
  const { slug, qr } = await params;

  if (!slug || !qr) {
    return NextResponse.json({ error: "Missing params" }, { status: 400 });
  }

  try {
    const safeSlug = slug.replace(/[^a-zA-Z0-9_]/g, "_");
    const tableName = `ActivationEntry_${safeSlug}`;

    const result = await prismaActivation.$queryRawUnsafe<any[]>(
      `SELECT * FROM "${tableName}" WHERE "qrCode" = $1 LIMIT 1`,
      qr
    );

    if (!result || result.length === 0) {
      return NextResponse.json({ error: "QR not found" }, { status: 404 });
    }

    return NextResponse.json(result[0]);
  } catch (e: any) {
    console.error("GET QR ERROR:", e);
    return NextResponse.json({ error: "DB error", details: e.message }, { status: 500 });
  }
}