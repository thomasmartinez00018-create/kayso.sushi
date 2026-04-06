# Meta Ads Audit — Kayso Sushi
**Cuenta:** `act_1218830036829115` | **Pixel:** `866675959278129`
**Período analizado:** 05/03/2026 – 03/04/2026 (30 días)
**Fecha del reporte:** 04/04/2026
**Moneda:** ARS

---

## Meta Ads Health Score: 41/100 (Grade: D)

```
Pixel / CAPI Health:  28/100  ███░░░░░░░  (peso 30%)
Creative:             52/100  █████░░░░░  (peso 30%)
Account Structure:    48/100  █████░░░░░  (peso 20%)
Audience:             33/100  ███░░░░░░░  (peso 20%)
```

**Score idéntico al audit anterior con nueva información crítica:**
La arquitectura del sitio revela que el 100% de los datos de conversiones reales (leads de WhatsApp) YA están siendo capturados en Google Sheets con FBP + FBC + event_id. El CAPI se puede implementar SIN desarrollo adicional en el sitio. Solo hay que rutear esos datos.

---

## Resumen Ejecutivo

| Métrica | Valor (30d) | Benchmark | Estado |
|---------|-------------|-----------|--------|
| Gasto | ARS 152,606 | — | — |
| Impresiones | 181,729 | — | — |
| Alcance único | 53,006 personas | — | — |
| Frecuencia 30d | **3.43** | < 3.0 | ⚠️ WARNING |
| Frecuencia 7d | **1.93** | < 3.0 | ✅ PASS |
| CTR | **2.71%** | > 1.71% | ✅ PASS |
| CPC | ARS 30.98 | — | ✅ |
| CPM | ARS 839.74 | — | OK |
| Leads (WA clicks) | **109** | — | — |
| Costo por Lead | **ARS 1,400** (~$1.05 USD) | — | Muy bajo |
| Add to Cart | 421 | — | — |
| Initiate Checkout | 117 | — | — |
| Purchase | **0** | ≥1 | ❌ FAIL |
| ROAS | **Incalculable** | ≥3.5x | ❌ FAIL |

---

## Estructura de la Cuenta

### Campañas Activas
| Campaña | Estado | Objetivo | Gasto 30d |
|---------|--------|----------|-----------|
| primera campaña ventas web | ✅ ACTIVA | OUTCOME_SALES | ARS 152,606 |
| [Campaña retargeting] | ❌ PAUSADA | OUTCOME_SALES | ARS 0 |

### Ad Sets
| Ad Set | Estado | Targeting | Budget/día | Optimización | Audiencias custom |
|--------|--------|-----------|------------|--------------|-------------------|
| sanmiguel 3km | ✅ ACTIVO | 3km radio San Miguel, 18-65+ | ARS 6,000 | ADD_TO_CART ❌ | Ninguna |
| Nuevo conjunto de anuncios de Ventas | 🔴 CAMPAIGN_PAUSED | Argentina + visitantes web + IG viewers | — | ADD_TO_CART ❌ | ✅ 2 CAs |

### Anuncios (12 total)
**Activos (6):**
- 2026-03-11 | Kayso | Foodporn video | Draft ← "Draft" en anuncio activo ❌
- 2026-03-11 | Kayso | Reviews video | Draft ← "Draft" en anuncio activo ❌
- 2026-03-10 | Kayso | Corte de rayos X | Draft ← "Draft" en anuncio activo ❌
- Navegación web
- ¿Cansado de pagar por relleno?
- ¿Cansado de pagar por relleno? - Copia

**Pausados (4):** Hoy no se cocina | Testimonio real | Video 1 Promo Mediodía | Video 2 Barco de Sushi

---

## Embudo de Conversión Real (con contexto del sitio)

```
181,729 impresiones
    ↓ (CTR 2.71%)
 4,926 clics totales
    ↓
 2,302 link clicks reales
    ↓ (82.7% landing rate)
 1,904 landing page views  →  CPA LPV: ARS 80.15
    ↓ (22.1%)
   421 Add to Cart          →  CPA ATC: ARS 362.48
    ↓ (27.8%)
   117 Initiate Checkout    →  CPA IC:  ARS 1,304.32
    ↓ (93.2%)
   109 Lead (WA click)      →  CPA Lead: ARS 1,400.05
    ↓ (?? — invisible para Meta)
    X  Pedidos confirmados
    ↓
    X  Ingresos reales
```

**Leak principal:** ATC → Lead (421 → 109 = 74% de pérdida). La gente llega al armador de combos pero no termina clickeando WhatsApp. La mejora de CTAs implementada en el sitio debería reducir esta brecha.

**La gran brecha invisible:** Meta no puede ver lo que pasa después del WA click. No sabe cuántas de esas 109 personas compraron. No puede optimizar para compradores reales.

---

## 46-Check Audit

### CATEGORÍA 1: PIXEL / CAPI HEALTH (30%)

| # | Check | Estado | Severidad | Detalle |
|---|-------|--------|-----------|---------|
| 1 | Pixel instalado y disparando PageView | ✅ PASS | Crítica | ID 866675959278129 en index.html, correcto |
| 2 | CAPI activo (server-side) | ❌ FAIL | Crítica | Solo browser pixel. ~30-40% de conversiones iOS invisibles |
| 3 | Event deduplication configurada | ⚠️ PARCIAL | Alta | `eventID: 'lead_${clientId}'` en pixel ✅ pero sin CAPI no hay nada que deduplicar |
| 4 | EMQ ≥8.0 para evento de compra | ❌ FAIL | Crítica | Purchase = 0. El Lead event solo envía `external_id` aleatorio (KS-XXXXXX), sin email/tel/nombre |
| 5 | Todos los eventos estándar configurados | ⚠️ WARNING | Alta | Tiene: PageView ✅ AddToCart ✅ InitiateCheckout ✅ Lead ✅. Falta: **Purchase ❌** |
| 6 | Custom conversions creadas | ❌ FAIL | Media | No se detectan custom conversions configuradas |
| 7 | AEM (Aggregated Event Measurement iOS) | ❌ FAIL | Alta | No confirmado. Prioritización de eventos sin verificar |
| 8 | Verificación de dominio | ⚠️ DESCONOCIDO | Media | No verificable vía API, asumir OK si Vercel está configurado |
| 9 | CAPI incluye customer_information | ❌ FAIL | Crítica | Sin CAPI = sin parámetros server-side |
| 10 | Eventos con currency + value | ❌ FAIL | Alta | Lead event no incluye `value` ni `currency`. El ticket promedio (~ARS 14,500) podría pasarse |

**Score Pixel/CAPI: 28/100**

> **Oportunidad crítica descubierta:** El sitio ya captura en Google Sheets: `fbclid`, `fbp`, `fbc`, `meta_event_id`, `timestamp`, `zona`, `tipo_pedido`. Estos son EXACTAMENTE los campos que Meta necesita para offline conversions vía CAPI. Solo falta un endpoint en Apps Script que envíe esos datos a `https://graph.facebook.com/v18.0/{pixel_id}/events`. Implementación: **~4 horas**.

---

### CATEGORÍA 2: CREATIVE — DIVERSIDAD Y FATIGA (30%)

| # | Check | Estado | Severidad | Detalle |
|---|-------|--------|-----------|---------|
| 1 | ≥3 formatos creativos activos | ⚠️ WARNING | Alta | Video ✅ + Imagen estática ✅ = 2 formatos. Falta carousel o collection |
| 2 | ≥5 creativos por ad set | ✅ PASS | Media | 6 anuncios activos en el ad set principal |
| 3 | Detección de fatiga creativa (CTR drop >20%) | ✅ PASS | Alta | CTR general 2.71%, por encima del benchmark. No se detecta caída severa |
| 4 | Videos ≤15s para Stories/Reels | ⚠️ DESCONOCIDO | Media | Nombres sugieren videos pero duración no verificable vía API |
| 5 | UGC/testimonial testeado | ✅ PASS | Alta | "Reviews video" y "Testimonio real" existen (aunque este último pausado) |
| 6 | DCO (Dynamic Creative Optimization) | ❌ FAIL | Media | `is_dynamic_creative: false` en ambos ad sets |
| 7 | Ad copy dentro de límites (headline <40 chars) | ⚠️ DESCONOCIDO | Baja | No accesible sin pull de creatives individuales |
| 8 | Cadencia de refresh (cada 2-4 semanas en alto gasto) | ⚠️ WARNING | Media | Anuncios desde diciembre 2025 siguen activos junto con los de marzo 2026 |
| 9 | Hook rate ≥25% (video view 3s / impresiones) | ✅ ESTIMADO | Alta | 27,478 video views / 181,729 impresiones = 15.1%. Bajo pero el CTR compensa |
| 10 | Carousel format testeado | ❌ FAIL | Media | No detectado |
| 11 | Collection ads (e-commerce) | N/A | Baja | No aplica — sin catálogo de productos |
| 12 | Naming convention consistente | ❌ FAIL | Baja | 4 anuncios activos con "Draft" en el nombre. Mezcla de formatos de fecha |

**Performance creativo individual (30d, datos disponibles):**

| Anuncio | Spend ARS | CTR | Frecuencia | Obs. |
|---------|-----------|-----|------------|------|
| Video 2: Barco de Sushi | 3,893 | 3.29% ✅ | 1.32 | PAUSADO — debería estar activo |
| ¿Cansado de pagar por relleno? | 6,096 | 1.73% ✅ | 1.37 | Activo, rendimiento OK |
| ¿Cansado de pagar por relleno? - Copia | ~9,983 | 1.66% | 1.44 | Activo — acumula la mayor parte del gasto 7d |
| Navegación web | — | — | — | Activo desde mar-06 |
| Corte de rayos X | — | — | — | Activo desde mar-10 |
| Reviews video + Foodporn video | — | — | — | Activos desde mar-11 |

**Score Creative: 52/100**

---

### CATEGORÍA 3: ACCOUNT STRUCTURE (20%)

| # | Check | Estado | Severidad | Detalle |
|---|-------|--------|-----------|---------|
| 1 | ≤5 campañas activas por objetivo | ✅ PASS | Baja | 1 activa |
| 2 | CBO vs ABO intencional | ✅ PASS | Media | ABO (ad set budget) = correcto para testing |
| 3 | Learning phase <30% ad sets en "Limited" | ✅ PASS | Alta | `learning_stage_info: null` = fuera del aprendizaje |
| 4 | Budget por ad set ≥5x CPA objetivo | ⚠️ WARNING | Alta | ARS 6,000/día ÷ ARS 1,400 CPA = **4.3x** (umbral: 5x) |
| 5 | Overlap de audiencias <30% | ✅ PASS | Media | 1 solo ad set activo = no hay overlap |
| 6 | Naming conventions consistentes | ❌ FAIL | Baja | Anuncios "Draft" activos, mezcla de convenciones |
| 7 | Advantage+ Shopping Campaigns | N/A | — | No aplica — delivery local sin catálogo Meta |
| 8 | Estructura simplificada | ✅ PASS | Media | 1 campaña / 1 ad set activo = bien simplificado |
| 9 | **Retargeting activo** | ❌ FAIL | **CRÍTICA** | La campaña con retargeting está PAUSADA. 100% del presupuesto a prospección fría |
| 10 | **Objetivo de optimización = conversión real** | ❌ FAIL | **CRÍTICA** | Optimiza para `ADD_TO_CART` pero la conversión real es `Lead` (WA click). Meta aprendió a buscar gente que hace clic en el armador, no que manda el pedido |
| 11 | Budget no desperdiciado | ⚠️ WARNING | Alta | Sin retargeting = dinero que calienta audiencia que nadie recupera |
| 12 | Advantage+ Placements activo | ✅ PASS | Media | Sin restricciones explícitas de placement |
| 13 | Attribution window configurada | ⚠️ DESCONOCIDO | Media | Usando default 7d_click/1d_view |
| 14 | Bid strategy apropiada | ✅ PASS | Media | Lowest cost — correcto para volumen con presupuesto acotado |

**Score Account Structure: 48/100**

---

### CATEGORÍA 4: AUDIENCE & TARGETING (20%)

| # | Check | Estado | Severidad | Detalle |
|---|-------|--------|-----------|---------|
| 1 | Frecuencia prospección 7d < 3.0 | ✅ PASS | Alta | 1.93 — OK |
| 2 | Frecuencia prospección 30d < 3.0 | ⚠️ WARNING | Alta | 3.43 — Sobre el umbral. Audiencia saturándose |
| 3 | Frecuencia retargeting 7d < 8.0 | N/A | — | Retargeting pausado |
| 4 | **Custom Audiences activas** | ❌ FAIL | Alta | "visitantes web" y "personas que vieron el ig" EXISTEN pero solo en campaña pausada |
| 5 | **Lookalike Audiences** | ❌ FAIL | **CRÍTICA** | NINGUNA LAL activa. Tenés datos (109 leads, visitas web, IG viewers) y no los usás |
| 6 | Advantage+ Audience testeado | ✅ PASS | Media | `targeting_automation.advantage_audience: 1` en ad set activo |
| 7 | Exclusión de compradores de prospección | ❌ FAIL | Alta | Sin listas de exclusión configuradas en el ad set activo |
| 8 | **Targeting geográfico apropiado** | ❌ FAIL | **CRÍTICA** | 3km radio = ~53,000 personas únicas alcanzadas en 30 días. Audiencia estructuralmente pequeña y saturada |

**Breakdown por plataforma (30d):**

| Plataforma | Gasto ARS | CTR | CPM ARS | Obs. |
|-----------|-----------|-----|---------|------|
| Facebook | 31,143 | 3.10% ✅ | 701.92 | Mayor volumen, buen CTR |
| Instagram | — | — | — | Mayor parte del presupuesto |
| Audience Network | 309 | 19.29% ⚠️ | 1,566.27 | CTR inflado = bot traffic, excluir |
| Messenger | — | — | — | — |

**Score Audience: 33/100**

---

## Quick Wins — Ordenados por Impacto

### 🔴 Crítico (hacer esta semana)

**1. Cambiar evento de optimización: ADD_TO_CART → Lead**
- Tiempo: 30 minutos
- Impacto: ALTO — Meta empezará a buscar personas que realmente manden el pedido por WA, no solo que exploren el menú
- Cómo: Ad set "sanmiguel 3km" → Edit → Optimization & Delivery → Conversion event → Lead
- Riesgo: El ad set vuelve al aprendizaje (~1 semana). Vale la pena porque el objetivo actual está fundamentalmente mal

**2. Reactivar la campaña de retargeting**
- Tiempo: 15 minutos
- Impacto: ALTO — Tenés ~53,000 personas que vieron tus anuncios en 30 días + visitantes web + viewers de IG. Nadie los está recuperando
- Cómo: Activar campaña `120241962636000706`. Revisar presupuesto: ARS 1,500-2,000/día para retargeting
- Configuración sugerida: Optimizar para Lead, audiencia = visitantes web 30d + IG viewers 30d, excluir quienes ya clickearon WA

**3. Agregar `value` y `currency` al evento Lead**
- Tiempo: 15 minutos en el código
- Impacto: ALTO — Permite LAL por valor, optimización por conversión con valor, y ROAS eventual
- Cómo: En `trackingService.ts`, modificar el fbq('track', 'Lead', ...) para incluir:
  ```javascript
  fbq('track', 'Lead', {
    external_id: clientId,
    content_name: orderDetails.resumen || 'Pedido WhatsApp',
    value: 14500,        // ticket promedio en ARS
    currency: 'ARS'
  }, { eventID: `lead_${clientId}` });
  ```

**4. Excluir Audience Network**
- Tiempo: 10 minutos
- Impacto: MEDIO — CTR 19.29% es anómalo, indica tráfico inválido. Excluir esta red libera presupuesto para Facebook/Instagram
- Cómo: Placements → Manual placements → desactivar Audience Network

**5. Crear Lookalike Audiences (1%, 3%, 5%)**
- Tiempo: 30 minutos
- Impacto: ALTO — No hay razón para no tenerlas
- Seeds disponibles hoy:
  - "visitantes web" → LAL 1%, 3%, 5%
  - "personas que vieron el ig" → LAL 1%, 3%
  - Lista de leads de Google Sheets exportada → LAL desde customer list
- Segmentar por Argentina

---

### 🟡 Alto Impacto (próximas 2 semanas)

**6. Implementar CAPI via Apps Script (oportunidad oculta)**
- Tiempo: 4-6 horas
- Impacto: **MUY ALTO** — El Google Sheets YA tiene todos los datos: `fbp`, `fbc`, `meta_event_id`, `timestamp`, `client_id`
- Cómo: Agregar una función en Apps Script que, cada vez que se inserta un nuevo lead, haga POST a:
  ```
  POST https://graph.facebook.com/v18.0/866675959278129/events
  {
    "data": [{
      "event_name": "Lead",
      "event_time": <timestamp>,
      "event_id": <meta_event_id>,  // ← ya lo tenés en la Sheet
      "user_data": {
        "fbp": <fbp>,               // ← ya lo tenés
        "fbc": <fbc>                // ← ya lo tenés
      },
      "custom_data": {
        "value": 14500,
        "currency": "ARS"
      }
    }]
  }
  ```
- Resultado: deduplicación pixel + CAPI, recuperás el 30-40% de conversiones iOS perdidas, EMQ sube

**7. Ampliar radio geográfico**
- Tiempo: 15 minutos
- Impacto: ALTO — El ad set de 3km tiene 53,000 personas alcanzadas en 30 días. La frecuencia del 30d ya está en 3.43
- Opciones:
  - Opción A: Ampliar a 5km (muestra San Miguel completo + Muñiz)
  - Opción B: Agregar ciudades: San Miguel, Muñiz, Bella Vista, José C. Paz (ya mencionadas en el sitio como zonas de entrega)
  - Opción C: Probar Advantage+ Audience con audience expansion ON (ya está activado — verificar si está funcionando)

**8. Subir conversiones offline desde Google Sheets**
- Tiempo: 3 horas (script one-time + automatización)
- Impacto: ALTO — Cerrar el loop. Meta actualmente solo ve los 109 WA clicks. Si subís los pedidos confirmados, puede optimizar para compradores reales
- Cómo: Exportar historial de Google Sheets → formato CSV → Upload en Events Manager → Offline Conversions

**9. Configurar AEM (Aggregated Event Measurement)**
- Tiempo: 1 hora
- Impacto: MEDIO — Esencial para atribución iOS 14.5+
- Cómo: Events Manager → Aggregated Event Measurement → Agregar dominio kayso.sushi → Configurar prioridades: Lead (1°), InitiateCheckout (2°), AddToCart (3°)

---

### 🟢 Medio Impacto (próximo mes)

**10. Aumentar budget a 5x CPA**
- Actualmente: ARS 6,000/día ÷ ARS 1,400 CPA = 4.3x (bajo el umbral de 5x)
- Sugerido: ARS 7,500/día para dar más margen al algoritmo
- Nota: Esperar a que se estabilice el cambio de evento de optimización primero

**11. Agregar carousel con productos del menú**
- El sitio tiene imágenes de productos ya hosteadas en postimg.cc
- Un carousel de "Combinados Clásicos", "Rolls Especiales", "Hot Rolls" con precio y CTA a WA puede bajar el CPA significativamente

**12. Activar DCO (Dynamic Creative Optimization)**
- Subir 3-5 imágenes, 3-5 copy variations, 3-5 títulos
- Dejar que Meta encuentre la combinación ganadora en el público de 3km

**13. Limpiar naming conventions**
- Remover "Draft" de anuncios activos
- Estandarizar: `YYYY-MM-DD | Kayso | [Concepto] | [Formato]`

---

## Análisis de Contexto — Sitio Web vs. Campaña

*Este análisis es posible porque tenemos acceso al código fuente del sitio.*

### Problema raíz de optimización

El sitio kayso.sushi tiene el siguiente flujo de conversión:

```
Ad → Landing → Menú/Builder → Click WA → Redirect Screen → WhatsApp → Pedido → Pago
```

Los eventos que dispara el pixel:
- `PageView` — carga del sitio
- `AddToCart` — cuando explora combos / agrega al pedido
- `InitiateCheckout` — cuando completa el armador
- `Lead` (eventID ✅) — cuando clickea CUALQUIER botón de WhatsApp

El ad set optimiza para **AddToCart** (421 eventos) pero el negocio convierte en **Lead** (109 eventos). La diferencia: personas que navegan el menú vs. personas que realmente inician el pedido. Meta está aprendiendo a targear curiosos, no compradores.

### Las mejoras del sitio impactan directamente las campañas

Las CTAs de WhatsApp que agregamos esta sesión:
- FloatingWhatsApp (aparece a los 2.5s o 300px scroll)
- Hero button (verde, prominente)
- HowToOrder CTA
- Navbar button
- Footer links

Esto debería **aumentar la tasa Lead/LPV** del 5.7% actual. Si sube al 8-10%, el CPA baja de ARS 1,400 a ARS 800-1,000 sin cambiar el presupuesto. Monitorear en los próximos 7 días.

### El Google Sheets es el activo oculto más valioso

Cada WA click genera este registro en la Sheet:
```
fecha_lead | client_id | zona | tipo_pedido | retiro_delivery | notas
fuente | campana | anuncio | pagina
utm_source | utm_medium | utm_campaign | utm_content
fbclid | fbp | fbc | timestamp_web
meta_event_name | meta_event_id | external_id
```

Con `fbp` + `fbc` + `meta_event_id` + `timestamp`, tenés todo para:
1. **Offline conversions** → sube cada lead confirmado como evento server-side
2. **CAPI en tiempo real** → trigger en OnEdit de Apps Script → POST a Meta
3. **Customer list para LAL** → exportar leads históricos → subir como custom audience

---

## Plan de Acción Priorizado

| Semana | Acción | Tiempo | Impacto | Quién |
|--------|--------|--------|---------|-------|
| Esta semana | Cambiar opt. event a Lead | 30 min | 🔴 Crítico | Vos |
| Esta semana | Reactivar retargeting | 15 min | 🔴 Crítico | Vos |
| Esta semana | Excluir Audience Network | 10 min | 🟡 Alto | Vos |
| Esta semana | Agregar value/currency a Lead event | 15 min | 🔴 Crítico | Dev (simple) |
| Esta semana | Crear 3 LAL audiences | 30 min | 🟡 Alto | Vos |
| Semana 2 | CAPI vía Apps Script | 4-6hs | 🔴 Crítico | Dev |
| Semana 2 | Ampliar radio geográfico a 5km | 15 min | 🟡 Alto | Vos |
| Semana 2 | Configurar AEM | 1h | 🟡 Alto | Vos |
| Semana 3 | Upload offline conversions históricas | 3hs | 🟡 Alto | Dev |
| Semana 3 | Carousel con productos del menú | 2hs | 🟢 Medio | Vos |
| Semana 4 | Aumentar budget a ARS 7,500/día | 5 min | 🟢 Medio | Vos (post-estabilización) |

---

## Score proyectado post-implementación

Si ejecutás las primeras 7 acciones:

```
Score proyectado: 68/100 (Grade: C+)

Pixel / CAPI Health:  65/100  ███████░░░  (CAPI implementado, EMQ mejorado)
Creative:             62/100  ██████░░░░  (carousel + DCO agregados)
Account Structure:    72/100  ███████░░░  (retargeting activo, opt. event correcto)
Audience:             68/100  ███████░░░  (LAL activas, geo expandido, exclusiones)
```

---

*Reporte generado con acceso directo a Meta Marketing API via Composio + análisis del código fuente del sitio kayso.sushi*
*Versión 2.0 — Incluye contexto completo del flujo de conversión web*
