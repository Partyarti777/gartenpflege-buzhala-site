# Anonyme Klick-Statistik für Buzhala-Sticky-Buttons

**Datum:** 2026-09-22
**Status:** Design-Approval — bereit für Spec-Review
**Author:** Claude (via brainstorming session)
**Project:** Gartenpflege & Service Buzhala (`gartenpflegeservicebuzhala.de`)

---

## 1. Zweck & Nicht-Zweck

**Zweck:** Der Seitenbetreiber (Artur) möchte wissen, wie oft die drei mobilen
Sticky-Contact-Buttons (`Festnetz`, `Mobil`, `WhatsApp`) tatsächlich geklickt
werden. Die Daten sind ausschließlich für den Betreiber bestimmt.

**Explizit NICHT-Zweck:**
- Kein öffentliches Counter-Badge auf den Buttons (kein Social-Proof)
- Keine User-Feedback-Meldung nach Klick
- Keine Charts/Graphs im Dashboard (einfache Tabelle reicht)
- Kein Cross-Device-Tracking, kein User-Identifying, kein Profiling

---

## 2. Architektur

Vier Komponenten, klar getrennt:

### 2.1 Cloudflare Worker `buzhala-stats`

Eigener, vom `buzhala-contact`-Worker unabhängiger Worker. Deployment unter
Standard-CF-Subdomain `https://buzhala-stats.workers.dev`.

**Endpoints:**

| Methode | Pfad | Zweck | Auth |
|---|---|---|---|
| `OPTIONS` | `*` | CORS-Preflight | Allow-Origin gesetzt |
| `POST` | `/count` | Click-Event empfangen, Counter inkrementieren | Keine (öffentlich) |
| `GET` | `/stats` | HTML-Dashboard | Token in `?token=` |
| `GET` | `/stats.json` | Rohe JSON-Daten | Token in `?token=` |
| `*` | alles andere | 404 | — |

### 2.2 Cloudflare KV Namespace `CLICK_STATS`

Binding via `wrangler.toml`:

```toml
[[kv_namespaces]]
binding = "CLICK_STATS"
id = "<aus wrangler kv:namespace create>"
```

**Key-Schema:**

| Key | Typ | Wert | TTL |
|---|---|---|---|
| `total:smfest` | String | `"12"` (laufender Total) | keine |
| `total:smcall` | String | `"47"` | keine |
| `total:smwa` | String | `"8"` | keine |
| `daily:smfest` | JSON-Array | `[{date:"2026-09-22",count:5}, ...]` (max 40 Einträge) | 40 Tage via `expirationTtl: 3456000` |
| `daily:smcall` | JSON-Array | dito | 40 Tage via `expirationTtl: 3456000` |
| `daily:smwa` | JSON-Array | dito | 40 Tage via `expirationTtl: 3456000` |

**Wichtig:** KV-TTL wird über die `expirationTtl`-Option beim `put()`-Aufruf
gesetzt (Sekunden). Das `metadata`-Argument ist frei wählbarer User-Data und
löst KEINE Expiry aus. Falsche Verwendung würde den 40-Tage-Lösch-Versprechen
in der Datenschutzerklärung brechen.

KV read-modify-write ist nicht atomar. Drift bei gleichzeitigen Klicks wird
akzeptiert (für kleines Traffic-Volumen praktisch irrelevant). Falls Drift
spürbar wird: spätere Migration zu D1 möglich (YAGNI jetzt).

### 2.3 Frontend `assets/js/click-stats.js`

Neue Datei, separat von `partials.js`. Wird per `<script defer>` in alle vier
HTML-Seiten eingebunden: `index.html`, `impressum.html`, `datenschutz.html`,
`cookies.html`.

**Verhalten:**
- Click-Listener auf `.smfest`, `.smcall`, `.smwa` (Event-Delegation am
  `document` für Resilienz gegen späte Header-Mounts)
- Fire-and-forget `navigator.sendBeacon()` gegen `POST /count` mit
  `Blob([JSON.stringify({button:'smcall'})], {type:'application/json'})`
- Fallback: `fetch(url, {method:'POST', body:..., keepalive:true})`
- **CORS-Preflight-Hinweis:** `application/json` ist KEIN simple content
  type (laut Fetch-Spec), der Browser sendet daher einen OPTIONS-Preflight
  vor jedem POST. Der Worker MUSS die OPTIONS-Route (siehe §3.3) korrekt
  beantworten, sonst scheitert jeder Klick im Cross-Origin-Fall. sendBeacon
  verschleiert den Preflight gegenüber dem Aufrufer, ändert aber nichts an
  der Notwendigkeit.
- Kein `await` im Klick-Handler, kein UX-Impact
- Defensive Try/Catch um alles — Tracking-Fehler dürfen Klick-Flow nie stören

### 2.4 Datenschutz-Update `datenschutz.html`

Neuer Absatz im bestehenden CF-Web-Analytics-Abschnitt (Erweiterung, kein
eigener Top-Level-Abschnitt):

> **Anonyme Button-Klick-Statistik (Ergänzung)**
>
> Zusätzlich zur Seitenaufruf-Statistik (Cloudflare Web Analytics) erfassen
> wir anonymisierte Klick-Zähler der drei mobilen Kontakt-Buttons (Festnetz,
> Mobil, WhatsApp). Dies hilft uns zu verstehen, über welchen Kanal Besucher
> bevorzugt Kontakt aufnehmen.
>
> - **Zweck:** Anonyme Reichweitenmessung der Kontaktaufnahme
> - **Rechtsgrundlage:** Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse)
> - **Erfasste Daten:** Button-Kennung (eines von drei Werten), Zeitstempel,
>   Tag. Keine IP-Adressen, keine Cookies, kein LocalStorage, keine
>   User-IDs, kein Fingerprinting, keine User-Agent-Speicherung
> - **Empfänger/Datenverarbeitung:** Cloudflare Inc., EU-Edge (Frankfurt bzw.
>   Stockholm bei EU-Usern), Speicherung in EU-KV. Kein Drittland-Transfer,
>   keine Profilbildung
> - **Speicherdauer:** Tagesauflösung 40 Tage, Gesamt-Total persistent
> - **Widerspruch/Auskunft:** Sie können der Verarbeitung jederzeit
>   widersprechen oder Auskunft verlangen — Kontakt über die im Impressum
>   angegebenen Wege. Wir löschen die Daten in diesem Fall

### 2.5 Cookie-Text-Update `cookies.html`

**Zeile 51** (Statistik-Kategorie):

> Hilft uns zu verstehen, wie Besucher mit der Website interagieren — durch
> anonyme Erfassung von Seitenaufrufen (Cloudflare Web Analytics) und Klicks
> auf die drei mobilen Kontakt-Buttons (Festnetz, Mobil, WhatsApp). Beide
> ohne Cookies, ohne LocalStorage, ohne Drittstaaten-Transfer.

**`cookie-banner.js` Zeile 19** (ⓘ-Tooltip):

> "Was bedeutet Statistik?" — erweitert auf: "Statistik umfasst anonyme
> Seitenaufrufe und anonyme Klick-Zähler der Kontakt-Buttons. Details in der
> Cookie-Richtlinie."

### 2.6 Was bewusst NICHT gebaut wird (YAGNI)

- ❌ Kein sichtbares Counter-Badge auf den Buttons
- ❌ Keine User-Feedback-Meldung nach Klick
- ❌ Keine externen Charts/Graphs. Tabelle mit optionalem
  30-Tage-Sparkline-Block pro Button (selbst gerendertes Mini-SVG aus den
  vorhandenen Daily-Werten, keine Chart-Library)
- ❌ Kein Bot-Detection via User-Agent
- ❌ Kein D1-SQL oder Durable Objects (nur wenn Drift empirisch auffällt)
- ❌ Kein CF Access für Admin-View (Token in URL reicht)
- ❌ Keine Retry-Queue im Browser

---

## 3. Datenfluss

### 3.1 Click-Event

```
[Mobile User klickt .smcall]
   │
   ▼
[click-stats.js: Click-Listener]
   │
   ├─ navigator.sendBeacon(
   │     'https://buzhala-stats.workers.dev/count',
   │     new Blob([JSON.stringify({button:'smcall'})],
   │              {type:'application/json'}))
   │  (Fire-and-forget, blockiert nichts)
   ▼
[Worker: POST /count]
   │
   ├─ Body parsen → {button: 'smcall'}
   ├─ Whitelist-Check: button ∈ {smfest, smcall, smwa}
   │   └─ wenn nicht: 400 + log, return
   ├─ KV-Reads:
   │    CLICK_STATS.get('total:smcall')  → z.B. "47"
   │    CLICK_STATS.get('daily:smcall', {type:'json'})
   │      → [{date:"2026-09-22",count:18}, ...]
   ├─ Total: Number + 1, write zurück (kein TTL)
   ├─ Daily:
   │    - Wenn heute schon im Array: count + 1
   │    - Wenn nicht: prepend {date: heute, count: 1}
   │    - Array auf max 40 Einträge getrimmt (älteste raus)
   │    - write mit `{expirationTtl: 3456000}` (40 Tage × 86400 sec)
   ├─ Response: 204 No Content
   └─ Bei Fehler: 500, geloggt, Browser ignoriert
```

### 3.2 Admin-View

```
[Browser: GET /stats?token=<SECRET>]
   │
   ▼
[Worker: GET /stats]
   │
   ├─ Token-Check: url.searchParams.get('token') === env.STATS_TOKEN
   │   └─ wenn falsch: 401 "Nope."
   ├─ KV-Reads (6 Keys parallel via Promise.all):
   │    total:smfest, total:smcall, total:smwa
   │    daily:smfest, daily:smcall, daily:smwa (type:'json')
   ├─ HTML rendern:
   │    - <h1>Button-Klick-Statistik</h1>
   │    - <p>Letzte Aktualisierung: <time>{jetzt}</time></p>
   │    - <table> mit 3 Spalten (Festnetz/Mobil/WhatsApp)
   │      - <thead>: Gesamt-Total + "Trend 30 Tage" (kleine SVG-Sparkline)
   │      - <tbody>: letzte 30 Tage, jeweils count pro Button
   │    - Footer: Token-Hint "URL als Bookmark speichern"
   ├─ Response: 200, text/html, Cache-Control: no-store, max-age=0
   └─ JSON-Variante /stats.json: gleiche Daten, Content-Type application/json
```

### 3.3 Worker-Response Headers

**CORS-Origin-Logik (gilt für alle Cross-Origin-Antworten):**
Der Worker liest `ALLOWED_ORIGIN` aus Env (kommaseparierte Liste, siehe §6).
Bei jeder Antwort mit CORS-Bedarf wird der `Origin`-Header des Requests
gegen die Liste geprüft:
- Match → `Access-Control-Allow-Origin` = der konkret anfragende Origin
  (NICHT die ganze Liste — `*` wäre nur bei Public-APIs erlaubt und würde
  hier mit `Access-Control-Allow-Credentials` ohnehin nicht funktionieren)
- Kein Match → 403 ohne CORS-Header
- Kein `Origin`-Header (z.B. direkter Server-zu-Server-Curl): kein CORS-Header
  nötig, Antwort geht durch

**CORS-Preflight (`OPTIONS /count`):**
```
Access-Control-Allow-Origin: <matching Origin aus Liste>
Access-Control-Allow-Methods: POST, OPTIONS
Access-Control-Allow-Headers: content-type
Access-Control-Max-Age: 86400
Vary: Origin
```

**POST /count Response:**
```
HTTP/1.1 204 No Content
Access-Control-Allow-Origin: <matching Origin aus Liste>
Vary: Origin
```

**GET /stats Response (kein CORS nötig):**
Dashboard wird direkt im Browser geöffnet, nicht via fetch von einer anderen
Origin. Daher kein `Access-Control-Allow-Origin` für HTML-Response nötig.
```
HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8
Cache-Control: no-store, max-age=0
Content-Security-Policy: default-src 'none'; style-src 'unsafe-inline'; img-src 'self' data:
```

**GET /stats Response:**
```
HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8
Cache-Control: no-store, max-age=0
Content-Security-Policy: default-src 'none'; style-src 'unsafe-inline'; img-src 'self' data:
```

(Hinweis: `style-src 'unsafe-inline'` ist nötig, weil das Inline-`<style>` im
HTML direkt mitsendet. Akzeptabel für rein-private Single-User-View.)

---

## 4. Dashboard-HTML (Kurz-Skizze)

```html
<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>Stats · Buzhala</title>
<style>
  :root { --primary:#3FBFB5; --bg:#f3efe2; --line:#e2e8e3; --text:#0b1f17; }
  * { box-sizing: border-box; }
  body { margin:0; padding:24px 16px; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
         background:var(--bg); color:var(--text); }
  h1 { font-size:1.4rem; margin:0 0 8px; }
  .meta { font-size:0.85rem; color:#456; margin-bottom:20px; }
  table { width:100%; border-collapse:collapse; background:white;
          border-radius:8px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,.05); }
  th, td { padding:10px 12px; text-align:left; border-bottom:1px solid var(--line);
           font-variant-numeric: tabular-nums; }
  th { background:#eef2ee; font-weight:600; }
  td.date { color:#678; font-size:0.85rem; }
  td.zero { color:#bbb; }
  th.total, td.total { font-weight:700; color:var(--primary); }
  .empty { text-align:center; padding:40px; color:#678; }
  @media (prefers-reduced-motion: reduce) { *,*::before,*::after { animation:0; transition:0; } }
</style>
</head>
<body>
  <h1>Button-Klick-Statistik</h1>
  <p class="meta">Stand: <time>22.09.2026, 14:35</time></p>

  <table>
    <thead>
      <tr>
        <th>Datum</th>
        <th>Festnetz</th>
        <th>Mobil</th>
        <th>WhatsApp</th>
      </tr>
    </thead>
    <tbody>
      <tr><td class="date">22.09.2026</td><td>5</td><td>18</td><td>2</td></tr>
      <tr><td class="date">21.09.2026</td><td>4</td><td>12</td><td>3</td></tr>
      <!-- ... 30 Tage ... -->
    </tbody>
    <tfoot>
      <tr class="total-row">
        <th>Gesamt</th>
        <td class="total">12</td>
        <td class="total">47</td>
        <td class="total">8</td>
      </tr>
    </tfoot>
  </table>

  <p class="meta" style="margin-top:24px">🔒 Diese URL als Bookmark speichern.
     Enthält deinen geheimen Token.</p>
</body>
</html>
```

Bei leerem KV (`total:*` existiert nicht): Empty-State `<div class="empty">Noch
keine Klicks — sobald jemand einen Button drückt, erscheinen hier Zahlen.</div>`
statt der Tabelle.

---

## 5. Error Handling & Edge Cases

| Szenario | Worker-Response | Wirkung |
|---|---|---|
| POST mit unbekanntem Button | 400 + log | Browser ignoriert |
| POST ohne Body / kaputtem JSON | 400 + log | Browser ignoriert |
| POST >20/10s pro IP | 429 + log | Browser ignoriert |
| KV-Read fails | 500 + log | Counter-Inkrement verpasst |
| KV-Write fails nach Read | 500 + log; kein Retry | Selten, akzeptabel |
| GET /stats ohne/falschem Token | 401 "Nope." | Niemand sieht Stats |
| Worker komplett down | 5xx | Frontend-Tracking fails silently |
| AdBlocker blockiert sendBeacon | Tracking-Datenverlust 5-20% | Akzeptabel für private Stats |
| iOS Safari sendBeacon | Funktioniert für Click-Events (nur unload-Events problematisch) | ✓ |

**Spam-Schutz:**
1. Button-Whitelist (nur `smfest`/`smcall`/`smwa`, sonst 400)
2. Rate-Limit: 20 Klicks / 10s pro IP, dann 429. IP-Quelle: Header
   `CF-Connecting-IP` (von Cloudflare an der Edge gesetzt, nicht
   spoofbar). `X-Forwarded-For` NICHT direkt vertrauen — kann vom Client
   gesetzt werden.

**Bewusst NICHT gebaut:**
- IP-Persistenz (nur in In-Memory per Request, kein KV-Log)
- Bot-Detection via User-Agent
- Retry-Queue im Browser

---

## 6. Konfiguration & Secrets

**`wrangler.toml` (Worker `buzhala-stats`):**

```toml
name = "buzhala-stats"
main = "src/index.js"
compatibility_date = "2024-09-23"

[[kv_namespaces]]
binding = "CLICK_STATS"
id = "<aus wrangler kv:namespace create CLICK_STATS>"

[vars]
ALLOWED_ORIGIN = "https://gartenpflegeservicebuzhala.de,https://www.gartenpflegeservicebuzhala.de,https://gartenpflege-service-buzhala.pages.dev"
# STATS_TOKEN ist Secret, NICHT hier. Siehe unten.
```

**Secrets (via `wrangler secret put STATS_TOKEN` oder Dashboard):**
- `STATS_TOKEN` — 48 chars random hex (`openssl rand -hex 24`)

**Token-Generierung:**
```bash
openssl rand -hex 24
# z.B. → a8F3kQp9zR7mN2wL5xY8jT4bH6cV1dE0fG9iS2uA3pM4
```

In Bitwarden / Password-Manager speichern unter z.B.
`buzhala-stats-dashboard`.

---

## 7. Testing

### 7.1 Lokal (vor Deploy)

```bash
cd workers/stats
wrangler kv:namespace create CLICK_STATS    # ID notieren, in wrangler.toml
echo "dev-token-fuer-lokales-testen" > .dev/vars
wrangler dev
```

### 7.2 Manuelle Tests

| Test | Command / Action | Erwartet |
|---|---|---|
| Smoke POST | `curl -X POST localhost:8787/count -H 'content-type:application/json' -d '{"button":"smcall"}'` | 204 |
| Whitelist | `curl ... -d '{"button":"xss"}'` | 400 |
| Token wrong | `curl localhost:8787/stats?token=falsch` | 401 "Nope." |
| Token right | `curl localhost:8787/stats?token=dev-token-...` | 200 HTML |
| Rate-Limit | 25× schnelle POSTs | 20× 204, 5× 429 |
| JSON-API | `curl localhost:8787/stats.json?token=...` | 200 JSON |
| Empty-State | `wrangler kv:key delete --binding=CLICK_STATS 'total:smfest'` → reload | "Noch keine Klicks" |

### 7.3 Production-Tests nach Deploy

1. Mobile-Viewport (Chrome DevTools ≤720px) → Button `.smcall` klicken
2. Network-Tab → POST `buzhala-stats.workers.dev/count` muss erscheinen, 204
3. `wrangler kv:key get --binding=CLICK_STATS 'total:smcall'` → muss inkrementiert sein
4. Stats-URL im Browser öffnen → Tabelle zeigt korrekte Zahlen + heutiges Datum

---

## 8. Rollout-Reihenfolge

**Kritisch: Datenschutz-Update VOR Tracking-Deployment** (sonst tracken
ohne dokumentierte Rechtsgrundlage).

1. **Worker-Code schreiben** (`workers/stats/src/index.js`, `wrangler.toml`)
2. **KV-Namespace anlegen** + `wrangler.toml` aktualisieren
3. **`STATS_TOKEN` als Secret setzen**
4. **`wrangler deploy`** → Worker live unter `buzhala-stats.workers.dev`
5. **Token in Bitwarden speichern**, Stats-URL bookmarken. Vor DSGVO-Deploy
   zeigt die Stats-Seite nur den Empty-State "Noch keine Klicks" — das ist
   erwartet und harmlos
6. **DSGVO-Update deployen**: `datenschutz.html` + `cookies.html` + `cookie-banner.js` Tooltip-Text
7. **Frontend deployen**: `assets/js/click-stats.js` + `<script>`-Tags in allen 4 HTML-Dateien
8. **Smoke-Test gegen Production**: 1× klicken, Stats-URL checken
9. **Nach 7 Tagen**: erste vollständige Tagesdaten sichtbar

---

## 9. Dateien die geändert/neu erstellt werden

| Datei | Aktion |
|---|---|
| `workers/stats/src/index.js` | **NEU** — Worker-Logik (~120 Zeilen) |
| `workers/stats/wrangler.toml` | **NEU** — Worker-Config |
| `workers/stats/package.json` | **NEU** — wrangler-Dependency |
| `workers/stats/.dev/vars` | **NEU** — gitignored, lokales STATS_TOKEN |
| `assets/js/click-stats.js` | **NEU** — Frontend-Tracking (~30 Zeilen) |
| `datenschutz.html` | EDIT — neuer Absatz im CF-Web-Analytics-Block |
| `cookies.html` | EDIT — Zeile 51 Statistik-Beschreibung |
| `assets/js/cookie-banner.js` | EDIT — Zeile 19 Tooltip-Text |
| `index.html` | EDIT — `<script defer src="assets/js/click-stats.js?v=1">` vor `</body>` |
| `impressum.html` | EDIT — dito |
| `datenschutz.html` | EDIT — dito |
| `cookies.html` | EDIT — dito |

---

## 10. Offene Punkte / Nice-to-haves (YAGNI jetzt)

- D1-Migration wenn Drift empirisch auffällt
- Per-Stunde-Aufschlüsselung wenn Daily zu grob wird
- CSV-Export-Endpoint
- Mobile-Push-Benachrichtigung bei Klick-Spitzen
- A/B-Vergleich Button-Reihenfolge
- E-Mail-Digest (wöchentlich)

Diese Features werden bewusst nicht im ersten Wurf gebaut.
