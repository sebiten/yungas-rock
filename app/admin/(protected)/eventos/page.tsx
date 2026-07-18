import Link from "next/link";
import { requireAdmin } from "@/lib/admin/auth";

export default async function EventsPage() {
  const { supabase } = await requireAdmin();
  const { data: events } = await supabase!.from("events").select("*").order("created_at", { ascending: false });

  return (
    <>
      <header className="admin-page-header"><div><p>Programación</p><h1>Eventos</h1></div><Link className="admin-primary-link" href="/admin/eventos/nuevo">Nuevo evento</Link></header>
      <div className="admin-table-wrap"><table><thead><tr><th>Evento</th><th>Fecha</th><th>Estado</th><th>Portada</th><th /></tr></thead><tbody>
        {events?.map((event) => <tr key={event.id}><td><strong>{event.artist_name}</strong><span>{event.title}</span></td><td>{event.event_date ? new Date(event.event_date).toLocaleDateString("es-AR") : "Por confirmar"}</td><td><span className={`admin-status admin-status-${event.status}`}>{event.status}</span></td><td>{event.is_featured ? "Sí" : "No"}</td><td><Link href={`/admin/eventos/${event.id}`}>Editar ↗</Link></td></tr>)}
        {!events?.length && <tr><td colSpan={5}>Todavía no hay eventos cargados.</td></tr>}
      </tbody></table></div>
    </>
  );
}
