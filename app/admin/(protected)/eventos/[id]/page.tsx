import Link from "next/link";
import { notFound } from "next/navigation";
import { DeleteEventButton } from "@/components/admin/delete-event-button";
import { EventForm } from "@/components/admin/event-form";
import { requireAdmin } from "@/lib/admin/auth";

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase } = await requireAdmin();
  const [eventResult, bandsResult, lineupResult] = await Promise.all([
    supabase!.from("events").select("*").eq("id", id).maybeSingle(),
    supabase!.from("bands").select("*").order("name"),
    supabase!.from("event_bands").select("band_id, role").eq("event_id", id),
  ]);
  if (!eventResult.data) notFound();
  const headliner = lineupResult.data?.find((item) => item.role === "headliner")?.band_id;
  const supports = lineupResult.data?.filter((item) => item.role === "support").map((item) => item.band_id) || [];

  return (
    <>
      <header className="admin-page-header"><div><p>Editar evento</p><h1>{eventResult.data.artist_name}</h1></div><Link className="admin-secondary-link" href={`/eventos/${eventResult.data.slug}`} target="_blank">Ver página ↗</Link></header>
      <EventForm event={eventResult.data} bands={bandsResult.data || []} selectedHeadlinerId={headliner} selectedSupportIds={supports} />
      <section className="admin-danger-zone"><div><h2>Eliminar evento</h2><p>Esta acción también elimina sus relaciones con bandas y sponsors.</p></div><DeleteEventButton eventId={id} /></section>
    </>
  );
}
