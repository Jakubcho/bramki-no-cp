import { prismaCore } from "@/lib/prisma-core";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { logAction } from "@/lib/audit";

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
  try {
    const session = await getServerSession(authOptions);

    if (session?.user.role !== "ADMIN") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const { id: eventId } = await params;
    const form = await req.formData();

    const type = form.get("type") as StepType;
    const titlePl = form.get("title[pl]") as string;
    const titleEn = form.get("title[en]") as string;

    if (!type || !titlePl || !titleEn) {
      return NextResponse.json({ error: "Brak danych" }, { status: 400 });
    }

    const event = await prismaCore.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return NextResponse.json({ error: "Event nie istnieje" }, { status: 404 });
    }

    const order =
      (await prismaCore.step.count({ where: { eventId } })) + 1;

    // =========================
    // CREATE STEP
    // =========================
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

    const baseDir = path.join(
      process.cwd(),
      "public",
      "media",
      event.slug,
      step.id
    );

    await fs.mkdir(baseDir, { recursive: true });

    let index = 0;

    while (form.has(`options[${index}][value]`)) {
      const value = form.get(`options[${index}][value]`) as string;
      const labelPl = form.get(
        `options[${index}][label][pl]`
      ) as string;

      const labelEn = form.get(
        `options[${index}][label][en]`
      ) as string;

      const icon = form.get(
        `options[${index}][icon]`
      ) as File | null;

      let iconUrl: string | null = null;

      if (icon && icon.size > 0) {
        const buffer = Buffer.from(await icon.arrayBuffer());
        const ext = icon.name.split(".").pop();
        const filename = `${crypto.randomUUID()}.${ext}`;
        const filePath = path.join(baseDir, filename);

        await fs.writeFile(filePath, buffer);

        iconUrl = `/media/${event.slug}/${step.id}/${filename}`;
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

    // =========================
    // AFTER SNAPSHOT
    // =========================
    const createdStep = await prismaCore.step.findUnique({
      where: { id: step.id },
      include: {
        translations: true,
        options: {
          include: { translations: true },
        },
      },
    });

    // =========================
    // LOG CREATE
    // =========================
    await logAction({
      action: "CREATE_STEP",
      entity: "STEP",
      entityId: step.id,
      session,
      meta: {
        eventId,
        eventSlug: event.slug,
        created: createdStep,
      },
    });

    return NextResponse.json({ stepId: step.id });

  } catch (error: any) {
    console.error("POST STEP ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}