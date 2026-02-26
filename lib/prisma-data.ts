import { PrismaClient } from "@/generated/data";

const globalForPrisma = globalThis as unknown as {
  prismaData: PrismaClient | undefined;
};

export const prismaData =
  globalForPrisma.prismaData ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prismaData = prismaData;
}