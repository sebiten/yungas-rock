import type { ReactNode } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdmin } from "@/lib/admin/auth";

export const dynamic = "force-dynamic";

export default async function ProtectedAdminLayout({ children }: { children: ReactNode }) {
  const { user } = await requireAdmin();
  return <AdminShell email={user!.email || "Producción"}>{children}</AdminShell>;
}
