import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { prismaCore } from "@/lib/prisma-core";
import { NextRequest, NextResponse } from "next/server";
import { deletePublicFile } from "@/lib/deletePublicFile";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { logAction } from "@/lib/audit";
import { logApiError } from "@/lib/logger";

type StepType =
  | "SINGLE_CHOICE"
  | "MULTI_CHOICE"
  | "MULTI_CHOICE_ICON"
  | "FORM"
  | "CONSENT";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  const { id } = await params;

  try {
    if (session?.user.role !== "ADMIN") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const form = await req.formData();
    const type = form.get("type") as StepType;
    const order = Number(form.get("order"));
    const titlePl = form.get("title[pl]") as string;
    const titleEn = form.get("title[en]") as string;

    const before = await prismaCore.step.findUnique({
      where: { id },
      include: {
        translations: true,
        options: {
          include: { translations: true },
        },
      },
    });

    if (!before) {
      return NextResponse.json({ error: "Step does not exist" }, { status: 404 });
    }

    const deleteIds: string[] = [];
    form.forEach((value, key) => {
      if (key.startsWith("deleteOptions[")) {
        deleteIds.push(value as string);
      }
    });

    if (deleteIds.length > 0) {
      const optionsToDelete = await prismaCore.option.findMany({
        where: { id: { in: deleteIds } },
        select: { iconUrl: true },
      });

      for (const opt of optionsToDelete) {
        if (opt.iconUrl) {
          try {
            await deletePublicFile(opt.iconUrl);
          } catch (err: any) {
            await logApiError({
              endpoint: `/api/admin/steps/${id}`,
              method: "DELETE_FILE",
              message: `Failed to delete orphaned icon: ${err.message}`,
              payload: { iconUrl: opt.iconUrl },
              status: 500
            });
          }
        }
      }

      await prismaCore.option.deleteMany({
        where: { id: { in: deleteIds } },
      });
    }

    const stepWithEvent = await prismaCore.step.findUnique({
      where: { id },
      include: { event: true },
    });

    const eventSlug = stepWithEvent!.event.slug;

    await prismaCore.step.update({
      where: { id },
      data: {
        type,
        order,
        translations: {
          deleteMany: {},
          create: [
            { locale: "pl", title: titlePl || "" },
            { locale: "en", title: titleEn || "" },
          ],
        },
      },
    });

    let index = 0;
    const baseDir = path.join(process.cwd(), "public", "media", eventSlug, id);
    await fs.mkdir(baseDir, { recursive: true });

    while (form.get(`options[${index}][value]`) !== null) {
      const optionId = form.get(`options[${index}][id]`) as string | null;
      const value = form.get(`options[${index}][value]`) as string;
      const labelPl = form.get(`options[${index}][label][pl]`) as string;
      const labelEn = form.get(`options[${index}][label][en]`) as string;
      const icon = form.get(`options[${index}][icon]`) as File | null;

      let iconUrl: string | undefined;

      if (icon && icon instanceof File && icon.size > 0) {
        const buffer = Buffer.from(await icon.arrayBuffer());
        const ext = icon.name.split(".").pop();
        const filename = `${crypto.randomUUID()}.${ext}`;
        const filePath = path.join(baseDir, filename);

        await fs.writeFile(filePath, buffer);
        iconUrl = `/media/${eventSlug}/${id}/${filename}`;
      }

      const translations = [
        { locale: "pl", label: labelPl || "" },
        { locale: "en", label: labelEn || "" },
      ];

      if (optionId && optionId !== "undefined" && optionId !== "null" && optionId !== "") {
        await prismaCore.option.update({
          where: { id: optionId },
          data: {
            value,
            order: index + 1,
            ...(iconUrl && { iconUrl }),
            translations: {
              deleteMany: {},
              create: translations,
            },
          },
        });
      } else {
        await prismaCore.option.create({
          data: {
            stepId: id,
            value,
            order: index + 1,
            iconUrl: iconUrl || null,
            translations: {
              create: translations,
            },
          },
        });
      }
      index++;
    }

    const after = await prismaCore.step.findUnique({
      where: { id },
      include: {
        translations: true,
        options: {
          include: { translations: true },
        },
      },
    });

    await logAction({
      action: "UPDATE_STEP",
      entity: "STEP",
      entityId: id,
      session,
      meta: {
        deletedOptions: deleteIds,
        before,
        after,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    await logApiError({
      endpoint: `/api/admin/steps/${id}`,
      method: "PUT",
      message: `Step update failed: ${error.message}`,
      payload: { stepId: id, userId: session?.user?.id },
      status: 500
    });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  const { id } = await params;

  try {
    if (session?.user.role !== "ADMIN") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const before = await prismaCore.step.findUnique({
      where: { id },
      include: {
        translations: true,
        options: {
          include: { translations: true },
        },
      },
    });

    if (!before) {
      return NextResponse.json({ error: "Step not found" }, { status: 404 });
    }

    const options = await prismaCore.option.findMany({
      where: { stepId: id },
      select: { iconUrl: true },
    });

    for (const o of options) {
      if (o.iconUrl) {
        try {
          await deletePublicFile(o.iconUrl);
        } catch (fsErr: any) {
          await logApiError({
            endpoint: `/api/admin/steps/${id}`,
            method: "DELETE_FS",
            message: `Cleanup failed during step deletion: ${fsErr.message}`,
            payload: { iconUrl: o.iconUrl },
            status: 500
          });
        }
      }
    }

    await prismaCore.step.delete({
      where: { id },
    });

    await logAction({
      action: "DELETE_STEP",
      entity: "STEP",
      entityId: id,
      session,
      meta: {
        deleted: before,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    await logApiError({
      endpoint: `/api/admin/steps/${id}`,
      method: "DELETE",
      message: `Step deletion failed: ${error.message}`,
      payload: { stepId: id, userId: session?.user?.id },
      status: 500
    });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}