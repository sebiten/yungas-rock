export type TicketStatus = "hidden" | "soon" | "available" | "sold_out";
export type EventStatus = "draft" | "published" | "completed" | "cancelled";

export interface PublicEvent {
  id: string | null;
  slug: string;
  artistName: string;
  title: string;
  eyebrow: string;
  description: string;
  eventDate: string | null;
  doorsTime: string | null;
  venue: string | null;
  city: string;
  address: string | null;
  heroImageUrl: string;
  flyerImageUrl: string | null;
  ticketUrl: string | null;
  ticketPriceLabel: string | null;
  ticketStatus: TicketStatus;
  status: EventStatus;
  instagramCopy: string | null;
  whatsappTitle: string | null;
  whatsappDescription: string | null;
}

export interface PublicBand {
  id: string;
  name: string;
  city: string | null;
  bio: string | null;
  imageUrl: string | null;
  instagramUrl: string | null;
  musicUrl: string | null;
  role: "headliner" | "support";
  sortOrder: number;
}

export interface PublicSponsor {
  id: string;
  name: string;
  logoUrl: string;
  websiteUrl: string | null;
  format: "square" | "wide";
  sortOrder: number;
}

export interface LandingContent {
  event: PublicEvent;
  bands: PublicBand[];
  sponsors: PublicSponsor[];
  source: "demo" | "supabase";
}
