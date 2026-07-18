export const siteConfig = {
  name: "Yungas Rock",
  title: "Yungas Rock | Rock en vivo en Jujuy",
  description:
    "Eventos, bandas, entradas, horarios, sponsors y convocatorias de Yungas Rock. La escena del norte suena fuerte.",
  shortDescription: "La selva también hace ruido.",
  locale: "es_AR",
  instagram: "https://www.instagram.com/yungas.rock/",
  keywords: [
    "Yungas Rock",
    "rock en Jujuy",
    "recitales en Jujuy",
    "bandas de Jujuy",
    "eventos de rock",
    "bandas del norte",
    "convocatoria de bandas",
  ],
} as const;

export function getSiteUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
  const rawUrl = configuredUrl ?? (vercelUrl ? `https://${vercelUrl}` : "http://localhost:3000");
  const normalizedUrl = rawUrl.startsWith("http") ? rawUrl : `https://${rawUrl}`;

  return normalizedUrl.replace(/\/$/, "");
}
