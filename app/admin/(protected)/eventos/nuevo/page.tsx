import { EventForm } from "@/components/admin/event-form";
import { requireAdmin } from "@/lib/admin/auth";

export default async function NewEventPage() {
  const { supabase } = await requireAdmin();
  const { data: bands } = await supabase!.from("bands").select("*").order("name");
  return <><header className="admin-page-header"><div><p>Programación</p><h1>Nuevo evento</h1></div></header><EventForm bands={bands || []} /></>;
}
