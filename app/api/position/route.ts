import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Brak ID" }, { status: 400 });
  }

  const position = await prisma.position.findUnique({
    where: { id }
  });

  return NextResponse.json(position);
}

export async function POST(req: Request) {
  const data = await req.json();

  const saved = await prisma.position.update({
    where: { id: data.id },
    data
  });

  return NextResponse.json(saved);
}
