-- ═══════════════════════════════════════════════════════════════════════════
-- Las vistas corren con los permisos de su dueño y saltean RLS, y Supabase le
-- da acceso a `anon` y `authenticated` a todo lo nuevo del esquema `public`. La
-- anon key la expone el backoffice en el navegador: las vistas tienen que
-- quedar cerradas. El sitio y el backoffice leen con la service role.
--
-- La causa de fondo es el privilegio por defecto: se quita, así que lo que se
-- cree de ahora en más nace cerrado. Ver también la migración 008.
-- ═══════════════════════════════════════════════════════════════════════════

begin;

do $$
declare v text;
begin
  foreach v in array array[
    'asientos_por_ejercicio','comprobantes_fecha_registro','comprobantes_saldo','comprobantes_vigentes',
    'cuentas_saldo','documentos_sin_asiento','ejercicios_resumen','libro_diario','ordenes_a_cuenta',
    'pagos_con_retenciones','presupuesto_items_calculados','presupuestos_totales','saldos_a_cuenta',
    'stock_movimientos_vigentes','stock_saldos','sumas_y_saldos'
  ] loop
    execute format('revoke all on public.%I from public, anon, authenticated', v);
    execute format('grant all on public.%I to service_role', v);
    execute format('alter view public.%I set (security_invoker = true)', v);
  end loop;
end $$;

do $$
declare r record;
begin
  for r in
    select p.oid::regprocedure as firma
    from pg_proc p join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public' and p.prokind = 'f' and p.prorettype <> 'trigger'::regtype
      and not exists (select 1 from pg_depend d where d.objid = p.oid and d.deptype = 'e')
      and (has_function_privilege('anon'::name, p.oid, 'EXECUTE')
        or has_function_privilege('authenticated'::name, p.oid, 'EXECUTE'))
  loop
    execute format('revoke all on function %s from public, anon, authenticated', r.firma);
    execute format('grant execute on function %s to service_role', r.firma);
  end loop;
end $$;

alter default privileges for role postgres in schema public revoke all on tables from anon, authenticated;
alter default privileges for role postgres in schema public revoke all on sequences from anon, authenticated;
alter default privileges for role postgres in schema public revoke execute on functions from public, anon, authenticated;

commit;
