export const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwUk07_6e3m4kbpSKEJW1K5yUDmUtCzEbNrPTDMiWo7LreAmaXIybt0vosZrI8yUaQI4w/exec';

function generateClientId() {
  return 'KS-' + Math.random().toString(36).substring(2, 8).toUpperCase();
}

function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
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

export const trackAndRedirectToWhatsApp = (baseMessage: string, phoneNumber: string, orderDetails: OrderDetails = {}) => {
  const clientId = generateClientId();
  const queryParams = getQueryParams();
  const fbp = getCookie('_fbp') || '';
  const fbc = getCookie('_fbc') || (queryParams.fbclid ? `fb.1.${Date.now()}.${queryParams.fbclid}` : '');
  const timestamp = new Date().toISOString();

  // 1. Prepare WhatsApp Message
  let whatsappMessage = `Pedido Kayso | ID: ${clientId}\n`;
  if (orderDetails.zona) whatsappMessage += `Zona: ${orderDetails.zona}\n`;
  if (orderDetails.tipo) whatsappMessage += `Tipo: ${orderDetails.tipo}\n`;
  if (orderDetails.modalidad) whatsappMessage += `Modalidad: ${orderDetails.modalidad}\n`;
  whatsappMessage += `\n${baseMessage}`;

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  // 2. Open WhatsApp immediately to prevent popup blockers
  // We use a small timeout to ensure tracking starts but redirect happens
  // On some Androids, window.open might be blocked if not directly in the click handler
  // But this function is usually called in a click handler.
  window.open(whatsappUrl, '_blank');

  // 3. Send to Meta Pixel
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('track', 'Lead', {
      external_id: clientId,
      content_name: orderDetails.resumen || 'Pedido WhatsApp',
      value: 14500,
      currency: 'ARS',
    }, { eventID: `lead_${clientId}` });
  }

  // 4. Send to Google Sheets via Apps Script (Background)
  const payload = {
    action: 'create_lead',
    fecha_lead: timestamp,
    client_id: clientId,
    zona: orderDetails.zona || '',
    tipo_pedido: orderDetails.resumen || baseMessage.substring(0, 150),
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
    meta_event_id: `lead_${clientId}`,
    origen_actualizacion: 'landing'
  };

  fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  }).catch(err => console.error('Error tracking lead:', err));

  return whatsappUrl;
};
