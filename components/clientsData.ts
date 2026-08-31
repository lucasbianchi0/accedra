/**
 * Los clientes que se muestran públicamente.
 *
 * En su propio archivo porque los usan la marquesina (cliente) y el brochure en
 * PDF (servidor). `scale` ajusta el tamaño visual de los logos cuadrados o de
 * emblema que, a igual altura, se ven más chicos que un wordmark ancho.
 */

export const clients = [
  { name: "Andreani Logística",  logo: "/logos/andreani.png",  scale: 1.15 },
  { name: "Finning",             logo: "/logos/finning.png", scale: 1 },
  { name: "CNP Seguros",         logo: "/logos/cnp.png",       scale: 1.35 },
  { name: "Banco Provincia",     logo: "/logos/provincia.svg", scale: 1 },
  { name: "Volkswagen",          logo: "/logos/volkswagen-logo-2019.png", scale: 1.3 },
  { name: "Hipódromo Argentino", logo: "/logos/hipodromo.svg", scale: 1.05 },
  { name: "Banco Macro",         logo: "/logos/banco-macro-logo-azul.png", scale: 1 },
  { name: "Mapfre",              logo: "/logos/logo-mapfre-2026.png", scale: 1 },
  { name: "Accenture",           logo: "/logos/accenture-svg.png", scale: 1 },
  { name: "Techint",             logo: "/logos/techint-logo-svg.png", scale: 1 },
  { name: "Hausler",             logo: "/logos/hausler.svg",   scale: 1 },
];
