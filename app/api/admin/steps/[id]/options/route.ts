import { prismaCore } from "@/lib/prisma-core";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { logAction } from "@/lib/audit";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: stepId } = await params;
    const body = await req.json();
    const session = await getServerSession(authOptions);

    const count = await prismaCore.option.count({
      where: { stepId },
    });

    const translationsArray = Object.entries(body.translations || {}).map(
      ([locale, label]) => ({
        locale,
        label: label as string,
      })
    );

    if (!translationsArray.length) {
      return NextResponse.json(
        { error: "Brak tłumaczeń" },
        { status: 400 }
      );
    }

    const option = await prismaCore.option.create({
      data: {
        stepId,
        value: body.value || "",
        iconUrl: body.iconUrl || null,
        order: count + 1,
        translations: {
          create: translationsArray,
        },
      },
      include: {
        translations: true,
      },
    });

    await logAction({
      action: "CREATE_OPTION",
      entity: "OPTION",
      entityId: option.id,
      session,
      meta: {
        create: option,
      },
    });

    return NextResponse.json(option);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}