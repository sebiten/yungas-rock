create extension if not exists pgcrypto;

create type public.event_status as enum ('draft', 'published', 'completed', 'cancelled');
create type public.ticket_status as enum ('hidden', 'soon', 'available', 'sold_out');
create type public.event_band_role as enum ('headliner', 'support');
create type public.application_status as enum ('pending', 'reviewing', 'selected', 'rejected');

create table public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now()
);

create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to authenticated;

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select (select auth.uid()) is not null
    and exists (
      select 1
      from public.admin_users
      where user_id = (select auth.uid())
    );
$$;

revoke all on function private.is_admin() from public;
grant execute on function private.is_admin() to authenticated;

create table public.events (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  artist_name text not null,
  title text not null,
  eyebrow text not null default 'Próxima fecha',
  description text not null,
  event_date timestamptz,
  doors_time text,
  venue text,
  city text not null default 'Jujuy, Argentina',
  address text,
  hero_image_url text,
  flyer_image_url text,
  ticket_url text,
  ticket_price_label text,
  ticket_status public.ticket_status not null default 'soon',
  status public.event_status not null default 'draft',
  instagram_copy text,
  whatsapp_title text,
  whatsapp_description text,
  is_featured boolean not null default false,
  created_by uuid references auth.users(id) on delete set null default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index events_one_featured_idx on public.events (is_featured) where is_featured;
create index events_public_date_idx on public.events (status, event_date);

create table public.bands (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  name text not null,
  city text,
  bio text,
  image_url text,
  instagram_url text,
  music_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.event_bands (
  event_id uuid not null references public.events(id) on delete cascade,
  band_id uuid not null references public.bands(id) on delete cascade,
  role public.event_band_role not null default 'support',
  sort_order integer not null default 0 check (sort_order >= 0),
  primary key (event_id, band_id)
);

create index event_bands_event_order_idx on public.event_bands (event_id, sort_order);

create table public.sponsors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_url text not null,
  website_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.event_sponsors (
  event_id uuid not null references public.events(id) on delete cascade,
  sponsor_id uuid not null references public.sponsors(id) on delete cascade,
  sort_order integer not null default 0 check (sort_order >= 0),
  primary key (event_id, sponsor_id)
);

create index event_sponsors_event_order_idx on public.event_sponsors (event_id, sort_order);

create table public.band_applications (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references public.events(id) on delete set null,
  band_name text not null,
  city text not null,
  instagram text not null,
  music_link text not null,
  status public.application_status not null default 'pending',
  internal_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index band_applications_status_created_idx on public.band_applications (status, created_at desc);

create table public.site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  is_public boolean not null default false,
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger events_set_updated_at before update on public.events
for each row execute function public.set_updated_at();
create trigger bands_set_updated_at before update on public.bands
for each row execute function public.set_updated_at();
create trigger sponsors_set_updated_at before update on public.sponsors
for each row execute function public.set_updated_at();
create trigger applications_set_updated_at before update on public.band_applications
for each row execute function public.set_updated_at();
create trigger settings_set_updated_at before update on public.site_settings
for each row execute function public.set_updated_at();

alter table public.admin_users enable row level security;
alter table public.events enable row level security;
alter table public.bands enable row level security;
alter table public.event_bands enable row level security;
alter table public.sponsors enable row level security;
alter table public.event_sponsors enable row level security;
alter table public.band_applications enable row level security;
alter table public.site_settings enable row level security;

create policy "Published events are public"
on public.events for select
to anon, authenticated
using (status in ('published', 'completed'));

create policy "Admins manage events"
on public.events for all
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

create policy "Active bands are public"
on public.bands for select
to anon, authenticated
using (is_active);

create policy "Admins manage bands"
on public.bands for all
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

create policy "Published event lineup is public"
on public.event_bands for select
to anon, authenticated
using (
  exists (
    select 1 from public.events
    where events.id = event_bands.event_id
      and events.status in ('published', 'completed')
  )
);

create policy "Admins manage event lineup"
on public.event_bands for all
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

create policy "Active sponsors are public"
on public.sponsors for select
to anon, authenticated
using (is_active);

create policy "Admins manage sponsors"
on public.sponsors for all
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

create policy "Published event sponsors are public"
on public.event_sponsors for select
to anon, authenticated
using (
  exists (
    select 1 from public.events
    where events.id = event_sponsors.event_id
      and events.status in ('published', 'completed')
  )
);

create policy "Admins manage event sponsors"
on public.event_sponsors for all
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

create policy "Public can submit band applications"
on public.band_applications for insert
to anon, authenticated
with check (status = 'pending' and internal_notes is null);

create policy "Admins manage applications"
on public.band_applications for all
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

create policy "Public settings are readable"
on public.site_settings for select
to anon, authenticated
using (is_public);

create policy "Admins manage settings"
on public.site_settings for all
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

create policy "Admins can view administrators"
on public.admin_users for select
to authenticated
using ((select private.is_admin()));

create policy "Admins manage administrators"
on public.admin_users for all
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

grant usage on schema public to anon, authenticated;
grant select on public.events, public.bands, public.event_bands, public.sponsors, public.event_sponsors, public.site_settings to anon;
grant insert on public.band_applications to anon;
grant select, insert, update, delete on public.events, public.bands, public.event_bands, public.sponsors, public.event_sponsors, public.band_applications, public.site_settings, public.admin_users to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'event-media',
  'event-media',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "Admins can inspect event media"
on storage.objects for select
to authenticated
using (bucket_id = 'event-media' and (select private.is_admin()));

create policy "Admins can upload event media"
on storage.objects for insert
to authenticated
with check (bucket_id = 'event-media' and (select private.is_admin()));

create policy "Admins can update event media"
on storage.objects for update
to authenticated
using (bucket_id = 'event-media' and (select private.is_admin()))
with check (bucket_id = 'event-media' and (select private.is_admin()));

create policy "Admins can delete event media"
on storage.objects for delete
to authenticated
using (bucket_id = 'event-media' and (select private.is_admin()));

comment on table public.admin_users is 'Bootstrap the first admin from the SQL editor using their auth.users id.';
