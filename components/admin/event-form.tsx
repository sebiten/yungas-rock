"use client";

import { useActionState } from "react";
import { saveEventAction, type AdminActionState } from "@/app/admin/actions/content";
import type { Database } from "@/lib/supabase/database.types";

type EventRow = Database["public"]["Tables"]["events"]["Row"];
type BandRow = Database["public"]["Tables"]["bands"]["Row"];

interface EventFormProps {
  event?: EventRow;
  bands: BandRow[];
  selectedHeadlinerId?: string;
  selectedSupportIds?: string[];
}

const initialState: AdminActionState = { error: "" };

export function EventForm({
  event,
  bands,
  selectedHeadlinerId,
  selectedSupportIds = [],
}: EventFormProps) {
  const [state, action, pending] = useActionState(saveEventAction, initialState);
  const eventDate = event?.event_date ? event.event_date.slice(0, 16) : "";

  return (
    <form className="admin-content-form" action={action}>
      {event && <input type="hidden" name="id" value={event.id} />}
      <input type="hidden" name="current_hero_image_url" value={event?.hero_image_url || ""} />
      <input type="hidden" name="current_flyer_image_url" value={event?.flyer_image_url || ""} />

      <section className="admin-form-section">
        <div className="admin-form-heading"><span>01</span><div><h2>Información principal</h2><p>Estos datos alimentan la portada y la página del evento.</p></div></div>
        <div className="admin-form-grid">
          <label>Artista principal<input name="artist_name" required defaultValue={event?.artist_name} /></label>
          <label>Slug<input name="slug" placeholder="nombre-del-evento" defaultValue={event?.slug} /></label>
          <label className="admin-field-wide">Título<input name="title" required defaultValue={event?.title} placeholder="Una fecha que va a sacudir el norte" /></label>
          <label className="admin-field-wide">Descripción<textarea name="description" required rows={4} defaultValue={event?.description} /></label>
          <label>Etiqueta superior<input name="eyebrow" defaultValue={event?.eyebrow || "Próxima fecha"} /></label>
          <label>Ciudad<input name="city" defaultValue={event?.city || "Jujuy, Argentina"} /></label>
        </div>
      </section>

      <section className="admin-form-section">
        <div className="admin-form-heading"><span>02</span><div><h2>Fecha y lugar</h2><p>Si quedan vacíos, la web muestra el estado por confirmar.</p></div></div>
        <div className="admin-form-grid">
          <label>Fecha y hora<input type="datetime-local" name="event_date" defaultValue={eventDate} /></label>
          <label>Horario de puertas<input name="doors_time" placeholder="20:00" defaultValue={event?.doors_time || ""} /></label>
          <label>Lugar<input name="venue" defaultValue={event?.venue || ""} /></label>
          <label>Dirección<input name="address" defaultValue={event?.address || ""} /></label>
        </div>
      </section>

      <section className="admin-form-section">
        <div className="admin-form-heading"><span>03</span><div><h2>Imágenes</h2><p>JPG, PNG o WebP. Máximo 10 MB.</p></div></div>
        <div className="admin-form-grid">
          <label>Imagen principal<input type="file" name="hero_image" accept="image/jpeg,image/png,image/webp" /></label>
          <label>Flyer<input type="file" name="flyer_image" accept="image/jpeg,image/png,image/webp" /></label>
        </div>
      </section>

      <section className="admin-form-section">
        <div className="admin-form-heading"><span>04</span><div><h2>Entradas</h2><p>El botón dirige a la ticketera externa.</p></div></div>
        <div className="admin-form-grid">
          <label>Estado<select name="ticket_status" defaultValue={event?.ticket_status || "soon"}><option value="hidden">Ocultas</option><option value="soon">Próximamente</option><option value="available">Disponibles</option><option value="sold_out">Agotadas</option></select></label>
          <label>Precio o etiqueta<input name="ticket_price_label" defaultValue={event?.ticket_price_label || ""} placeholder="Desde $..." /></label>
          <label className="admin-field-wide">Enlace de venta<input type="url" name="ticket_url" defaultValue={event?.ticket_url || ""} placeholder="https://ticketera.com/evento" /></label>
        </div>
      </section>

      <section className="admin-form-section">
        <div className="admin-form-heading"><span>05</span><div><h2>Line-up</h2><p>Elegí las bandas previamente cargadas.</p></div></div>
        <div className="admin-form-grid">
          <label>Headliner<select name="headliner_band_id" defaultValue={selectedHeadlinerId || ""}><option value="">Usar artista principal</option>{bands.map((band) => <option value={band.id} key={band.id}>{band.name}</option>)}</select></label>
          <fieldset><legend>Bandas soporte</legend>{bands.map((band) => <label className="admin-check" key={band.id}><input type="checkbox" name="support_band_ids" value={band.id} defaultChecked={selectedSupportIds.includes(band.id)} />{band.name}</label>)}</fieldset>
        </div>
      </section>

      <section className="admin-form-section">
        <div className="admin-form-heading"><span>06</span><div><h2>Difusión</h2><p>Textos que usan el SEO y las previews sociales.</p></div></div>
        <div className="admin-form-grid">
          <label className="admin-field-wide">Texto para Instagram<textarea name="instagram_copy" rows={4} defaultValue={event?.instagram_copy || ""} /></label>
          <label>Título de WhatsApp<input name="whatsapp_title" defaultValue={event?.whatsapp_title || ""} /></label>
          <label>Descripción de WhatsApp<input name="whatsapp_description" defaultValue={event?.whatsapp_description || ""} /></label>
        </div>
      </section>

      <section className="admin-publish-bar">
        <label>Estado<select name="status" defaultValue={event?.status || "draft"}><option value="draft">Borrador</option><option value="published">Publicado</option><option value="completed">Finalizado</option><option value="cancelled">Cancelado</option></select></label>
        <label className="admin-check"><input type="checkbox" name="is_featured" defaultChecked={event?.is_featured} />Mostrar en portada</label>
        {state.error && <p className="admin-form-error" role="alert">{state.error}</p>}
        <button type="submit" disabled={pending}>{pending ? "Guardando..." : "Guardar evento"}</button>
      </section>
    </form>
  );
}
