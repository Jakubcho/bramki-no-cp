import { NextResponse } from "next/server";
import { prismaData } from "@/lib/prisma-data";
import { prismaActivation } from "@/lib/prisma-activation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (session?.user.role !== "ADMIN") {
    return new NextResponse("Forbidden", { status: 403 });
  }

  try {
    const data = await prismaActivation.activationEntry.findMany({
      select: {
        slug: true,
        id: true,
        qrCode: true,
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json({
      count: data.length,
      data,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}