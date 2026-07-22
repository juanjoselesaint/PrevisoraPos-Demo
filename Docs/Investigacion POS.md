# Informe de Referencia para Diseño de Mockups de un Sistema POS Genérico Multi-Rubro Responsive

## TL;DR
- Un POS moderno multi-rubro es una plataforma SaaS en la nube (no una caja registradora) que unifica venta, inventario, clientes, pagos, reportes y gestión de caja; para el mockup, el patrón dominante y probado por líderes como Square, Shopify, Toast y Loyverse es **grid de productos + carrito lateral + checkout de un solo panel**, optimizado touch-first para tablet y adaptado responsive a desktop y móvil.
- La prioridad de diseño número uno es la **velocidad de transacción con mínima fricción**: botones táctiles grandes (mínimo 44×44 pt en iOS / 48×48 dp en Android), jerarquía visual clara, feedback inmediato, modo offline, y flujos diferenciados por rol (cajero vs. administrador).
- El set mínimo de mockups debe cubrir 8-9 flujos: login/selección de usuario, apertura de caja, pantalla principal de venta, checkout/pago, gestión de inventario, dashboard/reportes, gestión de clientes, cierre de caja y configuración; hay UI kits gratuitos en Figma Community (CloudPos, Posify, Makaryo, POS System Web UI) que sirven de punto de partida visual.

## Key Findings
1. **El POS dejó de ser hardware para ser software.** El mercado migra masivamente a cloud/SaaS: el segmento software es el de crecimiento más rápido del mercado cloud POS, y el despliegue en nube pública capturará la mayor cuota hacia 2035 (Research Nester estima el cloud POS en USD 8.2 mil millones en 2026 con un CAGR de 18.8% 2026–2035; jugadores líderes: Oracle, NCR Voyix y Block/Square). El diseño debe partir de "software agnóstico de dispositivo" que corre en tablet, desktop y móvil.
2. **Multi-rubro implica un núcleo común + módulos configurables.** Retail prioriza inventario/variantes/códigos de barras; restaurantes priorizan mesas/comandas/KDS/propinas; servicios priorizan citas/clientes. El mockup debe mostrar un núcleo reutilizable y "modos" por tipo de negocio (como hace Square).
3. **La UX de POS es distinta a la de apps web comunes:** el objetivo del usuario es offline (bolsear el producto y atender al cliente), el software es una "distracción necesaria". Cada segundo y cada tap cuentan.
4. **En Latinoamérica la facturación electrónica es un requisito diferenciador y obligatorio** en la mayoría de países (SAT México, DIAN Colombia, ARCA/ex-AFIP Argentina, SUNAT Perú, SRI Ecuador, SII Chile), con formatos y validaciones distintos por país.
5. **Las tendencias visuales 2025-2026** favorecen bases neutras (grises verdaderos, no negro puro), un único color de acento saturado para la acción primaria, colores semánticos (verde/rojo/ámbar), dark mode como opción real (no invertida), y densidad de información controlada.

## Details

### 1. QUÉ ES UN POS

**Definición.** Un sistema de Punto de Venta (POS, o PDV en español) es la combinación de hardware y software que un negocio usa para procesar transacciones, registrar ventas y gestionar operaciones diarias como inventario, precios, clientes y fidelización. Es el lugar —físico o digital— donde ocurre la venta.

**Evolución.**
- **1879:** James Ritty inventa la primera caja registradora ("Ritty's Incorruptible Cashier") en Ohio para evitar robos de empleados.
- **1973:** IBM desarrolla la primera caja registradora computarizada; primer uso comercial en la industria restaurantera.
- **1992:** Microsoft lanza el primer software POS sobre Windows, marcando el paso de registradoras mecánicas a sistemas digitales (ePOS), con lectores de tarjetas, escáneres de código de barras e interfaces táctiles en los 90.
- **2002:** Se crea el primer POS basado en la nube (Reino Unido).
- **2010s en adelante:** auge del POS "todo en uno" y del cloud-native SaaS; cualquier dispositivo con internet puede ser una terminal. La pandemia aceleró pagos contactless y modos móviles/curbside.

**Tres tipos principales (más kioscos de autoservicio):**

| Dimensión | POS Tradicional (legacy/on-premise) | mPOS (móvil) | POS en la nube (cloud/SaaS) |
|---|---|---|---|
| Dónde vive el dato | Servidor local en el local | App en smartphone/tablet (suele ser cloud) | Servidores remotos, acceso vía web/app |
| Hardware | Terminal dedicada, robusta, cara | Teléfono/tablet + lector | Cualquier dispositivo con internet |
| Costo | Pago único alto + mantenimiento | Bajo | Suscripción mensual (SaaS) |
| Acceso remoto | No (hay que estar físicamente) | Sí | Sí, desde cualquier lugar |
| Actualizaciones | Manuales, técnico presencial | Automáticas | Automáticas, remotas |
| Internet | No lo requiere (ventaja de fiabilidad) | Requerido (con modo offline parcial) | Requerido (con modo offline según proveedor) |
| Escalabilidad | Baja, costosa | Media | Alta, agregar cajas/sucursales fácil |

El mercado cloud POS crece fuertemente frente al hardware tradicional: Grand View Research lo valora en USD 36.2 mil millones en 2025, proyectado a USD 77.9 mil millones para 2033 (CAGR 10.0%), y señala que "el segmento de software crecerá al CAGR más rápido del período de proyección, impulsado por la rápida evolución de plataformas ricas en funciones, modulares y API-first". Para un POS nuevo multi-rubro, la elección lógica es **cloud-native SaaS con modo offline robusto**.

### 2. PARA QUÉ SE UTILIZA (casos de uso)

Casos de uso centrales que debe soportar (y por tanto reflejar el mockup):
- **Venta/checkout de productos y servicios** (el core).
- **Gestión de inventario/stock** en tiempo real: descuento automático al vender, alertas de bajo stock, órdenes de compra, transferencia entre sucursales, variantes (talla/color), múltiples códigos de barras.
- **Gestión de clientes (CRM básico):** perfiles, historial de compras, datos de contacto, segmentación.
- **Reportes y analítica:** ventas por producto/categoría/empleado/hora, tendencias, KPIs, márgenes.
- **Gestión de empleados/turnos:** roles y permisos, PIN de acceso, clock in/out, ventas por empleado, comisiones.
- **Integración con pagos:** efectivo, tarjeta, billeteras digitales, QR, pagos divididos, multi-moneda.
- **Facturación electrónica/impresión de tickets** (crítico en LATAM).
- **Programas de fidelización:** puntos, recompensas, gift cards, descuentos.
- **Gestión de caja:** apertura con fondo, movimientos (pay in/out, retiros a caja fuerte), cierre con arqueo y reporte Z.
- **Multi-sucursal y omnicanal:** inventario y clientes sincronizados entre tiendas y e-commerce.

**Variación por tipo de negocio (multi-rubro):**
- **Retail:** foco en inventario grande (SKUs), variantes, escaneo de códigos de barras, catálogo, promociones.
- **Restaurantes:** gestión de mesas/plano de salón, comandas enviadas a cocina (KDS), modificadores ("sin cebolla", "extra queso"), división de cuenta, propinas, cursos/tiempos.
- **Servicios (salones, spas):** reservas/citas, clientes, ventas por profesional; menos inventario.
- **Abarrotes/conveniencia:** velocidad, peso (balanza integrada), alto volumen.

El diseño multi-rubro debe permitir activar/desactivar módulos y ofrecer "modos" o plantillas por rubro sobre un mismo núcleo.

### 3. MÓDULOS Y FUNCIONALIDADES TÍPICAS

- **Pantalla de venta/checkout:** grid de productos configurable (smart grid), búsqueda por nombre/código/descripción, escaneo de código de barras, carrito con edición de cantidad, selección de variante, descuentos.
- **Gestión de productos/catálogo:** categorías jerárquicas, imágenes, precios, variantes, unidades de medida, múltiples códigos de barras.
- **Inventario/stock:** niveles en tiempo real, alertas de bajo stock, reorden automático, órdenes de compra, transferencias entre ubicaciones, conteo digitalizado.
- **Clientes (CRM básico):** perfiles, historial, fidelización, marketing segmentado.
- **Empleados y permisos/roles:** login por PIN/badge, permisos por rol (p. ej. descuentos, anulaciones, cierre de caja requieren permiso), registro de actividad.
- **Reportes y dashboards:** pre-construidos y filtrables, ventas/inventario/clientes, en tiempo real, accesibles desde cualquier dispositivo.
- **Gestión de caja (apertura/cierre):** declarar fondo inicial, ventas del turno, over/short, reporte X (snapshot durante turno) y reporte Z (cierre definitivo), pay in/out, drops a caja fuerte.
- **Métodos de pago:** efectivo, tarjeta, billeteras digitales, QR; pagos divididos; redondeo; terminal externa para pagos electrónicos.
- **Facturación/impresión de tickets:** recibos digitales (email/SMS) e impresos; facturación electrónica según país.
- **Promociones y descuentos:** por producto, categoría, cantidad, temporales, cupones.
- **Multi-sucursal:** dashboard centralizado, sincronización de inventario, reportes por ubicación.
- **Modo offline:** operar sin internet y sincronizar al reconectar (feature crítico; muchos cloud POS lo ofrecen de forma limitada — p. ej. Square permite operar offline y, según su Centro de Soporte, "debes subir tus pagos offline dentro de las 72 horas del inicio de tu sesión offline; sin embargo, subirlos dentro de las 24 horas es altamente recomendado para reducir el riesgo de contracargos o rechazos de tarjeta. Los pagos offline pendientes expiran tras 72 horas").

### 4. REFERENTES DEL MERCADO

**Internacionales:**

- **Square POS.** Propuesta: el mejor "por defecto" para pequeños negocios; plan gratuito, setup en minutos, pagos integrados, hardware asequible (lector desde precio bajo, Stand, Terminal, Register). Público: pymes retail, restaurantes, citas, venta móvil. UX: la más fácil de usar según pruebas comparativas; "modos" por tipo de negocio; smart grid personalizable; modo offline. Hardware estilo Apple, atractivo.
- **Shopify POS.** Propuesta: omnicanal — integra e-commerce y tienda física, inventario y clientes unificados (BOPIS, envío a casa, devoluciones cruzadas, email carts). Público: retailers de bienes físicos, especialmente quienes ya venden online con Shopify. UX: smart grid con tiles configurables y UI extensions para funciones e integraciones.
- **Toast POS.** Propuesta: POS restaurant-only, workflows de cocina profundos (KDS, gestión de mesas, avisos 86, course firing, reportes de costo laboral). Público: restaurantes full-service, de food trucks a cadenas. UX: hardware Android robusto (spill/grease/heat-resistant, Toast Go handheld IP65, resiste caídas de 1.5 m), pantallas ajustables incluyendo pantalla al cliente; diseño inspirado en Material Design. Solo Android.
- **Lightspeed (incluye ex-Vend).** Propuesta: mid-market retail y hospitality con necesidades complejas — mejor gestión de inventario de su clase, multi-sucursal, órdenes de compra, gestión de proveedores, e-commerce. Público: retailers con 500-1000+ SKUs, múltiples ubicaciones. UX: potente pero con mayor curva de aprendizaje; pruebas de terceros reportan issues de usabilidad y organización de menús.
- **Clover (Fiserv).** Propuesta: hardware premium personalizable, gran app marketplace, modo offline fuerte, loyalty y gift cards integrados; distribuido vía bancos/ISOs. Público: pymes retail y quick-service que quieren hardware premium. UX: fácil, buena selección de features por industria; transparencia de precios baja (varía por reseller).
- **Odoo POS.** Propuesta: parte de un ERP open-source todo-en-uno, integrado con inventario, contabilidad, CRM y e-commerce; funciona online/offline, multi-dispositivo (iPad/Android/desktop), multi-tienda. Público: pymes que quieren suite integrada; usuarios técnicos/desarrolladores. UX: interfaz touch limpia, categorías drag-and-drop, botones de acceso rápido; curva mayor que Square.

**Líderes/relevantes en Latinoamérica:**

- **Loyverse.** Propuesta: POS gratuito en la nube para cafés, bares y tiendas pequeñas; convierte smartphone/tablet en POS. Público: micro y pequeños negocios de food & retail. UX: interfaz limpia e intuitiva, setup rápido, muy valorada por relación precio/valor; inventario, loyalty, recibos electrónicos, empleados; facturación electrónica LATAM vía integraciones (p. ej. AlphaPOS en Panamá).
- **Fudo.** Propuesta: plataforma gastronómica todo-en-uno usada por más de 35.000 negocios en Latinoamérica (según su sitio oficial fu.do, 2026; disponible en Argentina, Chile, México, Colombia y Brasil — algunas piezas de comunicación aún citan 30.000); une gestión, cobros y delivery con comandas digitales, stock en tiempo real, reportes de rentabilidad, terminal propia, tienda online, pedidos por WhatsApp con agente IA. Público: restaurantes, cafeterías, bares y delivery en LATAM. UX: diseñada para usarse desde el primer día sin capacitación.
- **Tiendanube POS (Punto de Venta).** Propuesta: no es un producto aparte sino una funcionalidad del ecosistema Tiendanube que conecta ventas offline (local, WhatsApp, redes, teléfono) con la tienda online, sincronizando stock. Público: comercios LATAM que venden online y físico. UX: compatible con móvil, tablet y computadora; carrito con búsqueda/escaneo, cliente, descuentos, envío; usuarios/vendedores con permisos; reporte de cierre de caja exportable.
- **MercadoPago Point.** Propuesta: lectores de tarjeta para pagos presenciales integrados al stack de pagos de Mercado Libre (Checkout, QR, links); métodos locales LATAM (PIX Brasil, SPEI/OXXO México, PSE Colombia). Público: desde vendedores individuales hasta comercios en toda LATAM. Escala: según Justo Ferraro (ex-líder de Point, hoy CEO de Fudo), en entrevista con Startupeable, Point creció hasta "8 millones de negocios activos en toda Latinoamérica". Fortaleza: penetración regional y métodos de pago locales.

### 5. ESTILOS Y TENDENCIAS DE DISEÑO UI (2025-2026)

- **Paletas:** base neutra dominante (~90% de la pantalla) + uno o dos colores de acento vívidos para acción primaria y estados activos. Un default seguro para dashboards: sidebar oscuro (#343a40) + área de contenido blanca + acento azul (#0d6efd) + colores semánticos estándar.
- **Colores semánticos:** verde=éxito, rojo=peligro/error, ámbar=advertencia, azul=información. Nunca usar el color semántico también como color de marca/acento (genera confusión).
- **Dark mode:** ya es expectativa estándar, no un extra. Buenas prácticas 2026: usar grises verdaderos (no negro puro #000), elevación por capas de luminosidad, un único acento saturado, tipografía afinada para superficies de baja luminosidad, y paletas de datos/charts diseñadas para fondo oscuro (no invertidas). Texto: evitar blanco puro (#FFFFFF); usar p. ej. #FAFAFA para cuerpo. En POS conviene permitir toggle claro/oscuro (claro para luz natural exterior, oscuro para interiores).
- **Tipografía:** sans-serif limpia, jerarquía por tamaño/peso; alto contraste; legible desde ~30 pulgadas (distancia típica de terminal desktop).
- **Espacio y densidad:** grid de 8px como estándar; whitespace generoso pero densidad controlada (un POS necesita mostrar muchos productos sin abrumar). Cards sin bordes con elevación, layouts limpios.
- **Iconografía:** iconos intuitivos SIEMPRE acompañados de etiqueta de texto (para minimizar errores). Vectores SVG escalables; sets de iconos por tamaño de pantalla.
- **Touch-first:** botones grandes, feedback al presionar (cambio de color/sombra), animaciones solo informativas (nunca decorativas que ralenticen).

### 6. RECOMENDACIONES UX PARA POS

**Principios rectores:**
- **El objetivo del usuario es offline.** El cajero quiere atender al cliente y entregar el producto; el software no debe estorbar. Reducir el tiempo medio de transacción y minimizar los retrasos de casos excepcionales es la meta suprema.
- **Diseñar para dos usuarios opuestos:** el novato (rotación alta de cajeros, mucha info) y el power user (ejecuta la misma interacción miles de veces). El sistema debe guiar al novato sin frenar al experto.
- **No cambiar la interfaz sin necesidad.** Tras 2-3 semanas, los cajeros memorizan por condicionamiento; cambios grandes generan estrés y retraining. Cada update forzado "resetea" el condicionamiento.

**Especificaciones concretas para el mockup:**
- **Tamaño mínimo de botones táctiles:** 44×44 pt (Apple Human Interface Guidelines: "mantener un área tappable mínima de 44×44 puntos para todos los controles"), 48×48 dp (Google Material Design, ~9mm físico: "Los touch targets deben ser al menos 48×48 dp"). WCAG 2.2 SC 2.5.8 (AA) exige 24×24 CSS px mínimo; para acciones primarias del POS conviene apuntar al nivel AAA (SC 2.5.5: 44×44 CSS px). Nielsen Norman Group recomienda 1cm×1cm ("los elementos interactivos deben tener al menos 1cm × 1cm para permitir tiempo de selección adecuado y prevenir errores de fat-finger").
- **Espaciado entre targets:** mínimo 8 dp (Material Design: "los touch targets deben estar separados por 8dp o más para asegurar densidad de información y usabilidad balanceadas").
- **Contraste de color (WCAG 2.2 AA, SC 1.4.3):** texto normal 4.5:1 ("el texto tiene una relación de contraste de al menos 4.5:1"); texto grande (≥18pt o ≥14pt bold ≈24px/18.5px) 3:1; componentes de UI/iconos 3:1 (SC 1.4.11 Non-text Contrast).
- **Tamaño de texto:** base 16px mínimo en web (los inputs <16px provocan auto-zoom en Safari iOS); para POS visto a ~30 pulgadas conviene escalar cuerpo a 18-24px+ (inferencia razonada, no estándar; validar a la distancia real de uso).
- **Jerarquía de botones:** el botón más usado/importante (p. ej. "Cobrar"/"Continuar") debe destacar por color y tamaño; los secundarios más pequeños.
- **Minimizar taps:** aplicar "Don't Make Me Think" — p. ej. propinas con montos preestablecidos, división de cuenta donde el sistema calcula todo. Existe la regla heurística de "3 taps" para alcanzar cualquier función, aunque debe tomarse como orientación (el "three-click rule" ha sido cuestionado por NN/g: importa más la claridad de cada paso que el número de clics). Patrón "pay exact" (Microsoft Dynamics Commerce) que salta pantallas intermedias para pagos comunes (efectivo exacto / tarjeta directa).
- **Feedback:** visual (resaltar botón al presionar) y sonoro en confirmaciones; animaciones solo para indicar procesos (p. ej. "procesando pago"). No sobre-validar (no pedir confirmación en cada paso; sí en errores o acciones críticas).
- **Manejo de errores durante la venta:** los casos excepcionales toman 10-30× el tiempo de una transacción normal; el diseño debe hacer los errores "menos costosos" y auto-resolubles en pantalla (evitar rutas que dependan de llamar a soporte).
- **Roles diferenciados:** el cajero ve una interfaz simplificada de venta; el administrador/gerente accede a reportes, inventario, configuración y funciones sensibles (protegidas por PIN/permisos). Pantallas personalizadas por rol.
- **Accesibilidad:** iconos con etiqueta, alto contraste, targets grandes, soporte de resize de texto hasta 200% (WCAG SC 1.4.4).

**Benchmark direccional de velocidad (heurístico, no estándar):** las fuentes de industria sugieren que un cobro en efectivo debería completarse en menos de ~10 segundos y el procesamiento de pago en menos de ~3 segundos (autorización de tarjeta típica 1-3 s). Úsense como objetivo direccional, no como norma.

**Diseño responsive (tablet/desktop/móvil):**
- **Enfoque mobile-first + grid flexible de 8px.** Diseñar componentes que floten/apilen/reordenen, no pantallas fijas por tamaño.
- **Breakpoints estándar:** Material Design (480/600/840/960/1280/1440/1600dp); Bootstrap 5 (sm 576, md 768, lg 992, xl 1200, xxl 1400px); Tailwind (sm 640, md 768, lg 1024, xl 1280, 2xl 1536px). Nótese que md=768px coincide en Bootstrap y Tailwind. Mapeo práctico POS: móvil <768px, tablet ~768-1024px, desktop ≥1024-1200px.
- **Comportamiento adaptativo (Material):** revelar (mostrar sidebar/más opciones con más espacio), transformar (nav lateral ↔ tabs; lista ↔ grid), dividir (paneles), reposicionar (bottom sheet ↔ menú).
- **Tablet (primario, touch):** grid de productos + carrito lateral simultáneos (dos niveles de jerarquía, >600dp).
- **Móvil:** un solo nivel a la vez; carrito como pantalla/hoja aparte; navegación inferior; botones grandes fat-finger-friendly.
- **Desktop:** aprovechar ancho — grid + carrito + panel de detalle; soporte de teclado/atajos y lector de código de barras; densidad mayor.
- **Container queries** para que los componentes (charts, tablas) respondan al contenedor y no solo al viewport; tablas de datos que se vuelven cards en móvil.

### 7. ESTRUCTURA DE PANTALLAS / FLUJOS TÍPICOS (set mínimo de mockups)

1. **Login / selección de usuario:** ingreso por PIN o badge; selección de cajero; bloqueo por inactividad (p. ej. tras 20 min).
2. **Apertura de caja:** declarar fondo inicial (float) al abrir turno.
3. **Pantalla principal de venta:** grid de productos (categorías + búsqueda + escaneo) a la izquierda/centro + carrito a la derecha; edición de cantidad/variante; aplicar descuento; asignar cliente. Smart grid con productos/acciones frecuentes fijados.
4. **Pantalla de pago/checkout:** resumen de orden, selección de método (efectivo/tarjeta/QR/billetera), pago dividido, cálculo de cambio, propina (montos preset), CTA claro con monto ("Cobrar $X"), opciones de recibo (imprimir/email/SMS). Panel único de acción para minimizar pantallas.
5. **Gestión de inventario:** lista/búsqueda de productos, niveles de stock, alertas de bajo stock, alta/edición de producto (nombre, categoría, precio, imagen, variantes, código de barras), órdenes de compra, transferencias.
6. **Reportes / dashboard:** KPIs y quick actions; ventas por producto/categoría/empleado/hora; filtros; comparación multi-sucursal.
7. **Gestión de clientes:** lista/búsqueda, perfil con historial y datos, fidelización/puntos, alta de cliente.
8. **Cierre de caja:** conteo del efectivo, monto esperado vs. real, over/short, reporte Z (impreso/pantalla), handover al siguiente turno.
9. **Configuración:** métodos de pago, impuestos/facturación electrónica, usuarios y permisos, dispositivos/impresoras, personalización de recibos, sucursales, activación de módulos por rubro.

### 8. RECURSOS Y REFERENCIAS ADICIONALES (inspiración visual)

**UI kits y templates de POS (Figma Community, gratis salvo indicación):**
- **CloudPos** — Restaurant POS App UI Kit, limpio y personalizable para restaurantes/cafés.
- **POS System Web UI** — 25+ pantallas Figma editables gratis (sistema completo para restaurantes).
- **Imapos** — Point of Sale App UI Kit premium (sin versión móvil).
- **POS UI KIT / Point of Sale Dashboard** — UI kit moderno para retail, restaurantes y e-commerce.
- **Fast Food Point Of Sales UI Kit** — para iPad y iPhone, con autolayout, animaciones Lottie y prototipo.
- **Posify** — Mobile POS UI Kit, 84+ pantallas, dark y light mode, con guía de design system.
- **Makaryo Point of Sales (Free)** — dashboard de cajero limpio para restaurant/retail.
- **Postkita** — POS mobile app UI kit.
- **Point of Sales POS Mobile App UI** — comunidad Figma.
- **POS - Point of Sale App (Envato Elements)** — template Figma para tablet/touch: Dashboard, Order & Menu, Checkout, Inventory/Reports.

**Recursos de referencia y patrones:**
- **MockFlow POS UI Pack** — wireframes con componentes de código de barras, búsqueda de producto, facturación, cliente y confirmación de pago (desktop).
- **Dribbble / Behance** — buscar "POS", "point of sale", "checkout wireframe" para inspiración visual y flujos.
- **Muzli / Dribbble dashboards** — para estilo de dashboards y visualización de datos.
- **Sistemas de diseño base:** Material Design (breakpoints, componentes, comportamiento responsive), Apple HIG (touch targets iOS), Bootstrap/Tailwind (grids/breakpoints), shadcn/ui y Tabler/AdminLTE (patrones de dashboards y dark mode).
- **Producto real para estudiar UX de POS:** Square, Shopify POS, Toast (Material Design), Loyverse (interfaz limpia valorada), Odoo POS.

## Recommendations

**Etapa 1 — Definir alcance antes de dibujar (semana 1):**
- Con el cliente, definir el/los rubros objetivo y priorizar módulos del núcleo común vs. específicos. Si el cliente es LATAM, tratar la **facturación electrónica como requisito de primera clase** desde el inicio (definir país/es y ente regulador: SAT México, DIAN Colombia, ARCA/ex-AFIP Argentina, SUNAT Perú, SRI Ecuador, SII Chile).
- Definir el dispositivo primario: recomendación **tablet-first** (es el patrón dominante y el mejor balance touch/pantalla), con desktop y móvil como adaptaciones.
- Definir roles mínimos: cajero y administrador/gerente (mínimo dos flujos diferenciados).

**Etapa 2 — Diseñar el núcleo (semanas 2-3):**
- Empezar por la **pantalla de venta (grid + carrito) y el checkout**, que son el 80% del uso y el corazón del producto.
- Establecer un design system: grid de 8px, tokens de color (base neutra + 1 acento + semánticos), tipografía escalada para lectura a ~30", componentes de botón con estados (normal/press/disabled) que cumplan 44-48px de target y 8dp de espaciado.
- Diseñar en claro y oscuro desde el inicio (no como afterthought).

**Etapa 3 — Completar los flujos y validar (semanas 4-5):**
- Prototipar login/caja, inventario, dashboard, clientes, cierre de caja y configuración.
- Diseñar los tres breakpoints (móvil <768, tablet 768-1024, desktop ≥1024) mostrando cómo el mismo componente se revela/transforma/reposiciona.
- Hacer walkthroughs cronometrando taps para completar una venta típica; iterar para minimizarlos.

**Umbrales que cambian las decisiones:**
- Si el cliente maneja **>500-1000 SKUs o múltiples sucursales** → priorizar inventario avanzado y dashboard multi-tienda (modelo Lightspeed).
- Si es **restaurante** → añadir mesas/plano de salón, comandas/KDS, modificadores y propinas (modelo Toast/Fudo).
- Si el foco es **omnicanal** (tienda física + online) → priorizar sincronización de inventario y clientes (modelo Shopify/Tiendanube).
- Si opera en **zonas con internet inestable** → el modo offline pasa de "deseable" a "crítico".

## Caveats
- **El alcance no está definido:** este informe ofrece el universo de posibilidades; la definición final debe co-crearse con el cliente. No sobre-diseñar módulos que quizá no se usen.
- **Fuentes de mercado y comparativas** provienen en parte de sitios de reseñas y blogs de proveedores (tech.co, Expert Market, POSUSA, Substack de pagos), que pueden tener sesgos comerciales o de afiliados; los datos de propuesta de valor y público objetivo son consistentes entre múltiples fuentes, pero precios y features específicos cambian rápido y deben verificarse en la fuente oficial antes de citarlos al cliente. Las cifras de escala (35.000 negocios de Fudo, 8 millones de Point) provienen de fuentes de las propias empresas o entrevistas y no de auditorías independientes.
- **La "regla de 3 taps"** y los benchmarks de velocidad de transacción son heurísticas de la industria, no estándares formales; úsense como guía direccional.
- **La facturación electrónica** varía por país y cambia con frecuencia (resoluciones nuevas cada año; p. ej. Colombia con Resolución 165 de 2023 y el "documento equivalente electrónico POS", modificada en 2025); confirmar el marco vigente del país objetivo antes de comprometer requisitos.
- **Los tamaños de botón y contraste** citados (Apple/Material/WCAG) son mínimos; para uso rápido bajo presión conviene superarlos en las acciones primarias. La verbatim exacta de Apple HIG (44×44 pt) debe re-verificarse en developer.apple.com antes de citarla textualmente al cliente.
- Los **UI kits de Figma Community** son inspiración/base; revisar licencia de cada uno antes de uso comercial.