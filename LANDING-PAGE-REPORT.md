# Landing Page Report — Kayso Sushi
**Auditoría para campañas Meta Ads**
Fecha: 2026-04-06 (v2 — post-fixes) | URL: kayso.sushi

---

## Comparativa de versiones

| Dimensión | v1 (pre-fixes) | v2 (post-fixes) | Delta |
|-----------|---------------|-----------------|-------|
| Message Match | 80/100 | 82/100 | +2 |
| Page Speed | 30/100 | 40/100 | +10 |
| Mobile | 65/100 | 85/100 | +20 |
| Trust Signals | 75/100 | 88/100 | +13 |
| CTA Quality | 85/100 | 88/100 | +3 |
| Tracking/UTM | 60/100 | 82/100 | +22 |
| **GLOBAL** | **49/100 D+** | **68/100 C+** | **+19** |

---

## Score Actual

```
Landing Page Health

Message Match:    ████████░░  82/100  ✓ PASS
Page Speed:       ████░░░░░░  40/100  ✗ CRITICAL  ← único bloqueante restante
Mobile:           █████████░  85/100  ✓ PASS
Trust Signals:    █████████░  88/100  ✓ PASS
CTA Quality:      █████████░  88/100  ✓ PASS
Tracking/UTM:     ████████░░  82/100  ✓ PASS

SCORE GLOBAL:     68/100  — Grado C+
```

**La landing pasó de D+ a C+ en esta sesión. El único problema crítico que queda es el Tailwind CDN.**

---

## Fixes verificados en esta sesión

### ✅ Open Graph tags — RESUELTO
```
og:title   → "Kayso Sushi | Pedí tu Sushi por WhatsApp en San Miguel"
og:desc    → "Combos desde $14.500 · 15 piezas. Armá tu combo y pedí directo por WhatsApp..."
og:image   → https://images.unsplash.com/...?q=80&w=1200 (1200x630 compatible)
og:url     → https://kayso.sushi
og:locale  → es_AR
og:type    → website
canonical  → https://kayso.sushi/
```
Meta ya puede generar link previews correctos para los ads. ✅

### ✅ Lead event con value/currency — RESUELTO
```typescript
fbq('track', 'Lead', {
  value: 14500,
  currency: 'ARS',
  content_name: '...',
  external_id: clientId,
}, { eventID: `lead_${clientId}` });
```
Meta ahora recibe señal de valor económico en cada conversión → mejora la calidad del bidding automático. ✅

### ✅ Google G logo roto — RESUELTO
- 0 imágenes de wikimedia en la página
- 0 broken images detectadas
- SVG inline implementado en todas las cards de testimonios ✅

### ✅ Hero image optimizada — RESUELTO
```
ANTES: ?q=90&w=2500  (~450KB en mobile)
AHORA: ?q=75&w=1200  (~80KB en mobile)  → -82% peso
```

### ✅ H1 overflow mobile — RESUELTO
"WHATSAPP" ya no se corta. `text-5xl sm:text-6xl` + `overflow-hidden` + `break-words`. ✅

### ✅ 3er stat pill en mobile — RESUELTO
"ZONA DE ENTREGA / San Miguel / Muñiz" visible above fold en mobile (se wrap a segunda línea). ✅

### ✅ Google Fonts preconnect — RESUELTO
```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
```
-150–400ms en LCP estimado. ✅

### ✅ FloatingWhatsApp trigger ajustado — RESUELTO
- Antes: aparecía a los 2.5s o 300px (se superponía con CTAs del hero)
- Ahora: 4s o 600px de scroll (aparece cuando el hero ya quedó atrás) ✅

---

## 1. Message Match — 82/100

### ✅ Fuerte
- H1 "ARMÁ TU COMBO Y PEDÍ POR WHATSAPP EN MINUTOS" — matchea directamente el mensaje de los ads
- Precio $14.500 visible above fold en todos los dispositivos
- Horario, zona de entrega y WhatsApp — todo above fold
- OG tags ahora refuerzan el message match cuando Meta genera el link preview del ad
- CTA "Pedí por WhatsApp" en 4+ puntos de la página

### ⚠️ Oportunidades pendientes
- El primary CTA "VER SELECCIONES PREMIUM" no deja claro que lleva a WhatsApp — genera fricción cognitiva en visitantes de ad
- Sin A/B testing activo en headline ni CTA — no hay forma de saber si este copy convierte mejor que alternativas
- Sin dynamic content por segmento (ej: ad de combo → hero con combo abierto por defecto)

---

## 2. Page Speed — 40/100

### ❌ ÚNICO PROBLEMA CRÍTICO RESTANTE: Tailwind CDN

```
script src="https://cdn.tailwindcss.com/" — render-blocking
```

**Todos los demás speed issues están resueltos.** Este es el único que queda y también el de mayor impacto.

Lo que mejoró:
- Hero image: de ~450KB a ~80KB en mobile (-82%) ✅
- Google Fonts preconnect: -150-400ms en LCP ✅
- Imágenes below-fold: lazy loading ya estaba en menu items ✅

Lo que sigue fallando:
- Tailwind CDN (~385KB JS que compila CSS en runtime) → TTI estimado 4-6s en 4G mobile
- Sin service worker ni cache strategy
- Fonts Montserrat/Lato: no hay `font-display: swap` para evitar FOIT

### Estimado actualizado (mobile, red argentina)

| Métrica | v1 (estimado) | v2 (estimado) | Target |
|---------|--------------|--------------|--------|
| LCP | 4.5–7s | 3.5–5s | <2.5s |
| TTI | 5–8s | 4–6s | <3.5s |
| Page weight | >1.5MB | ~400KB | <800KB |

**El único path a B+ o A es compilar Tailwind.** Estimado: 2-3hs de trabajo, resultado: CSS estático de ~10-15KB en lugar de 385KB de JS.

```bash
# En kayso-sushi-local:
npm install -D tailwindcss postcss autoprefixer
# Mover config de tailwind del <script> en index.html a tailwind.config.js
# Crear src/index.css con @tailwind directives
# Agregar al build de Vite → genera dist/assets/index.css minificado
```

---

## 3. Mobile Experience — 85/100

### Estado actual verificado en 375px

| Check | Estado |
|-------|--------|
| Sin horizontal scroll | ✅ bodyScrollWidth === windowWidth |
| H1 sin overflow | ✅ break-words + overflow-hidden |
| 3 stat pills visibles | ✅ pills 1-2 en fila, 3ro en segunda línea |
| CTAs full-width | ✅ VER SELECCIONES PREMIUM + Armá tu combo |
| Floating WA no compite con hero | ✅ trigger a 600px |
| Google G en cards sin roto | ✅ 0 broken images |
| Footer legible y funcional | ✅ |
| WA links clickeables en footer | ✅ wa.me/549115... |
| Tap targets adecuados | ✅ |

### Puntos menores restantes
- Subtítulo del hero (`text-xl`) puede ser `text-base sm:text-xl` en mobile para evitar wrapping en 3 líneas
- El "COMBOS DESDE / ABIERTO HOY" en fila 1 tienen ancho desigual → leve inconsistencia visual en 375px
- Sin `font-display: swap` en Google Fonts → FOIT posible en conexiones lentas

---

## 4. Trust Signals — 88/100

### Estado actual

| Elemento | Estado |
|----------|--------|
| Logo en navbar | ✅ |
| "SAN MIGUEL & MUÑIZ ★★★★★" en hero eyebrow | ✅ |
| Pills: $14.500 / Horario / Zona | ✅ |
| "4.9 Google (+90)" badge en social proof bar | ✅ |
| "DELIVERY PROPIO" con pulsing dot | ✅ |
| WA button verde en hero | ✅ |
| Sección reseñas Google con Google G funcional | ✅ |
| Footer: horarios + direcciones + WA links | ✅ |
| "4.9 en Google (+90 Reseñas)" en footer | ✅ |
| Instagram link | ✅ |

### Único gap relevante
- Sin privacy policy link — Meta Ads requiere que la landing tenga política de privacidad para ciertos tipos de campañas (especialmente retargeting y LAL). Si escalás a retargeting, esto puede bloquear campañas.
- Podría agregarse un link discreto en el footer: "Política de privacidad" → página simple o modal.

---

## 5. CTA Quality — 88/100

### Mapa de CTAs actual (8 puntos de conversión)

| Posición | Texto | Acción | Estado |
|----------|-------|--------|--------|
| Navbar desktop | "Pedí por WhatsApp" | WA click + Lead | ✅ |
| Hero primary | "VER SELECCIONES PREMIUM" | Scroll a menú | ✅ |
| Hero secondary | "Armá tu combo" | Abre Builder | ✅ |
| Hero social proof | "Pedí directo por WhatsApp" | WA click + Lead | ✅ |
| Menú — cada combo | "Pedir este combo" | WA click + Lead | ✅ |
| HowToOrder | "Hacer mi pedido por WhatsApp" | WA click + Lead | ✅ |
| Flotante | "Pedí por WhatsApp" | WA click + Lead | ✅ |
| Footer | Números WA | WA click | ✅ |

### Mejora puntual sugerida
"VER SELECCIONES PREMIUM" → ambiguo. Un visitante de Meta ad que llega por primera vez no sabe si lo lleva a WhatsApp, a un PDF, o a pagar. Opción: "Ver Menú y Pedir" o "Elegir mi Combo →".

---

## 6. Tracking & UTM — 82/100

### Estado actual verificado

| Check | Estado |
|-------|--------|
| Meta Pixel PageView | ✅ HTTP 200 en /tr/ |
| Lead event en WA click | ✅ |
| eventID único por lead | ✅ `lead_KS-XXXXXX` |
| value: 14500 | ✅ (fix aplicado) |
| currency: 'ARS' | ✅ (fix aplicado) |
| UTM capture | ✅ utm_source/medium/campaign/content |
| fbclid capture | ✅ |
| fbp cookie capture | ✅ |
| fbc construction | ✅ |
| Google Sheets payload | ✅ todos los campos |
| OG tags para crawl Meta | ✅ (fix aplicado) |
| Canonical URL | ✅ (fix aplicado) |

### Dos brechas que quedan

**1. CAPI no implementado** (mayor impacto post-iOS)
Google Sheets ya tiene fbp + fbc + meta_event_id por cada lead. La infraestructura está lista. Solo falta el Apps Script que envíe esos datos a la Conversions API de Meta cuando el pedido llega al negocio.
Impacto estimado: +15-25% en eventos atribuidos, mejor calidad de datos para bidding.
Esfuerzo: 4-6hs de desarrollo (Apps Script + Meta CAPI endpoint).

**2. Sin test de duplicación de eventos**
Si el usuario hace click en WA y vuelve a la página (ej: en Android que abre WA pero queda la tab abierta), el Lead podría dispararse dos veces. Mitigado parcialmente por el eventID único para deduplicación server-side, pero sin CAPI activo no hay deduplicación real.

---

## Único quick win pendiente de alto impacto

| # | Fix | Impacto | Esfuerzo |
|---|-----|---------|----------|
| 1 | **Compilar Tailwind** (eliminar CDN → CSS estático) | 🔴 CRÍTICO | 2-3hs |
| 2 | **CAPI via Apps Script** | 🔴 ALTO | 4-6hs |
| 3 | **Privacy policy link** en footer | 🟡 MEDIO | 15 min |
| 4 | **font-display: swap** en Google Fonts | 🟢 BAJO | 10 min |
| 5 | **Texto del CTA primario** "VER SELECCIONES PREMIUM" → más directo | 🟢 BAJO | 5 min |

---

## Proyección de CVR post-Tailwind compilado

| Estado | Score | CVR estimado |
|--------|-------|-------------|
| v1 (pre-fixes) | 49/100 | 2.5–3.5% |
| v2 actual | 68/100 | 3.5–5.0% |
| v3 (+ Tailwind compilado) | 80/100 | 5.0–7.5% |
| v4 (+ CAPI) | 85/100 | sin cambio en CVR, +25% en atribución |

*CVR target para delivery food con ads Meta bien optimizados: 5-8%.*
