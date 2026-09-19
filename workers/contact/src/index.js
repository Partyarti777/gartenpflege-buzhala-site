/**
 * buzhala-contact — Cloudflare Worker
 * ------------------------------------
 * Nimmt Kontaktformular-Submissions entgegen und schickt Mails
 * an gartenpflegebuzhala@gmail.com via MailChannels.
 *
 * - POST /api/contact mit form-encoded body
 * - CORS nur für eigene Domains
 * - Server-side Validation
 * - Honeypot gegen Bots
 * - Rate-Limit per IP (KV, 5/hour)
 * - HTML-escape für Mail-Body
 */

const ALLOWED_ORIGINS = (env) =>
  (env.ALLOWED_ORIGIN || '').split(',').map((s) => s.trim());

const CORS_HEADERS = (origin) => ({
  'Access-Control-Allow-Origin': origin || '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json; charset=utf-8',
});

function escapeHtml(s) {
  if (!s) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function isValidEmail(s) {
  return typeof s === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

function isValidPhone(s) {
  if (!s) return true; // optional
  return typeof s === 'string' && /^[\d\s+\-()]{6,30}$/.test(s);
}

async function checkRateLimit(request, env) {
  // IP aus CF-Header
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  const key = `rate:${ip}`;
  const current = parseInt((await env.RATE_LIMIT.get(key)) || '0', 10);
  if (current >= 5) return false;
  await env.RATE_LIMIT.put(key, String(current + 1), { expirationTtl: 3600 });
  return true;
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const allowed = ALLOWED_ORIGINS(env).includes(origin);
    const corsHeaders = CORS_HEADERS(allowed ? origin : '');

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'method_not_allowed' }), {
        status: 405,
        headers: corsHeaders,
      });
    }

    if (!allowed) {
      return new Response(JSON.stringify({ error: 'origin_not_allowed' }), {
        status: 403,
        headers: corsHeaders,
      });
    }

    // Rate-Limit (nur wenn KV gebunden)
    if (env.RATE_LIMIT) {
      const ok = await checkRateLimit(request, env);
      if (!ok) {
        return new Response(
          JSON.stringify({ error: 'rate_limit', message: 'Zu viele Anfragen, bitte später erneut versuchen.' }),
          { status: 429, headers: corsHeaders },
        );
      }
    }

    // Form parsen
    let form;
    try {
      form = await request.formData();
    } catch (e) {
      return new Response(JSON.stringify({ error: 'invalid_form' }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    // Honeypot: verstecktes Feld "website" muss leer sein
    if (form.get('website')) {
      // Stille 200 zurückgeben, damit Bots denken sie waren erfolgreich
      return new Response(JSON.stringify({ ok: true }), { status: 200, headers: corsHeaders });
    }

    const name = (form.get('name') || '').toString().trim();
    const phone = (form.get('phone') || '').toString().trim();
    const email = (form.get('email') || '').toString().trim();
    const topic = (form.get('topic') || '').toString().trim();
    const message = (form.get('message') || '').toString().trim();

    // Validation
    if (!name || name.length < 2 || name.length > 100) {
      return new Response(JSON.stringify({ error: 'invalid_name' }), {
        status: 400, headers: corsHeaders,
      });
    }
    // Mindestens Telefon ODER E-Mail muss angegeben werden (sonst kann ich nicht antworten)
    if (!phone && !email) {
      return new Response(JSON.stringify({ error: 'missing_contact', message: 'Bitte Telefon ODER E-Mail angeben, damit wir antworten koennen.' }), {
        status: 400, headers: corsHeaders,
      });
    }
    if (phone && !isValidPhone(phone)) {
      return new Response(JSON.stringify({ error: 'invalid_phone' }), {
        status: 400, headers: corsHeaders,
      });
    }
    if (email && !isValidEmail(email)) {
      return new Response(JSON.stringify({ error: 'invalid_email' }), {
        status: 400, headers: corsHeaders,
      });
    }
    if (!message || message.length < 10 || message.length > 2000) {
      return new Response(JSON.stringify({ error: 'invalid_message' }), {
        status: 400, headers: corsHeaders,
      });
    }

    // Mail-Body (HTML)
    const subject = `Neue Anfrage über gartenpflegeservicebuzhala.de — ${escapeHtml(name)}`;
    const html = `
      <h2>Neue Kontaktanfrage</h2>
      <table style="border-collapse:collapse;font-family:sans-serif;">
        <tr><td style="padding:6px 12px;background:#f3efe2;"><strong>Name</strong></td><td style="padding:6px 12px;">${escapeHtml(name)}</td></tr>
        <tr><td style="padding:6px 12px;background:#f3efe2;"><strong>Telefon</strong></td><td style="padding:6px 12px;"><a href="tel:${escapeHtml(phone)}">${escapeHtml(phone)}</a></td></tr>
        ${email ? `<tr><td style="padding:6px 12px;background:#f3efe2;"><strong>E-Mail</strong></td><td style="padding:6px 12px;"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>` : ''}
        ${topic ? `<tr><td style="padding:6px 12px;background:#f3efe2;"><strong>Worum geht es</strong></td><td style="padding:6px 12px;">${escapeHtml(topic)}</td></tr>` : ''}
        <tr><td style="padding:6px 12px;background:#f3efe2;vertical-align:top;"><strong>Nachricht</strong></td><td style="padding:6px 12px;white-space:pre-wrap;">${escapeHtml(message)}</td></tr>
      </table>
      <hr>
      <p style="color:#666;font-size:0.85em;">
        Gesendet: ${new Date().toLocaleString('de-DE', { timeZone: 'Europe/Berlin' })}<br>
        IP (anonymisiert): ${(request.headers.get('CF-Connecting-IP') || 'unknown').slice(0, 12)}...<br>
        Land: ${request.cf?.country || 'unknown'}
      </p>
    `;

    const text = `
Neue Kontaktanfrage
==================
Name:     ${name}
Telefon:  ${phone}
${email ? `E-Mail:   ${email}\n` : ''}${topic ? `Worum:    ${topic}\n` : ''}

Nachricht:
${message}

--
Gesendet: ${new Date().toLocaleString('de-DE', { timeZone: 'Europe/Berlin' })}
IP (anonymisiert): ${(request.headers.get('CF-Connecting-IP') || 'unknown').slice(0, 12)}...
Land: ${request.cf?.country || 'unknown'}
    `;

    // Mail via Resend.com senden (kostenlos, EU-zuverlaessig)
    try {
      const mailRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + env.RESEND_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'Gartenpflege Buzhala <' + env.FROM_EMAIL + '>',
          to: [env.DESTINATION_EMAIL],
          reply_to: env.REPLY_TO || env.DESTINATION_EMAIL,
          subject,
          text,
          html
        })
      });

      if (!mailRes.ok) {
        const errText = await mailRes.text();
        console.error(`Resend error ${mailRes.status}: ${errText}`);
        return new Response(
          JSON.stringify({ error: 'mail_failed', status: mailRes.status, detail: errText }),
          { status: 502, headers: corsHeaders },
        );
      }
      const result = await mailRes.json();
      console.log('Mail sent via Resend, id:', result.id);
    } catch (e) {
      console.error(`Resend exception: ${e.message}`);
      return new Response(
        JSON.stringify({ error: 'mail_exception', message: e.message }),
        { status: 502, headers: corsHeaders },
      );
    }

    return new Response(
      JSON.stringify({ ok: true, message: 'Anfrage erfolgreich gesendet.' }),
      { status: 200, headers: corsHeaders },
    );
  },
};
