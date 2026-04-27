import { NextRequest, NextResponse } from "next/server";
import { prismaActivation } from "@/lib/prisma-activation";
import { logApiError } from "@/lib/logger";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const search = req.nextUrl.searchParams.get("search") || "";
  const slug = req.nextUrl.searchParams.get("slug");
  const activatedOnly = req.nextUrl.searchParams.get("activatedOnly") === "true";

  try {
    const where: any = {};
    if (slug) where.slug = slug;
    if (activatedOnly) where.isActivated = true;

    if (search) {
      where.OR = [
        { id: { contains: search, mode: 'insensitive' } },
        { entryId: { contains: search, mode: 'insensitive' } },
        { qrCode: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { fullName: { contains: search, mode: 'insensitive' } },
        { actLastName: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Wykonujemy dwa zapytania równolegle dla wydajności
    const [data, totalCount, totalActivated] = await Promise.all([
      prismaActivation.activationEntry.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: 100
      }),
      // Liczba wszystkich rekordów (bez filtrów wyszukiwania, ewentualnie tylko po slug)
      prismaActivation.activationEntry.count({
        where: slug ? { slug } : {}
      }),
      // Liczba wszystkich aktywowanych (bez filtrów wyszukiwania)
      prismaActivation.activationEntry.count({
        where: slug ? { slug, isActivated: true } : { isActivated: true }
      })
    ]);

    // Zwracamy obiekt zamiast samej tablicy
    return NextResponse.json({
      registrations: data,
      stats: {
        total: totalCount,
        activated: totalActivated
      }
    });
  } catch (error: any) {
    await logApiError({
      endpoint: "/api/admin/entries",
      method: "GET_SEARCH",
      message: `Failed to fetch entries: ${error.message}`,
      payload: { search, slug, activatedOnly },
      status: 500
    });
    return NextResponse.json({ error: "Fetch error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  let bodyData = { id: "", slug: "", action: "" };

  try {
    const body = await req.json();
    bodyData = body;
    const { id, slug, action } = body;

    if (action === "RESET_ACTIVATION") {
      await prismaActivation.activationEntry.update({
        where: { id_slug: { id, slug } },
        data: {
          isActivated: false,
          activatedAt: null,
          actFirstName: null,
          actLastName: null,
          actEmail: null,
        }
      });
      return NextResponse.json({ message: "Activation reset successfully" });
    }

    if (action === "DELETE_ALL") {
      await prismaActivation.activationEntry.delete({
        where: { id_slug: { id, slug } }
      });
      return NextResponse.json({ message: "Entry deleted successfully" });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    await logApiError({
      endpoint: "/api/admin/entries",
      method: "PATCH_ACTION",
      message: `Entry action failed (${bodyData.action}): ${error.message}`,
      payload: { ...bodyData, userId: session?.user?.id },
      status: 500
    });
    return NextResponse.json({ error: "Action execution error" }, { status: 500 });
  }
}