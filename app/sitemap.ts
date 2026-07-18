import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const routes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];

  if (!isSupabaseConfigured()) return routes;
  const supabase = await createClient();
  const { data: events } = await supabase.from("events").select("slug, updated_at").in("status", ["published", "completed"]);
  return [
    ...routes,
    ...(events || []).map((event) => ({
      url: `${siteUrl}/eventos/${event.slug}`,
      lastModified: new Date(event.updated_at),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
