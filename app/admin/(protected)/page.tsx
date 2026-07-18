import Link from "next/link";
import { requireAdmin } from "@/lib/admin/auth";

export default async function AdminDashboardPage() {
  const { supabase } = await requireAdmin();
  const [events, bands, sponsors, applications, featured] = await Promise.all([
    supabase!.from("events").select("id", { count: "exact", head: true }),
    supabase!.from("bands").select("id", { count: "exact", head: true }),
    supabase!.from("sponsors").select("id", { count: "exact", head: true }),
    supabase!.from("band_applications").select("id", { count: "exact", head: true }).eq("status", "pending"),
    supabase!.from("events").select("id, artist_name, event_date, status").eq("is_featured", true).maybeSingle(),
  ]);

  const stats = [
    ["Eventos", events.count || 0, "/admin/eventos"],
    ["Bandas", bands.count || 0, "/admin/bandas"],
    ["Sponsors", sponsors.count || 0, "/admin/sponsors"],
    ["Postulaciones pendientes", applications.count || 0, "/admin/postulaciones"],
  ] as const;

  return (
    <>
      <header className="admin-page-header"><div><p>Centro de control</p><h1>Resumen</h1></div><Link className="admin-primary-link" href="/admin/eventos/nuevo">Nuevo evento</Link></header>
      <section className="admin-stat-grid">
        {stats.map(([label, count, href]) => <Link href={href} key={label}><span>{label}</span><strong>{count}</strong><i>Ver sección ↗</i></Link>)}
      </section>
      <section className="admin-featured-card">
        <p>Evento en portada</p>
        {featured.data ? <><h2>{featured.data.artist_name}</h2><span>{featured.data.status} · {featured.data.event_date ? new Date(featured.data.event_date).toLocaleDateString("es-AR") : "Sin fecha"}</span><Link href={`/admin/eventos/${featured.data.id}`}>Editar evento ↗</Link></> : <><h2>Sin evento destacado</h2><span>La web mostrará “Próxima fecha en preparación”.</span></>}
      </section>
    </>
  );
}
