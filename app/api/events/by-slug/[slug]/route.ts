import { prismaCore } from "@/lib/prisma-core";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {

  const { slug } = await params;

  const event = await prismaCore.event.findUnique({
    where: { slug },
    include: {
      steps: {
        include: {
          translations: true,
          options: {
            include: {
              translations: true
            }
          }
        }
      }
    }
  });

  if (!event || !event.isActive) {
    return new NextResponse("Not found", { status: 404 });
  }

  return NextResponse.json(event);
}