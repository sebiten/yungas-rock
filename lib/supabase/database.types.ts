export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

type EventStatus = "draft" | "published" | "completed" | "cancelled";
type TicketStatus = "hidden" | "soon" | "available" | "sold_out";
type EventBandRole = "headliner" | "support";
type ApplicationStatus = "pending" | "reviewing" | "selected" | "rejected";

export interface Database {
  public: {
    Tables: {
      admin_users: {
        Row: { user_id: string; display_name: string | null; created_at: string };
        Insert: { user_id: string; display_name?: string | null; created_at?: string };
        Update: { display_name?: string | null };
        Relationships: [];
      };
      events: {
        Row: {
          id: string;
          slug: string;
          artist_name: string;
          title: string;
          eyebrow: string;
          description: string;
          event_date: string | null;
          doors_time: string | null;
          venue: string | null;
          city: string;
          address: string | null;
          hero_image_url: string | null;
          flyer_image_url: string | null;
          ticket_url: string | null;
          ticket_price_label: string | null;
          ticket_status: TicketStatus;
          status: EventStatus;
          instagram_copy: string | null;
          whatsapp_title: string | null;
          whatsapp_description: string | null;
          is_featured: boolean;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          artist_name: string;
          title: string;
          eyebrow?: string;
          description: string;
          event_date?: string | null;
          doors_time?: string | null;
          venue?: string | null;
          city?: string;
          address?: string | null;
          hero_image_url?: string | null;
          flyer_image_url?: string | null;
          ticket_url?: string | null;
          ticket_price_label?: string | null;
          ticket_status?: TicketStatus;
          status?: EventStatus;
          instagram_copy?: string | null;
          whatsapp_title?: string | null;
          whatsapp_description?: string | null;
          is_featured?: boolean;
          created_by?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["events"]["Insert"]>;
        Relationships: [];
      };
      bands: {
        Row: {
          id: string;
          slug: string;
          name: string;
          city: string | null;
          bio: string | null;
          image_url: string | null;
          instagram_url: string | null;
          music_url: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          city?: string | null;
          bio?: string | null;
          image_url?: string | null;
          instagram_url?: string | null;
          music_url?: string | null;
          is_active?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["bands"]["Insert"]>;
        Relationships: [];
      };
      event_bands: {
        Row: { event_id: string; band_id: string; role: EventBandRole; sort_order: number };
        Insert: { event_id: string; band_id: string; role?: EventBandRole; sort_order?: number };
        Update: { role?: EventBandRole; sort_order?: number };
        Relationships: [];
      };
      sponsors: {
        Row: {
          id: string;
          name: string;
          logo_url: string;
          website_url: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: { id?: string; name: string; logo_url: string; website_url?: string | null; is_active?: boolean };
        Update: Partial<Database["public"]["Tables"]["sponsors"]["Insert"]>;
        Relationships: [];
      };
      event_sponsors: {
        Row: { event_id: string; sponsor_id: string; sort_order: number };
        Insert: { event_id: string; sponsor_id: string; sort_order?: number };
        Update: { sort_order?: number };
        Relationships: [];
      };
      band_applications: {
        Row: {
          id: string;
          event_id: string | null;
          band_name: string;
          city: string;
          instagram: string;
          music_link: string;
          status: ApplicationStatus;
          internal_notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          event_id?: string | null;
          band_name: string;
          city: string;
          instagram: string;
          music_link: string;
          status?: ApplicationStatus;
          internal_notes?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["band_applications"]["Insert"]>;
        Relationships: [];
      };
      site_settings: {
        Row: { key: string; value: Json; is_public: boolean; updated_at: string };
        Insert: { key: string; value?: Json; is_public?: boolean };
        Update: { value?: Json; is_public?: boolean };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      event_status: EventStatus;
      ticket_status: TicketStatus;
      event_band_role: EventBandRole;
      application_status: ApplicationStatus;
    };
    CompositeTypes: Record<string, never>;
  };
}
