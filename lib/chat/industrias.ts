import { Code2, Factory, FlaskConical, Landmark, Pickaxe, ShieldCheck, ShoppingBag, Truck, type LucideIcon } from "lucide-react";

/**
 * Las industrias de los chips de Accedra AI y los ejemplos que se escriben
 * solos en el campo.
 *
 * Los ejemplos van en primera persona y con un dato concreto (sucursales,
 * depósitos, metros) porque son el modelo de mensaje que mejor funciona: le
 * muestran a la persona qué contar sin un párrafo de instrucciones. Cubren las
 * cinco soluciones a propósito —redes, firma, datos, seguridad, IA y código—
 * para que en pocos segundos se vea todo lo que se puede preguntar.
 *
 * `frase` es cómo se presenta la persona cuando eligió el chip: se antepone al
 * mensaje si no lo dijo ella, así el asistente arranca sabiendo el rubro.
 */

export type Industria = {
  id: string;
  label: string;
  icono: LucideIcon;
  frase: string;
  ejemplos: string[];
};

export const INDUSTRIAS: Industria[] = [
  {
    id: "banca",
    label: "Banca",
    icono: Landmark,
    frase: "Somos un banco.",
    ejemplos: [
      "Tenemos 80 sucursales y queremos dejar de imprimir los contratos…",
      "Necesitamos que los clientes firmen el alta desde el celular…",
    ],
  },
  {
    id: "salud",
    label: "Salud",
    icono: FlaskConical,
    frase: "Somos un laboratorio / institución de salud.",
    ejemplos: [
      "Somos un laboratorio y los resultados viven en planillas de Excel…",
      "Las sedes de la clínica no comparten la información a tiempo…",
    ],
  },
  {
    id: "logistica",
    label: "Logística",
    icono: Truck,
    frase: "Somos una empresa de logística.",
    ejemplos: [
      "Tenemos 12 depósitos y el WiFi se cae cuando escanean…",
      "Abrimos un centro de distribución y hay que conectarlo…",
    ],
  },
  {
    // Minería va arriba: es donde Accedra tiene un caso propio (Finning) y la
    // conectividad satelital que casi nadie más integra.
    id: "mineria",
    label: "Minería",
    icono: Pickaxe,
    frase: "Somos una empresa minera.",
    ejemplos: [
      "El yacimiento no tiene fibra y el enlace satelital se corta…",
      "Necesitamos WiFi en el taller y en el playón de la mina…",
    ],
  },
  {
    id: "industria",
    label: "Industria",
    icono: Factory,
    frase: "Somos una empresa industrial.",
    ejemplos: [
      "Vamos a cablear una planta nueva de 4.000 m²…",
      "Las máquinas generan datos pero nadie los mira…",
    ],
  },
  {
    id: "retail",
    label: "Retail",
    icono: ShoppingBag,
    frase: "Somos una empresa de retail.",
    ejemplos: [
      "Abrimos 20 locales y cada uno tiene una red distinta…",
      "Queremos ver las ventas de todas las sucursales en un tablero…",
    ],
  },
  {
    id: "seguros",
    label: "Seguros",
    icono: ShieldCheck,
    frase: "Somos una aseguradora.",
    ejemplos: [
      "Las pólizas se firman en papel y después se escanean…",
      "Nos preocupa un ataque de ransomware y no sabemos por dónde empezar…",
    ],
  },
  {
    id: "tecnologia",
    label: "Tecnología",
    icono: Code2,
    frase: "Somos una empresa de tecnología / software.",
    ejemplos: [
      "Probamos IA en una demo y nunca llegó a producción…",
      "Necesitamos integrar nuestro ERP con un sistema a medida…",
    ],
  },
];

/** Sin industria elegida: un ejemplo de cada una, intercalados. */
export const EJEMPLOS_MEZCLADOS: string[] = [0, 1].flatMap((i) => INDUSTRIAS.map((ind) => ind.ejemplos[i]));
