import { getSiteUrl, siteConfig } from "@/lib/site";

export function GET() {
  const content = `# ${siteConfig.name}

> ${siteConfig.description}

## Sitio oficial

- [Inicio](${getSiteUrl()}): eventos, bandas, entradas, sponsors y convocatorias.
- [Instagram](${siteConfig.instagram}): novedades y anuncios oficiales.

## Ubicación

Jujuy, Argentina.
`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
