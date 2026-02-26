import { notFound } from "next/navigation";
import ActivationClient from "./ActivationClient";

export default async function ActivationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/events/by-slug/${slug}`,
    { cache: "no-store" }
  );

  if (!res.ok) notFound();

  const event = await res.json();

  return <ActivationClient event={event} />;
}
