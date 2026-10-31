-- ═══════════════════════════════════════════════════════════════════════════
-- Las tablas de `public` tenían todos los permisos para `anon` y `authenticated`,
-- los de fábrica de Supabase. Lo único que las cerraba era RLS sin políticas:
-- apagar RLS en una sola tabla la dejaba abierta con la clave pública.
--
-- El sitio y el backoffice leen y escriben con la service role, que no se toca.
-- Lo que se cree de ahora en más ya nace cerrado: ver la migración 009.
-- ═══════════════════════════════════════════════════════════════════════════

begin;

revoke all on all tables in schema public from anon, authenticated;
revoke all on all sequences in schema public from anon, authenticated;

commit;

select jsonb_build_object(
  'tablas_con_privilegios_anon', (select count(distinct table_name) from information_schema.role_table_grants
    where table_schema = 'public' and grantee in ('anon', 'authenticated')),
  'tablas_sin_rls', (select count(*) from pg_class c join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public' and c.relkind in ('r', 'p') and not c.relrowsecurity),
  'tablas_service_role', (select count(distinct table_name) from information_schema.role_table_grants
    where table_schema = 'public' and grantee = 'service_role'),
  'cron_con_secreto_escrito', (select coalesce(jsonb_agg(jobname), '[]') from cron.job
    where command ~* 'bearer|apikey|authorization|eyJ[A-Za-z0-9_-]{10,}')
) as resultado;
