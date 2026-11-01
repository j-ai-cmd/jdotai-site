// Server-side relay for the enquiry form.
// The Make webhook URL lives only in Vercel env vars, never in browser code.
//
// Required env vars (Vercel → Project → Settings → Environment Variables):
//   MAKE_WEBHOOK_URL  the (regenerated) Make webhook URL
//   MAKE_SECRET       random string; Make filter checks the x-jdotai-secret header

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const FIELDS = ['name', 'email', 'phone', 'firm', 'pms', 'area', 'message', 'agents', 'source']
const MAX = 2000

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const hook = process.env.MAKE_WEBHOOK_URL
  const secret = process.env.MAKE_SECRET
  if (!hook || !secret) return res.status(500).json({ error: 'Not configured' })

  let body = req.body
  if (typeof body === 'string') {
    try { body = JSON.parse(body) } catch { body = {} }
  }
  body = body && typeof body === 'object' ? body : {}

  // Honeypot: real users never fill this hidden field.
  if (body.website) return res.status(200).json({ ok: true })

  const data = {}
  for (const k of FIELDS) {
    if (body[k] != null) data[k] = String(body[k]).slice(0, MAX).trim()
  }

  if (!data.email || !EMAIL.test(data.email)) return res.status(400).json({ error: 'Valid email required' })

  const h = req.headers
  const payload = {
    ...data,
    submitted_at: new Date().toISOString(),
    meta: {
      ip: (h['x-forwarded-for'] || '').split(',')[0].trim() || h['x-real-ip'] || '',
      country: h['x-vercel-ip-country'] || '',
      region: h['x-vercel-ip-country-region'] || '',
      city: decodeURIComponent(h['x-vercel-ip-city'] || ''),
      user_agent: h['user-agent'] || '',
      referer: h['referer'] || '',
    },
  }

  try {
    const r = await fetch(hook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-jdotai-secret': secret },
      body: JSON.stringify(payload),
    })
    if (!r.ok) throw new Error(String(r.status))
    return res.status(200).json({ ok: true })
  } catch {
    return res.status(502).json({ error: 'Upstream failed' })
  }
}
