-- ═══════════════════════════════════════════════════════════════════════════
-- Analítica propia: sesiones y eventos.
--
-- Se elige tabla propia en vez de Umami porque las preguntas que importan son
-- de negocio y necesitan JOIN con leads: "qué keyword trae clientes que
-- cierran", "de qué página vienen los leads ganados", "el embudo visita → clic
-- → consulta". Contra el schema de Umami eso es frágil, porque su modelo está
-- pensado para alimentar su dashboard y cambia entre versiones.
--
-- Modelo: la atribución vive UNA vez en sessions, no repetida en cada evento.
-- ═══════════════════════════════════════════════════════════════════════════

begin;

-- ── Sesiones ──────────────────────────────────────────────────────────────
-- Una fila por visita. El id lo genera el navegador (UUID aleatorio en
-- localStorage, sin cookies) y se renueva tras 30 minutos de inactividad,
-- que es la convención estándar de sesión web.
create table if not exists public.sessions (
  id          uuid primary key,
  created_at  timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),

  -- ── Atribución: de dónde vino esta visita ──
  gclid        text,
  gbraid       text,
  wbraid       text,
  utm_source   text,
  utm_medium   text,
  utm_campaign text,
  utm_term     text,
  utm_content  text,
  referrer     text,
  landing_page text,

  -- ── Contexto ──
  -- Sin IP a propósito: en una visita anónima no hay ninguna base para
  -- guardarla. En leads sí está, porque ahí la persona se identificó.
  device  text check (device in ('mobile', 'tablet', 'desktop')),
  country text,  -- código ISO que provee el edge de Vercel

  -- Los bots se MARCAN, no se descartan: en campañas de Ads el volumen de bots
  -- es justamente la señal para detectar clic fraudulento y pedir reintegro.
  is_bot boolean not null default false,

  metadata jsonb not null default '{}'::jsonb
);

create index if not exists sessions_created_at_idx on public.sessions (created_at desc);
create index if not exists sessions_gclid_idx      on public.sessions (gclid) where gclid is not null;
create index if not exists sessions_campaign_idx   on public.sessions (utm_campaign) where utm_campaign is not null;
-- Casi todas las consultas de analítica excluyen bots: el índice parcial hace
-- que ni los mire.
create index if not exists sessions_humanas_idx    on public.sessions (created_at desc) where not is_bot;

-- ── Eventos ───────────────────────────────────────────────────────────────
-- La tabla que más crece. PK bigint y no uuid: es append-only, y un entero
-- secuencial ocupa la mitad y no fragmenta el índice.
create table if not exists public.events (
  id         bigint generated always as identity primary key,
  created_at timestamptz not null default now(),

  session_id uuid not null references public.sessions(id) on delete cascade,

  -- type: la familia del evento (pageview, click, form).
  -- name: el evento concreto dentro de la familia (whatsapp, telefono, ...).
  type text not null,
  name text,
  -- Sobre qué objeto ocurrió: el slug de la solución, el caso, etc.
  target text,
  -- Desde qué página.
  path text not null,

  metadata jsonb not null default '{}'::jsonb
);

create index if not exists events_session_idx    on public.events (session_id);
create index if not exists events_created_at_idx on public.events (created_at desc);
create index if not exists events_tipo_idx       on public.events (type, name);
create index if not exists events_path_idx       on public.events (path);
-- "Clics por card de solución", que es una de las preguntas que hay que
-- responder seguido.
create index if not exists events_target_idx     on public.events (name, target) where target is not null;

-- ── Vincular leads con su sesión ──────────────────────────────────────────
-- Es lo que habilita el embudo completo: sesión → eventos → lead → contrato.
alter table public.leads
  add column if not exists session_id uuid references public.sessions(id) on delete set null;

create index if not exists leads_session_idx on public.leads (session_id);

-- La columna umami_session_id queda obsoleta: se decidió no usar Umami.
alter table public.leads drop column if exists umami_session_id;

-- ── RLS ───────────────────────────────────────────────────────────────────
-- Igual que el resto del proyecto: activa y sin políticas, sólo service_role.
-- El navegador NO escribe acá directo: postea a /api/track, que valida y
-- enriquece del lado del servidor. Si el navegador pudiera insertar, cualquiera
-- podría inflar tus métricas.
alter table public.sessions enable row level security;
alter table public.events   enable row level security;

commit;
