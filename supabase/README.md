# Base de datos

Las tablas viven en el proyecto de Supabase **`pjpebibjlqjwffafzhhh`**, que es
la misma base que usa el backoffice (`products`, `orders`, `settings`…). Este
repo sólo aporta las tablas del sitio público.

## Qué agrega el sitio

| Tabla | Para qué |
|---|---|
| `leads` | Consultas del formulario, con la atribución de campaña que las originó y el ciclo comercial hasta el contrato firmado. |
| `lead_statuses` | Estados del pipeline. Es tabla y no enum a propósito: sumar un estado es un `INSERT`, no una migración. |
| `sessions` | Una fila por visita, con la atribución (gclid, UTMs, referente) que no se repite en cada evento. |
| `events` | Pageviews y clics. Es la tabla que más crece. |

`leads.session_id` es lo que cierra el circuito: permite ir del contrato
firmado hasta el anuncio que lo originó, que es lo que necesita Google Ads
para optimizar en un negocio con ciclo de venta largo.

## Cómo se aplican

No hay CLI de Supabase configurado en este repo. Las migraciones se corrieron
a mano, en orden, contra la base de producción:

```bash
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f supabase/migrations/20260803_001_leads.sql
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f supabase/migrations/20260803_002_analytics.sql
```

Son idempotentes (`create table if not exists`, `on conflict do nothing`), así
que volver a correrlas no rompe nada.

> El host directo `db.<ref>.supabase.co` es **IPv6 únicamente**. Desde una red
> sin IPv6 hay que ir por el pooler:
> `postgresql://postgres.<ref>@aws-1-<region>.pooler.supabase.com:6543/postgres`

## Acceso

Todas las tablas tienen **RLS activa y ninguna política**, igual que las del
backoffice. Eso significa que sólo la `service_role` llega a ellas: el sitio
escribe desde sus API routes del lado del servidor y el navegador nunca toca
la base directo.

Las variables están en `.env.example`.

## Pendiente

- **Retención.** `events` crece con cada pageview y no hay purga configurada.
  Con `pg_cron` (ya instalado) conviene un job mensual que borre lo anterior a
  18 meses, antes de que se llene el plan free.
- **Si el backoffice adopta migraciones versionadas**, estos archivos deberían
  mudarse ahí: la base es compartida y tener dos fuentes de verdad para el
  mismo schema termina mal.
