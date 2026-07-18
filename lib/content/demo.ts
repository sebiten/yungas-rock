import type { LandingContent, PublicEvent, PublicSponsor } from "./types";

export const preparationEvent: PublicEvent = {
  id: null,
  slug: "proxima-fecha",
  artistName: "Próxima fecha",
  title: "El próximo encuentro está tomando forma.",
  eyebrow: "En preparación",
  description: "Seguinos en Instagram para enterarte primero del próximo anuncio de Yungas Rock.",
  eventDate: null,
  doorsTime: null,
  venue: null,
  city: "Jujuy, Argentina",
  address: null,
  heroImageUrl: "/hero-concert.png",
  flyerImageUrl: null,
  ticketUrl: null,
  ticketPriceLabel: null,
  ticketStatus: "hidden",
  status: "published",
  instagramCopy: null,
  whatsappTitle: "Yungas Rock | La selva también hace ruido",
  whatsappDescription: "La próxima fecha está en preparación.",
};

const demoSponsors: PublicSponsor[] = [
  ["el-nacho", "El Nacho", "/sponsors/el-nacho.png", "square"],
  ["disenos-mora", "Diseños Mora", "/sponsors/disenos-mora.png", "square"],
  ["lp-viajes", "LP Viajes", "/sponsors/lp-viajes.png", "square"],
  ["new-geor", "New Geor", "/sponsors/new-geor.png", "wide"],
  ["capitan-beto", "Capitán Beto", "/sponsors/capitan-beto.png", "square"],
  ["alquimia", "Alquimia", "/sponsors/alquimia.png", "square"],
  ["silvana-morel", "Silvana Morel", "/sponsors/silvana-morel.png", "wide"],
  ["aymagon", "Aymagón", "/sponsors/aymagon.png", "wide"],
  ["rnor-cell", "Rnor Cell", "/sponsors/rnor-cell.png", "wide"],
  ["yodas", "Yodas", "/sponsors/yodas.png", "square"],
].map(([id, name, logoUrl, format], sortOrder) => ({
  id,
  name,
  logoUrl,
  websiteUrl: null,
  format: format as "square" | "wide",
  sortOrder,
}));

export const demoContent: LandingContent = {
  source: "demo",
  event: preparationEvent,
  bands: [],
  sponsors: demoSponsors,
};
