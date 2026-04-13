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
}

// Fires Contact event once per session per product.
// Also sends to CAPI and registers ContactRedirected via visibilitychange.
function fireContactEvent(contentName: string, clientId: string): void {
  const sessionKey = `_fired_contact_${contentName}`;
  if (sessionStorage.getItem(sessionKey)) return;
  sessionStorage.setItem(sessionKey, '1');

  const eventId = generateEventId();
  const queryParams = getQueryParams();
  const fbp = getCookie('_fbp');
  const fbc = getCookie('_fbc') || (queryParams.fbclid ? `fb.1.${Date.now()}.${queryParams.fbclid}` : '');

  // Browser pixel — Contact
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('track', 'Contact', {
      external_id: clientId,
      content_name: contentName,
    }, { eventID: eventId });
  }

  // Server-side CAPI — Contact (same eventID for dedup)
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

  // ContactRedirected: fires when user leaves the tab (signal that WhatsApp opened)
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

export const trackAndRedirectToWhatsApp = (baseMessage: string, phoneNumber: string, orderDetails: OrderDetails = {}) => {
  const clientId = generateClientId();
  const queryParams = getQueryParams();
  const fbp = getCookie('_fbp') || '';
  const fbc = getCookie('_fbc') || (queryParams.fbclid ? `fb.1.${Date.now()}.${queryParams.fbclid}` : '');
  const timestamp = new Date().toISOString();

  // 1. Build WhatsApp message
  let whatsappMessage = `Pedido Kayso | ID: ${clientId}\n`;
  if (orderDetails.zona) whatsappMessage += `Zona: ${orderDetails.zona}\n`;
  if (orderDetails.tipo) whatsappMessage += `Tipo: ${orderDetails.tipo}\n`;
  if (orderDetails.modalidad) whatsappMessage += `Modalidad: ${orderDetails.modalidad}\n`;
  whatsappMessage += `\n${baseMessage}`;

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  const contentName = orderDetails.resumen || 'Pedido WhatsApp';

  // 2. Fire Contact (deduplicated per session per product + CAPI + ContactRedirected)
  fireContactEvent(contentName, clientId);

  // 3. Fire Lead (main conversion event for campaign optimization)
  const leadEventId = generateEventId();
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('track', 'Lead', {
      external_id: clientId,
      content_name: contentName,
      value: 14500,
      currency: 'ARS',
    }, { eventID: leadEventId });
  }

  // 4. Open WhatsApp (inside click handler call stack — prevents popup blocker)
  window.open(whatsappUrl, '_blank');

  // 5. Google Sheets log (background, non-blocking)
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
    fbp: fbp,
    fbc: fbc,
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
