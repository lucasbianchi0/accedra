-- ═══════════════════════════════════════════════════════════════════════════
-- Contadores de rate limit compartidos entre instancias.
--
-- El problema: sin Upstash configurado, `lib/contact/rateLimit.ts` contaba en
-- memoria. En Vercel cada request puede caer en una instancia distinta, así que
-- los límites por IP del asistente (y de los formularios) no frenaban a nadie:
-- un script podía gastar tokens de Claude y llenar `leads` sin tope real.
--
-- Esta tabla es el contador durable. Una fila por clave
-- (`<scope>:<regla>:<sujeto>`), con su ventana fija: cuando vence, el próximo
-- hit la reinicia en vez de acumular. `cantidad` permite sumar más de 1 por
-- golpe, que es como se descuentan los tokens del presupuesto diario.
--
-- Se llama `site_` porque la base es compartida y el backoffice ya tiene su
-- propia `rate_limits` (otro esquema, otra función `rate_limit_hit`): no se
-- tocan entre sí.
--
-- Sólo la usa el servidor con la service role. RLS activa sin políticas y la
-- función sin permisos para anon/authenticated: desde el navegador no se puede
-- ni leer ni resetear un contador.
-- ═══════════════════════════════════════════════════════════════════════════

begin;

create table if not exists public.site_rate_limits (
  key       text primary key,
  count     bigint      not null default 0,
  reset_at  timestamptz not null
);

alter table public.site_rate_limits enable row level security;

create index if not exists site_rate_limits_reset_at_idx on public.site_rate_limits (reset_at);

comment on table public.site_rate_limits is
  'Contadores de rate limit del sitio (asistente, formularios). Ventana fija por clave. Sólo service role.';

-- Suma `amounts[i]` a `keys[i]` y devuelve los totales, todo en una ida y
-- vuelta. Con amount 0 sólo consulta. Un amount negativo devuelve parte de una
-- reserva (el presupuesto de tokens reserva el peor caso antes de llamar al
-- modelo y devuelve lo que no gastó); el contador nunca baja de 0.
create or replace function public.site_rate_limit_hit(keys text[], windows int[], amounts bigint[])
returns bigint[]
language plpgsql
security definer
set search_path = public
as $$
declare
  resultado bigint[] := '{}';
  i int;
  total bigint;
begin
  if array_length(keys, 1) is null
     or array_length(keys, 1) <> array_length(windows, 1)
     or array_length(keys, 1) <> array_length(amounts, 1)
     or array_length(keys, 1) > 20 then
    raise exception 'site_rate_limit_hit: argumentos inválidos';
  end if;

  for i in 1 .. array_length(keys, 1) loop
    insert into public.site_rate_limits as r (key, count, reset_at)
    values (left(keys[i], 200), greatest(amounts[i], 0), now() + make_interval(secs => windows[i]))
    on conflict (key) do update
      set count    = case when r.reset_at <= now() then greatest(amounts[i], 0) else greatest(r.count + amounts[i], 0) end,
          reset_at = case when r.reset_at <= now() then excluded.reset_at else r.reset_at end
    returning count into total;
    resultado := resultado || total;
  end loop;

  -- Poda perezosa de ventanas vencidas: sin cron, la tabla no crece sin techo.
  -- `skip locked`: no espera filas que otro pedido está actualizando (si
  -- esperara, dos pedidos podrían bloquearse entre sí).
  if random() < 0.02 then
    delete from public.site_rate_limits
    where key in (
      select key from public.site_rate_limits
      where reset_at < now() - interval '1 hour'
      limit 500
      for update skip locked
    );
  end if;

  return resultado;
end;
$$;

revoke all on function public.site_rate_limit_hit(text[], int[], bigint[]) from public, anon, authenticated;
grant execute on function public.site_rate_limit_hit(text[], int[], bigint[]) to service_role;

commit;
