import { prismaCore } from "@/lib/prisma-core";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { logAction } from "@/lib/audit";
import { logApiError } from "@/lib/logger";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  const { id: optionId } = await params;
  let bodyData = {};

  try {
    const form = await req.formData();
    const value = form.get("value") as string;
    const icon = form.get("icon") as File | null;

    const existing = await prismaCore.option.findUnique({
      where: { id: optionId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Option not found" }, { status: 404 });
    }

    let iconUrl = existing.iconUrl;

    if (icon && typeof icon !== "string") {
      try {
        if (existing.iconUrl) {
          const oldPath = path.join(process.cwd(), "public", existing.iconUrl);
          if (fs.existsSync(oldPath)) {
            await fs.promises.unlink(oldPath);
          }
        }

        const bytes = await icon.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const uploadPath = `/uploads/${Date.now()}-${icon.name.replace(/\s+/g, "_")}`;
        const fullPath = path.join(process.cwd(), "public", uploadPath);

        const dir = path.dirname(fullPath);
        if (!fs.existsSync(dir)) await fs.promises.mkdir(dir, { recursive: true });

        await fs.promises.writeFile(fullPath, buffer);
        iconUrl = uploadPath;
      } catch (fsErr: any) {
        await logApiError({
          endpoint: `/api/admin/options/${optionId}`,
          method: "FS_ICON_UPDATE",
          message: `Failed to swap option icon: ${fsErr.message}`,
          payload: { optionId, iconName: icon.name },
          status: 500
        });
      }
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

    const oldState = await prismaCore.option.findUnique({
      where: { id: optionId },
      include: { translations: true }
    });

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
        update: { label: t.label },
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
        before: oldState,
        after: updated,
      },
      session,
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    await logApiError({
      endpoint: `/api/admin/options/${optionId}`,
      method: "PUT_UPDATE",
      message: `Option update failed: ${error.message}`,
      payload: { optionId, userId: session?.user?.id },
      status: 500
    });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}