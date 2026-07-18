import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { logoutAction } from "@/app/admin/actions/auth";

const navigation = [
  ["Resumen", "/admin"],
  ["Eventos", "/admin/eventos"],
  ["Bandas", "/admin/bandas"],
  ["Sponsors", "/admin/sponsors"],
  ["Postulaciones", "/admin/postulaciones"],
] as const;

export function AdminShell({ children, email }: { children: ReactNode; email: string }) {
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link className="admin-brand" href="/admin">
          <Image src="/yungas-rock-logo.jpg" alt="Yungas Rock" width={52} height={52} />
          <span>YUNGAS<br />CONTROL</span>
        </Link>
        <nav aria-label="Panel administrativo">
          {navigation.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}
        </nav>
        <div className="admin-account">
          <span>{email}</span>
          <form action={logoutAction}><button type="submit">Cerrar sesión</button></form>
        </div>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}
