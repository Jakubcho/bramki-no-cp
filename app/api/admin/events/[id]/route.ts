import { prismaCore } from "@/lib/prisma-core";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { logAction } from "@/lib/audit";
import { logApiError } from "@/lib/logger";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const { id } = await params;

  try {
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const startDate = formData.get("startDate") as string;
    const endDate = formData.get("endDate") as string;
    const entrancesRaw = formData.get("entrances") as string;
    const qrPrefixesRaw = formData.get("qrPrefixes") as string; // NOWE
    const domain = formData.get("domain") as string;
    const externalDirectoryIDRaw = formData.get("externalDirectoryID");
    const externalDirectoryID = externalDirectoryIDRaw && externalDirectoryIDRaw !== ""
      ? parseInt(externalDirectoryIDRaw as string, 10)
      : null;

    const image = formData.get("image") as File | null;
    const ticketRulesRaw = formData.get("ticketRules");
    const ticketRules = ticketRulesRaw
      ? JSON.parse(ticketRulesRaw as string)
      : undefined;


    if (!name) return new NextResponse("Name is required", { status: 400 });

    const event = await prismaCore.event.findUnique({ where: { id } });
    if (!event) return new NextResponse("Not found", { status: 404 });

    let imageUrl = event.imageUrl;

    // Obsługa obrazka
    if (image && typeof image !== "string") {
      try {
        const bytes = await image.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const uploadDir = path.join(process.cwd(), "public/media", event.slug);
        await fs.mkdir(uploadDir, { recursive: true });
        const fileName = `hero_${Date.now()}_${image.name.replace(/\s+/g, "_")}`;
        const filePath = path.join(uploadDir, fileName);
        await fs.writeFile(filePath, buffer);
        imageUrl = `/media/${event.slug}/${fileName}`;
      } catch (fsErr: any) {
        await logApiError({
          endpoint: `/api/admin/events/${id}`,
          method: "FS_UPLOAD",
          message: `Hero image upload failed: ${fsErr.message}`,
          payload: { eventId: id, fileName: image.name },
          status: 500
        });
      }
    }

    // Parsowanie Wejść
    let parsedEntrances = [];
    try {
      parsedEntrances = entrancesRaw ? JSON.parse(entrancesRaw) : [];
    } catch (parseErr: any) {
      await logApiError({
        endpoint: `/api/admin/events/${id}`,
        method: "JSON_PARSE_ENTRANCES",
        message: `Entrances JSON parse failed: ${parseErr.message}`,
        payload: { entrancesRaw },
        status: 400
      });
    }

    // Parsowanie Prefiksów QR (NOWE)
    let parsedQrPrefixes = event.qrPrefixes; // domyślnie zostawiamy stare
    if (qrPrefixesRaw) {
      try {
        parsedQrPrefixes = JSON.parse(qrPrefixesRaw);
      } catch (parseErr: any) {
        await logApiError({
          endpoint: `/api/admin/events/${id}`,
          method: "JSON_PARSE_QR",
          message: `QR Prefixes JSON parse failed: ${parseErr.message}`,
          payload: { qrPrefixesRaw },
          status: 400
        });
      }
    }

    const parsedStartDate = startDate ? new Date(startDate) : null;
    const parsedEndDate = endDate ? new Date(endDate) : null;

    const updatedEvent = await prismaCore.event.update({
      where: { id },
      data: {
        name,
        imageUrl,
        domain,
        startDate: parsedStartDate,
        endDate: parsedEndDate,
        entrances: parsedEntrances,
        qrPrefixes: parsedQrPrefixes, // AKTUALIZACJA POLA
        version: { increment: 1 },
        ticketRules: ticketRules,
        externalDirectoryID: externalDirectoryID,
      },
    });

    await logAction({
      action: "UPDATE_EVENT_CORE",
      entity: "EVENT",
      entityId: id,
      meta: {
        name,
        hasImage: !!image,
        version: updatedEvent.version,
        qrPrefixesCount: parsedQrPrefixes.length
      },
      session,
    });

    return NextResponse.json(updatedEvent);
  } catch (error: any) {
    await logApiError({
      endpoint: `/api/admin/events/${id}`,
      method: "PATCH_UPDATE",
      message: `Event core update failed: ${error.message}`,
      payload: { eventId: id, userId: session?.user?.id },
      status: 500
    });
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return new NextResponse("Forbidden", { status: 403 });
  }
  const { id } = await params;

  const event = await prismaCore.event.findUnique({ where: { id } });
  if (!event) return new NextResponse("Not found", { status: 404 });

  try {
    const mediaPath = path.join(process.cwd(), "public/media", event.slug);
    await fs.rm(mediaPath, { recursive: true, force: true });
  } catch (err: any) {
    await logApiError({
      endpoint: `/api/admin/events/${id}`,
      method: "FS_DELETE",
      message: `Media directory deletion failed: ${err.message}`,
      payload: { slug: event.slug },
      status: 500
    });
  }

  try {
    await prismaCore.event.delete({ where: { id } });

    await logAction({
      action: "DELETE_EVENT",
      entity: "EVENT",
      entityId: id,
      meta: { name: event.name, slug: event.slug },
      session,
    });

    return NextResponse.json({ ok: true });
  } catch (dbErr: any) {
    await logApiError({
      endpoint: `/api/admin/events/${id}`,
      method: "DELETE_DB",
      message: `Database event deletion failed: ${dbErr.message}`,
      payload: { id, userId: session?.user?.id },
      status: 500
    });
    return new NextResponse("Internal Error", { status: 500 });
  }
}