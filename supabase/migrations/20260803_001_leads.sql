-- ═══════════════════════════════════════════════════════════════════════════
-- Leads del sitio, con atribución publicitaria.
--
-- El objetivo no es "guardar el formulario": es poder cerrar el círculo entre
-- lo que se gasta en un anuncio y el contrato que se firma tres meses después.
-- Para eso hace falta el gclid (el identificador del clic en Google Ads) y el
-- ciclo de vida comercial del lead en la misma fila.
--
-- Convenciones tomadas de las tablas que ya existen (orders, products):
-- PK uuid, created_at timestamptz, snake_case, jsonb para lo flexible,
-- RLS activa sin políticas → sólo service_role, igual que el resto.
-- ═══════════════════════════════════════════════════════════════════════════

begin;

-- ── Estados del pipeline ──────────────────────────────────────────────────
-- Tabla y no un enum de Postgres: agregar o renombrar un estado es un INSERT,
-- no una migración. Los enums no dejan borrar valores ni reordenarlos, y un
-- pipeline comercial cambia seguido.
create table if not exists public.lead_statuses (
  key        text primary key,
  label      text not null,
  -- is_won marca cuáles cuentan como conversión real para subir a Google Ads.
  is_won     boolean not null default false,
  is_closed  boolean not null default false,
  sort_order integer not null default 0
);

insert into public.lead_statuses (key, label, is_won, is_closed, sort_order) values
  ('nuevo',      'Nuevo',              false, false, 10),
  ('contactado', 'Contactado',         false, false, 20),
  ('calificado', 'Calificado',         false, false, 30),
  ('propuesta',  'Propuesta enviada',  false, false, 40),
  ('ganado',     'Ganado',             true,  true,  50),
  ('perdido',    'Perdido',            false, true,  60),
  ('descartado', 'Descartado / spam',  false, true,  70)
on conflict (key) do nothing;

-- ── Leads ─────────────────────────────────────────────────────────────────
create table if not exists public.leads (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Lo que completa la persona. Espeja lib/contact/schema.ts del sitio.
  name       text not null,
  company    text not null,
  email      text not null,
  message    text not null,
  service    text,

  -- ── Atribución publicitaria ──
  -- gclid es la pieza central: sin él no se pueden importar conversiones
  -- offline a Google Ads y Smart Bidding queda optimizando por formularios
  -- completados en vez de por clientes que firman.
  gclid        text,
  gbraid       text,  -- campañas iOS
  wbraid       text,  -- web-to-app
  utm_source   text,
  utm_medium   text,
  utm_campaign text,
  utm_term     text,  -- la keyword que disparó el anuncio
  utm_content  text,  -- qué variante de anuncio

  -- ── Contexto de navegación ──
  referrer        text,
  landing_page    text,  -- primera página de la sesión
  submitted_from  text,  -- desde qué página envió el formulario
  -- Puente con las métricas de Umami: permite reconstruir el recorrido
  -- completo del lead antes de convertir. Se llena cuando Umami esté activo.
  umami_session_id uuid,

  -- ── Contexto del request ──
  ip         inet,
  user_agent text,

  -- ── Ciclo comercial ──
  status                 text not null default 'nuevo'
                           references public.lead_statuses(key) on update cascade,
  deal_value             numeric(14,2),
  deal_currency          text not null default 'ARS',
  closed_at              timestamptz,
  -- Marca de que la conversión ya se subió a Ads, para no duplicarla.
  conversion_uploaded_at timestamptz,
  notes                  text,

  -- Escape hatch para campos futuros sin migración, mismo criterio que
  -- products.attributes y orders.request.
  metadata jsonb not null default '{}'::jsonb,

  constraint leads_email_no_vacio check (length(btrim(email)) > 0),
  constraint leads_deal_value_no_negativo check (deal_value is null or deal_value >= 0)
);

-- ── Índices sobre los caminos de consulta reales ──────────────────────────
create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_status_idx     on public.leads (status);
create index if not exists leads_email_idx      on public.leads (lower(email));
-- Parciales: la enorme mayoría de las filas tendrá estos campos en null.
create index if not exists leads_gclid_idx      on public.leads (gclid) where gclid is not null;
create index if not exists leads_utm_campaign_idx on public.leads (utm_campaign) where utm_campaign is not null;
-- Cola de conversiones pendientes de subir a Google Ads.
create index if not exists leads_pendientes_de_subir_idx
  on public.leads (closed_at)
  where gclid is not null and conversion_uploaded_at is null;

-- ── updated_at automático ─────────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists leads_set_updated_at on public.leads;
create trigger leads_set_updated_at
  before update on public.leads
  for each row execute function public.set_updated_at();

-- ── RLS ───────────────────────────────────────────────────────────────────
-- Activa y sin políticas, igual que products/orders/settings: sólo service_role
-- llega. La API route del sitio inserta del lado del servidor y el backoffice
-- lee del lado del servidor. El navegador nunca toca estas tablas.
alter table public.leads          enable row level security;
alter table public.lead_statuses  enable row level security;

commit;
