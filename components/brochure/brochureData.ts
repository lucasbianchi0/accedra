/**
 * Contenido de los brochures que NO vive en `solutionsData.ts`.
 *
 * La regla es que acá no se duplique nada: el titular, la bajada, las
 * capacidades, el proceso, los partners, los casos y los benefits salen de los
 * datos de la solución, y si mañana cambian en la web cambian en el PDF. Lo que
 * vive en este archivo es solamente lo que el brochure necesita y la landing no
 * tiene:
 *
 *   · `detalle` — el párrafo largo de cada capacidad. En la web cada una se
 *     resuelve en una línea, que es lo correcto para una card; un brochure que
 *     repite esa línea no tiene razón de existir (alcanzaba con mandar el link).
 *     Acá se nombra la tecnología concreta y se cierra en una consecuencia de
 *     negocio, que es la regla de tono de la marca.
 *
 *   · `entregables` — la página 7 de las soluciones sin caso publicable. No es
 *     un relleno: contesta la misma pregunta que contesta un caso —¿esto a mí
 *     qué me deja?— con algo verificable y que no necesita autorización de
 *     ningún cliente.
 *
 *   · El brochure institucional entero, que no tiene datos de solución detrás.
 */

/* ── Datos de la empresa ──────────────────────────────────────────────────── */

export const EMPRESA = {
  nombre: "Accedra IT Solutions",
  sitio: "www.accedra.com.ar",
  email: "info@accedra.com.ar",
  telefono: "(+54 11) 5365-9887",
  domicilio: "Irala 1950, 2° piso · CABA, Argentina",
  horario: "Lunes a viernes, 9:00 a 18:00",
};

/** Las cifras que se pueden decir en cualquier pieza sin pedir permiso. En la
 *  web animan desde cero; en un PDF estático van con el número puesto. */
export const CIFRAS = [
  { valor: "17+", label: "Años de experiencia" },
  { valor: "400+", label: "Proyectos entregados" },
  { valor: "26+", label: "Partners tecnológicos" },
  { valor: "100+", label: "Clientes activos" },
];

/* ── Capacidades: el párrafo largo ────────────────────────────────────────── */

/**
 * Indexado por slug de solución y por título exacto de la capacidad, para que
 * el día que se agregue una capacidad en `solutionsData.ts` el brochure la
 * muestre igual —con su línea corta— en lugar de romperse.
 */
export const DETALLE_CAPACIDAD: Record<string, Record<string, string>> = {
  networking: {
    "Relevamiento, cableado y certificación":
      "Relevamos sitio por sitio, proyectamos el tendido y certificamos cada boca con equipo propio. Trabajamos sobre sistemas CommScope NetConnect y SYSTIMAX, Furukawa y Siemon, en cobre categoría 6 y 6A y en fibra monomodo y multimodo, con rotulado y documentación de todo el planteo. La certificación no es un trámite: es lo que después permite reclamar la garantía extendida del fabricante y lo que hace que una falla se ubique en minutos en vez de a fuerza de probar cables.",
    "Switching & Routing":
      "Diseñamos la topología completa —núcleo, distribución y acceso— sobre Cisco Catalyst y Meraki, con routers ASR o ISR según el caudal de cada sitio. Definimos VLANs, calidad de servicio para voz y video, y redundancia con stacking y enlaces agregados. El objetivo de este diseño es concreto: que la caída de un equipo o de un enlace no se note en la operación, porque el tráfico ya está pasando por otro lado antes de que alguien levante el teléfono.",
    "Wireless interior y exterior":
      "Antes de cotizar hacemos un relevamiento con mapas de calor: dónde hay que poner cada punto de acceso, con qué potencia y en qué canal. Desplegamos Wi-Fi de alta densidad con controladoras Cisco o HPE Aruba, adentro y en playones y frentes de operación con equipos para intemperie y montaje en altura, con portales de invitados separados de la red corporativa y roaming continuo entre puntos. Es la diferencia entre un depósito donde el lector de códigos funciona en todos los pasillos y uno donde hay que caminar hasta la oficina para sincronizar.",
    "Telefonía IP · VoIP":
      "Unificamos la telefonía sobre la misma infraestructura de datos, con plataformas Cisco y Avaya, troncales SIP y ruteo por sede. Se integra con el directorio corporativo y con los sistemas de atención que ya estén funcionando. Además de bajar el costo de los enlaces telefónicos tradicionales, elimina el escenario más incómodo de una mudanza o una apertura: esperar semanas a que una operadora habilite líneas nuevas.",
    "Seguridad de red":
      "Segmentamos la red para que un equipo comprometido no vea al resto, y sumamos control perimetral con firewalls de nueva generación de Palo Alto, Check Point o SonicWall, con inspección de tráfico cifrado y control de accesos por identidad. La segmentación es el trabajo menos visible y el que más rinde el día de un incidente: define si el problema queda encerrado en un sector o si recorre la organización entera.",
    "Contingencia y continuidad":
      "La red también se cae por lo que la rodea. Dimensionamos UPS y PDUs APC by Schneider o Vertiv, ordenamos el rack, resolvemos ventilación y puesta a tierra, y dejamos caminos redundantes en los enlaces críticos. A esto se le suma el monitoreo proactivo: la mayoría de las fallas de energía y temperatura avisan antes de romper algo, y verlas a tiempo es lo que convierte una salida de servicio en una visita programada.",
  },
  "firma-biometrica": {
    "Firma manuscrita biométrica":
      "Capturamos la firma sobre tabletas Wacom certificadas, que registran mucho más que el trazo: presión, velocidad y tiempos de cada tramo. Esos parámetros se cifran y quedan vinculados de forma inalterable al documento, así que cualquier modificación posterior rompe el vínculo y queda a la vista. Es lo que separa una firma escaneada —una imagen que cualquiera copia y pega— de una con valor probatorio: ante un desconocimiento hay dinámica de trazo para peritar, y no solamente un dibujo.",
    "eSignAnywhere":
      "Es la plataforma de Namirial para armar el circuito completo: quién firma, en qué orden, qué campos son obligatorios y qué pasa si alguien rechaza. El documento se lee, se completa y se firma desde el navegador o el celular, sin instalar nada y sin que el firmante tenga que pisar una sucursal. Lo que cambia no es la firma sino el expediente: el que antes tardaba días en juntar tres firmas de tres oficinas se cierra en la misma tarde, y en todo momento se ve en qué escritorio está frenado.",
    "Factoring digital":
      "En el descuento de cheques y facturas el papel cuesta plata literal: cada día que un legajo tarda en completarse es un día más de financiación. Digitalizamos el circuito entero —alta, validación de identidad, firma de la cesión y guarda del documento— con la misma trazabilidad que después pide una auditoría. El ciclo pasa a medirse en horas en vez de días, y el legajo se reconstruye completo sin ir a buscar una carpeta a un archivo físico.",
    "Firma mobile":
      "Firma desde el teléfono del cliente, integrada al proceso que ya tenés y no como una aplicación aparte que hay que explicar. Sirve para los casos donde el firmante no va a pisar una oficina: un alta remota, la conformidad de una entrega, un consentimiento en el domicilio. La ganancia es de conversión: cada paso que obliga a alguien a imprimir, firmar y escanear es un lugar donde el trámite se abandona, y sacarlo se nota en cuántas operaciones llegan al final.",
    "Multibiometría":
      "Cuando la firma sola no alcanza para probar quién estaba del otro lado se suman factores: huella, rostro y validación de la identidad contra el documento. Cada uno se guarda como plantilla cifrada y no como imagen, así que el resguardo del dato personal no queda librado al criterio de quien lo opera. Es lo que hace sostenible el no repudio: ante un reclamo la empresa no tiene que afirmar que era el titular, muestra con qué evidencia lo verificó.",
    "Integración homogénea":
      "La firma no es algo que se use aparte: tiene que aparecer dentro del sistema donde ya trabaja la gente. Nos integramos al core, al gestor documental o al CRM que tengas, por API o por el conector que corresponda, para que el operador no cambie de pantalla ni aprenda una herramienta nueva. Es la parte del proyecto que decide si la solución se adopta o queda instalada sin usar: una firma que obliga a salir del sistema se termina resolviendo, como antes, imprimiendo.",
  },
  consultoria: {
    "Power BI":
      "Conectamos Power BI a los orígenes que ya tenés —el ERP, el CRM, planillas, bases sueltas— y construimos el modelo de datos antes que el tablero: qué es un cliente, qué es una venta, con qué fecha se corta el mes. Recién sobre eso se arman los informes, publicados en web y en celular con permisos por rol. Es la diferencia entre un tablero lindo y uno que se usa: cuando dos áreas discuten un número, el modelo dice de dónde sale cada uno.",
    "Microsoft 365 & Teams":
      "Ordenamos el ecosistema completo: identidades, licencias, correo, Teams y la política de dispositivos, con las reglas de acceso condicional que correspondan. No es instalar Office — es definir quién entra a qué, desde dónde y con qué segundo factor, y dejarlo documentado. La consecuencia práctica aparece el día que alguien se va de la empresa o pierde el teléfono: el acceso se corta en un solo lugar, sin rastrear en cuántos sistemas había quedado habilitado.",
    "Dynamics 365 & SharePoint":
      "Implementamos el CRM y la gestión documental sobre el proceso real de la empresa, no sobre el que trae el producto por defecto. Definimos etapas, campos obligatorios, permisos por área y la estructura de la biblioteca documental, con versionado y retención. El resultado que importa es de continuidad: la información del cliente y los documentos del proyecto dejan de vivir en la casilla de una persona y quedan donde el equipo los encuentra.",
    "Azure Cloud":
      "Migramos e implementamos infraestructura en Azure con el dimensionamiento hecho sobre tu consumo real y no sobre una plantilla: qué se mueve, qué conviene dejar donde está y qué se rediseña. Dejamos la gobernanza puesta desde el primer día —suscripciones, etiquetas, presupuestos con alerta y respaldo—. Es lo que evita el problema clásico de la nube: la factura que crece todos los meses sin que nadie pueda explicar qué recurso la está empujando.",
    "Power Automate":
      "Automatizamos los flujos que hoy dependen de que alguien se acuerde: aprobaciones, avisos, carga de datos de un sistema a otro, armado de expedientes. Cada flujo queda con su historial de ejecución, así que se ve qué corrió, cuándo y por qué falló. Lo que se gana no es solo tiempo: son los errores de tipeo y los pasos olvidados, que son los que después obligan a rehacer el trabajo de todo un mes.",
    "Licenciamiento & CSP":
      "Como Cloud Solution Provider vemos qué licencias tenés, cuáles siguen asignadas a gente que ya no está y cuáles están sobredimensionadas para el uso real. Sobre eso proponemos el plan correcto por perfil de usuario, con facturación consolidada y soporte de primer nivel nuestro. El ahorro se cuantifica en pesos antes de firmar nada, y en la mayoría de los casos termina financiando buena parte del proyecto que lo destapó.",
  },
  seguridad: {
    "Firewalls de nueva generación":
      "Desplegamos firewalls Palo Alto, Check Point o Cisco con la política escrita por aplicación e identidad, no por puerto: quién puede usar qué, en vez de qué números pasan. Habilitamos inspección de tráfico cifrado, que hoy es casi todo el tráfico, y dejamos el registro centralizado. La diferencia se nota al investigar un incidente: en lugar de reconstruir qué pasó a partir de direcciones IP, se lee qué usuario abrió qué aplicación y a qué hora.",
    "Protección contra malware":
      "Sumamos Cisco AMP para lo que la firma tradicional no ve: en vez de comparar contra una lista de amenazas conocidas, mira comportamiento —qué proceso escribe, qué se conecta a dónde— y retrocede el archivo cuando algo se dispara. Además guarda la trayectoria de ese archivo dentro de la red. Eso contesta la pregunta que importa después de un incidente y que casi nunca se puede contestar: por dónde entró y hasta dónde llegó.",
    "Seguridad en la nube":
      "Con Cisco Umbrella el control pasa a la capa de DNS, antes de que se establezca la conexión: el dominio malicioso no resuelve y el equipo nunca llega a hablarle. Se suma el control de aplicaciones SaaS, para ver qué servicios se están usando por fuera de lo aprobado. Protege igual al que trabaja desde la oficina y al que está en su casa, que es exactamente donde el perímetro tradicional dejó de existir.",
    "Seguridad de endpoints":
      "El endpoint es donde termina cualquier ataque, así que ahí ponemos detección y respuesta, no solo bloqueo: qué se ejecutó, con qué permisos y qué tocó después. Permite aislar un equipo de la red desde la consola, sin ir a buscarlo físicamente. En una organización con sedes o con gente remota eso es la diferencia entre contener un incidente en minutos o esperar a que alguien viaje a desconectar una máquina.",
    "Protección de email":
      "El correo sigue siendo la puerta de entrada de la mayoría de los incidentes, y el phishing dirigido no se frena con un filtro de spam. Filtramos en la puerta —adjuntos, enlaces reescritos, suplantación del dominio propio— con SPF, DKIM y DMARC configurados de verdad y no solamente declarados. Lo que se evita es el caso caro: la transferencia hecha a partir de un mail que parecía venir de un director.",
    "VPN & acceso remoto":
      "Publicamos el acceso remoto con doble factor y postura del equipo: no alcanza con la contraseña correcta, el dispositivo tiene que cumplir la condición mínima para entrar. Donde tiene sentido migramos a un esquema de acceso por aplicación en lugar de entregar toda la red. Es la corrección del atajo que dejó la pandemia: una VPN que da la red entera convierte una sola credencial robada en acceso total.",
  },
  "software-ai": {
    "Desarrollo a medida":
      "Construimos aplicaciones web y móviles sobre TypeScript, React y Node.js, con el estándar que pide un sistema que va a durar: pruebas, revisión de código, despliegue automatizado y documentación técnica. El código y el repositorio son tuyos desde el primer commit. Es la cláusula que define si dentro de tres años podés cambiar de proveedor o quedás atado al que lo escribió, y por eso se acuerda al principio y no al final.",
    "Integraciones & APIs":
      "La mayoría de los proyectos no falla en la pantalla, falla en el medio: el ERP que exporta un archivo raro, el servicio que se cae dos horas, el dato que llega duplicado. Construimos APIs con contrato explícito, reintentos, idempotencia y registro de cada intercambio. Suena a detalle técnico y es lo contrario: es lo que hace que la integración siga funcionando el día que el otro sistema tiene un mal día, sin que nadie corrija a mano.",
    "Modelos de IA / ML":
      "Trabajamos con Python y PyTorch sobre tus propios datos, y con modelos de Azure AI y OpenAI cuando conviene no entrenar nada. El primer paso siempre es el mismo: definir contra qué se mide el acierto, porque un modelo sin métrica de negocio es una demostración y no un proyecto. Después queda monitoreado en producción, que es donde aparece lo que ninguna prueba anticipa: el día que los datos cambian y el modelo empieza a equivocarse.",
    "Chatbots & Copilotos":
      "Armamos asistentes conectados al conocimiento real de la empresa —manuales, procedimientos, catálogo— con LangChain y recuperación sobre tus propios documentos, para que respondan con lo que dice tu material y no con lo que el modelo supone. Se integran al canal donde ya está la gente: el sitio, WhatsApp, Teams. La medida de éxito no es que converse bien: es cuántas consultas resuelve solo y cuántas escala a una persona con el contexto ya cargado.",
    "Data & Analytics":
      "Antes del tablero está el trabajo que nadie muestra: juntar los datos de los sistemas donde están, limpiarlos y dejarlos actualizándose solos con una frecuencia definida. Recién ahí la analítica sirve para decidir algo. El síntoma de que ese paso falta es conocido: tres áreas llegan a la reunión con tres números distintos para la misma pregunta, y la hora se va discutiendo de dónde salió cada uno.",
    "Automatización de procesos":
      "Identificamos las tareas repetitivas que hoy consumen horas —cargar datos de un sistema a otro, clasificar documentos, armar informes— y las automatizamos con software y, donde aporta, con IA. Empezamos por medir cuánto tiempo llevan hoy, para poder mostrar después cuánto se recuperó. Lo que se libera no es tiempo genérico: son las horas del equipo que sabe del negocio, gastadas en algo que no requiere saber del negocio.",
  },
};

/* ── Entregables: la página 7 sin caso ────────────────────────────────────── */

export const ENTREGABLES: Record<string, { titulo: string; intro: string; items: { titulo: string; desc: string }[] }> = {
  seguridad: {
    titulo: "Qué recibís al final del proyecto",
    intro:
      "No es documentación de trámite: es lo que queda en manos de tu equipo y lo que permite auditar el trabajo hecho.",
    items: [
      { titulo: "Informe de postura", desc: "Los hallazgos priorizados por riesgo real, no por severidad teórica, con el plan de remediación ordenado." },
      { titulo: "Arquitectura documentada", desc: "El diagrama de la segmentación, las zonas de confianza y los flujos permitidos entre ellas." },
      { titulo: "Políticas cargadas", desc: "Las reglas activas en cada plataforma, explicadas: qué bloquea cada una y por qué está." },
      { titulo: "Runbook de incidentes", desc: "Qué hacer, en qué orden y a quién llamar cuando salta una alerta, con los contactos del soporte." },
    ],
  },
  consultoria: {
    titulo: "Qué recibís al final del proyecto",
    intro:
      "El trabajo no termina en un tablero lindo: termina cuando el equipo lo usa sin depender de nosotros.",
    items: [
      { titulo: "Informe de licenciamiento", desc: "Qué licencias tenés, cuáles se usan y cuáles no, con el ahorro cuantificado en pesos." },
      { titulo: "Modelo de datos documentado", desc: "De dónde sale cada número, con qué frecuencia se actualiza y qué significa exactamente." },
      { titulo: "Tableros en producción", desc: "Publicados, con permisos por rol y accesibles desde el navegador y el celular." },
      { titulo: "Capacitación al equipo", desc: "A quienes los van a usar todos los días, no solo al área de sistemas." },
    ],
  },
  "software-ai": {
    titulo: "Qué recibís al final del proyecto",
    intro:
      "El código es tuyo desde el primer día. Lo que entregamos es un producto que tu equipo puede sostener.",
    items: [
      { titulo: "El repositorio completo", desc: "Código, historial y documentación técnica, en tu organización de Git." },
      { titulo: "El producto en producción", desc: "Desplegado, con su infraestructura definida como código y el proceso de release documentado." },
      { titulo: "Monitoreo del modelo", desc: "Métricas de uso, calidad y deriva, para saber cuándo un modelo dejó de servir." },
      { titulo: "Traspaso al equipo", desc: "Sesiones de handover con quien va a mantenerlo, hasta que pueda hacer el primer cambio solo." },
    ],
  },
};

/**
 * Fabricantes que se suman a los quince de `partnersData` en la hoja de partners
 * del institucional.
 *
 * Salen de los `brands` de las cinco soluciones —donde hay 42 marcas con logo—,
 * filtrados a infraestructura, seguridad y firma. Quedan afuera a propósito los
 * lenguajes y frameworks (Python, React, Docker, PostgreSQL): son herramientas
 * con las que se construye, no fabricantes que respalden a Accedra, y mezclarlos
 * en una hoja de partners debilita justamente lo que la hoja viene a demostrar.
 *
 * Las claves son las de `TECH_LOGOS`.
 */
export const PARTNERS_EXTRA = [
  "Meraki",
  "Juniper",
  "Huawei",
  "Ubiquiti",
  "Avaya",
  "Vertiv",
  "SonicWall",
  "Furukawa",
  "Siemon",
  "Schneider Electric",
  "Thales",
];

/* ── Brochure institucional ───────────────────────────────────────────────── */

export const INSTITUCIONAL = {
  eyebrow: "Accedra IT Solutions",
  title: "Infraestructura IT para",
  highlight: "empresas que lideran.",
  subtitle:
    "Representamos e integramos las mejores tecnologías del mundo para que tu empresa opere con la infraestructura que merece.",
  heroImage: "/hero/hero-desktop.jpg",

  introTitle: "Todo tu IT, de una sola mano.",
  intro:
    "Accedra es un integrador tecnológico argentino con más de 17 años de trayectoria y más de 400 proyectos entregados. Resolvemos cada capa de la infraestructura de una empresa —la red, la seguridad, la firma digital, el ecosistema Microsoft y el software a medida— con un único interlocutor responsable, de la primera reunión al soporte.",

  // `slug` arma el link a la landing de cada solución. En un PDF los `<a>` quedan
  // clickeables, así que la card es una puerta de entrada real al sitio y no un
  // adorno — por eso además se imprime la URL: en papel el link no existe.
  soluciones: [
    { slug: "networking", nombre: "Networking", desc: "Infraestructura de red robusta y de alta disponibilidad, del cableado a la nube.", accent: "#3B82F6" },
    { slug: "firma-biometrica", nombre: "Firma Biométrica", desc: "Firma electrónica, biométrica y digital con validez legal y trazabilidad total.", accent: "#7C6CF6" },
    { slug: "consultoria", nombre: "Consultoría Microsoft", desc: "Ecosistema Microsoft y analítica que convierten tus datos en decisiones.", accent: "#06B6D4" },
    { slug: "seguridad", nombre: "Seguridad IT", desc: "Ciberseguridad de nivel corporativo en cada capa, con arquitectura Zero Trust.", accent: "#10B981" },
    { slug: "software-ai", nombre: "Software & AI", desc: "Software a medida e inteligencia artificial aplicada a tus procesos.", accent: "#B45CF2" },
  ],

  modeloTitulo: "Un único responsable, de punta a punta",
  modeloIntro:
    "El modelo es siempre el mismo, cambie la solución que cambie. No entregamos una caja y nos vamos.",
  modelo: [
    { titulo: "Relevamiento", desc: "Auditamos la situación actual en el lugar, con tu equipo, antes de proponer nada." },
    { titulo: "Diseño", desc: "Definimos arquitectura y alcance dimensionados a tu demanda real, no a un catálogo." },
    { titulo: "Implementación", desc: "Desplegamos con ventanas coordinadas y equipo propio, con mínima interrupción." },
    { titulo: "Soporte", desc: "Monitoreo, SLA definido por contrato y un interlocutor que atiende el teléfono." },
  ],

  diferenciales: [
    {
      titulo: "Un único responsable de punta a punta",
      desc: "Relevamiento, hardware, integración, despliegue, capacitación y soporte. La integración de Banco Provincia se hizo 100% con equipo propio.",
    },
    {
      titulo: "Cartera enterprise con cercanía de PyME",
      desc: "Andreani, Banco Provincia, Mapfre, Volkswagen, Techint y Accenture confían su infraestructura a un equipo que atiende el teléfono.",
    },
    {
      titulo: "Partner certificado, no revendedor",
      desc: "Más de 26 fabricantes con relación comercial vigente y certificación técnica real detrás de cada implementación.",
    },
    {
      titulo: "Firma digital y biométrica",
      desc: "El vertical más difícil de comoditizar, con el despliegue más grande del país: 4.400 pantallas en 400 sucursales.",
    },
  ],

  cierreTitulo: "Contanos tu desafío",
  cierreTexto:
    "Un experto de Accedra te contacta en menos de 24 horas hábiles. El relevamiento inicial es sin costo y sin compromiso: salís con un diagnóstico de tu situación, tengas o no un proyecto con nosotros.",
};

/* ── Cierre de los brochures de solución ──────────────────────────────────── */

export const CIERRE = {
  // El titular es la oferta, no el nombre de la sección: "El próximo paso" no
  // dice nada que el lector no sepa; "Diagnóstico sin cargo" es la propuesta.
  titulo: "Diagnóstico sin cargo",
  texto:
    "Un relevamiento sin costo y sin compromiso. Vamos, miramos la situación con tu equipo y te dejamos un diagnóstico con las prioridades ordenadas por riesgo — tengas o no un proyecto con nosotros.",
};
