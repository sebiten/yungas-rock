import type { Metadata } from "next";
import { HomeExperience } from "@/components/home-experience";
import { getLandingContent } from "@/lib/content/queries";
import { getSiteUrl, siteConfig } from "@/lib/site";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { event } = await getLandingContent();
  const title = event.id ? `${event.artistName} | Yungas Rock` : siteConfig.title;
  const description = event.whatsappDescription || event.description || siteConfig.description;
  return {
    title,
    description,
    openGraph: { title, description, url: "/", type: "website" },
    twitter: { title, description, card: "summary_large_image" },
  };
}

export default async function Home() {
  const content = await getLandingContent();
  const siteUrl = getSiteUrl();
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: siteConfig.name,
        description: siteConfig.description,
        inLanguage: "es-AR",
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: siteConfig.name,
        url: siteUrl,
        logo: `${siteUrl}/yungas-rock-logo.jpg`,
        image: `${siteUrl}/opengraph-image`,
        sameAs: [siteConfig.instagram],
        areaServed: { "@type": "AdministrativeArea", name: "Jujuy, Argentina" },
      },
    ],
  };

  return (
    <>
      <script
        id="yungas-rock-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />
      <HomeExperience content={content} />
    </>
  );
}
