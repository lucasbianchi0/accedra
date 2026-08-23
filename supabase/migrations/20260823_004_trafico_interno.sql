-- ═══════════════════════════════════════════════════════════════════════════
-- Marca de tráfico interno.
--
-- El problema: en las primeras tres semanas del sitio, 317 de 427 sesiones
-- llegaron sin referente y sin gclid. Para un sitio recién publicado, eso es
-- casi enteramente el equipo entrando a mirar cómo quedó. Mientras esas visitas
-- se cuenten como tráfico, la tasa de conversión de cada landing miente hacia
-- abajo — y es justo el número contra el que se van a juzgar los cambios de
-- formulario y de oferta.
--
-- Se MARCA, no se descarta, por el mismo motivo que `is_bot`: borrar datos es
-- irreversible y en algún momento se va a querer saber cuánto se probó el sitio.
-- Todas las consultas de analítica filtran por `not is_internal`.
--
-- Cómo se activa: la persona del equipo entra una vez a
--   https://accedra.com.ar/?interno=1
-- y su navegador queda marcado. Se revierte con `?interno=0`.
--
-- Por qué por navegador y no por IP: el equipo trabaja desde casa, desde la
-- oficina y desde el celular, así que una lista de IPs no los cubre. Y guardar
-- IPs de visitas anónimas contradice la decisión explícita de `sessions`, que
-- a propósito no las almacena.
-- ═══════════════════════════════════════════════════════════════════════════

begin;

alter table public.sessions
  add column if not exists is_internal boolean not null default false;

comment on column public.sessions.is_internal is
  'Visita del propio equipo, marcada desde el navegador con ?interno=1. Se excluye de las métricas de embudo.';

-- El índice parcial de sesiones humanas ahora también deja afuera las internas:
-- es el que usan todas las consultas de analítica, y sin esto seguirían
-- contando al equipo como si fueran visitantes.
drop index if exists public.sessions_humanas_idx;
create index if not exists sessions_humanas_idx
  on public.sessions (created_at desc)
  where not is_bot and not is_internal;

commit;
