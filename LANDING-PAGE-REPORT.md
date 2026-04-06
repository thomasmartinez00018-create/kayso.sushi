# Landing Page Report — Kayso Sushi
**Auditoría para campañas Meta Ads**
Fecha: 2026-04-06 | URL: kayso.sushi (Vercel deploy)

---

## Resumen Ejecutivo

```
Landing Page Health

Message Match:    ████████░░  80/100  ✓ PASS
Page Speed:       ███░░░░░░░  30/100  ✗ CRITICAL
Mobile:           ██████░░░░  65/100  ⚠ WARNING
Trust Signals:    ███████░░░  75/100  ✓ PASS
CTA Quality:      █████████░  85/100  ✓ PASS
Tracking/UTM:     ██████░░░░  60/100  ⚠ WARNING

SCORE GLOBAL:     49/100  — Grado D+
```

**La landing tiene buenas bases pero dos problemas críticos que destruyen performance:**
1. Tailwind CDN en producción — TTI estimado en mobile: 5-8s
2. Sin OG tags — los link preview ads de Meta muestran contenido basura

---

## 1. Message Match — 80/100

### ✅ Lo que funciona
- **H1 = ad copy**: "ARMÁ TU COMBO Y PEDÍ POR WHATSAPP EN MINUTOS" matchea directamente el mensaje de los ads (combo + WhatsApp ordering)
- **Oferta visible above the fold**: precio desde $14.500, horario 19:00–23:30, zona San Miguel/Muñiz — todo sin scroll
- **CTA match**: "Pedí por WhatsApp" aparece en hero, navbar, flotante, HowToOrder y footer — consistente con la promesa del ad
- **Visual match**: dark aesthetic premium, sushi photography — coherente con posicionamiento de calidad

### ⚠️ Lo que falta
- **Sin dynamic keyword insertion**: si el ad dice "Sushi San Miguel" y la landing no lo menciona prominentemente above fold, hay fricción micro
- **El H2 del beneficio es genérico**: "Calidad premium, ingredientes frescos y la libertad de elegir" — podría ser más específico (ej: "Delivery propio, sin apps, sin comisiones")
- **No hay urgencia explícita**: "ABIERTO HOY 19:00–23:30" está en pill pequeño — podría ser más prominente si el ad tiene copy de urgencia

### Oportunidad
Crear variantes de landing por segmento del ad:
- Ad de combo → landing con combo selector abierto por defecto
- Ad de precio → landing con $14.500 más destacado en H1 o badge rojo

---

## 2. Page Speed — 30/100

### ❌ CRÍTICO: Tailwind CDN en producción

```
<script src="https://cdn.tailwindcss.com/"></script>
```

**Este es el problema #1 de performance.** El CDN de Tailwind:
- Descarga ~385KB de JS que compila CSS en el navegador en runtime
- Es render-blocking: el navegador no pinta nada hasta que termina
- En una conexión 4G promedio argentina (~10Mbps): +300ms extra solo de descarga
- En 3G (~3Mbps): +1.2s extra. En mobile Meta ad click (a menudo 3G/H+): inaceptable
- Meta penaliza páginas lentas con CPM más alto y menor delivery

**Fix requerido**: Compilar Tailwind y servir CSS estático. Estimado: 1-2hs de trabajo.

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss -i ./src/input.css -o ./dist/output.css --minify
# Resultado: ~8-15KB CSS minificado vs 385KB de CDN
```

### ❌ Hero image sobredimensionada

```
https://images.unsplash.com/photo-1553621042...?q=90&w=2500
```

- `q=90, w=2500` en mobile 375px = descargar imagen 6x más grande de lo necesario
- Estimado: 400-600KB vs 40-60KB necesario
- **Fix**: usar `w=1200` + `q=75` = 90% reducción de peso. Mejor aún: convertir a WebP local

### ⚠️ Google Fonts sin preload

```html
<!-- Actualmente -->
<link href="https://fonts.googleapis.com/css2?family=Montserrat..." rel="stylesheet">

<!-- Fix -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
```

- Sin `preconnect`, el navegador hace 3 roundtrips DNS+TCP+TLS antes del primer byte
- Impacto en LCP: +150-400ms en mobile

### ⚠️ 6 de 9 imágenes sin lazy loading

Solo 3 imágenes tienen `loading="lazy"`. Las 6 restantes (incluyendo menu item cards below fold) cargan eagerly.

### Estimado de métricas reales (mobile, red móvil argentina)

| Métrica | Actual (estimado) | Target | Estado |
|---------|------------------|--------|--------|
| LCP | 4.5–7s | <2.5s | ❌ FAIL |
| TTI | 5–8s | <3.5s | ❌ FAIL |
| TBT | >800ms | <200ms | ❌ FAIL |
| Page weight total | >1.5MB | <800KB | ❌ FAIL |

**Por cada segundo extra de carga, el CVR de ad landing cae ~7%. A 5s de TTI, estás perdiendo ~28% de conversiones solo por velocidad.**

---

## 3. Mobile Experience — 65/100

### ✅ Lo que funciona
- Sin scroll horizontal (body.scrollWidth === windowWidth) ✅
- Floating WhatsApp button visible en todo momento ✅
- Teléfonos en footer son links clickeables de WA (`wa.me/`) ✅
- Cards del menú se apilan correctamente en 1 columna ✅
- Footer legible y bien organizado ✅
- CTAs son full-width en mobile ✅

### ⚠️ Problemas detectados

**1. H1 text overflow en 375px**
"PEDÍ POR WHATSAPP" se corta a la derecha del viewport. La línea "WHATSAPP" desborda levemente.
*Fix*: agregar `break-words` o reducir `font-size` en breakpoint `sm`.

**2. Stat pills: solo 2/3 visibles above fold en mobile**
"ZONA DE ENTREGA / San Miguel / Muñiz" queda off-screen o debajo de la línea.
En mobile, esta es info crítica (¿me llega a mí?). Necesita estar visible.
*Fix*: stack en 2 columnas en mobile o reducir padding de pills.

**3. Texto del hero subtitle se corta**
"Calidad premium, ingredientes frescos y la libertad de elegir. Elegí una de nuestras selecciones curadas o armá tu tabla pieza p" — overflow visible.
*Fix*: `overflow-hidden` o `text-sm` en mobile.

**4. Floating WA button compite visualmente con CTA buttons en hero**
En mobile, el botón flotante verde aparece encima del área de CTAs del hero cuando se hace scroll leve. Genera confusión visual.
*Fix*: aumentar el threshold de `scrollY` a 500px o delay a 4s.

### Aspectos móviles OK
- Tap targets adecuados (botones ≥44px altura)
- Font sizes legibles sin zoom
- Menu section bien adaptada a 1 columna
- Sección "¿Cómo pedir?" correcta en mobile
- Footer funcional

---

## 4. Trust Signals — 75/100

### ✅ Elementos presentes
- **4.9 GOOGLE (+90)** — visible en hero social proof bar ✅
- **"DELIVERY PROPIO"** badge en hero ✅
- Estrella de rating + ubicación en eyebrow del H1 ✅
- Sección de reseñas Google con testimonios reales ✅
- "4.9 en Google (+90 Reseñas)" en footer ✅
- Dirección física + horarios en footer ✅
- Instagram con link ✅
- Logo visible en navbar ✅

### ❌ Problemas
**Google G logo bloqueado por ORB (Cross-Origin Resource Policy)**

```
GET https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg
[FAILED: net::ERR_BLOCKED_BY_ORB]
```

El ícono de Google en la sección de testimonios no carga — aparece un broken image badge oscuro. Para un visitante que viene de un ad de Meta, esto puede verse como una landing de baja calidad o incluso generar desconfianza.

*Fix inmediato*: reemplazar con SVG inline (5 líneas de código):

```tsx
// En Testimonials.tsx, reemplazar <img src="https://upload.wikimedia.org/..."> con:
<svg viewBox="0 0 24 24" width="32" height="32">
  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
</svg>
```

### ⚠️ Sin certificaciones de pago/seguridad
No hay badges de Mercado Pago ni indicadores de pago seguro. Aunque el flujo es por WhatsApp (no hay checkout online), un visitante de ad puede dudar en "dar sus datos".
*Baja prioridad* dado que no hay form — pero mencionar "sin datos, todo por WA" puede ayudar.

---

## 5. CTA Quality — 85/100

### ✅ Estructura de CTAs (excelente)
| Ubicación | CTA | Color | Estado |
|-----------|-----|-------|--------|
| Navbar desktop | "Pedí por WhatsApp" | Verde #25D366 | ✅ |
| Hero — primario | "VER SELECCIONES PREMIUM" | Rojo kayso-orange | ✅ |
| Hero — secundario | "Pedí por WhatsApp" | Verde | ✅ |
| Hero — social proof | "Pedí directo por WhatsApp" | Verde outline | ✅ |
| Menú — cada item | "Pedir este combo" | Rojo | ✅ |
| HowToOrder | "Hacer mi pedido por WhatsApp" | Verde full-width | ✅ |
| Flotante | "Pedí por WhatsApp" | Verde | ✅ |
| Footer | números WA clickeables | Verde | ✅ |

Cobertura de WA CTAs: **8 puntos de conversión** a lo largo del funnel. Correcto.

### ⚠️ Puntos a mejorar
- **"VER SELECCIONES PREMIUM"** como CTA primario puede confundir — el visitante no sabe si lo lleva a un menú, a WhatsApp, o a pagar. Texto más claro: "Ver Menú y Pedir" o directamente "Elegir mi Combo"
- **No hay indicación de qué pasa después**: en ningún CTA se aclara que se abre WhatsApp. Para un usuario que viene de Meta y no conoce el negocio, un tooltip o subtexto como "→ Se abre WhatsApp" reduce fricción
- **Lead event sin value/currency**: el evento Lead que dispara en cada WA click no tiene `value` ni `currency`. Meta usa esto para ROAS y bidding inteligente. Fix en `trackingService.ts`:

```typescript
fbq('track', 'Lead', {
  value: 14500,      // precio promedio del combo mínimo
  currency: 'ARS',
  content_name: source || 'WhatsApp CTA',
}, { eventID: `lead_${clientId}` });
```

---

## 6. Tracking & UTM — 60/100

### ✅ Lo que funciona
- Meta Pixel PageView dispara al cargar (`GET /tr/?id=866675959278129&ev=PageView` — HTTP 200) ✅
- Lead event dispara en cada WA click con `eventID` único ✅
- UTM params capturados (`utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`) ✅
- `fbclid` capturado → Google Sheets ✅
- `fbp` y `fbc` capturados → Google Sheets ✅ (esto es la base para CAPI)
- Google Sheets recibe los datos para atribución offline ✅

### ❌ CRÍTICO: Sin Open Graph tags

```html
<!-- Actualmente: NADA de esto existe -->
<meta property="og:title" content="">
<meta property="og:description" content="">
<meta property="og:image" content="">
<meta property="og:url" content="">
```

**Por qué esto destruye las campañas Meta:**
1. Cuando Meta crawlea la URL para crear el link preview del ad, no encuentra nada → usa thumbnail genérico y título del `<title>` tag
2. Si corrés ads de tipo "Traffic" o "Conversiones" con link preview, el creative se ve amateur
3. Meta Events Manager puede tener problemas para matchear el dominio correctamente
4. Sin `og:image`, los ads de link que apunten a la landing no tienen imagen propia

**Fix** (5 minutos en `index.html`):
```html
<meta property="og:title" content="Kayso Sushi | Pedí tu Sushi por WhatsApp en San Miguel">
<meta property="og:description" content="Combos desde $14.500. Armá tu combo y pedí directo por WhatsApp. Delivery propio San Miguel, Muñiz y Bella Vista.">
<meta property="og:image" content="https://kayso.sushi/og-image.jpg"> <!-- 1200x630px -->
<meta property="og:url" content="https://kayso.sushi">
<meta property="og:type" content="website">
<meta property="og:locale" content="es_AR">
```

### ⚠️ Sin Twitter/X Cards
Menor prioridad pero si alguien comparte el link en cualquier plataforma, aparece sin preview.

### ⚠️ Sin canonical URL
Sin `<link rel="canonical">`, si hay múltiples versiones del dominio (con/sin www, HTTP/HTTPS), Google y Meta pueden crawlear versiones duplicadas.

---

## Quick Wins (ordenados por impacto/esfuerzo)

| # | Fix | Impacto | Esfuerzo | Prioridad |
|---|-----|---------|----------|-----------|
| 1 | **Agregar OG tags** (og:title, og:description, og:image) | 🔴 ALTO | 15 min | INMEDIATO |
| 2 | **Compilar Tailwind** (eliminar CDN, servir CSS estático) | 🔴 ALTO | 2-3hs | ESTA SEMANA |
| 3 | **Agregar value+currency al Lead event** | 🔴 ALTO | 20 min | INMEDIATO |
| 4 | **Fix Google G logo** (SVG inline) | 🟡 MEDIO | 10 min | INMEDIATO |
| 5 | **Reducir hero image** (w=1200, q=75, WebP) | 🟡 MEDIO | 30 min | ESTA SEMANA |
| 6 | **Fix H1 overflow mobile** (break-words en sm) | 🟡 MEDIO | 10 min | ESTA SEMANA |
| 7 | **Fix 3er stat pill** visible en mobile | 🟡 MEDIO | 20 min | ESTA SEMANA |
| 8 | **Preconnect a Google Fonts** | 🟢 BAJO | 5 min | CUANDO HAYA TIEMPO |
| 9 | **Lazy loading** a todas las imágenes below fold | 🟢 BAJO | 20 min | CUANDO HAYA TIEMPO |
| 10 | **Canonical URL** | 🟢 BAJO | 5 min | CUANDO HAYA TIEMPO |

---

## Impacto estimado en conversiones (post-fixes)

| Escenario | CVR Estimado | Cambio |
|-----------|-------------|--------|
| Actual (con Tailwind CDN, sin OG) | ~2.5-3.5% | baseline |
| Post quick wins #1-4 (tracking + OG) | ~3.0-4.0% | +15-20% |
| Post Tailwind compilado + img fix | ~4.5-6.0% | +50-70% |
| Post todas las fixes | ~5.5-7.5% | +80-100% |

*Estimados basados en benchmarks de la industria: CVR de landing de delivery food ≈ 4-8% con buena velocidad y message match.*

---

## Arquitectura técnica (contexto para fixes)

```
kayso-sushi-local/
├── index.html           ← Tailwind CDN, meta tags, animaciones CSS, film grain
├── App.tsx              ← ViewState router, FloatingWhatsApp, handleRedirect
├── components/
│   ├── Hero.tsx         ← H1, stat pills, CTAs primarios, social proof bar
│   ├── MenuPreview.tsx  ← Cards de menú, filtros por categoría
│   ├── HowToOrder.tsx   ← 4 pasos + CTA final a WA
│   ├── Testimonials.tsx ← Google reviews (Google G logo broken aquí)
│   ├── Navbar.tsx       ← Logo, nav links, WA button desktop + mobile
│   ├── Footer.tsx       ← Contacto, horarios, WA links, dirección
│   └── FloatingWhatsApp.tsx ← Botón persistente (aparece 2.5s o 300px scroll)
└── services/
    └── trackingService.ts ← UTM, fbclid, fbp, fbc, fbq Lead event, Google Sheets
```

Los fixes de OG tags (#1), Google G logo (#4) y value/currency (#3) se hacen directamente en `index.html` y `trackingService.ts` — sin tocar componentes React.

El fix de Tailwind CDN (#2) requiere configurar el pipeline de build con `tailwindcss` como dependencia y modificar `index.html` para apuntar al CSS compilado.
