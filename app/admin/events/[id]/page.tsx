import EventEditorClient from "./EventEditorClient";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {

  const { id } = await params;

  return <EventEditorClient id={id} />;
}
