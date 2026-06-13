import crypto from 'crypto';

const PIXEL_ID = '866675959278129';

const DEFAULT_CITY = 'san miguel';
const DEFAULT_STATE = 'buenos aires';
const DEFAULT_COUNTRY = 'ar';

function sha256(value: string): string {
  return crypto.createHash('sha256').update(value.trim().toLowerCase()).digest('hex');
}

function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith('54')) return digits;
  if (digits.startsWith('9')) return '54' + digits;
  return '54' + digits;
}

/**
 * Server-to-server endpoint for confirmed purchases.
 * Called by Apps Script (or any backend) when a lead in the Google Sheet
 * is marked as "Confirmado" / paid by Gladys.
 *
 * Required body:
 *   - secret: shared secret (env META_PURCHASE_SECRET) — protects from public abuse
 *   - external_id: original client_id from the lead (e.g. "KS-A3B5C9")
 *   - value: order total in ARS (number)
 *
 * Optional body (improves EMQ):
 *   - eventId: dedup id (auto-generated if missing)
 *   - fn, ln: customer name parts
 *   - ph: customer phone
 *   - em: customer email
 *   - branch: 'gelly' | 'peron'
 *   - mode: 'delivery' | 'retiro'
 *   - fbp, fbc: tracking cookies if available
 */
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = process.env.META_CAPI_TOKEN;
  if (!token) {
    return res.status(500).json({ error: 'CAPI not configured' });
  }

  const requiredSecret = process.env.META_PURCHASE_SECRET;
  const { secret, external_id, value, eventId, fn, ln, em, ph, branch, mode, fbp, fbc, content_name } = req.body || {};

  if (requiredSecret && secret !== requiredSecret) {
    return res.status(401).json({ error: 'Invalid secret' });
  }

  if (!external_id) {
    return res.status(400).json({ error: 'Missing external_id' });
  }

  if (typeof value !== 'number' || value <= 0) {
    return res.status(400).json({ error: 'Missing or invalid value (must be a positive number)' });
  }

  const userData: Record<string, string> = {};
  userData.external_id = sha256(String(external_id));
  if (fn) userData.fn = sha256(fn);
  if (ln) userData.ln = sha256(ln);
  if (em) userData.em = sha256(em);
  if (ph) {
    const normalized = normalizePhone(ph);
    if (normalized) userData.ph = sha256(normalized);
  }
  if (fbp) userData.fbp = fbp;
  if (fbc) userData.fbc = fbc;
  userData.ct = sha256(DEFAULT_CITY);
  userData.st = sha256(DEFAULT_STATE);
  userData.country = sha256(DEFAULT_COUNTRY);

  const customData: Record<string, any> = {
    value,
    currency: 'ARS',
  };
  if (content_name) customData.content_name = content_name;
  if (branch) customData.branch = branch;
  if (mode) customData.mode = mode;

  const eventPayload = {
    data: [
      {
        event_name: 'Purchase',
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId || `purchase-${external_id}-${Date.now()}`,
        action_source: 'physical_store', // closer to truth — pickup/delivery from a physical branch
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
      console.error('[CAPI Purchase] Error from Meta:', data);
      return res.status(500).json({ error: 'Meta rejected the event', details: data });
    }
    return res.status(200).json({ ok: true, ...data });
  } catch (err) {
    console.error('[CAPI Purchase] Request failed:', err);
    return res.status(500).json({ error: 'CAPI request failed' });
  }
}
