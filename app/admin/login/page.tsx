import Image from "next/image";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/login-form";
import { getAdminSession } from "@/lib/admin/auth";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  const session = await getAdminSession();
  if (!session.configured) redirect("/admin/setup");
  if (session.user && session.isAdmin) redirect("/admin");

  return (
    <main className="admin-auth-page">
      <section className="admin-auth-card">
        <Image src="/yungas-rock-logo.jpg" alt="Yungas Rock" width={84} height={84} />
        <p>Acceso privado</p>
        <h1>Panel de producción</h1>
        <span>Eventos, bandas, sponsors y postulaciones en un solo lugar.</span>
        <LoginForm />
      </section>
    </main>
  );
}
