import PresenceSection from "@/components/maps/PresenceSection";

export const metadata = {
  title: "Preview · Globo 3D de presencia — Accedra",
};

export default function PreviewMapaPage() {
  return (
    <main className="bg-[#07101D] min-h-screen">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12 pt-20 pb-2 text-center">
        <p className="text-xs font-semibold tracking-[0.22em] uppercase text-blue-400 mb-3">
          Preview interno
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
          Presencia · Globo 3D de puntos
        </h1>
        <p className="text-gray-400 text-sm max-w-xl mx-auto">
          Globo WebGL (Cobe) enfocado en Argentina, con marcadores y arcos desde el HQ.
          Tocá un chip de ciudad: el globo rota hacia ella y cambia el caso.
        </p>
      </div>

      <PresenceSection />
    </main>
  );
}
