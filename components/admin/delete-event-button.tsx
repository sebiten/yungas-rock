"use client";

import { deleteEventAction } from "@/app/admin/actions/content";

export function DeleteEventButton({ eventId }: { eventId: string }) {
  return (
    <form
      action={deleteEventAction}
      onSubmit={(event) => {
        if (!window.confirm("¿Eliminar este evento definitivamente?")) event.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={eventId} />
      <button type="submit">Eliminar</button>
    </form>
  );
}
