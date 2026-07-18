import Link from "next/link";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export default function AdminSetupPage() {
  const configured = isSupabaseConfigured();
  return (
    <main className="admin-auth-page">
      <section className="admin-auth-card admin-setup-card">
        <p>Configuración</p>
        <h1>{configured ? "Falta crear el administrador" : "Conectá Supabase"}</h1>
        <span>
          {configured
            ? "Creá un usuario en Supabase Auth y agregá su UUID a public.admin_users."
            : "Agregá las variables de Supabase en Vercel y ejecutá la migración incluida en el proyecto."}
        </span>
        <pre>{configured
          ? "insert into public.admin_users (user_id, display_name)\nvalues ('UUID_DEL_USUARIO', 'Producción');"
          : "NEXT_PUBLIC_SUPABASE_URL=...\nNEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=..."}</pre>
        <Link href={configured ? "/admin/login" : "/"}>{configured ? "Ir al ingreso" : "Volver al sitio"}</Link>
      </section>
    </main>
  );
}
