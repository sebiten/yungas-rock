import { createBandAction } from "@/app/admin/actions/content";
import { requireAdmin } from "@/lib/admin/auth";

export default async function BandsPage() {
  const { supabase } = await requireAdmin();
  const { data: bands } = await supabase!.from("bands").select("*").order("name");
  return (
    <>
      <header className="admin-page-header"><div><p>Line-up</p><h1>Bandas</h1></div></header>
      <section className="admin-split-layout">
        <form className="admin-quick-form" action={createBandAction}><h2>Nueva banda</h2><label>Nombre<input name="name" required /></label><label>Slug<input name="slug" placeholder="nombre-de-la-banda" /></label><label>Ciudad<input name="city" /></label><label>Biografía<textarea name="bio" rows={4} /></label><label>Instagram<input type="url" name="instagram_url" /></label><label>Música<input type="url" name="music_url" /></label><label>Imagen<input type="file" name="image" accept="image/jpeg,image/png,image/webp" /></label><button type="submit">Guardar banda</button></form>
        <div className="admin-card-list">{bands?.map((band) => <article key={band.id}><div><h3>{band.name}</h3><span>{band.city || "Sin ciudad"}</span></div><i>{band.is_active ? "Activa" : "Oculta"}</i></article>)}{!bands?.length && <p>No hay bandas cargadas.</p>}</div>
      </section>
    </>
  );
}
