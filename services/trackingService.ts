import { CartItem, CheckoutData } from '../types';
import { getCashDiscountRate } from '../constants';

export const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwUk07_6e3m4kbpSKEJW1K5yUDmUtCzEbNrPTDMiWo7LreAmaXIybt0vosZrI8yUaQI4w/exec';

function generateClientId(): string {
  return 'KS-' + Math.random().toString(36).substring(2, 8).toUpperCase();
}

function generateEventId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function getCookie(name: string): string {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || '';
  return '';
}

function getQueryParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get('utm_source') || '',
    utm_medium: params.get('utm_medium') || '',
    utm_campaign: params.get('utm_campaign') || '',
    utm_content: params.get('utm_content') || '',
    fbclid: params.get('fbclid') || '',
  };
}

export interface OrderDetails {
  resumen?: string;
  zona?: string;
  tipo?: string;
  modalidad?: string;
  value?: number;
}

// --- Contact event (dedup per session + CAPI + ContactRedirected) ---
function fireContactEvent(contentName: string, clientId: string): void {
  const sessionKey = `_fired_contact_${contentName}`;
  if (sessionStorage.getItem(sessionKey)) return;
  sessionStorage.setItem(sessionKey, '1');

  const eventId = generateEventId();
  const queryParams = getQueryParams();
  const fbp = getCookie('_fbp');
  const fbc = getCookie('_fbc') || (queryParams.fbclid ? `fb.1.${Date.now()}.${queryParams.fbclid}` : '');

  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('track', 'Contact', {
      external_id: clientId,
      content_name: contentName,
    }, { eventID: eventId });
  }

  fetch('/api/meta-event', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      event_name: 'Contact',
      eventId,
      content_name: contentName,
      external_id: clientId,
      fbp,
      fbc,
    }),
  }).catch(() => {});

  const onHidden = () => {
    if (document.visibilityState === 'hidden') {
      if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('trackCustom', 'ContactRedirected', { content_name: contentName });
      }
      document.removeEventListener('visibilitychange', onHidden);
    }
  };
  document.addEventListener('visibilitychange', onHidden);
  setTimeout(() => document.removeEventListener('visibilitychange', onHidden), 5000);
}

// --- Direct WA redirect (Hero CTA, Nav CTA, Floating — keeps working) ---
export const trackAndRedirectToWhatsApp = (baseMessage: string, phoneNumber: string, orderDetails: OrderDetails = {}) => {
  const clientId = generateClientId();
  const queryParams = getQueryParams();
  const fbp = getCookie('_fbp') || '';
  const fbc = getCookie('_fbc') || (queryParams.fbclid ? `fb.1.${Date.now()}.${queryParams.fbclid}` : '');
  const timestamp = new Date().toISOString();

  let whatsappMessage = `Pedido Kayso | ID: ${clientId}\n`;
  if (orderDetails.zona) whatsappMessage += `Zona: ${orderDetails.zona}\n`;
  if (orderDetails.tipo) whatsappMessage += `Tipo: ${orderDetails.tipo}\n`;
  if (orderDetails.modalidad) whatsappMessage += `Modalidad: ${orderDetails.modalidad}\n`;
  whatsappMessage += `\n${baseMessage}`;

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`;
  const contentName = orderDetails.resumen || 'Pedido WhatsApp';

  fireContactEvent(contentName, clientId);

  const leadEventId = generateEventId();
  // SOFT lead — user clicked WA but didn't pre-qualify. No fake value/currency to keep ROAS data clean.
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('track', 'Lead', {
      external_id: clientId,
      content_name: contentName,
    }, { eventID: leadEventId });
  }

  // Server-side CAPI for Lead — no value/currency (clean signal). Geo defaults applied server-side.
  fetch('/api/meta-event', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      event_name: 'Lead',
      eventId: leadEventId,
      content_name: contentName,
      external_id: clientId,
      fbp,
      fbc,
    }),
  }).catch(() => {});

  window.open(whatsappUrl, '_blank');

  const payload = {
    action: 'create_lead',
    fecha_lead: timestamp,
    client_id: clientId,
    zona: orderDetails.zona || '',
    tipo_pedido: contentName,
    retiro_delivery: orderDetails.modalidad || '',
    notas: baseMessage,
    estado: 'Pendiente',
    fuente: 'Meta',
    campana: queryParams.utm_campaign,
    anuncio: queryParams.utm_content,
    pagina: window.location.href,
    utm_source: queryParams.utm_source,
    utm_medium: queryParams.utm_medium,
    utm_campaign: queryParams.utm_campaign,
    utm_content: queryParams.utm_content,
    fbclid: queryParams.fbclid,
    fbp,
    fbc,
    timestamp_web: timestamp,
    external_id: clientId,
    meta_event_name: 'Lead',
    meta_event_id: leadEventId,
    origen_actualizacion: 'landing',
  };

  fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).catch(err => console.error('Error tracking lead:', err));

  return whatsappUrl;
};

// --- Structured checkout (cart + delivery + payment) ---
export const BRANCH_PHONES: Record<'gelly' | 'peron', { phone: string; label: string }> = {
  gelly: { phone: '5491150538254', label: 'Gelly y Obes' },
  peron: { phone: '5491128627514', label: 'Pte. Perón' },
};

const PAYMENT_LABELS: Record<string, string> = {
  efectivo: 'Efectivo',
  transferencia: 'Transferencia bancaria',
  mercadopago: 'Mercado Pago',
};

function buildCheckoutMessage(clientId: string, items: CartItem[], data: CheckoutData, total: number): string {
  const { branch, mode, address, payment, notes, customerName } = data;
  const branchLabel = BRANCH_PHONES[branch].label;
  const modeIcon = mode === 'delivery' ? '🛵' : '🏪';
  const modeLabel = mode === 'delivery' ? 'Delivery' : 'Retiro en sucursal';

  let msg = `*Pedido Kayso Sushi*\nID: ${clientId}\n\n`;
  if (customerName) msg += `👤 *Cliente:* ${customerName}\n`;
  msg += `🏬 *Sucursal:* ${branchLabel}\n`;
  msg += `${modeIcon} *Modalidad:* ${modeLabel}\n`;
  if (mode === 'delivery' && address) {
    msg += `📍 *Dirección:* ${address}\n`;
  }
  msg += `💵 *Forma de pago:* ${PAYMENT_LABELS[payment] || payment}\n`;

  msg += `\n*Productos:*\n`;
  items.forEach(item => {
    msg += `• ${item.quantity}x ${item.name} — $${(item.price * item.quantity).toLocaleString('es-AR')}\n`;
    if (item.details) msg += `   _${item.details}_\n`;
  });

  const discountRate = getCashDiscountRate(payment);
  if (discountRate > 0) {
    const discount = Math.round(total * discountRate);
    const finalTotal = total - discount;
    msg += `\nSubtotal: $${total.toLocaleString('es-AR')}\n`;
    msg += `Descuento efectivo (${Math.round(discountRate * 100)}% OFF): −$${discount.toLocaleString('es-AR')}\n`;
    msg += `\n*TOTAL A COBRAR: $${finalTotal.toLocaleString('es-AR')}*\n`;
  } else {
    msg += `\n*TOTAL: $${total.toLocaleString('es-AR')}*\n`;
  }

  if (notes && notes.trim().length > 0) {
    msg += `\n📝 *Notas:* ${notes.trim()}\n`;
  }

  msg += `\nGracias! 🍣`;
  return msg;
}

function fireCheckoutEvents(clientId: string, items: CartItem[], data: CheckoutData, total: number): { leadEventId: string; purchaseEventId: string; qualifiedLeadEventId: string } {
  const queryParams = getQueryParams();
  const fbp = getCookie('_fbp');
  const fbc = getCookie('_fbc') || (queryParams.fbclid ? `fb.1.${Date.now()}.${queryParams.fbclid}` : '');
  const contents = items.map(i => ({ id: i.productId, quantity: i.quantity, item_price: i.price }));
  const contentName = items.map(i => `${i.quantity}x ${i.name}`).join(' + ');
  const numItems = items.reduce((n, i) => n + i.quantity, 0);

  // Customer info passed to CAPI for higher EMQ (Meta hashes server-side)
  const customerName = (data.customerName || '').trim();
  const firstName = customerName ? customerName.split(' ')[0] : '';
  const lastName = customerName && customerName.includes(' ') ? customerName.split(' ').slice(1).join(' ') : '';

  // Fire Contact (for fatigue-proof tracking; deduplicated by resumen hash)
  fireContactEvent(`Checkout: ${contentName.slice(0, 60)}`, clientId);

  // 1. Lead event (campaign optimization — backwards-compatible)
  const leadEventId = generateEventId();
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('track', 'Lead', {
      external_id: clientId,
      content_name: contentName,
      contents,
      num_items: numItems,
      value: total,
      currency: 'ARS',
    }, { eventID: leadEventId });
  }

  fetch('/api/meta-event', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      event_name: 'Lead',
      eventId: leadEventId,
      content_name: contentName,
      external_id: clientId,
      fbp,
      fbc,
      value: total,
      currency: 'ARS',
      contents,
      num_items: numItems,
      fn: firstName,
      ln: lastName,
    }),
  }).catch(() => {});

  // 2. InitiateCheckout (browser + CAPI) — every checkout submit fires this
  const purchaseEventId = generateEventId();
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('track', 'InitiateCheckout', {
      external_id: clientId,
      content_name: contentName,
      contents,
      num_items: numItems,
      value: total,
      currency: 'ARS',
    }, { eventID: purchaseEventId });
  }

  fetch('/api/meta-event', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      event_name: 'InitiateCheckout',
      eventId: purchaseEventId,
      content_name: contentName,
      external_id: clientId,
      fbp,
      fbc,
      value: total,
      currency: 'ARS',
      contents,
      num_items: numItems,
      fn: firstName,
      ln: lastName,
    }),
  }).catch(() => {});

  // 3. QualifiedLead custom event — fires ONLY when user completed the form (high-intent signal)
  // Use this as the campaign optimization event in Ads Manager → "QualifiedLead"
  const qualifiedLeadEventId = generateEventId();
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('trackCustom', 'QualifiedLead', {
      external_id: clientId,
      content_name: contentName,
      branch: data.branch,
      mode: data.mode,
      value: total,
      currency: 'ARS',
    }, { eventID: qualifiedLeadEventId });
  }

  fetch('/api/meta-event', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      event_name: 'QualifiedLead',
      eventId: qualifiedLeadEventId,
      content_name: contentName,
      external_id: clientId,
      fbp,
      fbc,
      value: total,
      currency: 'ARS',
      fn: firstName,
      ln: lastName,
    }),
  }).catch(() => {});

  return { leadEventId, purchaseEventId, qualifiedLeadEventId };
}

export const trackAndRedirectFromCheckout = (items: CartItem[], data: CheckoutData, total: number): string => {
  const clientId = generateClientId();
  const queryParams = getQueryParams();
  const fbp = getCookie('_fbp') || '';
  const fbc = getCookie('_fbc') || (queryParams.fbclid ? `fb.1.${Date.now()}.${queryParams.fbclid}` : '');
  const timestamp = new Date().toISOString();

  const message = buildCheckoutMessage(clientId, items, data, total);
  const phone = BRANCH_PHONES[data.branch].phone;
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  const { leadEventId, purchaseEventId, qualifiedLeadEventId } = fireCheckoutEvents(clientId, items, data, total);

  // Open WhatsApp inside click handler (popup blocker compat)
  window.open(whatsappUrl, '_blank');

  // Google Sheets log — structured payload
  const payload = {
    action: 'create_lead',
    fecha_lead: timestamp,
    client_id: clientId,
    zona: BRANCH_PHONES[data.branch].label,
    tipo_pedido: items.map(i => `${i.quantity}x ${i.name}`).join(' | '),
    retiro_delivery: data.mode,
    direccion: data.address || '',
    forma_pago: data.payment,
    cliente_nombre: data.customerName || '',
    notas: data.notes || '',
    total,
    productos_json: JSON.stringify(items.map(i => ({ id: i.productId, name: i.name, qty: i.quantity, price: i.price }))),
    estado: 'Pendiente',
    fuente: 'Meta',
    campana: queryParams.utm_campaign,
    anuncio: queryParams.utm_content,
    pagina: window.location.href,
    utm_source: queryParams.utm_source,
    utm_medium: queryParams.utm_medium,
    utm_campaign: queryParams.utm_campaign,
    utm_content: queryParams.utm_content,
    fbclid: queryParams.fbclid,
    fbp,
    fbc,
    timestamp_web: timestamp,
    external_id: clientId,
    meta_event_name: 'InitiateCheckout',
    meta_event_id: purchaseEventId,
    meta_lead_event_id: leadEventId,
    meta_qualified_lead_event_id: qualifiedLeadEventId,
    origen_actualizacion: 'checkout',
  };

  fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).catch(err => console.error('Error tracking checkout:', err));

  return whatsappUrl;
};
