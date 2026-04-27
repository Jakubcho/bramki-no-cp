import { prismaCore } from "@/lib/prisma-core";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
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

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: eventId } = await params;
  const session = await getServerSession(authOptions);

  try {
    if (session?.user.role !== "ADMIN") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const form = await req.formData();
    const type = form.get("type") as StepType;
    const titlePl = form.get("title[pl]") as string;
    const titleEn = form.get("title[en]") as string;

    if (!type || !titlePl || !titleEn) {
      return NextResponse.json({ error: "Missing required data" }, { status: 400 });
    }

    const event = await prismaCore.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return NextResponse.json({ error: "Event does not exist" }, { status: 404 });
    }

    const order = (await prismaCore.step.count({ where: { eventId } })) + 1;

    const step = await prismaCore.step.create({
      data: {
        eventId,
        type,
        order,
        translations: {
          create: [
            { locale: "pl", title: titlePl },
            { locale: "en", title: titleEn },
          ],
        },
      },
    });

    const baseDir = path.join(process.cwd(), "public", "media", event.slug, step.id);

    try {
      await fs.mkdir(baseDir, { recursive: true });
    } catch (fsErr: any) {
      await logApiError({
        endpoint: `/api/admin/events/${eventId}/steps`,
        method: "FS_MKDIR",
        message: `Failed to create step directory: ${fsErr.message}`,
        payload: { baseDir },
        status: 500
      });
    }

    let index = 0;
    while (form.has(`options[${index}][value]`)) {
      const value = form.get(`options[${index}][value]`) as string;
      const labelPl = form.get(`options[${index}][label][pl]`) as string;
      const labelEn = form.get(`options[${index}][label][en]`) as string;
      const icon = form.get(`options[${index}][icon]`) as File | null;

      let iconUrl: string | null = null;

      if (icon && icon.size > 0) {
        try {
          const buffer = Buffer.from(await icon.arrayBuffer());
          const ext = icon.name.split(".").pop();
          const filename = `${crypto.randomUUID()}.${ext}`;
          const filePath = path.join(baseDir, filename);
          await fs.writeFile(filePath, buffer);
          iconUrl = `/media/${event.slug}/${step.id}/${filename}`;
        } catch (uploadErr: any) {
          await logApiError({
            endpoint: `/api/admin/events/${eventId}/steps`,
            method: "FS_WRITE",
            message: `Option icon upload failed: ${uploadErr.message}`,
            payload: { stepId: step.id, optionIndex: index },
            status: 500
          });
        }
      }

      await prismaCore.option.create({
        data: {
          stepId: step.id,
          value,
          iconUrl,
          order: index + 1,
          translations: {
            create: [
              { locale: "pl", label: labelPl || "" },
              { locale: "en", label: labelEn || "" },
            ],
          },
        },
      });
      index++;
    }

    const createdStep = await prismaCore.step.findUnique({
      where: { id: step.id },
      include: {
        translations: true,
        options: { include: { translations: true } },
      },
    });

    await logAction({
      action: "CREATE_STEP",
      entity: "STEP",
      entityId: step.id,
      session,
      meta: { eventId, eventSlug: event.slug, created: createdStep },
    });

    await prismaCore.event.update({
      where: { id: eventId },
      data: { version: { increment: 1 } }
    });

    return NextResponse.json({ stepId: step.id });

  } catch (error: any) {
    await logApiError({
      endpoint: `/api/admin/events/${eventId}/steps`,
      method: "POST_CREATE",
      message: `Step creation failed: ${error.message}`,
      payload: { userId: session?.user?.id, eventId },
      status: 500
    });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}