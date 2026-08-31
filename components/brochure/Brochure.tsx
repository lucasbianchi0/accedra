/**
 * El brochure impreso.
 *
 * Componente de servidor, sin una línea de interactividad: el destino es papel.
 * Todo lo que en la web es hover, reveal o video, acá es su estado final quieto.
 *
 * Tres reglas:
 *
 *  1. El contenido se importa, no se copia. Titular, bajada, capacidades, marcas
 *     y casos salen de `solutionsData.ts`; los clientes y partners, de sus
 *     archivos de datos. En `brochureData.ts` vive sólo lo que la web no tiene:
 *     el párrafo largo de cada capacidad y el brochure institucional.
 *
 *  2. Una idea por página. Si una página tiene dos cosas para decir, son dos
 *     páginas. El papel es barato; la atención del que lo abre, no.
 *
 *  3. Toda página lleva su capa de atmósfera. `Hoja` la pone sola, así que no hay
 *     forma de agregar una página y que salga con el fondo plano.
 */

import type { CSSProperties, ReactNode } from "react";
import { SOLUTIONS, type Solution } from "@/components/solutions/solutionsData";
import { TECH_LOGOS } from "@/components/solutions/techLogos";
import { partners } from "@/components/partnersData";
import { clients } from "@/components/clientsData";
import {
  CIFRAS,
  DETALLE_CAPACIDAD,
  EMPRESA,
  ENTREGABLES,
  INSTITUCIONAL,
  PARTNERS_EXTRA,
} from "@/components/brochure/brochureData";

/* ── Piezas de página ─────────────────────────────────────────────────────── */

/**
 * Completa una lista hasta el múltiplo de `cols` para que el panel de logos cierre
 * como rectángulo.
 *
 * Sin esto, once clientes en cuatro columnas dejan la última fila a tres y el
 * panel queda con un mordisco en la esquina — que no se lee como "faltan logos"
 * sino como un error de maquetado. Las celdas de relleno van vacías: dentro de un
 * panel blanco, un hueco blanco no es nada.
 */
function completar<T>(items: T[], cols: number): (T | null)[] {
  const faltan = (cols - (items.length % cols)) % cols;
  return [...items, ...Array<null>(faltan).fill(null)];
}

/**
 * La capa de luz.
 *
 * Las lámparas y la grilla en perspectiva son las de `AmbientLight.tsx`, con sus
 * colores y opacidades. La trama de puntos que traía el sitio se sacó: en pantalla
 * da textura, pero impresa a 300 dpi se lee como suciedad sobre el papel.
 *
 * `piso` se reserva para las páginas con aire abajo: encendido debajo de un bloque
 * de texto ensucia la lectura en vez de dar profundidad.
 */
function Atmosfera({ piso }: { piso?: boolean }) {
  return (
    <div className="amb" aria-hidden>
      <span className="l1" />
      <span className="l2" />
      <span className="l3" />
      {piso && <span className="piso" />}
      <span className="vineta" />
    </div>
  );
}

/** Una página: atmósfera, contenido y folio. El folio se numera solo desde el
 *  índice del array, así que agregar o sacar una página no descuadra el resto. */
function Hoja({
  n,
  total,
  seccion,
  children,
  piso,
  arriba,
  claro,
}: {
  n: number;
  total: number;
  seccion: string;
  children: ReactNode;
  piso?: boolean;
  /** Por defecto el contenido va centrado en la hoja. `arriba` es para las
   *  páginas largas, donde centrar dejaría el bloque cortado. */
  arriba?: boolean;
  /** Invierte la página a fondo claro. Va sin atmósfera: las lámparas están
   *  calculadas para levantar el navy y sobre blanco sólo lo ensucian. */
  claro?: boolean;
}) {
  return (
    <section className={claro ? "page claro" : "page"}>
      {!claro && <Atmosfera piso={piso} />}
      <div className={arriba ? "caja arriba" : "caja"}>{children}</div>
      <div className="folio">
        <span>{seccion}</span>
        <span className="num">
          {String(n).padStart(2, "0")} — {String(total).padStart(2, "0")}
        </span>
      </div>
    </section>
  );
}

/**
 * La portada: logotipo, un titular grande y un pie. Nada más.
 *
 * Las cifras y los logos que tuvo en versiones anteriores se fueron adentro. Una
 * portada que intenta decir todo no dice nada — y amontonada contra el borde
 * inferior, que es como quedaba al copiar el hero de la web, se ve rota.
 */
function Portada({
  eyebrow,
  title,
  highlight,
  subtitle,
  foto,
  pie,
}: {
  eyebrow: string;
  title: string;
  highlight: string;
  subtitle: string;
  foto: string;
  pie: string;
}) {
  return (
    <section className="page cover">
      <div className="cover-foto">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={foto} alt="" />
      </div>
      <Atmosfera />

      <div className="cover-marca">
        <span className="cover-word">ACCEDRA</span>
        <span className="cover-sub">IT SOLUTIONS</span>
      </div>

      <div className="cover-bloque">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="cover-h1">
          {title} <span className="grad">{highlight}</span>
        </h1>
        <p className="cover-bajada">{subtitle}</p>
      </div>

      {/* Las cifras vuelven a la tapa, abajo y sin recuadro: son la primera
          prueba que ve alguien que no nos conoce. */}
      <div className="cover-cifras">
        {CIFRAS.map((c) => (
          <div className="cover-cifra" key={c.label}>
            <b>{c.valor}</b>
            <span>{c.label}</span>
          </div>
        ))}
      </div>

      <div className="cover-pie">
        <span>{pie}</span>
        <span>{EMPRESA.sitio}</span>
      </div>
    </section>
  );
}

/* ── El cierre, común a los dos brochures ─────────────────────────────────── */

/*
 * Las tres últimas páginas —cómo trabajamos, quiénes nos eligen, la propuesta—
 * son las mismas en el institucional y en el de cada solución, y por eso viven
 * acá y no adentro de uno de los dos.
 *
 * El motivo no es ahorrar líneas: es que ese cierre es lo que la empresa
 * responde siempre igual —cómo encara el trabajo, quién ya la eligió y cómo
 * seguir—, y con dos copias del bloque el teléfono se actualiza en una sola.
 */

/** Cómo trabajamos: las cuatro etapas, de punta a punta. */
function PaginaModelo() {
  return (
    <div>
      <p className="eyebrow">{INSTITUCIONAL.modeloTitulo}</p>
      <div className="pasos">
        {INSTITUCIONAL.modelo.map((p, i) => (
          <div className="paso" key={p.titulo}>
            <span className="paso-n">{String(i + 1).padStart(2, "0")}</span>
            <div>
              <h4>{p.titulo}</h4>
              <p>{p.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Quiénes nos eligen. Tres columnas y no cuatro: son once logos y a esta escala
 *  se leen los nombres de las marcas, que es de lo que se trata. */
function PaginaClientes() {
  return (
    <div>
      <p className="eyebrow">Nos eligen</p>
      <div className="muro">
        {completar(clients.slice(0, 12), 3).map((c, i) => (
          <div key={c ? c.name : `v${i}`}>
            {c && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={c.logo} alt={c.name} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * El cierre: titular, una línea y los dos datos para responder.
 *
 * Va desnudo a propósito. Las tres columnas de condiciones que llevaba el
 * brochure de solución —sin cargo, sin compromiso, en 24 horas— repetían con
 * letra chica lo que el párrafo ya dice, y llenar de letra chica la última
 * página es la forma más rápida de que se cierre sin leerla.
 */
function PaginaPropuesta() {
  return (
    <div className="propuesta minima">
      <p className="eyebrow centro">La propuesta</p>
      <h2>{INSTITUCIONAL.cierreTitulo}</h2>
      <p>{INSTITUCIONAL.cierreTexto}</p>
      <div className="contacto">
        <div>
          <span>Teléfono</span>
          <b>{EMPRESA.telefono}</b>
        </div>
        <div>
          <span>Email</span>
          <b>{EMPRESA.email}</b>
        </div>
      </div>
    </div>
  );
}

/* ── Brochure de solución ─────────────────────────────────────────────────── */

/**
 * El recorrido: portada con las cifras → qué incluye → cada capacidad en detalle
 * → con quién trabajamos → cómo trabajamos → quiénes nos eligen → la propuesta.
 *
 * Termina con las mismas tres páginas que el institucional. El caso de éxito que
 * ocupaba el anteúltimo lugar se sacó: contado en una sola página, sin métricas y
 * sin el contexto de la reunión, competía con el cierre en vez de sostenerlo —y
 * el caso vive en la web, donde se lee con los números al lado. Lo que queda en
 * su lugar es lo que el que recibe el PDF necesita para decidir seguir: cómo se
 * encara el trabajo, quién ya lo eligió y cómo llamar.
 */
export function BrochureSolucion({ slug }: { slug: string }) {
  const s: Solution = SOLUTIONS[slug];
  const caso = s.cases[0];
  const entregables = ENTREGABLES[slug];
  const detalle = DETALLE_CAPACIDAD[slug] ?? {};
  const seccion = s.name;

  const estilo = { "--accent": s.accent, "--accent-rgb": s.accentRgb } as CSSProperties;

  // Las capacidades de a dos por página: seis en una hoja obligaba a un cuerpo de
  // ocho puntos, que es lo que hacía que la página se leyera como un manual.
  const pares: (typeof s.capabilities)[] = [];
  for (let i = 0; i < s.capabilities.length; i += 2) pares.push(s.capabilities.slice(i, i + 2));

  const marcas = s.brands.map((k) => TECH_LOGOS[k]).filter(Boolean);
  // Nueve entran justas en el panel de 3×3; el resto se nombra debajo.
  const enPanel = marcas.slice(0, 9);
  const resto = marcas.slice(9).map((m) => m.name);

  const paginas: ReactNode[] = [
    /* 02 · qué incluye */
    <div key="ind">
      <p className="eyebrow">Qué incluye</p>
      <div className="indice">
        {s.capabilities.map((c) => {
          const Icon = c.icon;
          return (
            <div className="indice-item" key={c.title}>
              <Icon />
              <h4>{c.title}</h4>
              <i />
            </div>
          );
        })}
      </div>
    </div>,

    /* 03… · cada capacidad en detalle */
    ...pares.map((par, i) => (
      <div className="detalles" key={`cap${i}`}>
        {par.map((c, j) => (
          <article className="detalle" key={c.title}>
            <span className="detalle-n">{String(i * 2 + j + 1).padStart(2, "0")}</span>
            <h3>{c.title}</h3>
            {/* El párrafo largo si está escrito; si no, la línea de la web — una
                capacidad nueva se muestra igual, no rompe la página. */}
            <p>{detalle[c.title] ?? c.desc}</p>
          </article>
        ))}
      </div>
    )),

    /* Con quién trabajamos */
    <div key="marcas">
      <p className="eyebrow">Con quién trabajamos</p>
      <div className="muro">
        {completar(enPanel, 3).map((m, i) => (
          <div key={m ? m.name : `v${i}`}>
            {m && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={m.logo} alt={m.name} />
            )}
          </div>
        ))}
      </div>
      {resto.length > 0 && <p className="linea-marcas">{resto.join("   ·   ")}</p>}
    </div>,
  ];

  // Sin caso publicable en la web, el entregable ocupa ese lugar: la solución que
  // no puede mostrar un cliente tiene que mostrar, al menos, qué se lleva quien
  // la contrata.
  const sinCaso = !caso && entregables && (
    <div key="entreg">
      <p className="eyebrow">{entregables.titulo}</p>
      <div className="pasos">
        {entregables.items.map((e, i) => (
          <div className="paso" key={e.titulo}>
            <span className="paso-n">{String(i + 1).padStart(2, "0")}</span>
            <div>
              <h4>{e.titulo}</h4>
              <p>{e.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (sinCaso) paginas.push(sinCaso);

  // El cierre, igual que en el institucional.
  paginas.push(
    <PaginaModelo key="modelo" />,
    <PaginaClientes key="clientes" />,
    <PaginaPropuesta key="fin" />
  );

  // Las dos hojas de logos van invertidas a fondo claro: los logos de marca
  // vienen hechos para blanco, y sobre navy hay que encerrar cada uno en su
  // recuadro. Se ubican por `key` para que reordenar la lista no las descoloque.
  const claras = new Set(["marcas", "clientes"]);
  const esClara = (n: ReactNode) => claras.has(String((n as { key?: string }).key));

  // Portada + interiores.
  const total = paginas.length + 1;

  return (
    <div className="bro" style={estilo}>
      <Portada
        eyebrow={s.eyebrow}
        title={s.title}
        highlight={s.highlight}
        subtitle={s.subtitle}
        foto={s.heroImage}
        pie={`Brochure de solución · ${s.name}`}
      />

      {paginas.map((nodo, i) => (
        <Hoja
          key={i}
          n={i + 2}
          total={total}
          seccion={seccion}
          piso={i === 0}
          claro={esClara(nodo)}
        >
          {nodo}
        </Hoja>
      ))}
    </div>
  );
}

/* ── Brochure institucional ───────────────────────────────────────────────── */

/**
 * Seis páginas: portada → las cinco soluciones → partners → quiénes nos eligen →
 * cómo trabajamos → la propuesta.
 *
 * Es un brochure de primer contacto, así que no lleva casos ni la sección de
 * diferenciales: quien lo recibe todavía no sabe qué necesita, y lo que tiene que
 * quedarle es el alcance y el respaldo. Los casos se cuentan en el brochure de la
 * solución que le interese, que es donde además tienen contexto.
 */
export function BrochureInstitucional() {
  const d = INSTITUCIONAL;
  const seccion = "Institucional";

  /**
   * El muro de partners: los quince con relación comercial primero, y detrás los
   * fabricantes que aportan las otras soluciones.
   *
   * Se filtra por dos cosas, y las dos son defensivas:
   *
   *   · Sin archivo de logo no entra. Hay entradas de `TECH_LOGOS` que sólo
   *     tienen nombre —Furukawa, Siemon— y renderizarlas deja el ícono de imagen
   *     rota en medio de la hoja de partners, que es la peor página posible para
   *     eso. Los que quedan afuera se nombran en la línea de texto.
   *
   *   · Un logo repetido tampoco. `CommScope` y `SYSTIMAX` apuntan al mismo
   *     archivo, así que en la grilla se veían dos celdas idénticas.
   *
   * El cruce con `partners` va por el nombre que se muestra y no por la clave:
   * `partnersData` dice "HPE Aruba" donde `brands` dice "Aruba".
   */
  const nombres = new Set<string>();
  const archivos = new Set<string>();
  const marcas: { name: string; logo: string }[] = [];
  const sinLogo: string[] = [];

  for (const m of [
    ...partners.map((p) => ({ name: p.name, logo: p.logo })),
    ...PARTNERS_EXTRA.map((k) => TECH_LOGOS[k]).filter(Boolean),
  ]) {
    if (nombres.has(m.name)) continue;
    nombres.add(m.name);
    if (!m.logo) {
      sinLogo.push(m.name);
      continue;
    }
    if (archivos.has(m.logo)) continue;
    archivos.add(m.logo);
    marcas.push({ name: m.name, logo: m.logo });
  }

  const paginas: ReactNode[] = [
    /* 02 · las cinco soluciones, cada una con link a su landing */
    <div key="soluciones">
      <p className="eyebrow">Cinco soluciones</p>
      <div className="cards-sol">
        {d.soluciones.map((s) => (
          <a
            className="card-sol"
            key={s.slug}
            href={`https://www.accedra.com.ar/soluciones/${s.slug}`}
            style={{ "--c": s.accent } as CSSProperties}
          >
            <span>
              <h4>{s.nombre}</h4>
              {/* La descripción sale del `intro` de la landing, no de una copia:
                  son las tres líneas que ya explican la solución en el sitio, y
                  así el institucional no puede quedar diciendo otra cosa. El
                  `desc` corto queda de respaldo por si la solución no existiera
                  en `SOLUTIONS`. */}
              <p>{SOLUTIONS[s.slug]?.intro ?? s.desc}</p>
            </span>
            <span className="ir">
              <span className="btn">Ver solución →</span>
            </span>
          </a>
        ))}
      </div>
      {/* La dirección va una sola vez y no dentro de cada card: repetida cinco
          veces obligaba a una columna derecha tan ancha que el texto no entraba.
          En pantalla los botones son links; en papel, esta línea es el link. */}
      <p className="cards-pie">Cada solución, en detalle: accedra.com.ar/soluciones</p>
    </div>,

    /* 03 · partners */
    <div key="partners">
      <p className="eyebrow">Partner certificado de</p>
      <div className="muro cuatro">
        {completar(marcas, 4).map((m, i) => (
          <div key={m ? m.name : `v${i}`}>
            {m && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={m.logo} alt={m.name} />
            )}
          </div>
        ))}
      </div>
      {sinLogo.length > 0 && <p className="linea-marcas">{sinLogo.join("   ·   ")}</p>}
    </div>,

    /* 04, 05 y 06 · el cierre, el mismo que el brochure de solución */
    <PaginaModelo key="modelo" />,
    <PaginaClientes key="clientes" />,
    <PaginaPropuesta key="fin" />,
  ];

  // Las dos hojas de logos van invertidas a fondo claro: los logos de marca vienen
  // hechos para blanco, y sobre navy hay que encerrar cada uno en su recuadro. Se
  // ubican por `key` para que reordenar la lista no las descoloque.
  const claras = new Set(["partners", "clientes"]);
  const esClara = (n: ReactNode) => claras.has(String((n as { key?: string }).key));
  const total = paginas.length + 1;

  return (
    <div className="bro">
      <Portada
        eyebrow={d.eyebrow}
        title={d.title}
        highlight={d.highlight}
        subtitle={d.subtitle}
        foto={d.heroImage}
        pie="Presentación institucional"
      />
      {paginas.map((nodo, i) => (
        <Hoja key={i} n={i + 2} total={total} seccion={seccion} claro={esClara(nodo)}>
          {nodo}
        </Hoja>
      ))}
    </div>
  );
}
