import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { demoContent, preparationEvent } from "./demo";
import type { LandingContent, PublicBand, PublicEvent, PublicSponsor } from "./types";

async function getGlobalSponsors(supabase: Awaited<ReturnType<typeof createClient>>): Promise<PublicSponsor[]> {
  const { data, error } = await supabase
    .from("sponsors")
    .select("*")
    .eq("is_active", true)
    .order("name");

  if (error) throw error;
  if (!data.length) return demoContent.sponsors;

  return data.map((sponsor, sortOrder) => ({
    id: sponsor.id,
    name: sponsor.name,
    logoUrl: sponsor.logo_url,
    websiteUrl: sponsor.website_url,
    format: "wide" as const,
    sortOrder,
  }));
}

function mapEvent(event: Awaited<ReturnType<typeof getPublishedEventRow>>): PublicEvent {
  if (!event) return preparationEvent;
  return {
    id: event.id,
    slug: event.slug,
    artistName: event.artist_name,
    title: event.title,
    eyebrow: event.eyebrow,
    description: event.description,
    eventDate: event.event_date,
    doorsTime: event.doors_time,
    venue: event.venue,
    city: event.city,
    address: event.address,
    heroImageUrl: event.hero_image_url || "/hero-concert.png",
    flyerImageUrl: event.flyer_image_url,
    ticketUrl: event.ticket_url,
    ticketPriceLabel: event.ticket_price_label,
    ticketStatus: event.ticket_status,
    status: event.status,
    instagramCopy: event.instagram_copy,
    whatsappTitle: event.whatsapp_title,
    whatsappDescription: event.whatsapp_description,
  };
}

async function getPublishedEventRow() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("status", "published")
    .order("is_featured", { ascending: false })
    .order("event_date", { ascending: true, nullsFirst: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export const getLandingContent = cache(async (): Promise<LandingContent> => {
  if (!isSupabaseConfigured()) return demoContent;

  try {
    const supabase = await createClient();
    const eventRow = await getPublishedEventRow();
    const sponsors = await getGlobalSponsors(supabase);
    if (!eventRow) return { event: preparationEvent, bands: [], sponsors, source: "supabase" };

    const { data: eventBands, error: bandsRelationError } = await supabase
      .from("event_bands")
      .select("band_id, role, sort_order")
      .eq("event_id", eventRow.id)
      .order("sort_order");

    if (bandsRelationError) throw bandsRelationError;

    const bandIds = eventBands.map((item) => item.band_id);
    const { data: bandRows, error: bandsError } = bandIds.length
      ? await supabase.from("bands").select("*").in("id", bandIds)
      : { data: [], error: null };

    if (bandsError) throw bandsError;

    const bands: PublicBand[] = eventBands.flatMap((relation) => {
      const band = bandRows?.find((item) => item.id === relation.band_id);
      return band
        ? [{
            id: band.id,
            name: band.name,
            city: band.city,
            bio: band.bio,
            imageUrl: band.image_url,
            instagramUrl: band.instagram_url,
            musicUrl: band.music_url,
            role: relation.role,
            sortOrder: relation.sort_order,
          }]
        : [];
    });

    return { event: mapEvent(eventRow), bands, sponsors, source: "supabase" };
  } catch {
    return demoContent;
  }
});

export const getPublicEventBySlug = cache(async (slug: string): Promise<LandingContent | null> => {
  if (!isSupabaseConfigured()) return slug === demoContent.event.slug ? demoContent : null;

  try {
    const supabase = await createClient();
    const { data: eventRow, error } = await supabase
      .from("events")
      .select("*")
      .eq("slug", slug)
      .in("status", ["published", "completed"])
      .maybeSingle();
    if (error || !eventRow) return null;

    const [{ data: eventBands }, sponsors] = await Promise.all([
      supabase.from("event_bands").select("band_id, role, sort_order").eq("event_id", eventRow.id).order("sort_order"),
      getGlobalSponsors(supabase),
    ]);
    const bandIds = eventBands?.map((item) => item.band_id) || [];
    const { data: bandRows } = bandIds.length
      ? await supabase.from("bands").select("*").in("id", bandIds)
      : { data: [] };
    const bands: PublicBand[] = (eventBands || []).flatMap((relation) => {
      const band = bandRows?.find((item) => item.id === relation.band_id);
      return band ? [{ id: band.id, name: band.name, city: band.city, bio: band.bio, imageUrl: band.image_url, instagramUrl: band.instagram_url, musicUrl: band.music_url, role: relation.role, sortOrder: relation.sort_order }] : [];
    });
    return { event: mapEvent(eventRow), bands, sponsors, source: "supabase" };
  } catch {
    return null;
  }
});
