import { Mail, Phone, MapPin, ExternalLink } from "lucide-react";

const links = {
  Servicios: ["Networking", "Seguridad IT", "Firma Biométrica", "Consultoría Microsoft"],
  Empresa: ["Sobre Accedra", "Partners", "Clientes", "Contacto"],
};

export default function Footer() {
  return (
    <footer className="bg-[#07101D] border-t border-white/5">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12 py-12 lg:py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-14">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="mb-5">
              <span className="text-2xl font-bold text-white tracking-widest">ACCEDRA</span>
              <span className="block text-[10px] font-medium tracking-[0.25em] text-blue-400 uppercase mt-0.5">
                IT Solutions
              </span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs mb-6">
              Proveedor integral de infraestructura, servicios y proyectos de tecnología para las empresas líderes de Argentina. 15 años, 400+ proyectos.
            </p>
            <div className="flex gap-3">
              <a
                href="https://www.linkedin.com/company/accedra"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/5 hover:bg-blue-600/30 border border-white/10 hover:border-blue-500/40 flex items-center justify-center transition-all"
              >
                <span className="text-gray-400 text-xs font-bold">in</span>
              </a>
              <a
                href="https://www.facebook.com/accedra"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/5 hover:bg-blue-600/30 border border-white/10 hover:border-blue-500/40 flex items-center justify-center transition-all"
              >
                <span className="text-gray-400 text-xs font-bold">f</span>
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <h4 className="text-white font-semibold text-sm mb-5 tracking-wide">{title}</h4>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact info bar */}
        <div className="border-t border-white/5 pt-8 grid sm:grid-cols-3 gap-6 mb-8">
          <div className="flex items-center gap-3">
            <MapPin size={14} className="text-blue-400 flex-shrink-0" />
            <span className="text-gray-500 text-xs">Irala 1950, 2° piso · CABA, Argentina</span>
          </div>
          <div className="flex items-center gap-3">
            <Phone size={14} className="text-blue-400 flex-shrink-0" />
            <span className="text-gray-500 text-xs">(+54 11) 5365-9887</span>
          </div>
          <div className="flex items-center gap-3">
            <Mail size={14} className="text-blue-400 flex-shrink-0" />
            <span className="text-gray-500 text-xs">info@accedra.com.ar</span>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-600 text-xs">
            © {new Date().getFullYear()} Accedra S.A. Todos los derechos reservados.
          </p>
          <p className="text-gray-700 text-xs">
            Hecho con precisión en Buenos Aires, Argentina.
          </p>
        </div>
      </div>
    </footer>
  );
}
