import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Cliente de Supabase para uso EXCLUSIVO del lado del servidor.
 *
 * Usa la service role key, que saltea RLS por completo. Las tablas del proyecto
 * tienen RLS activa sin políticas, así que esta es la única vía de acceso — y
 * por eso mismo esta key no puede filtrarse nunca al navegador. Las variables
 * NO llevan prefijo NEXT_PUBLIC_ justamente para que el bundler falle si alguien
 * intenta importar este módulo desde un componente cliente.
 *
 * Se elige supabase-js (PostgREST sobre HTTP) en vez de una conexión Postgres
 * directa a propósito: en serverless cada invocación abriría su propia conexión
 * y agotaría el pool, tumbando también al backoffice que comparte la base.
 */

let cliente: SupabaseClient | null = null;

/**
 * Devuelve el cliente, o `null` si falta configuración.
 *
 * Devolver null en vez de lanzar es deliberado: si Supabase no está configurado,
 * el formulario tiene que seguir enviando el mail. Perder la persistencia es
 * malo; perder el lead entero es peor.
 */
export function getSupabaseAdmin(): SupabaseClient | null {
  if (cliente) return cliente;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;

  cliente = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cliente;
}
