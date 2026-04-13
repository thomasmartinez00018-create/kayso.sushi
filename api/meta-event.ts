const PIXEL_ID = '866675959278129';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = process.env.META_CAPI_TOKEN;
  if (!token) {
    // CAPI not configured — fail silently so the UX is unaffected
    return res.status(200).json({ skipped: true });
  }

  const { event_name, eventId, content_name, external_id, fbp, fbc } = req.body || {};

  const userData: Record<string, string> = {
    client_ip_address: (req.headers['x-forwarded-for'] as string || '').split(',')[0].trim(),
    client_user_agent: (req.headers['user-agent'] as string) || '',
  };
  if (fbp) userData.fbp = fbp;
  if (fbc) userData.fbc = fbc;
  if (external_id) userData.external_id = external_id;

  const eventPayload = {
    data: [
      {
        event_name: event_name || 'Contact',
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId,
        action_source: 'website',
        event_source_url: (req.headers['referer'] as string) || '',
        user_data: userData,
        custom_data: {
          ...(content_name && { content_name }),
        },
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
    return res.status(200).json(data);
  } catch (_err) {
    return res.status(500).json({ error: 'CAPI request failed' });
  }
}
