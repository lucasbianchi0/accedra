-- ═══════════════════════════════════════════════════════════════════════════
-- Marca de interacción humana en la visita.
--
-- El problema: entre el 4/8 y el 13/9/2026, 230 de 639 sesiones "humanas"
-- vinieron de fuera de Argentina — 152 de EE.UU., 205 sin referente, 184 de
-- escritorio, 159 aterrizando en la home — y el 91% no emitió más de un
-- evento. Es el perfil de scanners, monitores y herramientas de SEO que corren
-- en datacenters con un user agent de Chrome común, así que `BOT_RE` no los ve.
-- Y Vercel no expone el ASN de la IP, así que no hay forma de separarlos por
-- red del lado del servidor.
--
-- La señal que sí tenemos: una persona mueve el mouse, toca la pantalla, usa la
-- rueda o una tecla. Un navegador que carga la página y se va, no. El sitio
-- manda un evento `interaccion` con el primer gesto real (`isTrusted`) de cada
-- visita y esta columna lo registra.
--
-- POR QUE TRES ESTADOS
--
--   · null  — la visita es anterior a esta medición. No se sabe; se cuenta
--             como se contaba hasta hoy. Reclasificar el histórico sin la
--             señal sería inventar.
--   · false — el sitio ya medía y nadie interactuó. Se excluye del embudo.
--   · true  — hubo al menos un gesto humano.
--
-- La columna NO tiene default a propósito: es el endpoint el que escribe
-- `false` al abrir la sesión. Así, si esta migración corre antes del deploy
-- del sitio, las visitas de ese intervalo quedan en null (contadas) y no en
-- false (descartadas por un código que todavía no medía).
--
-- Se MARCA, no se descarta, por el mismo motivo que `is_bot` e `is_internal`.
-- ═══════════════════════════════════════════════════════════════════════════

begin;

alter table public.sessions
  add column if not exists interactuo boolean;

comment on column public.sessions.interactuo is
  'Hubo un gesto humano (mouse, tecla, rueda, toque). NULL = visita anterior a la medición (13/9/2026). Las consultas de embudo excluyen sólo las false.';

commit;
