-- ═══════════════════════════════════════════════════════════════════════════
-- `purgar_analitica` corre como security definer (salta RLS) y, como toda
-- función nueva en Postgres, quedó ejecutable por `public`: con la anon key
-- —que el backoffice expone en el navegador— cualquiera podía llamarla por
-- PostgREST (`/rest/v1/rpc/purgar_analitica`). Sólo borra lo que ya vence por
-- la política de retención, pero una función que borra datos no la dispara
-- un anónimo. La sigue corriendo pg_cron, como postgres.
-- ═══════════════════════════════════════════════════════════════════════════

revoke all on function public.purgar_analitica() from public, anon, authenticated;
