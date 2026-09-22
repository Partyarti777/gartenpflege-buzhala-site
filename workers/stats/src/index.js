/* ============================================================
   Gartenpflege Buzhala · Click-Stats Worker
   ----------------------------------------------------------
   Empfängt anonyme Click-Events der 3 mobilen Sticky-Buttons
   (Festnetz, Mobil, WhatsApp) und stellt ein token-geschütztes
   Dashboard bereit. KEINE Cookies, KEINE User-IDs, KEINE IPs
   in KV — nur Button-ID + Tageszähler. DSGVO-konform.

   Endpoints:
     POST /count           Click-Event inkrementieren (öffentlich)
     GET  /stats?token=... HTML-Dashboard (Admin)
     GET  /stats.json?token=...  JSON-Export (Admin)

   Deploy:  wrangler deploy
   Secret:  wrangler secret put STATS_TOKEN
   KV:      wrangler kv:namespace create CLICK_STATS
   ============================================================ */

const ALLOWED_BUTTONS = ['smfest', 'smcall', 'smwa'];
const BUTTON_LABELS = { smfest: 'Festnetz', smcall: 'Mobil', smwa: 'WhatsApp' };
const RATE_LIMIT_MAX = 20;          // requests
const RATE_LIMIT_WINDOW_MS = 10_000; // per 10 seconds per IP
const DAILY_TTL_SECONDS = 40 * 24 * 60 * 60; // 40 days
const DAILY_MAX_ENTRIES = 40;

/** In-memory rate-limit state (best-effort within Worker-Isolate-Lifetime). */
const rlBuckets = new Map(); // ip -> { count, windowStart }

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin') || '';

    /* -------- CORS-Preflight (OPTIONS) -------- */
    if (request.method === 'OPTIONS') {
      if (matchesAllowedOrigin(origin, env.ALLOWED_ORIGIN)) {
        return new Response(null, {
          status: 204,
          headers: corsHeaders(origin),
        });
      }
      return new Response('Origin not allowed', { status: 403 });
    }

    /* -------- POST /count -------- */
    if (request.method === 'POST' && url.pathname === '/count') {
      return handleCount(request, env, ctx, origin);
    }

    /* -------- GET /stats -------- */
    if (request.method === 'GET' && url.pathname === '/stats') {
      return handleStats(request, env, ctx);
    }

    /* -------- GET /stats.json -------- */
    if (request.method === 'GET' && url.pathname === '/stats.json') {
      return handleStatsJson(request, env, ctx);
    }

    return new Response('Not found', { status: 404 });
  },
};

/* ============================================================
   POST /count
   ============================================================ */
async function handleCount(request, env, ctx, origin) {
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';

  // Rate limit
  if (!checkRateLimit(ip)) {
    return new Response('Too many requests', {
      status: 429,
      headers: matchesAllowedOrigin(origin, env.ALLOWED_ORIGIN)
        ? corsHeaders(origin) : {},
    });
  }

  // Parse body
  let body;
  try {
    body = await request.json();
  } catch (e) {
    return new Response('Invalid JSON', { status: 400 });
  }

  const button = body && body.button;
  if (!ALLOWED_BUTTONS.includes(button)) {
    return new Response('Unknown button', { status: 400 });
  }

  // Increment counters (read-modify-write; minor drift on contention acceptable)
  ctx.waitUntil(incrementCounters(env, button));

  return new Response(null, {
    status: 204,
    headers: matchesAllowedOrigin(origin, env.ALLOWED_ORIGIN)
      ? corsHeaders(origin) : {},
  });
}

async function incrementCounters(env, button) {
  const today = isoDate(new Date());
  const totalKey = `total:${button}`;
  const dailyKey = `daily:${button}`;

  // Total
  const totalStr = await env.CLICK_STATS.get(totalKey);
  const total = (parseInt(totalStr || '0', 10) || 0) + 1;
  await env.CLICK_STATS.put(totalKey, String(total));

  // Daily array
  let arr = await env.CLICK_STATS.get(dailyKey, { type: 'json' }) || [];
  if (!Array.isArray(arr)) arr = [];

  const idx = arr.findIndex(e => e && e.date === today);
  if (idx >= 0) {
    arr[idx].count = (arr[idx].count || 0) + 1;
  } else {
    arr.unshift({ date: today, count: 1 });
    if (arr.length > DAILY_MAX_ENTRIES) {
      arr = arr.slice(0, DAILY_MAX_ENTRIES);
    }
  }

  await env.CLICK_STATS.put(dailyKey, JSON.stringify(arr), {
    expirationTtl: DAILY_TTL_SECONDS,
  });
}

/* ============================================================
   GET /stats  (HTML dashboard)
   ============================================================ */
async function handleStats(request, env, ctx) {
  const url = new URL(request.url);
  if (!checkToken(url.searchParams.get('token'), env.STATS_TOKEN)) {
    return new Response('Nope.', {
      status: 401,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }

  const data = await readAll(env);
  const html = renderDashboardHtml(data);
  return new Response(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store, max-age=0',
      'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; img-src 'self' data:",
      'X-Robots-Tag': 'noindex, nofollow',
    },
  });
}

async function handleStatsJson(request, env, ctx) {
  const url = new URL(request.url);
  if (!checkToken(url.searchParams.get('token'), env.STATS_TOKEN)) {
    return new Response(JSON.stringify({ error: 'unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  const data = await readAll(env);
  return new Response(JSON.stringify(data, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store, max-age=0',
    },
  });
}

async function readAll(env) {
  const buttons = ALLOWED_BUTTONS;
  const [totals, dailies] = await Promise.all([
    Promise.all(buttons.map(b => env.CLICK_STATS.get(`total:${b}`))),
    Promise.all(buttons.map(b => env.CLICK_STATS.get(`daily:${b}`, { type: 'json' }))),
  ]);
  const totalsObj = {};
  const dailyObj = {};
  buttons.forEach((b, i) => {
    totalsObj[b] = parseInt(totals[i] || '0', 10) || 0;
    dailyObj[b] = Array.isArray(dailies[i]) ? dailies[i] : [];
  });
  return { totals: totalsObj, daily: dailyObj, generatedAt: new Date().toISOString() };
}

/* ============================================================
   HTML rendering
   ============================================================ */
function renderDashboardHtml(data) {
  const { totals, daily, generatedAt } = data;

  // Build 30-day window (oldest at bottom, newest at top)
  const today = new Date(generatedAt);
  const days = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setUTCDate(d.getUTCDate() - i);
    days.push(isoDate(d));
  }

  const anyData = ALLOWED_BUTTONS.some(b => totals[b] > 0);
  const now = new Date(generatedAt);
  const formattedNow = new Intl.DateTimeFormat('de-DE', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).format(now);

  if (!anyData) {
    return `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>Stats · Buzhala</title>
<style>${DASHBOARD_CSS}</style>
</head>
<body>
  <h1>Button-Klick-Statistik</h1>
  <p class="meta">Stand: ${escapeHtml(formattedNow)}</p>
  <div class="empty">Noch keine Klicks — sobald jemand einen der drei mobilen Kontakt-Buttons drückt, erscheinen hier Zahlen.</div>
</body>
</html>`;
  }

  const headerRow = ALLOWED_BUTTONS.map(b => `<th>${escapeHtml(BUTTON_LABELS[b])}</th>`).join('');
  const totalRow = ALLOWED_BUTTONS.map(b => `<td class="total">${totals[b]}</td>`).join('');

  const bodyRows = days.map(date => {
    const cells = ALLOWED_BUTTONS.map(b => {
      const entry = (daily[b] || []).find(e => e.date === date);
      const count = entry ? entry.count : 0;
      const cls = count === 0 ? ' class="zero"' : '';
      return `<td${cls}>${count}</td>`;
    }).join('');
    const formattedDate = new Intl.DateTimeFormat('de-DE', {
      day: '2-digit', month: '2-digit', year: 'numeric',
    }).format(new Date(date + 'T00:00:00Z'));
    return `<tr><td class="date">${escapeHtml(formattedDate)}</td>${cells}</tr>`;
  }).join('\n      ');

  return `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>Stats · Buzhala</title>
<style>${DASHBOARD_CSS}</style>
</head>
<body>
  <h1>Button-Klick-Statistik</h1>
  <p class="meta">Stand: ${escapeHtml(formattedNow)} · letzte 30 Tage</p>
  <table>
    <thead>
      <tr>
        <th>Datum</th>
        ${headerRow}
      </tr>
    </thead>
    <tbody>
      ${bodyRows}
    </tbody>
    <tfoot>
      <tr class="total-row">
        <th>Gesamt</th>
        ${totalRow}
      </tr>
    </tfoot>
  </table>
  <p class="footer-hint">🔒 Diese URL als Bookmark speichern. Sie enthält deinen geheimen Token.</p>
</body>
</html>`;
}

const DASHBOARD_CSS = `
  :root { --primary:#3FBFB5; --bg:#f3efe2; --line:#e2e8e3; --text:#0b1f17; --muted:#456; }
  * { box-sizing: border-box; }
  html { color-scheme: light; }
  body {
    margin: 0; padding: 24px 16px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: var(--bg); color: var(--text);
    line-height: 1.5;
  }
  h1 { font-size: 1.4rem; margin: 0 0 8px; font-weight: 700; }
  .meta { font-size: 0.85rem; color: var(--muted); margin: 0 0 20px; }
  .empty {
    text-align: center; padding: 40px 20px;
    color: var(--muted); background: white;
    border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  }
  table {
    width: 100%; border-collapse: collapse;
    background: white; border-radius: 12px; overflow: hidden;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    font-variant-numeric: tabular-nums;
  }
  th, td {
    padding: 10px 12px; text-align: left;
    border-bottom: 1px solid var(--line);
  }
  th { background: #eef2ee; font-weight: 600; }
  td.date { color: var(--muted); font-size: 0.85rem; }
  td.zero { color: #bbb; }
  td.total { font-weight: 700; color: var(--primary); font-size: 1.05rem; }
  th.total-row { background: #e7f5f3; }
  tfoot th, tfoot td { border-bottom: none; }
  .footer-hint { font-size: 0.8rem; color: var(--muted); margin-top: 20px; text-align: center; }
  @media (max-width: 540px) {
    body { padding: 16px 10px; }
    th, td { padding: 8px 6px; font-size: 0.9rem; }
    h1 { font-size: 1.2rem; }
  }
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { animation-duration: 0s !important; transition-duration: 0s !important; }
  }
`;

/* ============================================================
   Helpers
   ============================================================ */
function checkToken(provided, expected) {
  if (!provided || !expected) return false;
  if (provided.length !== expected.length) return false;
  // Constant-time compare
  let diff = 0;
  for (let i = 0; i < provided.length; i++) {
    diff |= provided.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return diff === 0;
}

function matchesAllowedOrigin(origin, allowedList) {
  if (!origin || !allowedList) return false;
  return allowedList.split(',').map(s => s.trim()).filter(Boolean).includes(origin);
}

function corsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'content-type',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  };
}

function checkRateLimit(ip) {
  const now = Date.now();
  const bucket = rlBuckets.get(ip);
  if (!bucket || now - bucket.windowStart > RATE_LIMIT_WINDOW_MS) {
    rlBuckets.set(ip, { count: 1, windowStart: now });
    return true;
  }
  if (bucket.count >= RATE_LIMIT_MAX) return false;
  bucket.count++;
  return true;
}

function isoDate(d) {
  return d.toISOString().slice(0, 10);
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
