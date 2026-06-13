import crypto from 'crypto';

const PIXEL_ID = '866675959278129';

// All Kayso traffic is local — defaults boost EMQ for users who don't fill the form
const DEFAULT_CITY = 'san miguel';
const DEFAULT_STATE = 'buenos aires';
const DEFAULT_COUNTRY = 'ar';

function sha256(value: string): string {
  return crypto.createHash('sha256').update(value.trim().toLowerCase()).digest('hex');
}

function normalizePhone(phone: string): string {
  // strip non-digits, ensure country code
  const digits = phone.replace(/\D/g, '');
  if (!digits) return '';
  // Argentine phone normalization: ensure starts with 54
  if (digits.startsWith('54')) return digits;
  if (digits.startsWith('9')) return '54' + digits;
  return '54' + digits;
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = process.env.META_CAPI_TOKEN;
  if (!token) {
    // CAPI not configured — fail silently so the UX is unaffected
    return res.status(200).json({ skipped: true });
  }

  const {
    event_name,
    eventId,
    content_name,
    external_id,
    fbp,
    fbc,
    value,
    currency,
    contents,
    num_items,
    // Customer information for EMQ
    fn, // first name (raw, will be hashed)
    ln, // last name (raw, will be hashed)
    em, // email (raw, will be hashed)
    ph, // phone (raw, will be normalized + hashed)
    ct, // city (raw, will be hashed) — defaults to san miguel
    st, // state — defaults to buenos aires
    country, // country code — defaults to ar
    zp, // postal code
  } = req.body || {};

  const userData: Record<string, string | string[]> = {
    client_ip_address: (req.headers['x-forwarded-for'] as string || '').split(',')[0].trim(),
    client_user_agent: (req.headers['user-agent'] as string) || '',
  };
  if (fbp) userData.fbp = fbp;
  if (fbc) userData.fbc = fbc;
  if (external_id) userData.external_id = sha256(external_id);

  // Hashed customer information — Meta expects SHA-256 of normalized values
  if (fn) userData.fn = sha256(fn);
  if (ln) userData.ln = sha256(ln);
  if (em) userData.em = sha256(em);
  if (ph) {
    const normalizedPhone = normalizePhone(ph);
    if (normalizedPhone) userData.ph = sha256(normalizedPhone);
  }

  // Geographic defaults — every Kayso lead is in San Miguel/Muñiz, AR
  userData.ct = sha256(ct || DEFAULT_CITY);
  userData.st = sha256(st || DEFAULT_STATE);
  userData.country = sha256(country || DEFAULT_COUNTRY);
  if (zp) userData.zp = sha256(zp);

  const customData: Record<string, any> = {};
  if (content_name) customData.content_name = content_name;
  if (value != null && value > 0) customData.value = value;
  if (currency && value != null && value > 0) customData.currency = currency;
  if (contents) customData.contents = contents;
  if (num_items != null) customData.num_items = num_items;

  const eventPayload = {
    data: [
      {
        event_name: event_name || 'Contact',
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId,
        action_source: 'website',
        event_source_url: (req.headers['referer'] as string) || '',
        user_data: userData,
        custom_data: customData,
      },
    ],
    access_token: token,
  };

  try {
    const response = await fetch(
      `https://graph.facebook.com/v21.0/${PIXEL_ID}/events`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventPayload),
      }
    );
    const data = await response.json();
    if (!response.ok) {
      console.error('[CAPI] Error from Meta:', data);
    }
    return res.status(200).json(data);
  } catch (err) {
    console.error('[CAPI] Request failed:', err);
    return res.status(500).json({ error: 'CAPI request failed' });
  }
}
