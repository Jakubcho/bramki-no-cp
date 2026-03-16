import { PrismaClient } from "@/generated/activation";

const globalForPrisma = globalThis as unknown as {
  prismaActivation: PrismaClient | undefined;
};

export const prismaActivation =
  globalForPrisma.prismaActivation ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prismaActivation = prismaActivation;
}