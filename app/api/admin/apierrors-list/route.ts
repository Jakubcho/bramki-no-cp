import { prismaActivation } from "@/lib/prisma-activation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    // Zabezpieczenie - tylko admin może oglądać logi błędów
    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const errors = await prismaActivation.apiError.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 50,
    });

    // Zwracamy surowe dane - Prisma automatycznie obsługuje pola typu Json
    return NextResponse.json(errors);
  } catch (error: any) {
    console.error("CRITICAL API ERROR LIST:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}