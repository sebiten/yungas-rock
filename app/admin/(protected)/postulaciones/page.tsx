import { updateApplicationAction } from "@/app/admin/actions/content";
import { requireAdmin } from "@/lib/admin/auth";

export default async function ApplicationsPage() {
  const { supabase } = await requireAdmin();
  const { data: applications } = await supabase!.from("band_applications").select("*").order("created_at", { ascending: false });
  return (
    <>
      <header className="admin-page-header"><div><p>Convocatoria</p><h1>Postulaciones</h1></div></header>
      <div className="admin-application-list">{applications?.map((application) => <article key={application.id}><header><div><h2>{application.band_name}</h2><span>{application.city} · {new Date(application.created_at).toLocaleDateString("es-AR")}</span></div><a href={application.music_link} target="_blank" rel="noreferrer">Escuchar ↗</a></header><p>{application.instagram}</p><form action={updateApplicationAction}><input type="hidden" name="id" value={application.id} /><label>Estado<select name="status" defaultValue={application.status}><option value="pending">Pendiente</option><option value="reviewing">En revisión</option><option value="selected">Seleccionada</option><option value="rejected">Descartada</option></select></label><label>Notas<textarea name="internal_notes" rows={2} defaultValue={application.internal_notes || ""} /></label><button type="submit">Guardar revisión</button></form></article>)}{!applications?.length && <p>No hay postulaciones todavía.</p>}</div>
    </>
  );
}
