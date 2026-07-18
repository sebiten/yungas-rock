import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublicEventBySlug } from "@/lib/content/queries";

interface EventPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
  const { slug } = await params;
  const content = await getPublicEventBySlug(slug);
  if (!content) return {};
  return {
    title: content.event.whatsappTitle || content.event.artistName,
    description: content.event.whatsappDescription || content.event.description,
    alternates: { canonical: `/eventos/${slug}` },
  };
}

export default async function EventPage({ params }: EventPageProps) {
  const { slug } = await params;
  const content = await getPublicEventBySlug(slug);
  if (!content) notFound();
  const { event, bands, sponsors } = content;
  const date = event.eventDate
    ? new Intl.DateTimeFormat("es-AR", { dateStyle: "long", timeStyle: "short", timeZone: "America/Argentina/Buenos_Aires" }).format(new Date(event.eventDate))
    : "Fecha por confirmar";

  return (
    <main className="event-detail-page">
      <header className="event-detail-nav"><Link href="/">← Yungas Rock</Link><span>{event.status === "completed" ? "Evento finalizado" : event.eyebrow}</span></header>
      <section className="event-detail-hero">
        <Image src={event.heroImageUrl} alt={event.artistName} fill priority sizes="100vw" />
        <div className="event-detail-scrim" />
        <div><p>{event.eyebrow} · {event.city}</p><h1>{event.artistName}</h1><span>{event.title}</span></div>
      </section>
      <section className="event-detail-info">
        <div><p>Cuándo</p><strong>{date}</strong></div><div><p>Dónde</p><strong>{event.venue || event.city}</strong><span>{event.address}</span></div><div><p>Entradas</p><strong>{event.ticketPriceLabel || (event.ticketStatus === "available" ? "Disponibles" : "Por anunciar")}</strong>{event.ticketStatus === "available" && event.ticketUrl && <a href={event.ticketUrl} target="_blank" rel="noreferrer">Comprar entradas ↗</a>}</div>
      </section>
      <section className="event-detail-copy"><p>Yungas Rock presenta</p><h2>{event.description}</h2></section>
      {bands.length > 0 && <section className="event-detail-lineup"><p>Line-up</p>{bands.map((band) => <article key={band.id}><span>{band.role === "headliner" ? "Headliner" : "Soporte"}</span><h3>{band.name}</h3><p>{band.bio}</p></article>)}</section>}
      {sponsors.length > 0 && <section className="event-detail-sponsors"><p>Acompañan esta fecha</p><div>{sponsors.map((sponsor) => <article key={sponsor.id}><Image src={sponsor.logoUrl} alt={sponsor.name} fill sizes="180px" /></article>)}</div></section>}
      <footer className="event-detail-footer"><Image src="/yungas-rock-logo.jpg" alt="Yungas Rock" width={72} height={72} /><Link href="/">Volver al sitio</Link></footer>
    </main>
  );
}
