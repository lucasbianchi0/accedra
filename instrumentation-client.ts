import { initBotId } from "botid/client/core";

/**
 * Vercel BotID: un desafío invisible que el navegador resuelve al cargar el
 * sitio y adjunta a los POST de esta lista. Del lado del servidor lo verifica
 * `esBot()` (lib/chat/guardia.ts). Un script que le pega directo a la API no lo
 * trae, así que no puede gastar tokens del asistente, cargar leads ni usarnos
 * para mandarle correo a terceros.
 *
 * Si se agrega una ruta acá, su handler tiene que llamar a `esBot()`; y una
 * ruta que llama a `esBot()` sin estar acá rechaza a todos en producción.
 */
initBotId({
  protect: [
    { path: "/api/chat", method: "POST" },
    { path: "/api/chat/contacto", method: "POST" },
    { path: "/api/chat/relevamiento", method: "POST" },
    { path: "/api/contact", method: "POST" },
    { path: "/api/brochure", method: "POST" },
    { path: "/api/eventos/inscripcion", method: "POST" },
    { path: "/api/popup/lead", method: "POST" },
  ],
});
