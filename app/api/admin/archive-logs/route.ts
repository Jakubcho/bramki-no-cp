import { NextResponse } from "next/server";
import { prismaActivation } from "@/lib/prisma-activation";
import { logApiError } from "@/lib/logger";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const now = new Date();
    const firstDayOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const logsToArchive = await prismaActivation.apiError.findMany({
      where: { createdAt: { lt: firstDayOfCurrentMonth } },
      orderBy: { createdAt: 'asc' }
    });

    if (logsToArchive.length === 0) {
      return NextResponse.json({ message: "No logs to archive" });
    }

    const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const year = prevMonth.getFullYear().toString();
    const month = (prevMonth.getMonth() + 1).toString().padStart(2, '0');

    const dirPath = path.join(process.cwd(), 'logs', year);
    if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });

    const filePath = path.join(dirPath, `${month}.json`);

    try {
      fs.writeFileSync(filePath, JSON.stringify(logsToArchive, null, 2));
    } catch (fsErr: any) {
      await logApiError({
        endpoint: "/api/admin/archive-logs",
        method: "FS_WRITE",
        message: `Failed to write archive file: ${fsErr.message}`,
        status: 500
      });
      throw fsErr;
    }

    await prismaActivation.apiError.deleteMany({
      where: { createdAt: { lt: firstDayOfCurrentMonth } }
    });

    return NextResponse.json({
      success: true,
      archivedCount: logsToArchive.length,
      file: `${year}/${month}.json`
    });
  } catch (error: any) {
    await logApiError({
      endpoint: "/api/admin/archive-logs",
      method: "CRON_ARCHIVE",
      message: `Critical archive failure: ${error.message}`,
      status: 500
    });

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}