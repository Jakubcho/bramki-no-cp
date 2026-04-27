import { NextRequest, NextResponse } from "next/server";
import { prismaCore } from "@/lib/prisma-core";
import QRCode from "qrcode";
import path from "path";
import fs from "fs";
import { logApiError } from "@/lib/logger";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  let hostId = "";

  try {
    const body = await req.json();
    hostId = body.hostId;

    const host = await prismaCore.userHost.findUnique({ where: { id: hostId } });
    if (!host) {
      return NextResponse.json({ error: "Host does not exist" }, { status: 404 });
    }

    if (host.qrCodeUrl) {
      return NextResponse.json({ qrUrl: host.qrCodeUrl });
    }

    const publicDir = path.join(process.cwd(), "public", "qrcodes");

    try {
      if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
      }
    } catch (fsErr: any) {
      await logApiError({
        endpoint: "/api/admin/hosts/generate-qr",
        method: "FS_MKDIR",
        message: `Failed to create QR directory: ${fsErr.message}`,
        status: 500
      });
    }

    const fileName = `host-${host.id}.png`;
    const filePath = path.join(publicDir, fileName);
    const publicPath = `/qrcodes/${fileName}`;

    const qrOptions = {
      width: 220,
      margin: 1,
      errorCorrectionLevel: 'H' as const,
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
    };

    try {
      await QRCode.toFile(filePath, `HOST:${host.id}`, qrOptions);
    } catch (qrErr: any) {
      await logApiError({
        endpoint: "/api/admin/hosts/generate-qr",
        method: "QR_GENERATE",
        message: `QR code generation failed: ${qrErr.message}`,
        payload: { hostId },
        status: 500
      });
      throw qrErr;
    }

    await prismaCore.userHost.update({
      where: { id: hostId },
      data: { qrCodeUrl: publicPath }
    });

    return NextResponse.json({ qrUrl: publicPath });
  } catch (error: any) {
    await logApiError({
      endpoint: "/api/admin/hosts/generate-qr",
      method: "POST",
      message: `Failed to process host QR: ${error.message}`,
      payload: { hostId, userId: session?.user?.id },
      status: 500
    });

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}