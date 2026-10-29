import { initBotId } from "botid/client/core";

/**
 * Vercel BotID: un desafío invisible que el navegador resuelve al cargar el
 * sitio y adjunta a los POST de esta lista. Del lado del servidor lo verifica
 * `esBot()` (lib/chat/guardia.ts). Un script que le pega directo a la API no lo
 * trae, así que no puede gastar tokens del asistente ni cargar leads.
 *
 * Si se agrega una ruta acá, su handler tiene que llamar a `esBot()`; y una
 * ruta que llama a `esBot()` sin estar acá rechaza a todos en producción.
 */
initBotId({
  protect: [
    { path: "/api/chat", method: "POST" },
    { path: "/api/chat/contacto", method: "POST" },
    { path: "/api/chat/relevamiento", method: "POST" },
  ],
});
