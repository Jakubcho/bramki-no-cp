import { prismaCore } from "@/lib/prisma-core";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function logAction({
  action,
  entity,
  entityId,
  meta,
  session,
}: {
  action: string;
  entity: string;
  entityId?: string;
  meta?: any;
  session?: any;
}) {
  const s = session ?? (await getServerSession(authOptions));

  await prismaCore.auditLog.create({
    data: {
      action,
      entity,
      entityId,
      meta,
      userId: s?.user?.id,
      userEmail: s?.user?.email,
      userRole: s?.user?.role,
    },
  });
}