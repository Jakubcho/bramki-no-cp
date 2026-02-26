import { prismaCore } from "@/lib/prisma-core";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { logAction } from "@/lib/audit";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  const { id: optionId } = await params;
  const form = await req.formData();

  const value = form.get("value") as string;
  const icon = form.get("icon") as File | null;

  const existing = await prismaCore.option.findUnique({
    where: { id: optionId },
  });

  if (!existing) {
    return NextResponse.json({ error: "Nie znaleziono opcji" }, { status: 404 });
  }

  let iconUrl = existing.iconUrl;

  if (icon) {

    if (existing.iconUrl) {
      const oldPath = path.join(process.cwd(), "public", existing.iconUrl);
      if (fs.existsSync(oldPath)) {
        await fs.promises.unlink(oldPath);
      }
    }

    const bytes = await icon.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadPath = `/uploads/${Date.now()}-${icon.name}`;
    const fullPath = path.join(process.cwd(), "public", uploadPath);

    await fs.promises.writeFile(fullPath, buffer);
    iconUrl = uploadPath;
  }

  const translations: { locale: string; label: string }[] = [];

  for (const [key, val] of form.entries()) {
    const match = key.match(/^label\[(.+)\]$/);
    if (match && typeof val === "string") {
      translations.push({
        locale: match[1],
        label: val,
      });
    }
  }
  const old = await prismaCore.option.findUnique({ where: { id: optionId } });

  await prismaCore.option.update({
    where: { id: optionId },
    data: {
      value,
      iconUrl,
    },
  });

  for (const t of translations) {
    await prismaCore.optionTranslation.upsert({
      where: {
        optionId_locale: {
          optionId,
          locale: t.locale,
        },
      },
      update: {
        label: t.label,
      },
      create: {
        optionId,
        locale: t.locale,
        label: t.label,
      },
    });
  }

  const updated = await prismaCore.option.findUnique({
    where: { id: optionId },
    include: { translations: true },
  });

  await logAction({
    action: "UPDATE_OPTION",
    entity: "OPTION",
    entityId: optionId,
    meta: {
      before: old,
      after: updated,
    },
    session,
  });

  return NextResponse.json(updated);
}