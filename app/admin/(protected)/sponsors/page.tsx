import Image from "next/image";
import { createSponsorAction } from "@/app/admin/actions/content";
import { requireAdmin } from "@/lib/admin/auth";

export default async function SponsorsPage() {
  const { supabase } = await requireAdmin();
  const { data: sponsors } = await supabase!.from("sponsors").select("*").order("name");
  return (
    <>
      <header className="admin-page-header"><div><p>Alianzas</p><h1>Sponsors</h1></div></header>
      <section className="admin-split-layout">
        <form className="admin-quick-form" action={createSponsorAction}><h2>Nuevo sponsor</h2><label>Nombre<input name="name" required /></label><label>Sitio web<input type="url" name="website_url" /></label><label>Logo<input type="file" name="logo" accept="image/jpeg,image/png,image/webp" required /></label><button type="submit">Guardar sponsor</button></form>
        <div className="admin-sponsor-grid">{sponsors?.map((sponsor) => <article key={sponsor.id}><div><Image src={sponsor.logo_url} alt={sponsor.name} fill sizes="180px" /></div><span>{sponsor.name}</span></article>)}{!sponsors?.length && <p>No hay sponsors cargados.</p>}</div>
      </section>
    </>
  );
}
