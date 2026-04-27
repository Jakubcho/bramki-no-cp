import { prismaCore } from "@/lib/prisma-core";
import { redirect, notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ shortcode: string }>;
}

export default async function ShortLinkRedirect({ params }: PageProps) {
  const resolvedParams = await params;
  const shortcode = resolvedParams.shortcode;

  if (!shortcode || shortcode.includes('.') || shortcode === "admin") {
    return notFound();
  }

  const link = await prismaCore.shortLink.findUnique({
    where: {
      code: shortcode.toLowerCase().trim()
    }
  });

  if (link) {
    console.log("Znaleziono w bazie! Cel:", link.destination);
    return redirect(link.destination);
  }

  return notFound();
}