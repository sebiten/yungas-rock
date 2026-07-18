# Yungas Rock

Sitio público y panel de contenidos para administrar eventos sin modificar el diseño de la landing.

## Qué administra el panel

- Eventos, estados y evento destacado de portada.
- Artista principal, textos, fecha, lugar, flyer e imagen principal.
- Ticketera externa, estado de entradas y precio visible.
- Line-up y sponsors asociados a cada fecha.
- Textos de Instagram y preview de WhatsApp.
- Bandas, sponsors y postulaciones recibidas desde la web.

Cuando no existe un evento publicado, la portada muestra automáticamente **Próxima fecha en preparación**. Los eventos finalizados conservan su URL dentro de `/eventos/[slug]`.

## Activación con Supabase

1. Crear un proyecto en Supabase.
2. Vincularlo y ejecutar la migración:

```bash
npx supabase@2.109.1 login
npx supabase@2.109.1 link --project-ref REFERENCIA_DEL_PROYECTO
npx supabase@2.109.1 db push
```

3. Copiar `.env.example` como `.env.local` y completar:

```env
NEXT_PUBLIC_SITE_URL=https://yungas-rock.vercel.app
NEXT_PUBLIC_SUPABASE_URL=https://REFERENCIA.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

4. Crear el usuario de producción desde **Supabase → Authentication → Users**.
5. Copiar su UUID y ejecutar en el SQL Editor:

```sql
insert into public.admin_users (user_id, display_name)
values ('UUID_DEL_USUARIO', 'Producción');
```

6. Ingresar desde `/admin/login` y cargar el primer evento.

En Vercel deben existir las mismas tres variables de entorno. Después de agregarlas, hay que volver a desplegar el proyecto.

## Seguridad

La base usa Row Level Security. El público solo puede leer eventos publicados o finalizados, bandas activas y sponsors activos. Las escrituras del panel requieren un usuario autenticado registrado en `admin_users`. Las imágenes se guardan en el bucket público `event-media`, pero solo los administradores pueden subirlas, reemplazarlas o eliminarlas.
