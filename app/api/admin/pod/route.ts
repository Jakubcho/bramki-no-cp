import { NextRequest, NextResponse } from "next/server";
import { prismaActivation } from "@/lib/prisma-activation";

export async function GET(req: NextRequest) {
  try {
    const targetPartition = "ActivationEntry_mr_glasstec_2026";

    const partitionsList: any[] = await prismaActivation.$queryRaw`
      SELECT
          child.relname AS partition_name
      FROM pg_inherits
          JOIN pg_class parent ON pg_inherits.inhparent = parent.oid
          JOIN pg_class child  ON pg_inherits.inhrelid  = child.oid
      WHERE parent.relname = 'ActivationEntry';
    `;


    let partitionData: any[] = [];
    let partitionCount = 0;

    try {
      partitionData = await prismaActivation.$queryRawUnsafe(
        `SELECT * FROM "${targetPartition}" ORDER BY "createdAt" DESC LIMIT 5000`
      );

      const countRes: any[] = await prismaActivation.$queryRawUnsafe(
        `SELECT count(*)::int as total FROM "${targetPartition}"`
      );
      partitionCount = countRes[0]?.total || 0;
    } catch (e) {
      console.warn(`Tabela ${targetPartition} jeszcze nie istnieje lub jest pusta.`);
    }

    const totalGlobalRecords = await prismaActivation.activationEntry.count();

    return NextResponse.json({
      status: "ok",
      activePartition: targetPartition,
      stats: {
        totalInThisPartition: partitionCount,
        totalInAllPartitions: totalGlobalRecords,
        loadedRows: partitionData.length
      },

      availablePartitions: partitionsList.map(p => p.partition_name),

      data: partitionData,
    });

  } catch (error: any) {
    console.error("DEBUG ROUTE ERROR:", error);
    return NextResponse.json({
      status: "error",
      message: error.message,
    }, { status: 500 });
  }
}