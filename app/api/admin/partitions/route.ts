import { NextResponse } from "next/server";
import { prismaActivation } from "@/lib/prisma-activation";
import { logApiError } from "@/lib/logger";

export async function GET() {
  try {
    const partitions: any[] = await prismaActivation.$queryRawUnsafe(`
      SELECT
        c.relname as name
      FROM pg_inherits
      JOIN pg_class c ON pg_inherits.inhrelid = c.oid
      JOIN pg_class p ON pg_inherits.inhparent = p.oid
      WHERE p.relname = 'ActivationEntry'
    `);

    const result = [];

    for (const p of partitions) {
      try {
        const slug = p.name.replace("ActivationEntry_", "");

        // Querying specific partition counts
        const count: any = await prismaActivation.$queryRawUnsafe(`
          SELECT count(*) FROM "${p.name}"
        `);

        const yearMatch = slug.match(/(20[0-9]{2})$/);

        result.push({
          slug,
          table: p.name,
          year: yearMatch ? yearMatch[1] : "unknown",
          count: Number(count[0].count)
        });
      } catch (partitionErr: any) {
        await logApiError({
          endpoint: "/api/admin/partitions",
          method: "RAW_QUERY_PARTITION",
          message: `Failed to count partition ${p.name}: ${partitionErr.message}`,
          status: 500
        });
        // Continue to next partition even if one fails
      }
    }

    return NextResponse.json(result);
  } catch (error: any) {
    await logApiError({
      endpoint: "/api/admin/partitions",
      method: "GET_CATALOG",
      message: `Failed to fetch PG partitions: ${error.message}`,
      status: 500
    });

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}