// Google Analytics de kaysosushi.store (propiedad "Kayso Sushi", 558940549, creada el 14-oct-2026).
// Para qué está: separar de dónde viene cada pedido (avisos de Meta, Instagram sin pagar, Google Maps,
// directo). Hasta acá los pedidos enviados del píxel mezclaban todas las fuentes y no se podía medir
// qué cambio movió qué. Kayso no hace publicidad en Google: no hay conversión de Ads ni vínculo.
//
// Eventos (los nombres son los de comercio de GA4, así los reportes de compras funcionan solos):
//   whatsapp_click  · toque a un botón de chat (no un pedido)            → evento clave
//   add_to_cart     · producto o combo que entra al carrito, en pesos
//   begin_checkout  · se abre la pantalla de finalizar pedido
//   purchase        · pedido enviado por WhatsApp, con el monto que se cobra y su Nº KS-  → evento clave
// Cada evento lleva el primer origen y la primera campaña del visitante (se guardan 90 días), y la promo.

const GA_ID = 'G-DYT37WMRGT';
const LSK = 'kayso_primer_clic';
const NOVENTA_DIAS = 90 * 864e5;

type Item = { productId: string | number; name: string; price: number; quantity: number };

interface PrimerClic { origen: string; campana: string; promo: string; ts: number }

function leerPrimerClic(): PrimerClic {
  let guardado: PrimerClic | null = null;
  try { guardado = JSON.parse(localStorage.getItem(LSK) || 'null'); } catch { guardado = null; }
  if (guardado && Date.now() - guardado.ts < NOVENTA_DIAS) return guardado;
  const q = new URLSearchParams(window.location.search);
  let ref = '';
  try { ref = document.referrer ? new URL(document.referrer).hostname.replace(/^www\./, '') : ''; } catch { ref = ''; }
  if (ref.endsWith('kaysosushi.store')) ref = '';
  const origen = q.get('utm_source') || (q.get('fbclid') ? 'facebook' : '') || (q.get('gclid') ? 'google' : '') || ref || 'directo';
  const nuevo: PrimerClic = { origen, campana: q.get('utm_campaign') || '', promo: q.get('promo') || '', ts: Date.now() };
  try { localStorage.setItem(LSK, JSON.stringify(nuevo)); } catch { /* modo privado: se manda igual */ }
  return nuevo;
}

let primer: PrimerClic | null = null;
// gtag tiene que empujar el objeto `arguments`, no un array: gtag.js ignora en silencio los arrays
// (se perdían todos los eventos sin error). Por eso es function y no flecha.
// eslint-disable-next-line prefer-rest-params
const gtag = function (..._args: unknown[]) {
  const w = window as any;
  w.dataLayer = w.dataLayer || [];
  // eslint-disable-next-line prefer-rest-params
  w.dataLayer.push(arguments);
};

/** Se llama una vez al arrancar. El script de Google baja al primer gesto o a los 3,5 s,
 *  para no competir con la foto de arriba; lo que pase antes queda en la cola y se manda igual. */
export function iniciarAnalytics(): void {
  if (typeof window === 'undefined' || (window as any).__kaysoGA) return;
  (window as any).__kaysoGA = true;
  primer = leerPrimerClic();
  const promoActual = new URLSearchParams(window.location.search).get('promo') || '';
  gtag('js', new Date());
  gtag('config', GA_ID, { primer_origen: primer.origen, primer_campana: primer.campana, promo: promoActual || primer.promo });
  let cargado = false;
  const cargar = () => {
    if (cargado) return; cargado = true;
    const s = document.createElement('script');
    s.async = true; s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(s);
  };
  ['pointerdown', 'scroll', 'keydown'].forEach(e => window.addEventListener(e, cargar, { once: true, passive: true }));
  window.setTimeout(cargar, 3500);
}

function evento(nombre: string, params: Record<string, unknown>): void {
  if (typeof window === 'undefined') return;
  const p = primer || leerPrimerClic();
  gtag('event', nombre, { primer_origen: p.origen, primer_campana: p.campana, promo: p.promo, ...params });
}

const items = (lista: Item[]) => lista.map(i => ({ item_id: String(i.productId), item_name: i.name, price: i.price, quantity: i.quantity }));

export function gaWhatsapp(boton: string): void {
  evento('whatsapp_click', { boton: boton.slice(0, 90) });
}

export function gaAddToCart(item: Item): void {
  evento('add_to_cart', { currency: 'ARS', value: Math.round(item.price * item.quantity), items: items([item]) });
}

export function gaBeginCheckout(lista: Item[], subtotal: number): void {
  evento('begin_checkout', { currency: 'ARS', value: Math.round(subtotal), items: items(lista) });
}

/** valor = lo que se cobra (con el descuento en efectivo aplicado), igual que en Meta. */
export function gaPurchase(pedido: string, lista: Item[], valor: number, pago: string, sucursal: string): void {
  evento('purchase', {
    transaction_id: pedido, currency: 'ARS', value: Math.round(valor), items: items(lista),
    pago, affiliation: sucursal,
  });
}
