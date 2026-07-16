// Imagen por industria para los casos de éxito (portada de card y de detalle).
const casePhoto = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1400`;

const CASE_IMG: Record<string, string> = {
  "Logística": casePhoto(4481259),
  "Salud": casePhoto(3735709),
  "Retail": casePhoto(264636),
  "Banca": casePhoto(259200),
  "Seguros": casePhoto(3760067),
  "Fintech": casePhoto(546819),
  "Industria": casePhoto(577210),
};

export const imgFor = (industry: string) => CASE_IMG[industry] ?? casePhoto(577210);
