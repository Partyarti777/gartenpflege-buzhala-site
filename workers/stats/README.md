# buzhala-stats Worker

Anonyme Klick-Statistik für die drei mobilen Sticky-Buttons (Festnetz, Mobil, WhatsApp)
auf [gartenpflegeservicebuzhala.de](https://gartenpflegeservicebuzhala.de).

DSGVO-konform:
- Keine Cookies
- Keine IP-Speicherung (nur transient für Rate-Limit, in Worker-Isolate-Memory)
- Keine User-IDs, kein Fingerprinting
- Nur Button-ID + Tageszähler in EU-KV (Cloudflare Frankfurt/Stockholm-Edge)
- Speicherdauer: Tagesauflösung 40 Tage, Gesamt-Total persistent

## Erst-Setup (einmalig)

```bash
# 1. KV-Namespace anlegen
wrangler kv:namespace create CLICK_STATS
# → kopiere die ID in wrangler.toml (id = "...")

# 2. Token generieren (48 Zeichen Hex)
openssl rand -hex 24
# → notieren, in Schritt 4 als Secret eintragen

# 3. Lokal testen (optional)
echo "dev-test-token" > .dev/vars
wrangler dev
# → http://localhost:8787/stats?token=dev-test-token

# 4. STATS_TOKEN als Secret deployen
wrangler secret put STATS_TOKEN
# → 48-Hex aus Schritt 2 einfügen

# 5. Deployen
wrangler deploy
# → Worker live unter https://buzhala-stats.workers.dev
```

## Stats-URL

```
https://buzhala-stats.workers.dev/stats?token=<STATS_TOKEN>
```

Im Browser öffnen, als Bookmark speichern. Ohne / mit falschem Token → 401 "Nope."

JSON-Export für Scripts:
```
https://buzhala-stats.workers.dev/stats.json?token=<STATS_TOKEN>
```

## Smoke-Test nach Deploy

```bash
# Click-Event simulieren
curl -X POST https://buzhala-stats.workers.dev/count \
  -H 'content-type: application/json' \
  -H 'Origin: https://gartenpflegeservicebuzhala.de' \
  -d '{"button":"smcall"}'
# → 204 No Content

# Whitelist-Check
curl -X POST ... -d '{"button":"xss"}'
# → 400 Unknown button

# Stats-Read
curl 'https://buzhala-stats.workers.dev/stats?token=<TOKEN>'
# → 200 HTML
```

Browser-Test: Mobile-Viewport (≤720px), Button klicken, DevTools Network-Tab:
zuerst muss `OPTIONS /count` (Preflight) erscheinen, dann `POST /count` mit 204.

## Wartung

- KV-IDs in `wrangler.toml` ändern → `wrangler deploy`
- Token rotieren → `wrangler secret put STATS_TOKEN` (überschreibt), Browser-Bookmark updaten
- Logs ansehen → `wrangler tail`

## Architektur

| Datei | Zweck |
|---|---|
| `src/index.js` | Worker-Logik (POST /count, GET /stats, GET /stats.json, OPTIONS) |
| `wrangler.toml` | Worker-Config (Name, KV-Binding, ALLOWED_ORIGIN) |
| `package.json` | wrangler-Dependency + Scripts |

Siehe Spec: `docs/superpowers/specs/2026-09-22-buzhala-button-click-stats-design.md`
