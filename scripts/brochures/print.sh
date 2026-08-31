#!/usr/bin/env bash
#
# Imprime los brochures a PDF desde la ruta /brochure/[slug].
#
# Chrome headless y no una librería: el PDF tiene que salir del MISMO motor que
# renderiza la vista previa, o el resultado se parece pero no es igual —y los
# milímetros de una hoja A4 no perdonan un "se parece". Además evita sumar
# puppeteer (~200 MB) al repo para correr esto tres veces al año.
#
# Uso:
#   npm run dev                        # en otra terminal
#   ./scripts/brochures/print.sh       # todos
#   ./scripts/brochures/print.sh networking
#
set -euo pipefail

CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
# El dev server salta a 3001 si el 3000 está ocupado, así que se prueban los dos
# antes de fallar: acordarse del puerto no puede ser parte del procedimiento.
BASE="${BASE:-}"
if [ -z "$BASE" ]; then
  for p in 3000 3001 3002; do
    # Exige 200: `curl -f` da por bueno un 307, y en el 3000 suele haber otra app
    # que redirige al login — imprimirla daría un PDF de la pantalla equivocada.
    if [ "$(curl -s -o /dev/null -w '%{http_code}' "http://localhost:$p/brochure/institucional")" = "200" ]; then
      BASE="http://localhost:$p"
      break
    fi
  done
fi
BASE="${BASE:-http://localhost:3000}"
DEST="$(cd "$(dirname "$0")/../.." && pwd)/public/brochures"

SLUGS=("$@")
if [ ${#SLUGS[@]} -eq 0 ]; then
  SLUGS=(institucional networking firma-biometrica consultoria seguridad software-ai)
fi

if [ "$(curl -s -o /dev/null -w '%{http_code}' "$BASE/brochure/institucional")" != "200" ]; then
  echo "No hay un dev server de accedra respondiendo en $BASE — corré 'npm run dev' primero." >&2
  exit 1
fi

mkdir -p "$DEST"

for slug in "${SLUGS[@]}"; do
  out="$DEST/accedra-$slug.pdf"
  echo "→ $slug"
  # --virtual-time-budget espera a que terminen fuentes e imágenes: sin eso la
  # primera página sale con la tipografía de fallback y las fotos en blanco.
  "$CHROME" \
    --headless \
    --disable-gpu \
    --no-pdf-header-footer \
    --virtual-time-budget=15000 \
    --print-to-pdf="$out" \
    "$BASE/brochure/$slug" 2>/dev/null
  echo "  $(du -h "$out" | cut -f1)  $out"
done
