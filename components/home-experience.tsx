"use client";

import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import { submitBandApplication } from "@/app/actions/public";
import type { LandingContent, PublicBand } from "@/lib/content/types";

interface ApplicationData {
  bandName: string;
  city: string;
  instagram: string;
  musicLink: string;
}

const initialApplication: ApplicationData = {
  bandName: "",
  city: "",
  instagram: "",
  musicLink: "",
};

function formatEventDate(value: string | null) {
  if (!value) return "Próximamente";
  return new Intl.DateTimeFormat("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "America/Argentina/Buenos_Aires",
  }).format(new Date(value));
}

function ticketLabel(status: LandingContent["event"]["ticketStatus"], price: string | null) {
  if (status === "available") return price || "Entradas disponibles";
  if (status === "sold_out") return "Entradas agotadas";
  if (status === "soon") return "Venta por anunciar";
  return "Sin venta publicada";
}

function SupportSlot({ band, position, onApply }: { band?: PublicBand; position: number; onApply: () => void }) {
  const className = `open-slot slot-${position === 0 ? "one" : "two"}${band ? " confirmed-slot" : ""}`;

  if (band) {
    return (
      <article className={className}>
        <span>Banda soporte</span>
        <strong>{band.name}</strong>
        <i>{band.city || "Confirmada"}</i>
      </article>
    );
  }

  return (
    <button className={className} type="button" onClick={onApply}>
      <span>Banda soporte</span>
      <strong>{position === 0 ? "Este lugar puede ser tuyo" : "Traé tu sonido al escenario"}</strong>
      <i>Postular ahora ↗</i>
    </button>
  );
}

export function HomeExperience({ content }: { content: LandingContent }) {
  const { event, bands, sponsors } = content;
  const headliner = bands.find((band) => band.role === "headliner");
  const supports = bands.filter((band) => band.role === "support").slice(0, 2);
  const eventDate = formatEventDate(event.eventDate);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isApplicationOpen, setIsApplicationOpen] = useState(false);
  const [application, setApplication] = useState(initialApplication);
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    document.body.style.overflow = isApplicationOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isApplicationOpen]);

  function closeMenus() {
    setIsMenuOpen(false);
  }

  function openApplication() {
    setFormStatus("idle");
    setFormError("");
    setIsApplicationOpen(true);
    closeMenus();
  }

  function updateApplication(field: keyof ApplicationData, value: string) {
    setApplication((current) => ({ ...current, [field]: value }));
  }

  async function handleApplicationSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormStatus("sending");
    setFormError("");
    const result = await submitBandApplication({ ...application, eventId: content.event.id });
    if (!result.success) {
      setFormStatus("idle");
      setFormError(result.message);
      return;
    }
    setFormStatus("sent");
  }

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#inicio" onClick={closeMenus} aria-label="Yungas Rock, inicio">
          <Image src="/yungas-rock-logo.jpg" alt="Logo de Yungas Rock" width={64} height={64} priority />
          <span>YUNGAS<br />ROCK</span>
        </a>

        <button
          className="menu-toggle"
          type="button"
          aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((current) => !current)}
        >
          <span />
          <span />
        </button>

        <nav className={isMenuOpen ? "main-nav is-open" : "main-nav"} aria-label="Navegación principal">
          <a href="#evento" onClick={closeMenus}>Próxima fecha</a>
          <a href="#bandas" onClick={closeMenus}>Bandas</a>
          <a href="#convocatoria" onClick={closeMenus}>Convocatoria</a>
          <a href="#contacto" onClick={closeMenus}>Contacto</a>
          <button type="button" onClick={openApplication}>Postular banda</button>
        </nav>
      </header>

      <section className="hero" id="inicio">
        <Image
          className="hero-image"
          src={event.heroImageUrl}
          alt={`${event.artistName} en Yungas Rock`}
          fill
          sizes="100vw"
          priority
        />
        <div className="hero-scrim" />
        <div className="hero-content">
          <p className="hero-kicker"><span>{event.eyebrow}</span> {event.artistName} · {event.city}</p>
          <h1>YUNGAS<br /><i>ROCK</i></h1>
          <p className="hero-copy">{event.description}</p>
          <div className="hero-actions">
            <a className="button button-primary" href="#evento">Ver el evento</a>
            <button className="button button-ghost" type="button" onClick={openApplication}>Subí a tu banda</button>
          </div>
        </div>
        <aside className="hero-ticket" aria-label="Información del próximo evento">
          <span>{event.eyebrow}</span>
          <strong>{event.artistName}</strong>
          <p>{eventDate}<br />{event.venue || event.city}</p>
        </aside>
      </section>

      <div className="marquee" aria-hidden="true">
        <div>
          <span>{event.artistName}</span><b>+</b><span>BANDAS DEL NORTE</span><b>+</b><span>JUJUY</span><b>+</b>
          <span>{event.artistName}</span><b>+</b><span>BANDAS DEL NORTE</span><b>+</b><span>JUJUY</span><b>+</b>
        </div>
      </div>

      <section className="manifesto section-shell">
        <p>No es solo un recital.</p>
        <h2>Es el punto de encuentro para la escena que crece entre cerros, rutas y amplificadores.</h2>
      </section>

      <section className="event-section" id="evento">
        <div className="event-poster">
          {event.flyerImageUrl && (
            <Image className="event-poster-image" src={event.flyerImageUrl} alt={`Flyer de ${event.artistName}`} fill sizes="(max-width: 900px) 100vw, 55vw" />
          )}
          <div className="poster-number">PRÓXIMO<br />SHOW</div>
          <div className="poster-copy">
            <p>Yungas Rock presenta</p>
            <h2>{event.artistName}</h2>
            <span>{event.title}</span>
          </div>
        </div>
        <div className="event-info">
          <h3>{event.title}</h3>
          <div className="event-facts">
            <div><span>Cuándo</span><strong>{eventDate}{event.doorsTime ? ` · ${event.doorsTime}` : ""}</strong></div>
            <div><span>Dónde</span><strong>{event.venue || event.city}</strong></div>
            <div><span>Entradas</span><strong>{ticketLabel(event.ticketStatus, event.ticketPriceLabel)}</strong></div>
          </div>
          <p>{event.description}</p>
          {event.ticketStatus === "available" && event.ticketUrl ? (
            <a className="text-link" href={event.ticketUrl} target="_blank" rel="noreferrer">Comprar entradas <span>↗</span></a>
          ) : (
            <a className="text-link" href="https://www.instagram.com/yungas.rock/?hl=es" target="_blank" rel="noreferrer">Seguir en Instagram <span>↗</span></a>
          )}
        </div>
      </section>

      <section className="lineup section-shell" id="bandas">
        <div className="section-title">
          <p>El escenario</p>
          <h2>Una noche.<br />Todo el norte en escena.</h2>
        </div>
        <div className="lineup-grid">
          <article className="headliner-slot">
            <span>Headliner</span>
            <h3>{headliner?.name || event.artistName}</h3>
            <p>{headliner?.bio || event.description}</p>
          </article>
          <SupportSlot band={supports[0]} position={0} onApply={openApplication} />
          <SupportSlot band={supports[1]} position={1} onApply={openApplication} />
        </div>
      </section>

      <section className="application-section" id="convocatoria">
        <div className="application-copy">
          <p>Convocatoria abierta</p>
          <h2>¿Tu banda está lista para abrir la noche?</h2>
          <span>Mandanos tu música, redes y material en un solo formulario.</span>
          <button className="button button-dark" type="button" onClick={openApplication}>Postular mi banda</button>
        </div>
        <div className="application-steps">
          <div><strong>Completá tus datos</strong><span>Nombre, ciudad y contacto.</span></div>
          <div><strong>Compartí tu sonido</strong><span>Redes, video o link de escucha.</span></div>
          <div><strong>Esperá la selección</strong><span>La producción revisa cada propuesta.</span></div>
        </div>
      </section>

      {sponsors.length > 0 && <section className="sponsors" aria-labelledby="sponsors-title">
        <div className="sponsors-heading section-shell">
          <div>
            <p>Marcas que hacen ruido con nosotros</p>
            <h2 id="sponsors-title">Esta fecha se hace<br />entre todos.</h2>
          </div>
          <a href="https://wa.me/543886477266" target="_blank" rel="noreferrer">Sumar mi marca <span>↗</span></a>
        </div>

        <div className="sponsor-carousel" aria-label="Sponsors de Yungas Rock">
          <div className="sponsor-track">
            {[false, true].map((isCopy) => (
              <div className="sponsor-set" aria-hidden={isCopy || undefined} key={isCopy ? "copy" : "original"}>
                {sponsors.map((sponsor) => (
                  <article className={`sponsor-card sponsor-card-${sponsor.format}`} key={`${sponsor.name}-${isCopy}`}>
                    <div className="sponsor-logo">
                      <Image
                        src={sponsor.logoUrl}
                        alt={isCopy ? "" : `Logo de ${sponsor.name}`}
                        fill
                        sizes="(max-width: 620px) 240px, 320px"
                      />
                    </div>
                    <span>{sponsor.name}</span>
                  </article>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>}

      <section className="organize section-shell">
        <div className="organize-heading">
          <h2>Todo el festival.<br /><i>Un solo lugar.</i></h2>
        </div>
        <div className="organize-list">
          <article><strong>Entradas</strong><p>Venta online y acceso rápido desde Instagram.</p></article>
          <article><strong>Horarios</strong><p>Cronograma actualizado para no perderte ninguna banda.</p></article>
          <article><strong>Ubicación</strong><p>Mapa, accesos y toda la información del predio.</p></article>
          <article><strong>Novedades</strong><p>Anuncios, convocatorias y próximas fechas en un mismo canal.</p></article>
        </div>
      </section>

      <section className="location-section">
        <div className="location-map" aria-hidden="true">
          <span>{event.city.split(",")[0].toUpperCase()}</span>
          <b>YUNGAS<br />ROCK</b>
        </div>
        <div className="location-copy">
          <h2>{event.venue ? `Nos vemos en ${event.venue}.` : "Nos vemos en Jujuy."}</h2>
          <p>{event.address || "La ubicación exacta y las indicaciones de acceso se publicarán con el anuncio oficial."}</p>
          <span className="location-status">{event.venue || "Ubicación por confirmar"}</span>
        </div>
      </section>

      <footer id="contacto">
        <div className="footer-logo">
          <Image src="/yungas-rock-logo.jpg" alt="Yungas Rock" width={92} height={92} />
          <h2>EL NORTE<br />SUENA FUERTE.</h2>
        </div>
        <div className="footer-links">
          <a href="https://www.instagram.com/yungas.rock/?hl=es" target="_blank" rel="noreferrer">Instagram ↗</a>
          <a href="https://wa.me/543886477266" target="_blank" rel="noreferrer">WhatsApp ↗</a>
          <button type="button" onClick={openApplication}>Postular banda ↗</button>
        </div>
        <div className="footer-note">
          <span>Yungas Rock. Jujuy, Argentina.</span>
          <span>{content.source === "demo" ? "Modo demo. Contenido sujeto a confirmación." : "Contenido administrado por Yungas Rock."}</span>
        </div>
      </footer>

      {isApplicationOpen && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setIsApplicationOpen(false)}>
          <section
            className="application-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="application-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button className="modal-close" type="button" aria-label="Cerrar formulario" onClick={() => setIsApplicationOpen(false)}>×</button>
            {formStatus === "sent" ? (
              <div className="success-state">
                <span>Recibido</span>
                <h2>Tu banda ya está en la lista.</h2>
                <p>La producción recibirá el material ordenado y podrá responder desde el panel.</p>
                <button className="button button-primary" type="button" onClick={() => setIsApplicationOpen(false)}>Cerrar</button>
              </div>
            ) : (
              <>
                <p className="modal-kicker">Convocatoria bandas soporte</p>
                <h2 id="application-title">Queremos escuchar lo que hacen.</h2>
                <p className="modal-intro">Compartí los datos principales y un enlace donde podamos escuchar la banda.</p>
                <form onSubmit={handleApplicationSubmit}>
                  <label>
                    Nombre de la banda
                    <input required value={application.bandName} onChange={(event) => updateApplication("bandName", event.target.value)} placeholder="Ej: Ruido del Cerro" />
                  </label>
                  <div className="form-row">
                    <label>
                      Ciudad
                      <input required value={application.city} onChange={(event) => updateApplication("city", event.target.value)} placeholder="San Salvador de Jujuy" />
                    </label>
                    <label>
                      Instagram
                      <input required value={application.instagram} onChange={(event) => updateApplication("instagram", event.target.value)} placeholder="@tubanda" />
                    </label>
                  </div>
                  <label>
                    Link a música o video
                    <input required type="url" value={application.musicLink} onChange={(event) => updateApplication("musicLink", event.target.value)} placeholder="https://" />
                  </label>
                  {formError && <p className="form-error" role="alert">{formError}</p>}
                  <button className="button button-primary submit-button" type="submit" disabled={formStatus === "sending"}>
                    {formStatus === "sending" ? "Enviando material..." : "Enviar postulación"}
                  </button>
                </form>
              </>
            )}
          </section>
        </div>
      )}
    </main>
  );
}
