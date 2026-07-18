"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";
import type { Database } from "@/lib/supabase/database.types";

export interface AdminActionState {
  error: string;
}

function value(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

function optionalValue(formData: FormData, key: string) {
  return value(formData, key) || null;
}

function slugify(input: string) {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function uploadImage(file: FormDataEntryValue | null, folder: string) {
  if (!(file instanceof File) || file.size === 0) return null;
  if (file.size > 10 * 1024 * 1024) throw new Error("La imagen supera el límite de 10 MB.");
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
    throw new Error("Usá una imagen JPG, PNG o WebP.");
  }

  const { supabase } = await requireAdmin();
  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${folder}/${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase!.storage.from("event-media").upload(path, file, {
    contentType: file.type,
    upsert: false,
  });
  if (error) throw new Error("No se pudo subir la imagen.");

  return supabase!.storage.from("event-media").getPublicUrl(path).data.publicUrl;
}

export async function saveEventAction(_: AdminActionState, formData: FormData): Promise<AdminActionState> {
  const { supabase } = await requireAdmin();
  const id = optionalValue(formData, "id");
  const artistName = value(formData, "artist_name");
  const title = value(formData, "title");
  const description = value(formData, "description");
  const slug = slugify(value(formData, "slug") || artistName);

  if (!artistName || !title || !description || !slug) {
    return { error: "Artista, título, descripción y slug son obligatorios." };
  }

  let heroImageUrl = optionalValue(formData, "current_hero_image_url");
  let flyerImageUrl = optionalValue(formData, "current_flyer_image_url");
  try {
    heroImageUrl = (await uploadImage(formData.get("hero_image"), "events/heroes")) || heroImageUrl;
    flyerImageUrl = (await uploadImage(formData.get("flyer_image"), "events/flyers")) || flyerImageUrl;
  } catch (error) {
    return { error: error instanceof Error ? error.message : "No se pudieron subir las imágenes." };
  }

  const rawDate = optionalValue(formData, "event_date");
  const payload: Database["public"]["Tables"]["events"]["Insert"] = {
    slug,
    artist_name: artistName,
    title,
    eyebrow: value(formData, "eyebrow") || "Próxima fecha",
    description,
    event_date: rawDate ? new Date(rawDate).toISOString() : null,
    doors_time: optionalValue(formData, "doors_time"),
    venue: optionalValue(formData, "venue"),
    city: value(formData, "city") || "Jujuy, Argentina",
    address: optionalValue(formData, "address"),
    hero_image_url: heroImageUrl,
    flyer_image_url: flyerImageUrl,
    ticket_url: optionalValue(formData, "ticket_url"),
    ticket_price_label: optionalValue(formData, "ticket_price_label"),
    ticket_status: value(formData, "ticket_status") as Database["public"]["Enums"]["ticket_status"],
    status: value(formData, "status") as Database["public"]["Enums"]["event_status"],
    instagram_copy: optionalValue(formData, "instagram_copy"),
    whatsapp_title: optionalValue(formData, "whatsapp_title"),
    whatsapp_description: optionalValue(formData, "whatsapp_description"),
    is_featured: formData.get("is_featured") === "on",
  };

  if (payload.is_featured) {
    const { error } = await supabase!.from("events").update({ is_featured: false }).neq("id", id || "00000000-0000-0000-0000-000000000000");
    if (error) return { error: "No se pudo actualizar el evento destacado." };
  }

  const result = id
    ? await supabase!.from("events").update(payload).eq("id", id).select("id").single()
    : await supabase!.from("events").insert(payload).select("id").single();
  if (result.error || !result.data) return { error: result.error?.message || "No se pudo guardar el evento." };

  const eventId = result.data.id;
  const headlinerBandId = optionalValue(formData, "headliner_band_id");
  const supportBandIds = formData.getAll("support_band_ids").map(String).filter(Boolean);

  const { error: lineupDeleteError } = await supabase!.from("event_bands").delete().eq("event_id", eventId);
  if (lineupDeleteError) return { error: "El evento se guardó, pero no se pudo actualizar el line-up." };

  const lineupRows: Database["public"]["Tables"]["event_bands"]["Insert"][] = [
    ...(headlinerBandId ? [{ event_id: eventId, band_id: headlinerBandId, role: "headliner" as const, sort_order: 0 }] : []),
    ...supportBandIds.map((bandId, index) => ({ event_id: eventId, band_id: bandId, role: "support" as const, sort_order: index + 1 })),
  ];
  const lineupResult = lineupRows.length
    ? await supabase!.from("event_bands").insert(lineupRows)
    : { error: null };
  if (lineupResult.error) return { error: "El evento se guardó, pero faltaron bandas en el line-up." };

  revalidatePath("/");
  revalidatePath("/opengraph-image");
  revalidatePath("/sitemap.xml");
  revalidatePath("/admin");
  revalidatePath("/admin/eventos");
  redirect(`/admin/eventos/${eventId}?guardado=1`);
}

export async function deleteEventAction(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = value(formData, "id");
  if (id) await supabase!.from("events").delete().eq("id", id);
  revalidatePath("/");
  revalidatePath("/opengraph-image");
  revalidatePath("/sitemap.xml");
  revalidatePath("/admin/eventos");
  redirect("/admin/eventos");
}

export async function createBandAction(formData: FormData) {
  const { supabase } = await requireAdmin();
  const name = value(formData, "name");
  if (!name) redirect("/admin/bandas?error=nombre");
  const imageUrl = await uploadImage(formData.get("image"), "bands");
  await supabase!.from("bands").insert({
    name,
    slug: slugify(value(formData, "slug") || name),
    city: optionalValue(formData, "city"),
    bio: optionalValue(formData, "bio"),
    image_url: imageUrl,
    instagram_url: optionalValue(formData, "instagram_url"),
    music_url: optionalValue(formData, "music_url"),
  });
  revalidatePath("/admin/bandas");
  redirect("/admin/bandas?creada=1");
}

export async function createSponsorAction(formData: FormData) {
  const { supabase } = await requireAdmin();
  const name = value(formData, "name");
  if (!name) redirect("/admin/sponsors?error=nombre");
  const logoUrl = await uploadImage(formData.get("logo"), "sponsors");
  if (!logoUrl) redirect("/admin/sponsors?error=logo");
  await supabase!.from("sponsors").insert({
    name,
    logo_url: logoUrl,
    website_url: optionalValue(formData, "website_url"),
  });
  revalidatePath("/admin/sponsors");
  redirect("/admin/sponsors?creado=1");
}

export async function updateApplicationAction(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = value(formData, "id");
  await supabase!.from("band_applications").update({
    status: value(formData, "status") as Database["public"]["Enums"]["application_status"],
    internal_notes: optionalValue(formData, "internal_notes"),
  }).eq("id", id);
  revalidatePath("/admin/postulaciones");
}
