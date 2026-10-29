import { NextResponse, type NextRequest } from "next/server";

import { COOKIE_EQUIPO, claveDeEquipo, cookieDeEquipo } from "@/lib/chat/alertas";
import { iguales } from "@/lib/chat/guardia";

export const runtime = "nodejs";

/**
 * Marca este navegador como del equipo: sus pedidos no generan alertas de
 * seguridad (ver `lib/chat/alertas.ts`) y la analítica lo cuenta como interno
 * (`?interno=1`). Se entra una vez por navegador con el enlace que tiene la
 * clave; `?salir=1` lo desmarca.
 *
 * La clave es `EQUIPO_CLAVE` (16 caracteres o más): el enlace es
 * `/api/equipo?clave=<EQUIPO_CLAVE>`. Sin ella esto es un 404 más. La cookie
 * que deja va firmada con la clave del servidor: no se puede fabricar.
 */
const VIGENCIA_MS = 365 * 24 * 60 * 60 * 1000;

export function GET(req: NextRequest) {
  const destino = new URL("/", req.url);

  if (req.nextUrl.searchParams.get("salir") === "1") {
    destino.searchParams.set("interno", "0");
    const res = NextResponse.redirect(destino);
    res.cookies.delete(COOKIE_EQUIPO);
    return res;
  }

  const vence = Date.now() + VIGENCIA_MS;
  const valor = cookieDeEquipo(vence);
  if (!valor || !iguales(claveDeEquipo(), req.nextUrl.searchParams.get("clave"))) {
    return new Response("Not found", { status: 404 });
  }

  destino.searchParams.set("interno", "1");
  const res = NextResponse.redirect(destino);
  res.cookies.set(COOKIE_EQUIPO, valor, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(vence),
  });
  return res;
}
