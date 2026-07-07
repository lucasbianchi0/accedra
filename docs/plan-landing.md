# Plan de rediseño — Landing Accedra (todo lo que va debajo de Hero + ClientsBar)

> Alcance: rehacer **Services (Soluciones) → Partners (Tecnologías) → WhyUs → Testimonials (Voz de clientes) → Contact → Footer**.
> El Hero (con métricas 15+/400+/12+/100+) y la ClientsBar quedan como están.
> Basado en teardown de competidores (Quick, Open IT, Nextware, Logicalis) + lectura del código actual.

---

## 0. El problema de fondo: la página se repite

El mismo mensaje ("tenemos experiencia") aparece **3 veces con los mismos números**:
- **Hero** → 15+ años · 400+ proyectos · 12+ partners · 100+ clientes
- **WhyUs** → 400+ proyectos · 12+ partners · 24/7 (otra vez las mismas métricas, con formato de números gigantes)
- **Testimonials** → badge "100+ clientes satisfechos"

Resultado: de la mitad para abajo la landing no *avanza* una historia, la *repite*. El rediseño tiene que darle a cada sección un trabajo distinto:
**Services = QUÉ hacemos · Partners = CON QUÉ · WhyUs = POR QUÉ nosotros (cualitativo, sin repetir números) · Testimonials = PRUEBA real · Contact = acción.**

### Bugs de contenido a corregir (contradicciones reales en el código)
- **Clientes inconsistentes**: `WhyUs` cita *"YPF, Accenture, Banco Provincia"*, pero ClientsBar / Testimonials / el análisis dicen **Mapfre, Andreani, Finning**. Dos listas de clientes distintas en la misma página → hay que unificar a la real.
- **Formulario falso**: `Contact` hace `setTimeout(1000)` y muestra "enviado" — no manda nada a ningún lado.
- **Links muertos**: todos los links del `Footer` son `href="#"`.
- **LinkedIn**: el footer apunta a `/company/accedra`; el perfil real es `/company/accedra-s.a.`

---

## 1. Qué hace cada competidor (lo que el rubro espera)

| | Servicios | Prueba social | Conversión |
|---|---|---|---|
| **Quick** | 6 servicios con bullets inline | métricas + 25 logos + video testimonial + badges de nivel | form B2B (CUIT, cargo, tamaño) + WhatsApp |
| **Open IT** | 3 pilares con bullets + framing del problema | 5 testimonios nominales + métricas | "hablar con especialista" + agendar |
| **Nextware** | 4 verticales expandidas | Silver Partner (débil: sin logos de clientes) | 4× "agendá reunión sin costo" |
| **Logicalis** | 4 pilares + 60 casos por industria | casos con métrica + premios (Gold) | contenido descargable |

**Constante**: bullets inline (no ocultos tras un click), testimonios nominales, nivel de partnership visible, CTA de baja fricción repetido.

**Dónde gana Accedra y nadie explota**: liderar con **Firma Digital/Biométrica** (moat propio: Wacom+Namirial+Gemalto) y capitalizar la **cartera enterprise** (Mapfre/Andreani/Finning) con casos, no solo logos.

---

## 2. Sección por sección

### A. Services — "Soluciones IT end-to-end"

> **Estado:** fondo ya cambiado (aurora premium en vez de las cables del circuito). Rediseño de la sección: propuesta abajo, pendiente de aprobación.

**Propuesta de rediseño (3 opciones):**
- **Opción 1 — Bento asimétrico:** Firma Biométrica ocupa una card grande (2×) a la izquierda como diferencial; los otros 3 servicios en cards chicas. Rompe la grilla de 4 iguales y jerarquiza el moat.
- **Opción 2 — Lista con panel de detalle (tabs verticales):** a la izquierda los 4 servicios como pestañas; al hacer clic/hover se muestra a la derecha la foto + los bullets inline. Reemplaza el modal, muestra la sustancia sin salir del flujo.
- **Opción 3 — Cards con bullets inline (cambio mínimo):** mantener las 4 cards pero traer 2–3 bullets clave a la vista y dejar el modal solo para el detalle largo. Menos foto decorativa, más contenido.
- En cualquiera de las tres: **liderar con Firma Biométrica**, fotos únicas (no repetir la del Hero) y bullets visibles.

**Detalle del estado actual:** 4 cards (foto + resumen + "Ver más" → modal con los bullets). Bien armado pero:
- La sustancia (los 6 features de cada servicio) está **escondida detrás del modal**. Los competidores muestran los bullets inline.
- La foto de Networking es **la misma que el poster del Hero** (Pexels 4682189) → se siente repetido.
- **Firma Biométrica está en el puesto #3**, siendo el diferencial más vendible.

**Qué haría:**
- Reordenar para **liderar con Firma Biométrica** o darle una card destacada (más grande / "featured").
- Traer **2–3 bullets clave inline** en cada card (no todo escondido en el modal); el modal queda para el detalle largo.
- Fotos únicas por servicio (que no repitan el Hero) o cambiar foto por ilustración/ícono 3D consistente.

### B. Partners — "Tecnologías"
**Hoy:** grid de 12 logos hotlinkeados de Wikipedia con spotlight hover. Limpio, pero:
- Logos **hotlinkeados** (frágil, se pueden romper; tamaños/colores dispares) → self-host en `/public`.
- **No muestra nivel de partnership** (Gold/Silver/Authorized) — el patrón que usan Quick y Logicalis.
- Faltan los partners del **diferencial biométrico**: **Namirial y Gemalto** no están; aparecen marcas que no figuran en el stack real (VMware, Oracle).
- Es un muro de logos plano, sin narrativa.

**Qué haría:**
- Self-host de logos, normalizados (mismo alto óptico, todos en versión monocromo/clara).
- **Agrupar por capacidad** (Redes · Seguridad · Cloud/Datacenter · Firma & Identidad) para que el muro *cuente* qué hace Accedra, no solo qué marcas revende.
- Mostrar nivel donde exista ("Cisco Partner", "Microsoft Partner").

### C. WhyUs → reconvertir en diferenciadores CUALITATIVOS
**Hoy:** 4 cards con números gigantes (400+, 12+, 1, 24/7) → **duplica las métricas del Hero** y menciona clientes equivocados (YPF/Accenture/Banco Provincia).

**Qué haría:**
- **Sacar los números repetidos.** Convertir en 3–4 razones cualitativas que el Hero no dice: *un solo interlocutor end-to-end · cartera enterprise real · soporte local 24/7 · cercanía PyME vs. los gigantes*.
- Corregir los nombres de clientes a los reales.
- Formato más editorial (menos "otra barra de stats").

### D. Testimonials — "La voz de nuestros clientes"
**Hoy:** 3 testimonios reales (Mapfre/Andreani/Finning, con nombre+cargo) sobre un fondo de **56 reviews falsas borroneadas** ("ghost reviews").

**Qué haría:**
- **Eliminar el fondo de reviews falsas** — para B2B enterprise lee como relleno/inflado y arriesga credibilidad. La fuerza de esta sección son los 3 nombres reales.
- Subir de nivel a **caso de éxito** cuando haya permiso: contexto → qué hizo Accedra → resultado con métrica. Es lo que más convierte en B2B.
- Si en algún momento hay video (como Quick), sumarlo.

### E. Contact
**Hoy:** diseño lindo (info a la izquierda, form a la derecha) pero **el form no envía nada** (setTimeout). Campos: nombre, empresa, email, servicio, mensaje.

**Qué haría:**
- **Conectarlo de verdad** (route handler → email/CRM, o Formspree/Resend). Hoy los leads se pierden.
- Sumar 1–2 campos calificadores B2B que usan los competidores: **cargo** y **tamaño de empresa** (o teléfono).
- Mantener WhatsApp como CTA de baja fricción (ya está).

### F. Footer
**Hoy:** marca + 2 columnas de links **todos muertos (`href="#"`)** + barra de contacto + social.

**Qué haría:**
- Cablear los links a anchors reales (`#servicios`, `#partners`, `#nosotros`, `#contacto`).
- Corregir LinkedIn a `/company/accedra-s.a.` y validar Facebook.
- Unificar un solo domicilio (ya usa Irala 1950 — mantener ese en todos lados).

---

## 3. Necesito input del cliente antes de codear
- **Métricas reales** para no inflar (¿15 años / 400 proyectos / 100 clientes son reales?).
- **Casos de éxito**: ¿permiso para nombrar Andreani/Mapfre/Finning con un resultado/métrica?
- **Partners reales del stack** y su nivel (para no listar marcas que no maneja).
- **A dónde van los leads** del formulario (email / CRM / WhatsApp Business).
