-- Visitante recurrente: el id que sobrevive a la sesión.
--
-- POR QUE HACE FALTA
--
-- `sessions.id` vence a los 30 minutos de inactividad, que es la convención
-- correcta para "una visita". Pero eso deja una pregunta sin responder: si la
-- misma persona vuelve mañana, es una fila nueva y nada la ata a la anterior.
--
-- En B2B eso no es un detalle. El ciclo es largo —alguien ve el anuncio, se va,
-- vuelve dos veces y recién a la tercera pide el brochure— y sin este id las
-- tres visitas se cuentan como tres personas distintas. Con él se puede
-- responder lo que hoy no se puede:
--
--   · cuánta gente vuelve, y a los cuántos días
--   · cuántas visitas hace alguien antes de convertir
--   · si el tráfico de una campaña vuelve o entra y no regresa nunca
--
-- POR QUE NO ES UNA COOKIE
--
-- Mismo criterio que el resto del tracking: un UUID aleatorio en localStorage,
-- sin cookie, sin fingerprint y sin viajar a ningún tercero. No identifica a una
-- persona ni se comparte entre sitios; sólo dice "este navegador ya estuvo acá".
-- Si el visitante limpia el almacenamiento, se vuelve uno nuevo — y está bien:
-- es una métrica de comportamiento agregado, no un padrón.
--
-- POR QUE ADMITE NULL
--
-- Las 899 sesiones que ya están en la tabla no lo tienen, y las que lleguen con
-- localStorage bloqueado tampoco. Un default generado en la base sería peor que
-- null: inventaría un visitante distinto por cada visita y haría que la tasa de
-- recurrencia se lea como cero cuando en realidad es desconocida.

alter table public.sessions
  add column if not exists visitor_id uuid;

comment on column public.sessions.visitor_id is
  'Navegador que originó la visita. Persiste entre sesiones (localStorage, sin vencimiento). Null en las sesiones anteriores a esta columna y cuando el almacenamiento está bloqueado.';

-- La consulta típica es "todas las visitas de este visitante, en orden": el
-- índice compuesto la resuelve sin tocar las filas sin id.
create index if not exists sessions_visitante_idx
  on public.sessions (visitor_id, created_at)
  where visitor_id is not null;
