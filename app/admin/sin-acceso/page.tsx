import Link from "next/link";

export default function NoAdminAccessPage() {
  return (
    <main className="admin-auth-page">
      <section className="admin-auth-card">
        <p>Acceso restringido</p>
        <h1>Tu usuario no es administrador.</h1>
        <span>La cuenta existe, pero todavía no fue agregada a la lista de producción.</span>
        <Link href="/">Volver al sitio</Link>
      </section>
    </main>
  );
}
