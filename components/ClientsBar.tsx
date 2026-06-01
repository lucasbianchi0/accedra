"use client";

const clients = [
  { name: "Accenture",      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Accenture.svg/250px-Accenture.svg.png" },
  { name: "YPF",            logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/YPF_S.A._logo.svg/250px-YPF_S.A._logo.svg.png" },
  { name: "BBVA",           logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/BBVA_logo_2025.svg/250px-BBVA_logo_2025.svg.png" },
  { name: "Santander",      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Banco_Santander_Logotipo.svg/250px-Banco_Santander_Logotipo.svg.png" },
  { name: "Mercado Libre",  logo: "https://upload.wikimedia.org/wikipedia/en/thumb/f/fa/Mercado_Libre_logo_%28Spanish_version%29.svg/250px-Mercado_Libre_logo_%28Spanish_version%29.svg.png" },
  { name: "Mapfre",         logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Logo_Mapfre_2026.svg/250px-Logo_Mapfre_2026.svg.png" },
  { name: "Finning",        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Finning.svg/250px-Finning.svg.png" },
  { name: "Banco Galicia",  logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Grupo_Financiero_Galicia.svg/250px-Grupo_Financiero_Galicia.svg.png" },
  { name: "Techint",        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Techint_logo.svg/250px-Techint_logo.svg.png" },
  { name: "Andreani",       logo: "/logos/andreani.svg" },
  { name: "Banco Provincia", logo: "/logos/provincia.svg" },
];

export default function ClientsBar() {
  const doubled = [...clients, ...clients];

  return (
    <section id="clientes" className="py-10 overflow-hidden" style={{ background: "#F1F5F9" }}>
      <div className="relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#F1F5F9] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#F1F5F9] to-transparent z-10 pointer-events-none" />

        <div className="flex animate-marquee">
          {doubled.map((client, i) => (
            <div key={i} className="flex-shrink-0 mx-10">
              <div className="h-14 flex items-center justify-center w-44">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={client.logo}
                  alt={client.name}
                  className="max-h-10 max-w-36 w-auto h-auto object-contain"
                  style={{ opacity: 0.85 }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
