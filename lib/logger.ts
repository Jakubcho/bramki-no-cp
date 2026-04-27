import { prismaActivation } from "@/lib/prisma-activation";

export async function logApiError({
  endpoint,
  method,
  message,
  payload,
  status,
  response,
  stack
}: {
  endpoint: string;
  method: string;
  message: string;
  payload?: any;
  status?: number;
  response?: any;
  stack?: string;
}) {
  try {
    console.log(`[LOGGER] Zapisywanie błędu dla: ${endpoint}`);

    const errorLog = await prismaActivation.apiError.create({
      data: {
        endpoint,
        method,
        message,
        payload: payload ?? undefined,
        response: response ?? undefined,
        status: status ?? 500, // Domyślnie 500, jeśli nie podano
        stack: stack ?? null,
      },
    });

    console.log(`[LOGGER] Sukces! ID: ${errorLog.id}`);
    return errorLog;
  } catch (dbError: any) {
    // Logujemy błąd samego loggera w konsoli, żeby nie "wywalił" całej aplikacji
    console.error("[LOGGER FATAL ERROR]:", dbError.message);
  }
}