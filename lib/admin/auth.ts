import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export async function getAdminSession() {
  if (!isSupabaseConfigured()) {
    return { configured: false as const, user: null, isAdmin: false, supabase: null };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { configured: true as const, user: null, isAdmin: false, supabase };

  const { data: admin } = await supabase
    .from("admin_users")
    .select("user_id, display_name")
    .eq("user_id", user.id)
    .maybeSingle();

  return { configured: true as const, user, isAdmin: Boolean(admin), admin, supabase };
}

export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session.configured) redirect("/admin/setup");
  if (!session.user) redirect("/admin/login");
  if (!session.isAdmin) redirect("/admin/sin-acceso");
  return session;
}
