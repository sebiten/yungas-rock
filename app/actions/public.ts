"use server";

import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export interface BandApplicationInput {
  bandName: string;
  city: string;
  instagram: string;
  musicLink: string;
  eventId?: string | null;
}

export async function submitBandApplication(input: BandApplicationInput) {
  const bandName = input.bandName.trim();
  const city = input.city.trim();
  const instagram = input.instagram.trim();
  const musicLink = input.musicLink.trim();

  if (!bandName || !city || !instagram || !musicLink) {
    return { success: false, message: "Completá todos los campos." };
  }

  try {
    new URL(musicLink);
  } catch {
    return { success: false, message: "Ingresá un enlace de música válido." };
  }

  if (!isSupabaseConfigured()) {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return { success: true, message: "Postulación simulada en modo demo." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("band_applications").insert({
    band_name: bandName.slice(0, 120),
    city: city.slice(0, 120),
    instagram: instagram.slice(0, 180),
    music_link: musicLink.slice(0, 500),
    event_id: input.eventId || null,
  });

  if (error) return { success: false, message: "No pudimos guardar la postulación. Intentá nuevamente." };
  return { success: true, message: "Postulación recibida." };
}
