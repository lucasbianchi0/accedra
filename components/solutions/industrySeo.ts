// Capa de contenido SEO/GEO de las landings /soluciones/[slug]/[industria].
//
// Por qué existe este archivo aparte de `industryContent` (en solutionsData):
// aquel cubre la COPY de la portada (subtitle + pains). Éste cubre lo que hace
// que la página sea INDEXABLE sin ser una variante: texto propio, preguntas
// frecuentes y marco normativo que sólo aplican a esa combinación.
//
// Regla de oro: si el contenido de una entrada se puede copiar a otra industria
// cambiando una palabra, no sirve — Google lo lee como doorway page y arrastra
// al dominio entero. Cada intro nombra procesos reales de la industria y cada
// FAQ responde algo que sólo se pregunta en ese vertical.
//
// Las FAQs además son el activo de GEO (Generative Engine Optimization): son lo
// que ChatGPT, Perplexity y los AI Overviews de Google citan textualmente. Por
// eso están escritas como respuestas autocontenidas — se entienden fuera de la
// página, sin el resto del contexto.
//
// ⚠️ Las referencias normativas son anclas de contenido, NO asesoramiento legal.
// Deben ser revisadas por Accedra antes de publicar.

export type IndustryFaq = { q: string; a: string };

export type ComplianceItem = {
  label: string; // norma o marco (ej. "Ley 25.506")
  detail: string; // qué exige, en una línea
};

export type IndustrySeo = {
  /** <title> propio. ~60 caracteres, la keyword adelante, marca al final. */
  metaTitle: string;
  /** <meta description>. ~155 caracteres, con verbo y beneficio concreto. */
  metaDescription: string;
  /** H2 de la sección de contexto (la keyword long-tail en encabezado real). */
  h2: string;
  /** Texto propio de la combinación. 2 párrafos. Es el cuerpo indexable. */
  intro: string[];
  /** Marco normativo del vertical. Aporta entidades que los LLMs reconocen. */
  compliance?: ComplianceItem[];
  /** 4 preguntas. Activo principal de GEO + FAQPage schema. */
  faqs: IndustryFaq[];
  /** Términos objetivo. No se emiten como <meta keywords> (Google los ignora
   *  desde 2009): alimentan el JSON-LD y sirven de documentación editorial. */
  keywords: string[];
};

/** INDUSTRY_SEO[solucion][industria] */
export const INDUSTRY_SEO: Record<string, Record<string, IndustrySeo>> = {
  // ══════════════════════════════════════════════════════════════════════
  //  NETWORKING
  // ══════════════════════════════════════════════════════════════════════
  networking: {
    bancos: {
      metaTitle: "Redes para bancos y entidades financieras · Accedra",
      metaDescription:
        "Infraestructura de red para bancos: sucursales con enlaces redundantes, segmentación de cajeros y POS, y wireless corporativo sobre Cisco. Partner certificado.",
      h2: "Redes de sucursal para entidades financieras",
      intro: [
        "En un banco la red no es infraestructura de soporte: es el canal por el que pasa cada operación de caja, cada consulta al core y cada transacción de cajero automático. Una sucursal sin enlace es una sucursal cerrada. Por eso el diseño arranca por la redundancia — doble enlace con salidas por operadores distintos, failover automático y equipamiento en alta disponibilidad — y no por el ancho de banda.",
        "El segundo eje es la segmentación. Cajeros automáticos, terminales de caja, red administrativa y WiFi de visitas no pueden convivir en el mismo dominio de broadcast. Trabajamos con switching y routing Cisco Catalyst, control de acceso por identidad con Cisco ISE y VLANs separadas por función, de modo que un incidente en un segmento no alcance a los demás. Sumamos telefonía IP para la atención al cliente y UPS con PDUs gestionadas en cada rack de sucursal.",
      ],
      compliance: [
        {
          label: "BCRA — riesgo tecnológico",
          detail:
            "Las Comunicaciones 'A' del Banco Central exigen a las entidades financieras gestionar el riesgo de TI, documentar la infraestructura y garantizar continuidad operativa.",
        },
        {
          label: "PCI DSS",
          detail:
            "El estándar de la industria de tarjetas requiere segmentar la red que procesa datos de tarjeta del resto del entorno corporativo.",
        },
      ],
      faqs: [
        {
          q: "¿Cómo se garantiza que una sucursal bancaria no quede sin conectividad?",
          a: "Con enlaces redundantes de operadores distintos y failover automático: si el enlace principal cae, el tráfico pasa al secundario sin intervención manual. En sucursales críticas se suma equipamiento de borde en alta disponibilidad, de modo que tampoco un router caído interrumpa la operación. Accedra diseña e implementa este esquema como partner certificado de Cisco.",
        },
        {
          q: "¿Por qué hay que separar la red de cajeros automáticos de la red administrativa?",
          a: "Porque limita el radio de impacto de un incidente. Si un equipo administrativo se infecta con malware, la segmentación por VLANs y políticas de control de acceso impide que la amenaza alcance las terminales que procesan transacciones. Además es un requisito del estándar PCI DSS para todo entorno que maneje datos de tarjeta.",
        },
        {
          q: "¿Se puede desplegar WiFi para clientes sin exponer la red interna del banco?",
          a: "Sí. El WiFi de visitas se publica como un SSID aislado, con su propia VLAN y salida a internet independiente, sin ruta hacia los segmentos internos. El control de acceso por identidad — con Cisco ISE, por ejemplo — permite además que un mismo punto de acceso físico atienda al personal y al público aplicando políticas distintas a cada uno.",
        },
        {
          q: "¿Cuánto demora renovar la red de una red de sucursales completa?",
          a: "Depende de la cantidad de sitios, pero el despliegue es sucursal por sucursal, no de una sola vez: se releva cada sitio, se planifica la ventana y se migra sin cortar la operación diurna. Accedra ejecutó despliegues multisitio de este tipo en clientes como Grupo Logístico Andreani y Finning Argentina, en varias provincias.",
        },
      ],
      keywords: [
        "redes para bancos",
        "infraestructura de red bancaria",
        "segmentación de red PCI",
        "conectividad de sucursales",
        "Cisco bancos Argentina",
      ],
    },

    seguros: {
      metaTitle: "Redes para aseguradoras y compañías de seguros · Accedra",
      metaDescription:
        "Conectividad para aseguradoras: casa central, sucursales y productores con acceso remoto seguro, wireless corporativo y telefonía IP sobre Cisco.",
      h2: "Conectividad para compañías de seguros",
      intro: [
        "Una aseguradora opera repartida: casa central, sucursales, centros de atención de siniestros y una red de productores y brokers que trabajan desde afuera. La red tiene que sostener a los cuatro con el mismo nivel de servicio, y eso rara vez se resuelve solo con más ancho de banda en la central. Diseñamos la topología para que cada tipo de usuario tenga el camino más corto al sistema de gestión, con enlaces dimensionados por sitio y calidad de servicio para el tráfico de voz.",
        "El acceso de terceros es el punto sensible. Los productores necesitan entrar a los sistemas de emisión y consulta, pero no son personal de la compañía. Resolvemos ese acceso con VPN y control de acceso por identidad, de modo que cada perfil vea exactamente lo que le corresponde. Sumamos telefonía IP para los centros de atención — donde el volumen de llamadas por siniestros marca el pico — y wireless corporativo con roaming en las oficinas.",
      ],
      compliance: [
        {
          label: "Ley 25.326 — Protección de Datos Personales",
          detail:
            "Los datos de asegurados y siniestros son datos personales: exigen medidas técnicas de resguardo y control de quién accede a ellos.",
        },
        {
          label: "SSN",
          detail:
            "La Superintendencia de Seguros de la Nación requiere continuidad operativa y resguardo de la documentación de pólizas y siniestros.",
        },
      ],
      faqs: [
        {
          q: "¿Cómo se le da acceso a los productores sin abrir la red de la aseguradora?",
          a: "Con acceso remoto por VPN y políticas de identidad: el productor se autentica, y a partir de ahí sólo alcanza los sistemas de emisión y consulta que su perfil habilita. No recibe una ruta general a la red interna. Sumar doble factor de autenticación en ese acceso es la práctica recomendada, porque el dispositivo del productor no está bajo gestión de la compañía.",
        },
        {
          q: "¿Qué necesita la red de un centro de atención de siniestros?",
          a: "Prioridad para el tráfico de voz. Un centro de siniestros vive de llamadas, y la telefonía IP degrada de forma muy visible si comparte el enlace con transferencias de archivos sin calidad de servicio configurada. Se define QoS que reserve ancho de banda para voz y se dimensiona el enlace por cantidad de posiciones simultáneas.",
        },
        {
          q: "¿Conviene wireless o cableado en las oficinas de una aseguradora?",
          a: "Ambos, con roles distintos. El cableado estructurado da el respaldo estable para puestos fijos, telefonía IP e impresoras; el wireless corporativo cubre movilidad interna, salas de reunión y notebooks. Lo que no conviene es resolver todo por WiFi: en oficinas densas la interferencia degrada justo cuando más gente hay conectada.",
        },
        {
          q: "¿Qué pasa con la conectividad de las sucursales del interior?",
          a: "Se dimensiona por sitio según la disponibilidad real de cada localidad. Donde hay fibra, se contrata con respaldo de un segundo operador; donde no llega, se resuelve con enlaces alternativos integrados por SD-WAN, que balancea y hace failover entre ellos de forma transparente para el usuario.",
        },
      ],
      keywords: [
        "redes para aseguradoras",
        "conectividad compañías de seguros",
        "acceso remoto productores",
        "telefonía IP siniestros",
        "SD-WAN seguros",
      ],
    },

    juridicos: {
      metaTitle: "Redes e infraestructura IT para estudios jurídicos · Accedra",
      metaDescription:
        "Infraestructura de red para estudios jurídicos: WiFi segmentado, cableado estructurado, resguardo documental y contingencia. Confidencialidad por diseño.",
      h2: "Infraestructura de red para estudios jurídicos",
      intro: [
        "Un estudio jurídico maneja poco volumen de tráfico y muchísima sensibilidad. El riesgo no es la saturación del enlace: es que un expediente quede accesible para quien no corresponde, o que un ransomware cifre el repositorio documental de veinte años de trabajo. Por eso en estudios la red se diseña alrededor de la confidencialidad y el resguardo, no del rendimiento.",
        "En la práctica eso significa tres cosas concretas. Segmentar el WiFi de clientes y visitas del segmento donde viven los expedientes, con salidas a internet separadas. Cablear en condiciones los puestos fijos y el rack, con UPS que sostenga un corte sin apagar el servidor de archivos de golpe. Y dejar armado un esquema de contingencia — respaldo de la documentación y camino alternativo de conectividad — que permita seguir trabajando el día que falle el enlace principal o el edificio no sea accesible.",
      ],
      compliance: [
        {
          label: "Secreto profesional",
          detail:
            "El deber de confidencialidad del abogado alcanza a la documentación digital: quién accede a cada expediente tiene que ser controlable y auditable.",
        },
        {
          label: "Ley 25.326 — Protección de Datos Personales",
          detail:
            "Los datos de las partes contenidos en un expediente son datos personales y exigen medidas de resguardo.",
        },
      ],
      faqs: [
        {
          q: "¿Cómo se protege la confidencialidad de los expedientes en la red de un estudio?",
          a: "Separando la red donde viven los expedientes del WiFi de clientes y visitas, y controlando el acceso por identidad en lugar de por contraseña compartida. Cada usuario entra con su credencial, lo que permite auditar quién abrió qué documento — algo que no es posible cuando todo el estudio comparte una clave única de red.",
        },
        {
          q: "¿Qué protege a un estudio jurídico de un ransomware que cifre los expedientes?",
          a: "El respaldo, antes que cualquier otra cosa. Una copia de la documentación fuera del alcance de la red que se cifró — offline o inmutable — es lo único que garantiza recuperar el trabajo sin pagar rescate. Sobre eso se suma protección de endpoints y filtrado de navegación, que reducen la probabilidad de que el incidente ocurra, pero no la eliminan.",
        },
        {
          q: "¿Necesita un estudio de diez personas cableado estructurado o alcanza con WiFi?",
          a: "Conviene cablear al menos los puestos fijos, el rack y las impresoras. El WiFi es cómodo pero comparte medio: cuando hay una audiencia por video y alguien sube un escrito pesado al mismo tiempo, la diferencia se nota. El cableado también simplifica el resguardo, porque el servidor de archivos deja de depender de la calidad de la señal.",
        },
        {
          q: "¿Qué pasa si el estudio se queda sin internet un día de vencimiento?",
          a: "Por eso se deja armado un enlace de contingencia de un operador distinto al principal, con conmutación automática. En estudios donde los plazos procesales son críticos, el costo del respaldo es marginal comparado con perder una presentación por un corte de servicio.",
        },
      ],
      keywords: [
        "infraestructura IT estudios jurídicos",
        "red para estudio de abogados",
        "confidencialidad documental",
        "backup expedientes",
        "contingencia estudio jurídico",
      ],
    },

    laboratorios: {
      metaTitle: "Redes para laboratorios y centros de salud · Accedra",
      metaDescription:
        "Infraestructura de red para laboratorios y salud: segmentación de equipamiento clínico, alta disponibilidad, wireless y contingencia sobre Cisco.",
      h2: "Redes para laboratorios y organizaciones de salud",
      intro: [
        "En un laboratorio o un centro de salud la red conecta cosas que no se parecen entre sí: analizadores y equipamiento clínico que hablan protocolos propios, estaciones de trabajo del personal, sistemas de gestión de pacientes y, cada vez más, dispositivos móviles en piso. Muchos de esos equipos corren software que el fabricante no actualiza, y no se pueden parchear como una PC. La respuesta es aislarlos.",
        "Diseñamos la red con el equipamiento clínico en segmentos propios, con reglas que definen exactamente con qué sistemas puede hablar cada dispositivo y con cuáles no. Eso permite convivir con equipos legacy sin exponerlos al resto de la red. Sobre esa base va la alta disponibilidad — porque un analizador que pierde conexión con el sistema de gestión frena el circuito de resultados — y el wireless con roaming para el personal que se mueve entre salas.",
      ],
      compliance: [
        {
          label: "Ley 25.326 — datos sensibles",
          detail:
            "Los datos de salud tienen la categoría de datos sensibles y exigen el nivel más alto de resguardo y control de acceso.",
        },
        {
          label: "ANMAT",
          detail:
            "Las disposiciones sobre trazabilidad y buenas prácticas requieren registros íntegros y disponibles de la operación.",
        },
      ],
      faqs: [
        {
          q: "¿Cómo se conecta equipamiento clínico viejo sin poner en riesgo la red?",
          a: "Aislándolo en un segmento propio con reglas explícitas de qué puede comunicarse con qué. Muchos analizadores corren sistemas operativos que el fabricante ya no actualiza y no admiten agentes de seguridad; la única defensa efectiva es que ese equipo sólo alcance el sistema de gestión que necesita y nada más. Así el equipo sigue operativo sin ser una puerta de entrada.",
        },
        {
          q: "¿Qué pasa si se cae la red mientras se están procesando muestras?",
          a: "Los resultados quedan retenidos en el equipo y no llegan al sistema de gestión, lo que frena la validación y la entrega al paciente. Por eso en laboratorios se trabaja con equipamiento de red redundante y UPS en los racks: el objetivo no es evitar todo corte, sino que un corte no interrumpa el circuito de resultados.",
        },
        {
          q: "¿Se puede dar WiFi a pacientes en una sala de espera sin comprometer los datos clínicos?",
          a: "Sí, publicando el acceso de pacientes como una red completamente separada, con su propia salida a internet y sin ninguna ruta hacia los segmentos donde viven los sistemas clínicos. Es la misma infraestructura física de puntos de acceso, con políticas distintas según quién se conecta.",
        },
        {
          q: "¿Qué implica la protección de datos sensibles en la infraestructura de red?",
          a: "Que el control de acceso deje registro. La Ley 25.326 clasifica los datos de salud como sensibles, lo que exige poder demostrar quién accedió a qué información. En la red eso se traduce en autenticación por identidad en lugar de credenciales compartidas, y en segmentos donde el acceso a sistemas clínicos esté restringido por perfil.",
        },
      ],
      keywords: [
        "redes para laboratorios",
        "infraestructura IT salud",
        "segmentación equipamiento clínico",
        "red hospitalaria",
        "datos sensibles salud",
      ],
    },

    logistica: {
      metaTitle: "Redes para logística, plantas y depósitos · Accedra",
      metaDescription:
        "Conectividad para operaciones logísticas: WiFi industrial en depósitos, SD-WAN multisitio y enlaces satelitales. Caso Andreani: de 5 caídas por semana a menos de 1 por mes.",
      h2: "Conectividad para operaciones logísticas 24/7",
      intro: [
        "En logística la red es parte de la operación física. Si el WiFi del depósito falla, los handhelds no leen, la mercadería no se registra y la playa se frena — el costo no se mide en minutos de sistema caído sino en camiones parados. Eso cambia el diseño: el WiFi de un depósito no se planifica como el de una oficina, porque hay que cubrir naves de altura con racks metálicos que reflejan la señal y pasillos que se comportan como túneles.",
        "Relevamos cada sitio con mapas de calor antes de instalar, y ubicamos los puntos de acceso en altura donde hace falta, con equipamiento apto para ambientes industriales. Entre sitios usamos SD-WAN, que integra enlaces heterogéneos — fibra donde hay, alternativos donde no — y hace failover sin intervención. En los puntos donde la conectividad tradicional no llega, sumamos enlaces satelitales integrados al mismo esquema, como hicimos en yacimientos de Finning Argentina en cuatro provincias.",
      ],
      compliance: [
        {
          label: "Continuidad operativa",
          detail:
            "Una operación 24/7 no tiene ventana de mantenimiento natural: los cambios se planifican sin detener la actividad.",
        },
        {
          label: "Trazabilidad documental",
          detail:
            "El registro de remitos y entregas debe estar disponible e íntegro para auditorías y reclamos.",
        },
      ],
      faqs: [
        {
          q: "¿Por qué el WiFi de un depósito requiere un diseño distinto al de una oficina?",
          a: "Porque el entorno físico es hostil a la señal. Los racks metálicos reflejan y bloquean, la altura de las naves obliga a montar los puntos de acceso lejos de los dispositivos, y los pasillos se comportan como túneles donde la cobertura se corta de golpe. Se releva con mapas de calor antes de instalar y se usa equipamiento apto para ambiente industrial, no puntos de acceso de oficina.",
        },
        {
          q: "¿Qué es SD-WAN y por qué sirve en una operación multisitio?",
          a: "Es una capa que integra varios enlaces de conectividad — fibra, radioenlace, satelital — y decide por cuál mandar cada tráfico según su calidad en tiempo real. En logística sirve porque los sitios tienen realidades muy distintas: permite que un depósito con fibra y otro con enlace satelital se administren bajo la misma política, con failover automático entre enlaces.",
        },
        {
          q: "¿Se puede dar conectividad a un sitio donde no llega la fibra?",
          a: "Sí, con enlaces satelitales integrados por SD-WAN. Accedra desplegó este esquema en yacimientos y sucursales de Finning Argentina en Catamarca, San Juan, Santa Cruz y Jujuy, donde la conectividad tradicional no llega: el enlace satelital entra al mismo esquema de gestión que el resto de los sitios.",
        },
        {
          q: "¿Cómo se migra la red de una operación que no puede parar?",
          a: "Sitio por sitio y en ventanas acordadas, no de una sola vez. Se releva cada ubicación, se prepara el equipamiento en paralelo al existente y se conmuta en el horario de menor actividad, con vuelta atrás preparada. En el rediseño de red de Grupo Logístico Andreani este enfoque llevó las caídas de 5 por semana a menos de 1 por mes.",
        },
      ],
      keywords: [
        "WiFi industrial depósitos",
        "redes para logística",
        "SD-WAN multisitio",
        "conectividad satelital",
        "red centros de distribución",
      ],
    },

    retail: {
      metaTitle: "Redes multisucursal para retail y comercios · Accedra",
      metaDescription:
        "Infraestructura de red para retail: SD-WAN entre sucursales, segmentación de POS según PCI DSS y WiFi de clientes separado de la red de cobro.",
      h2: "Redes multisucursal para retail",
      intro: [
        "El desafío de una cadena de retail no es la complejidad de una sucursal: es que hay muchas, todas parecidas y todas críticas. Una caja que no cobra es facturación que se pierde en el momento, sin posibilidad de recuperarla después. Por eso el diseño apunta a la estandarización — la misma topología replicable en cada local, gestionada de forma centralizada — y a que un sitio nuevo se levante en días y no en semanas.",
        "Dentro de cada sucursal conviven tres redes que no deben tocarse: los puntos de venta que procesan pagos, la red administrativa del personal y el WiFi que se ofrece a los clientes. Las separamos por VLANs con políticas explícitas, que además es lo que exige PCI DSS para cualquier entorno que maneje datos de tarjeta. Entre sucursales usamos SD-WAN para absorber la variedad de enlaces disponibles según la localidad, con failover automático hacia un enlace secundario cuando el principal degrada.",
      ],
      compliance: [
        {
          label: "PCI DSS",
          detail:
            "Exige aislar el entorno que procesa datos de tarjeta del resto de la red, con controles de acceso documentados.",
        },
        {
          label: "Ley 25.326 — Protección de Datos Personales",
          detail:
            "Los datos de clientes captados en programas de fidelidad o WiFi requieren resguardo y consentimiento.",
        },
      ],
      faqs: [
        {
          q: "¿Por qué la red de los puntos de venta tiene que estar separada del WiFi de clientes?",
          a: "Porque PCI DSS lo exige y porque reduce el riesgo real. Si el WiFi público comparte segmento con las terminales de cobro, cualquier dispositivo de un cliente queda a un salto de la red que procesa tarjetas. La separación por VLANs con políticas explícitas hace que el tráfico de clientes salga directo a internet, sin ninguna ruta hacia el entorno de pago.",
        },
        {
          q: "¿Qué pasa cuando se cae el enlace de una sucursal y las cajas no pueden cobrar?",
          a: "Con un esquema de enlace secundario y failover automático, el tráfico de las cajas conmuta al respaldo sin intervención del personal del local — que no tiene por qué saber de redes. La clave es que el respaldo sea de un operador distinto: dos enlaces del mismo proveedor suelen caer juntos.",
        },
        {
          q: "¿Cuánto lleva conectar una sucursal nueva?",
          a: "Con una topología estandarizada y gestión centralizada, el trabajo en sitio se reduce a instalar equipamiento preconfigurado. Lo que suele marcar el plazo real no es la configuración sino la provisión del enlace por parte del operador, que conviene gestionar apenas se confirma la ubicación del local.",
        },
        {
          q: "¿Se puede administrar la red de todas las sucursales desde un solo lugar?",
          a: "Sí, es el sentido de una arquitectura gestionada centralmente. Los cambios de política se aplican a todos los sitios desde una consola, en lugar de configurarse local por local, y se ve el estado de cada sucursal en un solo tablero. Accedra trabaja con Cisco y Meraki, que resuelven este modelo de gestión para operaciones multisitio.",
        },
      ],
      keywords: [
        "redes multisucursal retail",
        "segmentación POS PCI DSS",
        "SD-WAN retail",
        "WiFi clientes comercio",
        "conectividad cadena de locales",
      ],
    },
  },

  // ══════════════════════════════════════════════════════════════════════
  //  FIRMA BIOMÉTRICA / DIGITAL
  // ══════════════════════════════════════════════════════════════════════
  "firma-biometrica": {
    bancos: {
      metaTitle: "Firma digital y biométrica para bancos · Accedra",
      metaDescription:
        "Firma biométrica en sucursales bancarias: onboarding y formularios sin papel, con identidad verificada y valor probatorio. Caso Banco Provincia: 400 sucursales.",
      h2: "Firma biométrica para entidades financieras",
      intro: [
        "El circuito de papel de una sucursal bancaria tiene un costo que rara vez se mide entero: imprimir el formulario, hacerlo firmar, escanearlo, archivarlo físicamente y después buscarlo cuando alguien lo reclama. La firma biométrica elimina las cinco etapas de una vez. El cliente firma sobre una pantalla, y esa firma queda vinculada al documento de forma inalterable, disponible al instante.",
        "Lo que la hace válida para un banco no es la comodidad sino los parámetros que captura: presión, velocidad, trazo y tiempos del gesto manuscrito, ligados criptográficamente al documento firmado. Eso da el respaldo probatorio que exige una operación financiera y permite el no repudio. Accedra implementó este esquema en el Banco de la Provincia de Buenos Aires: más de 4.400 pantallas Wacom en 400 sucursales, con integración a los sistemas core del banco y más de 620 formularios digitalizados, con la integración realizada íntegramente por nuestro equipo.",
      ],
      compliance: [
        {
          label: "Ley 25.506 — Firma Digital",
          detail:
            "Establece el marco de validez de la firma digital y electrónica en Argentina, y su eficacia probatoria.",
        },
        {
          label: "UIF — prevención de lavado",
          detail:
            "Los legajos de clientes deben conservarse íntegros, accesibles y auditables durante los plazos exigidos.",
        },
        {
          label: "BCRA",
          detail:
            "Los procesos de alta y documentación de clientes requieren trazabilidad y resguardo de los registros.",
        },
      ],
      faqs: [
        {
          q: "¿Tiene validez legal una firma biométrica capturada en una sucursal bancaria?",
          a: "Sí. La firma biométrica es una especie de firma electrónica dentro del marco de la Ley 25.506, y su fuerza probatoria proviene de los datos que captura: presión, velocidad, trazo y tiempos del gesto, vinculados criptográficamente al documento. Ese vínculo permite demostrar tanto la autoría como que el documento no fue alterado después de firmado.",
        },
        {
          q: "¿Qué pasa si un cliente desconoce después una firma que hizo en la sucursal?",
          a: "Los parámetros biométricos capturados son periciables: un perito calígrafo puede analizarlos igual que analizaría una firma en papel, con la ventaja de contar con datos dinámicos — la presión y la velocidad del trazo — que una firma escaneada no conserva. Además, el vínculo criptográfico con el documento prueba que el contenido no cambió desde la firma.",
        },
        {
          q: "¿Se integra la firma biométrica con el core bancario existente?",
          a: "Sí, es el requisito central del proyecto. En la implementación del Banco Provincia, Accedra integró la solución de forma nativa con los sistemas core del banco y digitalizó más de 620 formularios operativos. El objetivo es que el empleado de caja no cambie de sistema para hacer firmar: el documento se genera, se firma y se archiva dentro del mismo circuito que ya usaba.",
        },
        {
          q: "¿Cuánto tiempo lleva desplegar firma biométrica en una red de sucursales grande?",
          a: "Se ejecuta por etapas, sucursal por sucursal, con relevamiento, hardware, integración de software, capacitación y soporte. El despliegue del Banco Provincia alcanzó las 400 sucursales de la red con más de 4.400 dispositivos de firma, bajo un modelo llave en mano de punta a punta.",
        },
      ],
      keywords: [
        "firma biométrica bancos",
        "firma digital entidades financieras",
        "onboarding digital bancario",
        "digitalización de formularios",
        "Wacom firma sucursales",
      ],
    },

    seguros: {
      metaTitle: "Firma digital para aseguradoras y pólizas · Accedra",
      metaDescription:
        "Firma electrónica para compañías de seguros: pólizas, endosos y siniestros firmados a distancia, con validez legal y trazabilidad de punta a punta.",
      h2: "Firma digital de pólizas, endosos y siniestros",
      intro: [
        "En seguros la firma aparece en cada punto donde el negocio se define: la contratación de una póliza, un endoso que modifica cobertura, la denuncia de un siniestro y la conformidad final del asegurado. Cuando cada uno de esos pasos exige presencialidad o intercambio de papel, el proceso se estira — y en contratación, cada día de demora es una probabilidad más alta de que el cliente firme con otro.",
        "La firma electrónica corta esa fricción sin resignar respaldo. El asegurado firma a distancia desde su dispositivo, o presencialmente sobre pantalla si está en oficina, y en ambos casos queda un registro auditable de quién firmó, cuándo y sobre qué versión exacta del documento. Para el circuito de siniestros esto es especialmente valioso: la trazabilidad de cada conformidad es lo que después sostiene el expediente frente a un reclamo o una auditoría.",
      ],
      compliance: [
        {
          label: "Ley 25.506 — Firma Digital",
          detail:
            "Da marco de validez a la firma electrónica y digital, aplicable a la contratación de seguros.",
        },
        {
          label: "SSN",
          detail:
            "La Superintendencia de Seguros de la Nación exige resguardo y disponibilidad de la documentación de pólizas y siniestros.",
        },
        {
          label: "Ley 25.326",
          detail:
            "Los datos del asegurado y del siniestro son datos personales sujetos a protección.",
        },
      ],
      faqs: [
        {
          q: "¿Se puede emitir una póliza con firma electrónica sin presencia física del asegurado?",
          a: "Sí. La firma electrónica remota permite que el asegurado firme desde su propio dispositivo, con verificación de identidad previa al acto de firma. Queda registrado quién firmó, cuándo y sobre qué versión del documento, lo que constituye la evidencia del consentimiento. El nivel de verificación de identidad se define según el riesgo del producto.",
        },
        {
          q: "¿Cómo se prueba que el asegurado firmó la versión correcta de la póliza?",
          a: "Porque la firma se vincula criptográficamente al documento: cualquier modificación posterior al texto invalida esa vinculación y queda evidenciada. Eso resuelve una discusión clásica en siniestros, donde se debate qué condiciones particulares regían al momento de la contratación.",
        },
        {
          q: "¿Sirve la firma digital para la conformidad de un siniestro?",
          a: "Es uno de los usos de mayor impacto. La conformidad del asegurado sobre la liquidación puede firmarse a distancia el mismo día, en lugar de esperar el circuito de envío, firma y devolución de papel. Se acorta el cierre del expediente y queda un registro auditable de la aceptación, con fecha y hora ciertas.",
        },
        {
          q: "¿Los productores pueden usar el mismo circuito de firma?",
          a: "Sí, y suele ser donde más se nota la mejora. El productor envía el documento a firmar desde el sistema, el cliente firma desde donde esté, y la póliza vuelve firmada al expediente sin que nadie imprima ni escanee. El productor deja de ser el cuello de botella logístico del papel.",
        },
      ],
      keywords: [
        "firma digital pólizas",
        "firma electrónica seguros",
        "conformidad siniestros digital",
        "contratación remota seguros",
        "endosos firma electrónica",
      ],
    },

    juridicos: {
      metaTitle: "Firma digital para estudios jurídicos y abogados · Accedra",
      metaDescription:
        "Firma digital para estudios jurídicos: contratos, poderes y escritos con validez legal según Ley 25.506, trazabilidad y resguardo documental. Sin papel.",
      h2: "Firma digital de contratos, poderes y escritos",
      intro: [
        "Para un estudio jurídico la firma no es un trámite administrativo: es el acto que da existencia al documento. Un contrato, un poder o una conformidad de cliente valen por la firma que los respalda, y cualquier duda sobre su autenticidad se discute después en un expediente. Por eso la digitalización de la firma en el ámbito legal tiene una vara más alta que en cualquier otra industria: no alcanza con que sea cómoda, tiene que ser defendible.",
        "El marco lo da la Ley 25.506 de Firma Digital, reglamentada por el Decreto 182/2019, junto con los artículos del Código Civil y Comercial que regulan la forma escrita. La firma digital con certificado emitido por un certificador licenciado goza de presunción de autoría e integridad; la firma electrónica y biométrica, sin esa presunción, conserva plena eficacia probatoria — con la diferencia de que la carga de la prueba se invierte. Elegir entre una y otra es una decisión jurídica antes que técnica, y la implementamos según el criterio del estudio para cada tipo de documento.",
      ],
      compliance: [
        {
          label: "Ley 25.506 — Firma Digital",
          detail:
            "Distingue firma digital de firma electrónica y define la presunción de autoría e integridad de la primera.",
        },
        {
          label: "Decreto 182/2019",
          detail:
            "Reglamenta la Ley 25.506 y actualiza el régimen de certificadores licenciados.",
        },
        {
          label: "Código Civil y Comercial",
          detail:
            "Los artículos sobre forma escrita y firma reconocen expresamente los instrumentos generados por medios electrónicos.",
        },
      ],
      faqs: [
        {
          q: "¿Cuál es la diferencia entre firma digital y firma electrónica en Argentina?",
          a: "La Ley 25.506 las distingue. La firma digital usa un certificado emitido por un certificador licenciado y goza de presunción de autoría e integridad: quien la desconoce debe probar que no firmó. La firma electrónica —incluida la biométrica— no tiene esa presunción, por lo que en caso de desconocimiento la carga de probar su validez recae en quien la invoca. Ambas son válidas; cambia quién debe probar qué.",
        },
        {
          q: "¿Se puede otorgar un poder con firma digital?",
          a: "Depende de la forma que la ley exija para ese acto en particular. Los actos que requieren escritura pública mantienen ese requisito y no se sustituyen por firma digital. Para los documentos donde la ley admite forma privada —contratos, conformidades, cartas de instrucción, escritos internos— la firma digital es aplicable. Es una decisión que corresponde definir al estudio caso por caso.",
        },
        {
          q: "¿Qué evidencia queda de una firma digital si el documento se discute en juicio?",
          a: "Queda el documento firmado con su vinculación criptográfica intacta, más el registro de auditoría del acto: identidad del firmante, momento de la firma y versión exacta del documento sobre la que se firmó. Si la firma fue biométrica, se conservan además los parámetros dinámicos del trazo, que son periciables por un calígrafo con más elementos que una firma escaneada.",
        },
        {
          q: "¿Cómo se conservan los documentos firmados a lo largo de los años?",
          a: "El punto crítico es la conservación de la evidencia, no del archivo. Un documento firmado necesita que su vinculación criptográfica siga siendo verificable en el tiempo, lo que exige un esquema de resguardo que preserve el documento y sus metadatos de firma juntos. Es lo que se define al diseñar el circuito, y suele ser lo que más se subestima al digitalizar.",
        },
      ],
      keywords: [
        "firma digital estudios jurídicos",
        "Ley 25.506 firma digital",
        "firma electrónica contratos",
        "validez legal firma digital Argentina",
        "firma digital abogados",
      ],
    },

    laboratorios: {
      metaTitle: "Firma digital para laboratorios y salud · Accedra",
      metaDescription:
        "Firma electrónica en salud: consentimientos informados, informes y protocolos firmados digitalmente, con identidad verificada y trazabilidad documental.",
      h2: "Firma digital de consentimientos e informes clínicos",
      intro: [
        "En salud la firma aparece en dos documentos que no admiten ambigüedad: el consentimiento informado del paciente y la validación profesional de un informe o protocolo. El primero es la prueba de que el paciente fue informado y aceptó; el segundo, de que un profesional habilitado se hizo responsable de un resultado. Los dos terminan en un archivo que hay que conservar por años y encontrar cuando se los reclama.",
        "Digitalizar esa firma resuelve el archivo y refuerza la prueba. El consentimiento firmado sobre pantalla queda vinculado al documento con fecha y hora ciertas y a la identidad de quien firmó, sin depender de que el papel se escanee, se archive bien y siga legible dentro de diez años. Para la validación de informes, la firma del profesional queda asociada a la versión exacta del resultado, lo que evita la discusión sobre qué se firmó cuando un informe se corrige o se amplía.",
      ],
      compliance: [
        {
          label: "Ley 26.529 — Derechos del Paciente",
          detail:
            "Regula el consentimiento informado y la historia clínica, admitiendo soporte electrónico con resguardo de integridad.",
        },
        {
          label: "Ley 25.326 — datos sensibles",
          detail:
            "Los datos de salud exigen el nivel más alto de protección y control de acceso.",
        },
        {
          label: "ANMAT",
          detail:
            "Las buenas prácticas requieren registros íntegros, atribuibles y trazables en el tiempo.",
        },
      ],
      faqs: [
        {
          q: "¿Puede firmarse digitalmente un consentimiento informado?",
          a: "Sí. La Ley 26.529 regula el consentimiento informado y admite el soporte electrónico siempre que se resguarde su integridad y se pueda acreditar quién lo prestó. La firma electrónica sobre pantalla cumple ese requisito: vincula la aceptación del paciente al documento exacto que se le presentó, con fecha y hora ciertas.",
        },
        {
          q: "¿Cómo se maneja la firma de un informe que después se corrige o amplía?",
          a: "Cada versión se firma por separado y queda vinculada a su contenido específico. Eso evita la ambigüedad de un archivo donde conviven varias versiones: siempre se puede determinar qué texto exacto validó el profesional en cada momento, algo que un circuito de papel con correcciones manuscritas resuelve muy mal.",
        },
        {
          q: "¿Qué requisitos tiene la conservación de documentación clínica firmada?",
          a: "Los plazos los fija la normativa sanitaria, y lo que exige la firma digital es que el documento se conserve junto con sus metadatos de firma, no como un PDF suelto. Sin esos metadatos la vinculación criptográfica no se puede verificar después, y el documento pierde justamente lo que lo hacía más sólido que el papel.",
        },
        {
          q: "¿Sirve para la firma de profesionales en laboratorios con alto volumen?",
          a: "Sí, y ahí es donde más rinde. En un laboratorio con centenares de informes diarios, la validación profesional en papel implica imprimir, firmar, escanear y archivar cada uno. Con firma electrónica integrada al sistema de gestión, el profesional valida desde su estación y el informe queda firmado y disponible para el paciente en el mismo acto.",
        },
      ],
      keywords: [
        "firma digital consentimiento informado",
        "firma electrónica salud",
        "validación digital informes",
        "Ley 26.529 consentimiento",
        "historia clínica electrónica firma",
      ],
    },

    logistica: {
      metaTitle: "Firma digital para logística: remitos y entregas · Accedra",
      metaDescription:
        "Firma electrónica en operaciones logísticas: conformidad de entrega y remitos firmados en el punto de destino, sin papel y con trazabilidad inmediata.",
      h2: "Firma digital de remitos y conformidad de entrega",
      intro: [
        "En logística la firma ocurre en el peor lugar posible para el papel: en la puerta del cliente, muchas veces bajo lluvia, con el chofer apurado y un remito triplicado que después hay que devolver a la base, ordenar y archivar. El resultado conocido es que la conformidad tarda días en llegar al sistema, y cuando hay un reclamo el remito específico no aparece.",
        "La firma electrónica en el punto de entrega cambia el circuito entero. El destinatario firma sobre el dispositivo del chofer, y la conformidad queda registrada en el momento, vinculada al remito, con fecha, hora y ubicación. La operación pasa a saber en tiempo real qué se entregó y qué no, sin esperar el retorno físico de la documentación. Y cuando el cliente reclama, el comprobante se busca en segundos en lugar de en un archivo de cajas.",
      ],
      compliance: [
        {
          label: "Ley 25.506 — Firma Digital",
          detail:
            "Da marco de validez a la firma electrónica aplicada a la conformidad de entrega.",
        },
        {
          label: "Trazabilidad documental",
          detail:
            "El comprobante de entrega debe estar disponible e íntegro para sostener reclamos y auditorías.",
        },
      ],
      faqs: [
        {
          q: "¿Cómo se firma una entrega si el chofer no tiene señal en ese momento?",
          a: "El dispositivo captura la firma y la almacena localmente, y la sincroniza cuando recupera conectividad. La fecha y hora del acto se registran en el momento de la firma, no en el de la sincronización, de modo que la evidencia refleja cuándo ocurrió realmente la entrega. Es un requisito de diseño, porque en reparto la falta de señal es la norma y no la excepción.",
        },
        {
          q: "¿Qué valor tiene la firma del destinatario en un dispositivo frente a un remito en papel?",
          a: "Al menos el mismo, y en la práctica más elementos de prueba. Además de la firma queda registrado el momento exacto, la ubicación y el vínculo con el remito específico. Un remito de papel firmado prueba que alguien firmó algo; la conformidad electrónica prueba además cuándo y dónde, y no se pierde en el traslado de vuelta.",
        },
        {
          q: "¿Se integra con el sistema de gestión de transporte que ya usamos?",
          a: "Es el punto que define el proyecto. La firma no aporta valor si genera un archivo aparte que después hay que conciliar: tiene que impactar en el mismo remito dentro del sistema de gestión. La integración se resuelve por API contra el TMS o ERP existente, para que la conformidad actualice el estado del envío automáticamente.",
        },
        {
          q: "¿Cuánto se tarda en encontrar un comprobante de entrega cuando un cliente reclama?",
          a: "Con conformidad electrónica, segundos: se busca por número de remito, cliente o fecha. Es la diferencia más visible frente al papel, donde recuperar un comprobante puntual de meses atrás implica ir al archivo físico y, con frecuencia, no encontrarlo.",
        },
      ],
      keywords: [
        "firma digital remitos",
        "conformidad de entrega electrónica",
        "prueba de entrega digital",
        "firma electrónica logística",
        "remito electrónico",
      ],
    },

    retail: {
      metaTitle: "Firma digital para retail y comercios · Accedra",
      metaDescription:
        "Firma electrónica en retail: altas de cuenta, contratos de crédito y garantías firmados en el local, sin papel y con respaldo probatorio.",
      h2: "Firma digital en el punto de venta",
      intro: [
        "El retail firma más papel del que suele reconocer: solicitudes de crédito y financiación, altas de programas de fidelidad, contratos de garantía extendida, conformidades de entrega de productos grandes y documentación de devoluciones. Todo eso ocurre en el mostrador, con el cliente esperando, y termina en un archivo que después nadie quiere buscar.",
        "La firma electrónica en el punto de venta hace dos cosas a la vez: acorta el trámite frente al cliente y elimina el archivo físico. El vendedor genera el documento desde el sistema, el cliente firma sobre pantalla y la operación queda cerrada en el acto, con el comprobante disponible de inmediato para ambas partes. En operaciones con financiación esto importa especialmente, porque la documentación de crédito es la que más se audita y la que más caro sale no poder encontrar.",
      ],
      compliance: [
        {
          label: "Ley 24.240 — Defensa del Consumidor",
          detail:
            "Exige entregar al consumidor constancia de la operación y de las condiciones contratadas.",
        },
        {
          label: "Ley 25.506 — Firma Digital",
          detail:
            "Da marco de validez a la firma electrónica en la contratación con consumidores.",
        },
        {
          label: "Ley 25.326",
          detail:
            "Los datos captados en altas y programas de fidelidad son datos personales y requieren consentimiento.",
        },
      ],
      faqs: [
        {
          q: "¿Se puede firmar una solicitud de crédito en el local sin papel?",
          a: "Sí. El documento se genera desde el sistema con las condiciones de la operación, el cliente lo firma sobre pantalla y queda vinculado a esa versión exacta. Para financiación es donde más rinde, porque es la documentación que más se audita: tenerla digital y buscable evita el costo de no poder localizar un legajo puntual meses después.",
        },
        {
          q: "¿Hay que darle al cliente una copia de lo que firmó?",
          a: "Sí, la Ley 24.240 exige entregar constancia de la operación y las condiciones contratadas. Con firma electrónica la copia se envía por mail o se descarga en el momento, lo que además deja registro de la entrega — algo que con el papel duplicado no queda documentado.",
        },
        {
          q: "¿Funciona en locales donde rota mucho el personal de mostrador?",
          a: "Es una de las ventajas, porque reduce el margen de error humano. El circuito digital genera el documento correcto desde el sistema, en lugar de depender de que el vendedor tome el formulario adecuado del cajón y lo complete bien. La capacitación se reduce a firmar en pantalla.",
        },
        {
          q: "¿Cómo se maneja la firma en la entrega a domicilio de un producto grande?",
          a: "Con el mismo esquema que la conformidad de entrega en logística: el repartidor captura la firma del cliente en el dispositivo, con fecha, hora y ubicación, y queda vinculada al comprobante de esa entrega puntual. Resuelve la discusión típica sobre si el producto llegó, cuándo y en qué estado se recibió.",
        },
      ],
      keywords: [
        "firma digital retail",
        "firma electrónica punto de venta",
        "contratos de crédito digitales",
        "alta de clientes sin papel",
        "garantía extendida digital",
      ],
    },
  },

  // ══════════════════════════════════════════════════════════════════════
  //  CONSULTORÍA MICROSOFT
  // ══════════════════════════════════════════════════════════════════════
  consultoria: {
    bancos: {
      metaTitle: "Power BI y Microsoft 365 para bancos · Accedra",
      metaDescription:
        "Consultoría Microsoft para entidades financieras: tableros de Power BI, reporting regulatorio y gestión documental sobre SharePoint y Microsoft 365.",
      h2: "Power BI y analítica para entidades financieras",
      intro: [
        "Un banco produce más información de la que consigue mirar. Los datos de originación, mora, productividad por sucursal y cumplimiento viven en sistemas distintos, y la consolidación termina siendo un ejercicio manual de planillas que llega tarde y que nadie audita. El problema no es la falta de datos: es que el dato no llega a la mesa donde se decide.",
        "Trabajamos ese circuito con Power BI sobre los orígenes que el banco ya tiene, modelando primero y visualizando después — porque un tablero construido sobre un modelo mal definido produce números que nadie termina de creer. Sobre eso montamos gestión documental en SharePoint para los legajos y circuitos de aprobación, y automatización con Power Automate para los pasos repetitivos de conciliación y reporte. El resultado buscado es que el reporte se genere solo y que la discusión pase de qué número es el correcto a qué hacer con él.",
      ],
      compliance: [
        {
          label: "BCRA — regímenes informativos",
          detail:
            "La información que se remite al Banco Central debe ser consistente, trazable y reproducible.",
        },
        {
          label: "Ley 25.326",
          detail:
            "El acceso a datos de clientes dentro de tableros y reportes debe estar restringido por perfil.",
        },
      ],
      faqs: [
        {
          q: "¿Se puede armar un tablero de Power BI sin migrar los sistemas del banco?",
          a: "Sí, y es el enfoque habitual. Power BI se conecta a los orígenes existentes —bases del core, planillas, sistemas departamentales— sin exigir reemplazarlos. Lo que sí hace falta es definir el modelo de datos antes de visualizar: sin esa capa, cada tablero interpreta los mismos campos de forma distinta y aparecen números que no cierran entre áreas.",
        },
        {
          q: "¿Cómo se controla quién ve qué información en un tablero con datos de clientes?",
          a: "Con seguridad a nivel de fila, que filtra los datos según la identidad de quien abre el reporte. Un gerente de sucursal ve su cartera y no la de las demás, sobre el mismo tablero. Es un requisito cuando hay datos personales involucrados, y se configura en el modelo, no en cada visualización.",
        },
        {
          q: "¿Sirve Power Automate para procesos de un banco o queda corto?",
          a: "Sirve bien para los circuitos administrativos que hoy se resuelven por mail: aprobaciones, notificaciones, movimiento de documentación entre áreas, recordatorios de vencimientos. No reemplaza integraciones de core bancario, que tienen otro nivel de criticidad y se resuelven con desarrollo dedicado.",
        },
        {
          q: "¿Qué gana un banco moviendo la gestión documental a SharePoint?",
          a: "Control de versiones y trazabilidad de acceso, principalmente. Un legajo en SharePoint registra quién lo abrió, quién lo modificó y qué versión regía en cada momento — algo que una carpeta compartida de red no ofrece. Para documentación sujeta a auditoría, esa diferencia es la que importa.",
        },
      ],
      keywords: [
        "Power BI bancos",
        "reporting regulatorio BCRA",
        "consultoría Microsoft financiera",
        "SharePoint legajos",
        "tableros de riesgo",
      ],
    },

    seguros: {
      metaTitle: "Power BI y Microsoft 365 para aseguradoras · Accedra",
      metaDescription:
        "Consultoría Microsoft para seguros: tableros de siniestralidad y producción, gestión documental de expedientes y automatización sobre Power Platform.",
      h2: "Analítica de siniestralidad y producción con Power BI",
      intro: [
        "En una aseguradora hay dos preguntas que se hacen todos los meses y que casi nunca se responden rápido: cómo viene la siniestralidad por ramo y quién está produciendo. Ambas requieren cruzar emisión, cobranza y siniestros, y ese cruce suele resolverse a mano, con planillas que reconcilia una persona y que llegan cuando el mes ya cerró.",
        "Modelamos ese cruce en Power BI para que la respuesta esté disponible en el momento y no dependa de nadie en particular. Los tableros típicos combinan siniestralidad por ramo y período, producción por productor y canal, y evolución de cartera con alertas sobre desvíos. Sobre el mismo ecosistema Microsoft resolvemos la gestión documental del expediente de siniestro en SharePoint —donde la trazabilidad de versiones importa tanto como el archivo— y automatizamos con Power Automate los circuitos de aprobación que hoy viven en cadenas de mails.",
      ],
      compliance: [
        {
          label: "SSN",
          detail:
            "La información de producción y siniestros que se reporta debe ser consistente y reproducible.",
        },
        {
          label: "Ley 25.326",
          detail:
            "Los datos de asegurados en tableros y expedientes requieren control de acceso por perfil.",
        },
      ],
      faqs: [
        {
          q: "¿Qué tablero conviene armar primero en una aseguradora?",
          a: "El de siniestralidad por ramo, porque es el que más decisiones habilita y el que hoy más trabajo manual consume. Una vez modelado el cruce de emisión y siniestros, los tableros de producción por productor y de evolución de cartera se construyen sobre el mismo modelo, con esfuerzo incremental bajo.",
        },
        {
          q: "¿Se puede dar acceso a los productores a sus propios números?",
          a: "Sí, con seguridad a nivel de fila: cada productor abre el mismo tablero y ve exclusivamente su cartera. Es una de las formas más directas de mejorar la relación con el canal, porque reemplaza el envío mensual de un reporte armado a mano por acceso permanente y autogestionado.",
        },
        {
          q: "¿Por qué mover los expedientes de siniestro a SharePoint?",
          a: "Por la trazabilidad. Un expediente de siniestro acumula versiones de peritajes, presupuestos y conformidades, y en una carpeta de red compartida es imposible reconstruir después qué documento regía en cada instancia. SharePoint registra versiones y accesos, lo que sostiene el expediente frente a una auditoría o un reclamo.",
        },
        {
          q: "¿Cuánto demora tener el primer tablero en producción?",
          a: "El tiempo real lo consume el modelado y la validación de los datos, no la construcción visual. Cuando los orígenes están identificados y hay alguien del negocio que valide las definiciones —qué cuenta como siniestro cerrado, por ejemplo— el primer tablero llega rápido; cuando esas definiciones no están acordadas, ningún tablero las va a resolver.",
        },
      ],
      keywords: [
        "Power BI seguros",
        "tablero siniestralidad",
        "analítica aseguradoras",
        "SharePoint expedientes siniestros",
        "producción por productor",
      ],
    },

    juridicos: {
      metaTitle: "Microsoft 365 y gestión documental para estudios · Accedra",
      metaDescription:
        "Consultoría Microsoft para estudios jurídicos: gestión documental de expedientes en SharePoint, control de versiones, Teams y tableros de horas.",
      h2: "Gestión documental de expedientes con Microsoft 365",
      intro: [
        "El activo de un estudio jurídico es su documentación, y la forma en que la mayoría la guarda es una estructura de carpetas de red que creció sin diseño durante años. El síntoma es siempre el mismo: nadie está seguro de cuál es la última versión de un escrito, los documentos se duplican en carpetas personales y encontrar algo de un expediente viejo depende de que se acuerde quién lo trabajó.",
        "Ordenar eso con SharePoint no es mudar carpetas: es definir una estructura por expediente con metadatos —cliente, materia, estado, responsable— que permita buscar por criterio y no por ubicación. El control de versiones elimina la discusión sobre cuál es el archivo vigente, y los permisos por expediente resuelven la confidencialidad de forma granular, algo imposible en una carpeta compartida. Sobre eso, Teams reemplaza las cadenas de mail por conversación asociada al expediente, y Power BI da visibilidad sobre horas, carga de trabajo y facturación.",
      ],
      compliance: [
        {
          label: "Secreto profesional",
          detail:
            "El acceso a cada expediente debe poder restringirse por persona y quedar registrado.",
        },
        {
          label: "Ley 25.326",
          detail:
            "Los datos de las partes contenidos en la documentación son datos personales.",
        },
      ],
      faqs: [
        {
          q: "¿Cómo se organiza la documentación de expedientes en SharePoint?",
          a: "Por metadatos antes que por carpetas. Se define un conjunto de campos —cliente, materia, estado, abogado responsable, fecha— y cada documento se clasifica con ellos. Eso permite buscar y filtrar por criterio en lugar de recordar en qué carpeta quedó algo, y hace que un mismo documento aparezca en todas las vistas donde corresponde sin duplicarse.",
        },
        {
          q: "¿Se puede restringir el acceso a un expediente sensible dentro del estudio?",
          a: "Sí, con permisos a nivel de expediente o biblioteca. Es una de las diferencias prácticas más importantes frente a una carpeta de red, donde el control suele ser todo o nada. Además queda registro de quién accedió a cada documento, lo que respalda el deber de confidencialidad frente al cliente.",
        },
        {
          q: "¿Qué resuelve el control de versiones en un estudio jurídico?",
          a: "La pregunta de cuál es el escrito vigente. SharePoint conserva el historial completo y permite volver a una versión anterior, con registro de quién hizo cada cambio. Elimina la práctica de archivos con sufijos —final, final2, final_revisado— que es donde más errores se cometen al presentar.",
        },
        {
          q: "¿Sirve Power BI en un estudio o es sólo para empresas grandes?",
          a: "Sirve para las tres preguntas de gestión que todo estudio se hace: cuántas horas se dedicaron a cada cliente, cómo está distribuida la carga entre el equipo y qué se facturó contra qué se trabajó. No requiere volumen: requiere que las horas se carguen con alguna disciplina, que es la condición previa a cualquier tablero.",
        },
      ],
      keywords: [
        "gestión documental estudios jurídicos",
        "SharePoint expedientes",
        "Microsoft 365 abogados",
        "control de versiones legal",
        "tablero horas facturables",
      ],
    },

    laboratorios: {
      metaTitle: "Power BI y Microsoft 365 para laboratorios · Accedra",
      metaDescription:
        "Consultoría Microsoft para laboratorios y salud: tableros de producción y tiempos de entrega, gestión documental de protocolos y automatización.",
      h2: "Analítica y gestión documental para laboratorios",
      intro: [
        "Un laboratorio mide todo lo que ocurre dentro de un ensayo y muy poco de lo que ocurre alrededor. Los tiempos de entrega por tipo de estudio, los cuellos de botella entre recepción y validación, la tasa de repeticiones y el rendimiento por turno suelen conocerse por percepción antes que por dato, porque la información está en el sistema de gestión pero no en un formato que alguien pueda mirar.",
        "Power BI resuelve esa capa sin tocar el sistema que ya opera: se conecta a los orígenes existentes y modela los indicadores de producción, tiempos y calidad. En paralelo, la documentación que exige el marco de buenas prácticas —procedimientos, protocolos, registros de capacitación— se ordena en SharePoint con control de versiones y circuitos de aprobación, que es exactamente lo que una auditoría pide poder reconstruir. Power Automate cubre los avisos y aprobaciones que hoy dependen de que alguien se acuerde de mandar un mail.",
      ],
      compliance: [
        {
          label: "ANMAT — buenas prácticas",
          detail:
            "Exige procedimientos vigentes, versionados y con evidencia de aprobación y capacitación del personal.",
        },
        {
          label: "Ley 25.326 — datos sensibles",
          detail:
            "Los datos de pacientes en tableros deben estar agregados o restringidos por perfil.",
        },
      ],
      faqs: [
        {
          q: "¿Qué indicadores conviene medir primero en un laboratorio?",
          a: "El tiempo entre recepción de la muestra y entrega del resultado, abierto por tipo de estudio y por etapa. Es el indicador que explica la percepción del paciente y el que revela dónde está el cuello de botella real, que casi nunca es el análisis en sí sino la validación o la carga administrativa previa.",
        },
        {
          q: "¿Cómo se gestionan los procedimientos y protocolos con control de versiones?",
          a: "En bibliotecas de SharePoint con versionado y flujo de aprobación: un procedimiento nuevo no queda vigente hasta que lo aprueba quien corresponde, y el histórico de versiones anteriores se conserva. Es lo que permite responder en una auditoría qué procedimiento regía en una fecha determinada, que es la pregunta que efectivamente se hace.",
        },
        {
          q: "¿Se puede llevar registro de capacitación del personal en el mismo entorno?",
          a: "Sí. Se asocia cada procedimiento con la constancia de que el personal correspondiente lo leyó y fue capacitado, y se automatizan los avisos cuando un procedimiento se actualiza y requiere recapacitación. Reemplaza planillas paralelas que suelen estar desactualizadas justo cuando llega la auditoría.",
        },
        {
          q: "¿Los tableros pueden incluir datos de pacientes?",
          a: "Conviene trabajarlos agregados. Para indicadores de producción y tiempos no hace falta el dato individual, y evitar el dato personal simplifica el cumplimiento de la Ley 25.326, que clasifica la información de salud como dato sensible. Cuando se necesita el detalle, se restringe el acceso por perfil dentro del propio modelo.",
        },
      ],
      keywords: [
        "Power BI laboratorios",
        "indicadores tiempo de entrega",
        "gestión documental ANMAT",
        "SharePoint procedimientos",
        "analítica salud",
      ],
    },

    logistica: {
      metaTitle: "Power BI para logística: OTIF y flota · Accedra",
      metaDescription:
        "Consultoría Microsoft para logística: tableros de cumplimiento de entregas, costo por envío y disponibilidad de flota. Automatización con Power Platform.",
      h2: "Tableros de operación y flota con Power BI",
      intro: [
        "Una operación logística genera datos en cada movimiento, y aun así la pregunta de cómo venimos suele responderse con un reporte que alguien arma los lunes. El problema es de latencia: cuando el desvío se detecta con una semana de atraso, ya se transformó en un reclamo del cliente. Lo que cambia el juego no es tener más datos sino verlos el mismo día.",
        "Modelamos en Power BI los indicadores que efectivamente mueven la operación: cumplimiento de entregas en tiempo y forma, costo por envío y por ruta, ocupación y disponibilidad de flota, y desvíos por sitio. Los orígenes son los sistemas que ya están —TMS, ERP, planillas de operación— sin exigir reemplazarlos. Sobre eso, Power Automate dispara alertas cuando un indicador cruza un umbral, para que la información llegue a quien puede actuar en lugar de esperar a que alguien abra el tablero.",
      ],
      compliance: [
        {
          label: "Trazabilidad operativa",
          detail:
            "El registro de entregas y desvíos debe ser reconstruible para sostener reclamos y acuerdos de nivel de servicio.",
        },
      ],
      faqs: [
        {
          q: "¿Qué es OTIF y por qué es el indicador central en logística?",
          a: "OTIF —On Time In Full— mide el porcentaje de entregas realizadas en el plazo comprometido y completas. Es el indicador central porque combina las dos cosas que el cliente efectivamente percibe: que llegue cuando se prometió y que llegue todo. Medir sólo puntualidad esconde los envíos que llegaron a tiempo pero incompletos.",
        },
        {
          q: "¿Se puede conectar Power BI al sistema de gestión de transporte que ya usamos?",
          a: "Sí. Power BI se conecta a bases de datos, APIs y archivos, que cubre prácticamente cualquier TMS o ERP en uso. Lo que define el esfuerzo no es la conexión sino el modelado: unificar cómo se identifica un envío entre sistemas distintos suele ser la parte que más trabajo lleva y la que más valor aporta.",
        },
        {
          q: "¿Cómo se hace para que un desvío se detecte el mismo día y no la semana siguiente?",
          a: "Con alertas automáticas sobre el modelo, en lugar de depender de que alguien abra el tablero. Se define un umbral —por ejemplo, cumplimiento por debajo de cierto porcentaje en una ruta— y Power Automate notifica al responsable cuando se cruza. El tablero sirve para analizar; la alerta, para reaccionar.",
        },
        {
          q: "¿Qué se necesita para medir costo por envío con precisión?",
          a: "Poder imputar los costos variables al envío individual, que es donde suele fallar el dato. Combustible, peajes y horas de chofer se registran a nivel de viaje o de período, y traducirlos a costo por envío requiere definir un criterio de asignación. Esa definición es una decisión de negocio que hay que tomar antes de construir el tablero, no después.",
        },
      ],
      keywords: [
        "Power BI logística",
        "indicador OTIF",
        "tablero de flota",
        "costo por envío",
        "analítica de distribución",
      ],
    },

    retail: {
      metaTitle: "Power BI para retail: ventas, stock y margen · Accedra",
      metaDescription:
        "Consultoría Microsoft para retail: tableros de venta por sucursal, rotación de stock y margen por categoría. Microsoft 365 y automatización de circuitos.",
      h2: "Analítica de ventas, stock y margen con Power BI",
      intro: [
        "En retail el dato existe y llega tarde. La venta de ayer se conoce hoy, la rotación de una categoría se revisa a fin de mes y el quiebre de stock se detecta cuando el vendedor lo reporta. Cada una de esas demoras tiene un costo directo: producto que no se repuso a tiempo es venta que se fue al competidor de al lado.",
        "Armamos en Power BI el modelo que cruza venta, stock y margen por sucursal, categoría y período, con el detalle que cada nivel de la organización necesita: el gerente de local mira su sucursal, la gerencia comercial mira la comparación entre locales, y compras mira rotación y quiebres. Sobre el mismo modelo se configuran alertas de quiebre y de desvío de margen, para que la información llegue al responsable en el momento. Microsoft 365 y Power Automate cubren los circuitos administrativos —aprobaciones de descuento, pedidos de reposición, comunicación a locales— que hoy viven en mails y grupos de mensajería.",
      ],
      compliance: [
        {
          label: "Ley 25.326",
          detail:
            "Los datos de clientes de programas de fidelidad requieren consentimiento y control de acceso.",
        },
        {
          label: "Ley 24.240 — Defensa del Consumidor",
          detail:
            "La información de precios y condiciones exhibida debe ser consistente con la registrada.",
        },
      ],
      faqs: [
        {
          q: "¿Qué debería mostrar el tablero de un gerente de sucursal?",
          a: "Su venta contra objetivo, el comparativo con el mismo período del año anterior, las categorías con quiebre de stock y el margen por categoría. Poco y accionable: un gerente de local que abre un tablero con cuarenta indicadores no lo usa. La comparación entre sucursales conviene reservarla para el nivel de gerencia comercial.",
        },
        {
          q: "¿Cómo se detecta un quiebre de stock antes de que el vendedor lo reporte?",
          a: "Cruzando stock disponible con velocidad de venta de cada artículo: cuando la cobertura proyectada cae por debajo del plazo de reposición, se dispara la alerta. Es un cálculo simple que casi ninguna operación tiene automatizado, y es de los que más impacto directo tiene sobre la venta perdida.",
        },
        {
          q: "¿Se puede medir margen real por categoría si los costos cambian seguido?",
          a: "Sí, siempre que el costo se registre con fecha de vigencia y el modelo use el costo correspondiente a la fecha de cada venta. El error habitual es calcular el margen histórico con el costo actual, lo que distorsiona todo período con inflación o variación de tipo de cambio. Es una decisión de modelado que hay que resolver al inicio.",
        },
        {
          q: "¿Sirve para una cadena chica o hace falta volumen?",
          a: "Sirve desde pocas sucursales, porque el problema que resuelve no es de volumen sino de latencia y de consistencia entre locales. Lo que sí hace falta es que la información de venta y stock esté en un sistema y no en planillas por local, porque ahí el trabajo previo de unificación supera el del tablero.",
        },
      ],
      keywords: [
        "Power BI retail",
        "tablero de ventas por sucursal",
        "rotación de stock",
        "margen por categoría",
        "analítica comercio",
      ],
    },
  },

  // ══════════════════════════════════════════════════════════════════════
  //  SEGURIDAD IT
  // ══════════════════════════════════════════════════════════════════════
  seguridad: {
    bancos: {
      metaTitle: "Ciberseguridad para bancos y entidades financieras · Accedra",
      metaDescription:
        "Ciberseguridad bancaria: arquitectura Zero Trust, doble factor, protección de endpoints y seguridad de email con Cisco y Palo Alto. Partner certificado.",
      h2: "Ciberseguridad para entidades financieras",
      intro: [
        "Un banco es un objetivo permanente, y el vector de entrada casi nunca es el más sofisticado: es un mail que parece del área de sistemas y una credencial que alguien entrega sin darse cuenta. Por eso la arquitectura arranca por la identidad. El doble factor de autenticación en todos los accesos —no sólo en los críticos— y el principio de menor privilegio son la base sobre la que cualquier otra medida tiene sentido.",
        "Sobre esa base montamos las capas que contienen lo que la identidad no frena: firewalls de nueva generación en el perímetro, filtrado de navegación y DNS con Cisco Umbrella para cortar la conexión con infraestructura maliciosa antes de que se establezca, protección de endpoints con Cisco AMP, y seguridad de email, que es donde empieza la mayoría de los incidentes. El modelo de referencia es Zero Trust: cada acceso se verifica, ningún segmento se considera confiable por estar adentro.",
      ],
      compliance: [
        {
          label: "BCRA — ciberseguridad",
          detail:
            "Las Comunicaciones 'A' exigen gestión formal del riesgo tecnológico, controles documentados y respuesta ante incidentes.",
        },
        {
          label: "Ley 25.326",
          detail:
            "Exige medidas técnicas de seguridad sobre los datos personales de los clientes.",
        },
        {
          label: "PCI DSS",
          detail:
            "Define controles obligatorios para los entornos que procesan datos de tarjeta.",
        },
      ],
      faqs: [
        {
          q: "¿Qué es una arquitectura Zero Trust y por qué aplica a un banco?",
          a: "Es un modelo donde ningún acceso se considera confiable por su origen: da lo mismo si viene de la red interna o de afuera, cada solicitud se autentica y autoriza. Aplica especialmente a un banco porque el perímetro dejó de existir — hay acceso remoto, servicios en nube y terceros conectados — y asumir que lo interno es seguro es lo que convierte un incidente puntual en un compromiso general.",
        },
        {
          q: "¿Cómo se reduce el riesgo de phishing sobre el personal de sucursales?",
          a: "Con tres capas que se complementan. Filtrado de email que bloquea la mayoría antes de que llegue; filtrado de DNS que corta la conexión aunque el usuario haga clic, porque el dominio malicioso no resuelve; y doble factor, que hace que una credencial robada no alcance para entrar. Ninguna de las tres es suficiente sola, y la capacitación no reemplaza a ninguna.",
        },
        {
          q: "¿Qué exige el BCRA en materia de ciberseguridad?",
          a: "Las Comunicaciones 'A' del Banco Central requieren que las entidades gestionen formalmente el riesgo tecnológico: controles documentados, gestión de accesos, registro de eventos y procedimientos de respuesta ante incidentes. El punto que más suele faltar no es la tecnología sino la evidencia documentada de que los controles operan.",
        },
        {
          q: "¿Cómo se protege el acceso remoto del personal sin exponer el core?",
          a: "Con VPN sobre doble factor y segmentación estricta de lo que cada perfil alcanza. El acceso remoto no debe entregar una ruta general a la red interna sino a los sistemas puntuales que el rol requiere. Sumar verificación del estado del dispositivo antes de permitir la conexión cierra el hueco de los equipos personales sin gestión.",
        },
      ],
      keywords: [
        "ciberseguridad bancaria",
        "Zero Trust bancos",
        "BCRA ciberseguridad",
        "phishing entidades financieras",
        "seguridad perimetral Cisco",
      ],
    },

    seguros: {
      metaTitle: "Ciberseguridad para aseguradoras · Accedra",
      metaDescription:
        "Seguridad IT para compañías de seguros: protección contra ransomware, resguardo de datos de asegurados y acceso seguro de productores. Zero Trust.",
      h2: "Ciberseguridad para compañías de seguros",
      intro: [
        "Una aseguradora concentra exactamente lo que un atacante busca: datos personales de miles de asegurados, información de siniestros y documentación con valor económico. Y tiene una superficie de exposición particular, porque su operación depende de terceros —productores, brokers, peritos, talleres— que acceden a sistemas sin estar bajo la gestión de la compañía.",
        "Ese acceso de terceros es donde ponemos el foco: autenticación fuerte, permisos acotados al rol y visibilidad de qué hizo cada uno. Sobre eso van las capas estándar —firewall de nueva generación, protección de endpoints, filtrado de DNS y seguridad de email— y el punto que define la supervivencia frente a un ransomware, que es el resguardo. Una copia inmutable o fuera de línea de los sistemas de gestión y del repositorio documental es la diferencia entre un incidente de días y uno que compromete la continuidad del negocio.",
      ],
      compliance: [
        {
          label: "Ley 25.326",
          detail:
            "Exige medidas técnicas sobre los datos personales de asegurados y terceros involucrados en siniestros.",
        },
        {
          label: "SSN",
          detail:
            "Requiere continuidad operativa y resguardo de la documentación de pólizas y siniestros.",
        },
      ],
      faqs: [
        {
          q: "¿Cómo se protege el acceso de productores y peritos externos?",
          a: "Con autenticación de doble factor y permisos acotados estrictamente al rol: el productor alcanza emisión y consulta de su cartera, el perito sólo los expedientes que se le asignaron. Y con registro de actividad, para poder reconstruir qué hizo cada usuario externo. El riesgo es que el dispositivo del tercero no está bajo gestión de la compañía, así que el control tiene que estar del lado del acceso.",
        },
        {
          q: "¿Qué protege efectivamente contra un ransomware en una aseguradora?",
          a: "El resguardo, por encima de todo lo demás. Las capas de prevención —email, endpoint, DNS, firewall— reducen la probabilidad, pero la única garantía de recuperar la operación sin negociar es una copia inmutable o fuera de línea que el atacante no pueda cifrar. Conviene probar la restauración periódicamente: un backup que nunca se restauró es una hipótesis, no un respaldo.",
        },
        {
          q: "¿Qué obligaciones tiene una aseguradora sobre los datos de sus asegurados?",
          a: "La Ley 25.326 exige adoptar medidas técnicas y organizativas de seguridad sobre los datos personales que administra, y responder por ellos aun cuando el tratamiento lo haga un tercero. En la práctica eso implica controlar el acceso, registrar quién consulta qué y poder demostrar que los controles existen y operan.",
        },
        {
          q: "¿Por dónde empezar si no hay una estrategia de seguridad armada?",
          a: "Por identidad y resguardo, en ese orden. Doble factor en todos los accesos y un esquema de backup probado cubren los dos escenarios más frecuentes y más costosos: credencial comprometida y cifrado por ransomware. Recién después conviene invertir en las capas de detección, que sin esas dos bases dan visibilidad sobre un problema que igual no se puede contener.",
        },
      ],
      keywords: [
        "ciberseguridad aseguradoras",
        "ransomware seguros",
        "protección datos asegurados",
        "acceso seguro productores",
        "backup inmutable",
      ],
    },

    juridicos: {
      metaTitle: "Ciberseguridad para estudios jurídicos · Accedra",
      metaDescription:
        "Seguridad IT para estudios jurídicos: protección contra ransomware, resguardo de expedientes y control de acceso. Confidencialidad y secreto profesional.",
      h2: "Ciberseguridad y resguardo para estudios jurídicos",
      intro: [
        "Los estudios jurídicos se volvieron un objetivo frecuente por una razón simple: concentran información valiosa de muchas empresas y suelen tener defensas más livianas que sus propios clientes. Un atacante que no puede entrar a una corporación puede entrar al estudio que lleva sus contratos, y obtener lo mismo con menos esfuerzo. A eso se suma que un ransomware en un estudio no compromete un sistema: compromete el archivo completo de trabajo.",
        "El planteo empieza por lo que sostiene el deber de confidencialidad: control de acceso por identidad, con permisos por expediente y registro de quién abrió qué. Sigue por el resguardo, con copias fuera del alcance de la red que pueda comprometerse y restauración probada. Y se completa con las capas de prevención que evitan la mayoría de los incidentes: seguridad de email —el vector dominante—, protección de endpoints y filtrado de navegación, más doble factor en todo acceso remoto.",
      ],
      compliance: [
        {
          label: "Secreto profesional",
          detail:
            "El deber de confidencialidad exige controlar y poder auditar el acceso a la documentación de cada cliente.",
        },
        {
          label: "Ley 25.326",
          detail:
            "Los datos de las partes exigen medidas técnicas de resguardo.",
        },
      ],
      faqs: [
        {
          q: "¿Por qué los estudios jurídicos son un objetivo frecuente de ataques?",
          a: "Porque concentran información sensible de muchas organizaciones y suelen tener menos controles que esas mismas organizaciones. Para un atacante, el estudio es la ruta de menor resistencia hacia los contratos, las estrategias procesales y los datos de sus clientes corporativos. El tamaño del estudio no lo protege: en la práctica lo vuelve más atractivo.",
        },
        {
          q: "¿Qué pasa si un ransomware cifra todos los expedientes del estudio?",
          a: "Sin un respaldo fuera del alcance del ataque, la recuperación depende de negociar con el atacante y no hay garantía de resultado. Por eso la copia inmutable o fuera de línea es la medida más importante, y hay que probar la restauración con regularidad. Además existe un segundo riesgo que el backup no cubre: la filtración de la documentación, que compromete el secreto profesional aunque los archivos se recuperen.",
        },
        {
          q: "¿Cómo se controla quién accede a cada expediente?",
          a: "Con identidad individual y permisos por expediente, no con una credencial compartida por todo el estudio. Cada persona entra con su usuario, y el acceso a documentación sensible se restringe a quienes trabajan en esa causa. Eso deja registro auditable, que es lo que permite responderle a un cliente quién tuvo acceso a su información.",
        },
        {
          q: "¿Alcanza con un antivirus en las computadoras del estudio?",
          a: "No. El antivirus tradicional detecta amenazas conocidas, y la mayoría de los incidentes actuales entran por credenciales robadas o por un archivo que ninguna firma reconoce todavía. Las medidas que más reducen el riesgo real son el doble factor, la seguridad de email y el resguardo probado — el antivirus es una capa más, no la defensa principal.",
        },
      ],
      keywords: [
        "ciberseguridad estudios jurídicos",
        "ransomware abogados",
        "confidencialidad expedientes",
        "backup estudio jurídico",
        "secreto profesional digital",
      ],
    },

    laboratorios: {
      metaTitle: "Ciberseguridad para laboratorios y salud · Accedra",
      metaDescription:
        "Seguridad IT en salud: protección de datos sensibles, aislamiento de equipamiento clínico y defensa contra ransomware. Continuidad de la operación.",
      h2: "Ciberseguridad para laboratorios y organizaciones de salud",
      intro: [
        "En salud un incidente de seguridad tiene una consecuencia que no tiene en otras industrias: puede frenar la atención. Un ransomware que cifra el sistema de gestión deja al laboratorio sin poder entregar resultados y al centro de salud sin acceso a las historias clínicas, con impacto directo sobre pacientes. Y los datos comprometidos son datos sensibles bajo la Ley 25.326, la categoría de mayor protección.",
        "El problema estructural del sector es el equipamiento clínico: analizadores y dispositivos que corren software que el fabricante no actualiza y donde no se puede instalar un agente de seguridad. La respuesta es aislarlos en segmentos con reglas explícitas de comunicación, en lugar de intentar protegerlos individualmente. Sobre eso van las capas convencionales —email, endpoints en las estaciones que sí lo admiten, filtrado de DNS y firewall— y el resguardo probado, que en salud es también un requisito de continuidad asistencial y no sólo de recuperación de datos.",
      ],
      compliance: [
        {
          label: "Ley 25.326 — datos sensibles",
          detail:
            "Los datos de salud son la categoría de mayor protección y exigen control de acceso y trazabilidad.",
        },
        {
          label: "Ley 26.529",
          detail:
            "La historia clínica en soporte electrónico requiere garantías de integridad, confidencialidad y disponibilidad.",
        },
        {
          label: "ANMAT",
          detail:
            "Los registros deben conservarse íntegros y disponibles ante auditoría.",
        },
      ],
      faqs: [
        {
          q: "¿Cómo se protege equipamiento clínico que no admite antivirus?",
          a: "Aislándolo por red en lugar de protegerlo por software. Se lo ubica en un segmento propio con reglas que definen exactamente con qué sistemas puede comunicarse, y se bloquea todo el resto. Es la única estrategia efectiva para equipos con sistemas operativos sin soporte, que son mayoría en el parque de analizadores instalado.",
        },
        {
          q: "¿Qué impacto tiene un ransomware en un laboratorio o centro de salud?",
          a: "Frena la operación asistencial, no sólo la administrativa. Sin sistema de gestión no se validan ni se entregan resultados, y sin acceso a historias clínicas la atención se degrada. Por eso en salud el resguardo se dimensiona por tiempo de recuperación —cuánto puede estar caída la operación— y no sólo por integridad de los datos.",
        },
        {
          q: "¿Qué obligaciones hay sobre los datos de pacientes?",
          a: "La Ley 25.326 clasifica los datos de salud como sensibles, la categoría que exige el mayor nivel de protección, y la Ley 26.529 requiere que la historia clínica en soporte electrónico garantice integridad, confidencialidad y disponibilidad. En términos prácticos hay que controlar el acceso por identidad y poder demostrar quién consultó cada registro.",
        },
        {
          q: "¿Se puede segmentar la red sin frenar la operación del laboratorio?",
          a: "Sí, si se releva primero qué comunica con qué. El error frecuente es aplicar reglas restrictivas sin conocer los flujos reales, y cortar la conexión entre un analizador y el sistema de gestión. Se trabaja en modo observación antes de aplicar bloqueos, para que las reglas reflejen la operación real y no una suposición.",
        },
      ],
      keywords: [
        "ciberseguridad salud",
        "protección datos sensibles pacientes",
        "ransomware laboratorios",
        "segmentación equipamiento médico",
        "continuidad asistencial",
      ],
    },

    logistica: {
      metaTitle: "Ciberseguridad para logística y operaciones 24/7 · Accedra",
      metaDescription:
        "Seguridad IT para logística: continuidad de operaciones críticas, protección de sistemas de gestión y defensa contra ransomware sin ventanas de parada.",
      h2: "Ciberseguridad para operaciones logísticas",
      intro: [
        "Una operación logística no tiene horario de baja actividad donde aplicar parches con tranquilidad. Trabaja 24/7, y eso genera una tensión constante: los sistemas que más habría que actualizar son los que nunca se pueden detener. El resultado típico es un parque con actualizaciones atrasadas y equipamiento de depósito que quedó fuera de todo esquema de gestión.",
        "Trabajamos ese escenario con dos criterios. Primero, segmentar: separar la red de operación —handhelds, sistemas de depósito, equipamiento industrial— de la red administrativa, para que un incidente en oficinas no llegue a la playa. Segundo, priorizar la continuidad sobre la perfección: un esquema de resguardo probado, con tiempo de recuperación definido, vale más que una política de parcheo que nunca se puede ejecutar. Sobre eso, seguridad de email y protección de endpoints en las estaciones administrativas, que es por donde entran la mayoría de los incidentes.",
      ],
      compliance: [
        {
          label: "Continuidad operativa",
          detail:
            "Los acuerdos de nivel de servicio con clientes exigen que la operación se sostenga y que los incidentes tengan tiempo de recuperación definido.",
        },
        {
          label: "Ley 25.326",
          detail:
            "Los datos de destinatarios de envíos son datos personales sujetos a protección.",
        },
      ],
      faqs: [
        {
          q: "¿Cómo se aplican actualizaciones de seguridad en una operación que no para?",
          a: "Con ventanas acotadas por sitio y equipamiento redundante donde la criticidad lo justifica: se actualiza la mitad de un par en alta disponibilidad mientras la otra sostiene el servicio, y después se invierte. Donde no hay redundancia, se prioriza por exposición real — lo que está expuesto a internet primero, lo que vive en un segmento aislado después.",
        },
        {
          q: "¿Por qué separar la red del depósito de la red administrativa?",
          a: "Para acotar el radio de un incidente. Los sistemas de depósito y los handhelds suelen tener actualizaciones atrasadas porque no se pueden detener, y si comparten segmento con las estaciones administrativas —donde llegan los mails— un incidente de oficina frena la operación física. La segmentación no elimina el riesgo, pero evita que se propague.",
        },
        {
          q: "¿Qué tiempo de recuperación conviene definir para una operación logística?",
          a: "El que la operación pueda tolerar sin incumplir sus acuerdos de servicio, que en distribución suele medirse en horas y no en días. Ese número es el que define la inversión en resguardo y redundancia — y conviene fijarlo con el área de operaciones antes de diseñar el esquema técnico, no después.",
        },
        {
          q: "¿Los dispositivos de los choferes son un riesgo de seguridad?",
          a: "Lo son si acceden a sistemas de gestión sin control. Conviene que los dispositivos de reparto estén bajo gestión —con la aplicación acotada a lo que necesitan y sin acceso general a la red— y que la autenticación sea individual. Un dispositivo perdido con una sesión abierta y permisos amplios es un problema evitable por diseño.",
        },
      ],
      keywords: [
        "ciberseguridad logística",
        "continuidad operativa 24/7",
        "segmentación red depósito",
        "ransomware distribución",
        "seguridad OT",
      ],
    },

    retail: {
      metaTitle: "Ciberseguridad para retail y puntos de venta · Accedra",
      metaDescription:
        "Seguridad IT para retail: protección de terminales de pago, cumplimiento PCI DSS y defensa contra ransomware en operaciones multisucursal.",
      h2: "Ciberseguridad para retail y medios de pago",
      intro: [
        "El retail tiene una superficie de ataque que crece con cada sucursal. Muchos locales, personal con alta rotación, terminales de pago y un WiFi abierto al público conviven en el mismo espacio físico, y el control técnico de cada sitio es necesariamente más liviano que el de una casa central. El objetivo del atacante es concreto: los datos de tarjeta que pasan por los puntos de venta.",
        "El eje es la segmentación del entorno de pago, que además de reducir riesgo es un requisito explícito de PCI DSS. Las terminales que procesan tarjetas viven en un segmento propio, sin ruta desde la red administrativa ni desde el WiFi de clientes, y con reglas que limitan estrictamente con qué destinos pueden comunicarse. Sobre eso, protección de endpoints en las estaciones administrativas, filtrado de DNS que aplica en todos los sitios por igual, y gestión centralizada de políticas — porque lo que no se administra desde un solo lugar, en una cadena, deja de aplicarse.",
      ],
      compliance: [
        {
          label: "PCI DSS",
          detail:
            "Exige aislar el entorno de datos de tarjeta, controlar accesos y mantener registros de eventos.",
        },
        {
          label: "Ley 25.326",
          detail:
            "Los datos de clientes de programas de fidelidad requieren resguardo y consentimiento.",
        },
        {
          label: "Ley 24.240",
          detail:
            "La información del consumidor debe resguardarse con la diligencia que exige la relación de consumo.",
        },
      ],
      faqs: [
        {
          q: "¿Qué exige PCI DSS sobre la red de un comercio?",
          a: "Que el entorno donde se procesan, almacenan o transmiten datos de tarjeta esté aislado del resto de la red, con controles de acceso documentados y registro de eventos. En la práctica implica que las terminales de pago no compartan segmento con las estaciones administrativas ni con el WiFi de clientes, y que esa separación se pueda demostrar.",
        },
        {
          q: "¿Cómo se sostiene la seguridad en locales con alta rotación de personal?",
          a: "Reduciendo lo que depende del comportamiento individual. Credenciales nominales que se dan de baja al egreso, permisos mínimos por rol y controles técnicos que aplican solos —filtrado de navegación, bloqueo de dispositivos externos— pesan más que la capacitación, que en un contexto de rotación alta se diluye rápido.",
        },
        {
          q: "¿El WiFi para clientes puede comprometer la seguridad del local?",
          a: "Sólo si comparte infraestructura lógica con la red de operación. Publicado como red aislada, con su propia salida a internet y sin ruta hacia los segmentos internos, el WiFi de clientes no agrega riesgo relevante al entorno de pago. El riesgo aparece cuando se resuelve rápido y mal, colgándolo de la misma red del local.",
        },
        {
          q: "¿Cómo se administra la seguridad de cincuenta sucursales sin equipo en cada una?",
          a: "Con gestión centralizada de políticas: las reglas se definen una vez y se aplican a todos los sitios desde una consola, en lugar de configurarse local por local. Es la única forma de que una cadena mantenga un estándar uniforme, porque lo que requiere intervención manual en cada sucursal termina aplicándose en unas pocas.",
        },
      ],
      keywords: [
        "ciberseguridad retail",
        "PCI DSS Argentina",
        "seguridad punto de venta",
        "protección terminales de pago",
        "seguridad multisucursal",
      ],
    },
  },

  // ══════════════════════════════════════════════════════════════════════
  //  SOFTWARE & AI
  // ══════════════════════════════════════════════════════════════════════
  "software-ai": {
    bancos: {
      metaTitle: "Software a medida e IA para bancos · Accedra",
      metaDescription:
        "Desarrollo a medida e inteligencia artificial para entidades financieras: automatización de back office, lectura de documentos e integración con el core.",
      h2: "Software a medida e inteligencia artificial para bancos",
      intro: [
        "El back office de un banco está lleno de trabajo que no debería hacer una persona: cargar datos de un formulario a un sistema, comparar dos listados para encontrar diferencias, revisar que un legajo tenga la documentación completa. Son tareas de alto volumen, reglas claras y cero valor agregado humano — exactamente donde la automatización rinde y donde el error manual es más caro.",
        "Construimos ese software contra los sistemas que el banco ya tiene, integrando por API en lugar de reemplazar. Los usos que más aparecen son la extracción automática de datos desde documentación —donde los modelos de lenguaje actuales leen formularios y comprobantes con precisión que antes exigía OCR muy afinado—, la conciliación asistida y los asistentes internos que responden sobre normativa y procedimientos propios de la entidad. En un entorno regulado, el diseño incluye desde el inicio la trazabilidad: qué decidió el sistema, con qué datos y en qué momento.",
      ],
      compliance: [
        {
          label: "BCRA — riesgo tecnológico",
          detail:
            "Los desarrollos que operan sobre procesos críticos requieren control de cambios, documentación y trazabilidad.",
        },
        {
          label: "Ley 25.326",
          detail:
            "El tratamiento automatizado de datos personales exige resguardo y control sobre las decisiones que los afectan.",
        },
      ],
      faqs: [
        {
          q: "¿Se puede usar inteligencia artificial en un banco sin comprometer datos de clientes?",
          a: "Sí, y define buena parte del diseño. Las opciones van desde modelos desplegados en la infraestructura del banco hasta servicios en nube contratados con garantías de no reutilización de los datos enviados. La decisión depende de la sensibilidad del caso de uso: no es lo mismo un asistente que responde sobre normativa interna que uno que procesa documentación de clientes.",
        },
        {
          q: "¿Qué procesos del back office bancario conviene automatizar primero?",
          a: "Los de alto volumen, reglas estables y bajo criterio: carga de datos desde formularios, conciliaciones, verificación de completitud de legajos y generación de reportes recurrentes. Conviene evitar como primer proyecto los procesos con muchas excepciones, donde el esfuerzo de cubrir cada caso particular supera el ahorro.",
        },
        {
          q: "¿Cómo se integra un desarrollo nuevo con el core bancario?",
          a: "Por API contra las interfaces que el core expone, sin tocar su lógica. El desarrollo a medida se ubica como una capa alrededor: consume y escribe a través de las interfaces habilitadas, con control de cambios documentado. Reemplazar o modificar el core es un proyecto de otra naturaleza y de otro riesgo.",
        },
        {
          q: "¿Cómo se audita una decisión tomada por un sistema automatizado?",
          a: "Registrando qué datos usó, qué regla o modelo aplicó y qué resultado produjo, en cada ejecución. En un entorno regulado ese registro no es opcional: es lo que permite responder por qué el sistema resolvió lo que resolvió. Se diseña desde el inicio, porque agregarlo después obliga a rehacer el flujo.",
        },
      ],
      keywords: [
        "software a medida bancos",
        "IA entidades financieras",
        "automatización back office bancario",
        "integración core bancario",
        "extracción de datos documentos",
      ],
    },

    seguros: {
      metaTitle: "Software a medida e IA para aseguradoras · Accedra",
      metaDescription:
        "Desarrollo e inteligencia artificial para seguros: automatización del circuito de siniestros, lectura de documentación y asistentes para el canal.",
      h2: "Automatización e IA para compañías de seguros",
      intro: [
        "El circuito de siniestros es donde una aseguradora gana o pierde la relación con el cliente, y sigue siendo mayormente manual. Alguien recibe la denuncia, alguien lee el presupuesto del taller, alguien compara contra la cobertura y alguien carga el resultado en el sistema. Cada paso agrega días, y los días son exactamente lo que el asegurado mide.",
        "La combinación que más impacto tiene es lectura automática de documentación más automatización de flujo. Los modelos actuales extraen datos de presupuestos, informes periciales y documentación de denuncia con buena precisión, lo que elimina la carga manual y acorta el circuito de días a horas. Sobre eso construimos el flujo que enruta cada caso según reglas de negocio, escala a un humano cuando corresponde y deja registro de cada paso. En el canal, los asistentes internos que responden sobre coberturas y condiciones reducen la consulta repetitiva que hoy absorbe al equipo técnico.",
      ],
      compliance: [
        {
          label: "SSN",
          detail:
            "El circuito de siniestros debe ser trazable y la documentación conservarse íntegra.",
        },
        {
          label: "Ley 25.326",
          detail:
            "El tratamiento automatizado de datos de asegurados exige resguardo y control de acceso.",
        },
      ],
      faqs: [
        {
          q: "¿Puede la inteligencia artificial leer presupuestos e informes periciales?",
          a: "Sí, es uno de los usos más maduros. Los modelos actuales extraen datos estructurados de documentos no estructurados —presupuestos de taller, informes, documentación de denuncia— con precisión suficiente para eliminar la carga manual. Lo que se recomienda es validación humana sobre los casos que el sistema marca con baja confianza, en lugar de revisar el cien por ciento.",
        },
        {
          q: "¿Se puede automatizar la liquidación de un siniestro de punta a punta?",
          a: "En siniestros de baja complejidad y monto acotado, sí, con reglas claras y un umbral definido por encima del cual interviene una persona. En siniestros complejos la automatización aporta en las etapas —extracción de datos, verificación de cobertura, armado del expediente— pero la decisión final conviene que siga siendo humana y quede registrada como tal.",
        },
        {
          q: "¿Sirve un asistente de IA para responder consultas de productores?",
          a: "Sí, cuando se construye sobre la documentación propia de la compañía —condiciones, coberturas, procedimientos— y no sobre conocimiento general. Resuelve la consulta repetitiva que hoy absorbe al equipo técnico y responde a cualquier hora. Es importante que cite la fuente de cada respuesta, para que el productor pueda verificar la condición exacta antes de comprometerla con un cliente.",
        },
        {
          q: "¿Qué riesgo hay de que el sistema se equivoque en un caso concreto?",
          a: "Existe, y por eso el diseño incluye umbrales de confianza y derivación a humano. La comparación relevante no es contra la perfección sino contra el proceso actual, que también tiene errores de carga manual. La diferencia es que el sistema automatizado deja registro de cada decisión y sus datos, lo que permite detectar y corregir el patrón de error.",
        },
      ],
      keywords: [
        "IA seguros",
        "automatización siniestros",
        "lectura automática documentos",
        "software a medida aseguradoras",
        "asistente para productores",
      ],
    },

    juridicos: {
      metaTitle: "Inteligencia artificial y software para estudios jurídicos · Accedra",
      metaDescription:
        "IA aplicada al trabajo legal: búsqueda semántica sobre documentación propia, análisis de contratos y automatización de tareas repetitivas del estudio.",
      h2: "Inteligencia artificial aplicada al trabajo jurídico",
      intro: [
        "Un estudio jurídico acumula un activo que casi nunca aprovecha: años de escritos, dictámenes y contratos que resolvieron problemas parecidos a los que llegan hoy. Ese conocimiento está en la carpeta de alguien, y recuperarlo depende de que un socio recuerde en qué causa se trabajó algo similar. La búsqueda por nombre de archivo no lo encuentra, porque el criterio de búsqueda es conceptual y no textual.",
        "La búsqueda semántica sobre la documentación propia del estudio resuelve exactamente eso: se pregunta en lenguaje natural por un problema y el sistema devuelve los antecedentes internos que lo tratan, aunque no compartan una sola palabra literal. Sobre la misma base construimos análisis de contratos —extracción de cláusulas, plazos y obligaciones para revisión comparativa— y automatización de la producción repetitiva. En todos los casos el criterio es asistir la tarea profesional y dejar la decisión en el abogado, con la fuente citada para que sea verificable.",
      ],
      compliance: [
        {
          label: "Secreto profesional",
          detail:
            "La documentación procesada debe permanecer bajo control del estudio, sin exposición a terceros.",
        },
        {
          label: "Ley 25.326",
          detail:
            "Los datos personales contenidos en la documentación exigen resguardo en cualquier tratamiento automatizado.",
        },
      ],
      faqs: [
        {
          q: "¿Qué es la búsqueda semántica y por qué sirve en un estudio jurídico?",
          a: "Es una búsqueda que entiende el concepto de la consulta en lugar de buscar coincidencias de palabras. Sirve en un estudio porque los antecedentes útiles rara vez comparten vocabulario con la consulta: se busca 'un caso donde se discutió la resolución por incumplimiento en un contrato de distribución' y el sistema devuelve los escritos que lo tratan, aunque usen otros términos.",
        },
        {
          q: "¿La documentación del estudio queda expuesta al usar inteligencia artificial?",
          a: "Depende enteramente de cómo se implemente, y es la decisión más importante del proyecto. Existen esquemas donde el procesamiento ocurre en infraestructura controlada por el estudio, y servicios contratados con garantías explícitas de que los datos enviados no se usan para entrenar modelos. Para documentación amparada por secreto profesional, esa definición se toma antes que cualquier otra.",
        },
        {
          q: "¿Puede la IA redactar escritos judiciales?",
          a: "Puede producir borradores sobre modelos propios del estudio, y ahí tiene valor: acelera la parte repetitiva de la producción. Lo que no puede es asumir la responsabilidad profesional del contenido. El criterio de implementación es que el sistema asista y el abogado decida, con revisión obligatoria — los modelos de lenguaje pueden generar citas y referencias inexactas con total apariencia de corrección.",
        },
        {
          q: "¿Qué se puede automatizar en el análisis de contratos?",
          a: "La extracción de cláusulas, plazos, obligaciones y condiciones de terminación, para revisión comparativa contra un estándar del estudio. Es útil cuando hay volumen —revisar cincuenta contratos de un mismo tipo— porque permite detectar rápido cuáles se apartan del modelo y concentrar la revisión profesional donde efectivamente hace falta.",
        },
      ],
      keywords: [
        "IA estudios jurídicos",
        "búsqueda semántica legal",
        "análisis de contratos IA",
        "legaltech Argentina",
        "automatización estudios de abogados",
      ],
    },

    laboratorios: {
      metaTitle: "Software a medida e IA para laboratorios y salud · Accedra",
      metaDescription:
        "Desarrollo e inteligencia artificial para laboratorios: integración con sistemas de gestión, procesamiento de informes y automatización de circuitos.",
      h2: "Software a medida e IA para laboratorios",
      intro: [
        "En un laboratorio el software crítico ya existe —el sistema de gestión, los equipos, el portal de resultados— y el problema no es reemplazarlo sino conectarlo. Entre un analizador y el sistema de gestión, entre el sistema y la obra social, entre el resultado y el paciente, suele haber pasos manuales que alguien resuelve todos los días copiando información de un lado a otro.",
        "Ahí es donde el desarrollo a medida rinde más: integraciones por API que eliminan la recarga manual, con validación y registro de cada paso. Sobre eso, la inteligencia artificial aporta en el procesamiento de documentación —órdenes médicas, autorizaciones, derivaciones— que hoy se leen y cargan a mano, y en el análisis de los datos de producción para anticipar picos de demanda y planificar turnos e insumos. Toda automatización sobre información clínica se diseña con trazabilidad completa, que es requisito tanto normativo como de sentido común.",
      ],
      compliance: [
        {
          label: "ANMAT",
          detail:
            "Los sistemas que producen registros deben garantizar integridad, atribución y trazabilidad.",
        },
        {
          label: "Ley 25.326 — datos sensibles",
          detail:
            "El tratamiento automatizado de datos de salud exige el máximo nivel de resguardo.",
        },
        {
          label: "Ley 26.529",
          detail:
            "La historia clínica electrónica requiere integridad y disponibilidad de los registros.",
        },
      ],
      faqs: [
        {
          q: "¿Se puede integrar el sistema de gestión del laboratorio con los analizadores?",
          a: "Sí, y suele ser el proyecto con mejor retorno inmediato. La integración elimina la transcripción manual de resultados, que es el punto donde se produce el error más caro de un laboratorio. Se resuelve por las interfaces que el equipamiento expone, con validación y registro de cada resultado transferido.",
        },
        {
          q: "¿Qué puede hacer la IA con órdenes médicas y autorizaciones?",
          a: "Extraer los datos y clasificarlas automáticamente, que hoy se hace leyendo y cargando a mano. Los modelos actuales manejan bien documentos con formatos variables, que es exactamente el caso: cada obra social y cada prescriptor usa un formato distinto. Se recomienda validación humana sobre los casos de baja confianza en lugar de sobre el total.",
        },
        {
          q: "¿Sirve para anticipar demanda y planificar turnos?",
          a: "Sí, cuando hay historial suficiente. Los datos de producción de un laboratorio tienen estacionalidad marcada —por día de la semana, por época del año, por campañas de salud— y esos patrones se modelan bien. El resultado práctico es planificar personal e insumos sobre una proyección en lugar de sobre la memoria del mes anterior.",
        },
        {
          q: "¿Cómo se garantiza la trazabilidad en un proceso automatizado con datos clínicos?",
          a: "Registrando cada paso: qué dato entró, qué transformación se aplicó, qué salió y cuándo. En salud eso no es una buena práctica opcional sino un requisito para que el registro sea atribuible y auditable. Se diseña desde el inicio del desarrollo, porque incorporarlo después implica rehacer el flujo completo.",
        },
      ],
      keywords: [
        "software a medida laboratorios",
        "integración analizadores",
        "IA salud",
        "automatización órdenes médicas",
        "predicción de demanda laboratorio",
      ],
    },

    logistica: {
      metaTitle: "Software a medida e IA para logística · Accedra",
      metaDescription:
        "Desarrollo e inteligencia artificial para operaciones logísticas: optimización de rutas, predicción de demanda e integración con TMS y ERP.",
      h2: "Software a medida e IA para operaciones logísticas",
      intro: [
        "En logística los márgenes se definen en decisiones que se toman todos los días bajo presión de tiempo: cómo armar las rutas de mañana, cuánta flota disponer, qué depósito abastece qué zona. Esas decisiones suelen apoyarse en la experiencia de quien planifica, que funciona bien hasta que el volumen crece o esa persona no está.",
        "La optimización de rutas es el caso de uso más directo: un modelo que considera ventanas horarias, capacidad de vehículo, restricciones de acceso y tiempos reales de recorrido produce planificaciones que reducen kilómetros y aumentan entregas por viaje. Sobre la misma base de datos históricos se construye predicción de demanda por zona y período, que permite dimensionar flota y personal con anticipación. Todo esto se integra contra el TMS o ERP existente por API —el objetivo es que la planificación optimizada llegue al mismo sistema donde opera el equipo, no a una planilla aparte.",
      ],
      compliance: [
        {
          label: "Ley 25.326",
          detail:
            "Los datos de destinatarios y de geolocalización son datos personales sujetos a protección.",
        },
        {
          label: "Trazabilidad operativa",
          detail:
            "Las decisiones automatizadas sobre asignación deben quedar registradas para auditoría y análisis.",
        },
      ],
      faqs: [
        {
          q: "¿Cuánto se puede mejorar la planificación de rutas con optimización automática?",
          a: "La mejora depende del punto de partida: en operaciones planificadas manualmente el margen suele ser significativo, y en operaciones ya optimizadas es incremental. Lo que un modelo aporta consistentemente es considerar simultáneamente más restricciones de las que una persona puede sostener —ventanas horarias, capacidad, accesos, tiempos reales— y hacerlo todos los días con el mismo criterio.",
        },
        {
          q: "¿Qué datos hacen falta para predecir demanda por zona?",
          a: "Historial de envíos con fecha, zona y volumen, de al menos un ciclo estacional completo. Con eso se modelan los patrones que efectivamente existen: día de la semana, época del año, efecto de fechas comerciales. Cuanto más limpio esté el dato histórico de zona, mejor el resultado — y suele ser ahí donde hay que trabajar primero.",
        },
        {
          q: "¿Se integra con el TMS que ya usamos o hay que cambiarlo?",
          a: "Se integra. El desarrollo se ubica como una capa que consume datos del TMS o ERP y devuelve la planificación optimizada al mismo sistema, por API. Reemplazar el sistema de gestión es un proyecto de otra escala y rara vez es necesario para obtener el beneficio de la optimización.",
        },
        {
          q: "¿Qué pasa cuando la realidad no coincide con la ruta planificada?",
          a: "Es la norma, no la excepción, y por eso el sistema tiene que permitir replanificar durante el día en lugar de producir un plan rígido a la mañana. El diseño contempla que el planificador pueda intervenir y que el modelo recalcule con las condiciones nuevas — un optimizador que no admite excepción manual termina sin usarse.",
        },
      ],
      keywords: [
        "optimización de rutas",
        "IA logística",
        "predicción de demanda",
        "integración TMS",
        "software a medida distribución",
      ],
    },

    retail: {
      metaTitle: "Software a medida e IA para retail · Accedra",
      metaDescription:
        "Desarrollo e inteligencia artificial para comercios: previsión de demanda, reposición automática, atención al cliente e integración con el ERP.",
      h2: "Software a medida e IA para retail",
      intro: [
        "En retail casi todo el margen se juega en la previsión. Comprar de más inmoviliza capital y termina en liquidación; comprar de menos es venta perdida que nadie registra porque el cliente simplemente compró en otro lado. La decisión se toma cada semana, artículo por artículo, y en la mayoría de las operaciones sigue apoyándose en el criterio de quien compra.",
        "La previsión de demanda por artículo y sucursal es el caso de uso con retorno más medible: se modela sobre el histórico de ventas incorporando estacionalidad, promociones y efecto de fechas comerciales, y alimenta sugerencias de reposición automática. En atención al cliente, los asistentes construidos sobre el catálogo y las políticas propias resuelven la consulta repetitiva —disponibilidad, estado de pedido, condiciones de cambio— a cualquier hora. Todo integrado contra el ERP existente, porque una previsión que no llega al circuito de compra no cambia nada.",
      ],
      compliance: [
        {
          label: "Ley 25.326",
          detail:
            "Los datos de clientes usados en modelos de recomendación requieren consentimiento y resguardo.",
        },
        {
          label: "Ley 24.240 — Defensa del Consumidor",
          detail:
            "La información automatizada que se le da al consumidor debe ser exacta y consistente con las condiciones reales.",
        },
      ],
      faqs: [
        {
          q: "¿Qué precisión se puede esperar de una previsión de demanda en retail?",
          a: "Varía mucho por categoría: los artículos de rotación estable se proyectan bien, y los de moda o novedad son estructuralmente más difíciles porque tienen poco histórico propio. La comparación útil no es contra la precisión perfecta sino contra el método actual — y el aporte más consistente de un modelo es la sistematicidad, porque aplica el mismo criterio a miles de artículos que nadie puede revisar uno por uno.",
        },
        {
          q: "¿Se puede automatizar la reposición sin perder control sobre las compras?",
          a: "Sí, con el sistema generando la sugerencia y una persona aprobando. Es el esquema que mejor funciona en la práctica: el modelo cubre el volumen —miles de artículos que nadie alcanza a revisar— y el comprador interviene sobre las excepciones y sobre las categorías donde su criterio aporta información que el histórico no tiene.",
        },
        {
          q: "¿Qué puede resolver un asistente de IA en atención al cliente?",
          a: "Las consultas repetitivas y verificables: disponibilidad de producto, estado de un pedido, condiciones de cambio y devolución, horarios y ubicaciones. Construido sobre el catálogo y las políticas propias, responde a cualquier hora y descarga al equipo. Lo importante es que derive a una persona cuando la consulta excede lo que puede responder con certeza, en lugar de improvisar.",
        },
        {
          q: "¿Hace falta cambiar el ERP para implementar esto?",
          a: "No. El desarrollo se integra por API contra el ERP existente: consume ventas y stock, devuelve previsiones y sugerencias al mismo circuito de compra que ya opera. El objetivo explícito es que la previsión llegue donde se decide, porque un modelo que produce un archivo aparte que nadie incorpora al proceso no cambia ningún resultado.",
        },
      ],
      keywords: [
        "IA retail",
        "previsión de demanda",
        "reposición automática",
        "chatbot atención al cliente",
        "software a medida comercio",
      ],
    },
  },
};

/** Devuelve el bloque SEO de una combinación, o null si no existe. */
export function getIndustrySeo(
  solutionSlug: string,
  industrySlug: string,
): IndustrySeo | null {
  return INDUSTRY_SEO[solutionSlug]?.[industrySlug] ?? null;
}
