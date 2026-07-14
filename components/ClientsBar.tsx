"use client";

// scale ajusta el tamaño visual de logos cuadrados/emblema que, a igual altura,
// se ven más chicos que un wordmark ancho.
const clients = [
  { name: "Andreani Logística",  logo: "/logos/andreani.svg",  scale: 1 },
  { name: "Finning",             logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Finning.svg/250px-Finning.svg.png", scale: 1 },
  { name: "CNP Seguros",         logo: "/logos/cnp.png",       scale: 1.35 },
  { name: "Banco Provincia",     logo: "/logos/provincia.svg", scale: 1 },
  { name: "Volkswagen",          logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Volkswagen_logo_2019.svg/250px-Volkswagen_logo_2019.svg.png", scale: 1.3 },
  { name: "Hipódromo Argentino", logo: "/logos/hipodromo.svg", scale: 1.05 },
  { name: "Banco Macro",         logo: "https://commons.wikimedia.org/wiki/Special:FilePath/Banco%20macro%20logo%20azul.svg?width=240", scale: 1 },
  { name: "Mapfre",              logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Logo_Mapfre_2026.svg/250px-Logo_Mapfre_2026.svg.png", scale: 1 },
  { name: "Accenture",           logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Accenture.svg/250px-Accenture.svg.png", scale: 1 },
  { name: "Techint",             logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Techint_logo.svg/250px-Techint_logo.svg.png", scale: 1 },
  { name: "Hausler",             logo: "/logos/hausler.svg",   scale: 1 },
];

export default function ClientsBar() {
  const doubled = [...clients, ...clients];

  return (
    <section id="clientes" className="py-10 overflow-hidden" style={{ background: "#F1F5F9" }}>
      <div className="relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#F1F5F9] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#F1F5F9] to-transparent z-10 pointer-events-none" />

        <div className="flex w-max animate-marquee">
          {doubled.map((client, i) => (
            <div key={i} className="flex-shrink-0 mx-4 sm:mx-7">
              <div className="h-12 sm:h-16 flex items-center justify-center w-32 sm:w-44">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={client.logo}
                  alt={client.name}
                  className="w-auto object-contain"
                  style={{
                    height: `calc(clamp(22px, 3.2vw, 34px) * ${client.scale ?? 1})`,
                    maxWidth: "160px",
                    opacity: 0.85,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
