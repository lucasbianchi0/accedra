-- ═══════════════════════════════════════════════════════════════════════════
-- Retención de analítica.
--
-- `events` crece con cada pageview. Sin purga, el plan free (500 MB) se llena
-- y se lleva puesto también al backoffice, que comparte la base. Las campañas
-- de Ads además traen bots, que inflan el volumen más de lo esperable.
--
-- 18 meses permite comparar interanual —"cómo veníamos el agosto pasado"— que
-- es el horizonte más largo que alguien mira en la práctica. Más atrás que eso
-- ocupa lugar y no se consulta nunca.
--
-- Los LEADS no se tocan: son datos comerciales, no telemetría, y su plazo de
-- conservación está declarado en la política de privacidad (5 años).
-- ═══════════════════════════════════════════════════════════════════════════

begin;

create or replace function public.purgar_analitica()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  borrados_eventos  bigint;
  borradas_sesiones bigint;
begin
  delete from public.events where created_at < now() - interval '18 months';
  get diagnostics borrados_eventos = row_count;

  -- Sesiones que quedaron sin ningún evento: o se les purgaron todos, o nunca
  -- llegó ninguno (beacon bloqueado). En ambos casos ya no aportan nada.
  -- Se respeta el mismo corte para no borrar la sesión de un lead reciente.
  delete from public.sessions s
  where s.created_at < now() - interval '18 months'
    and not exists (select 1 from public.events e where e.session_id = s.id)
    and not exists (select 1 from public.leads l where l.session_id = s.id);
  get diagnostics borradas_sesiones = row_count;

  raise notice 'purga: % eventos, % sesiones', borrados_eventos, borradas_sesiones;
end;
$$;

-- Mensual, el día 1 a las 4 AM UTC (1 AM en Argentina): fuera de horario de
-- uso tanto del sitio como del backoffice.
select cron.schedule(
  'purgar-analitica',
  '0 4 1 * *',
  $$select public.purgar_analitica()$$
);

commit;
