# Cloudflare-Setup für Gartenpflege Buzhala

Dieser Guide führt durch die technische Seite. Domain-Transfer ist ein separates Thema: siehe `DOMAIN_TRANSFER_JIMDO_TO_CLOUDFLARE.md`.

---

## Phase 1 — Account + Account-ID finden

1. Account anlegen auf https://dash.cloudflare.com (Free-Plan reicht)
2. Account-ID finden: rechts unten im Dashboard, oder via API-Token später

## Phase 2 — API-Token erstellen (für CI/Deploy)

1. **My Profile → API Tokens → Create Token**
2. Template: **„Edit Cloudflare Pages"** (oder Custom mit `Cloudflare Pages:Edit` + `Account Settings:Read`)
3. Token kopieren — wird in GitHub-Action oder lokal als `CLOUDFLARE_API_TOKEN` gebraucht

## Phase 3 — Pages-Projekt

### Option A: Git-Integration (empfohlen)

1. **Workers & Pages → Create application → Pages → Connect to Git**
2. Repo wählen: `gartenpflege-buzhala-site` (lokal in `C:\Users\Artur\Documents\Projects\GartenpflegeBuzhala\`)
3. Build-Settings:
   - **Framework preset:** None
   - **Build command:** leer
   - **Build output directory:** `/` (Root-Verzeichnis)
4. **Save and Deploy** → Cloudflare holt sich das Repo, deployed automatisch bei jedem Push auf `main`

### Option B: Wrangler CLI (lokal)

```bash
npm install -g wrangler
wrangler login
wrangler pages deploy . --project-name=gartenpflege-buzhala
```

## Phase 4 — Custom Domain

**Erst NACH erfolgreichem Domain-Transfer** (siehe `DOMAIN_TRANSFER_JIMDO_TO_CLOUDFLARE.md`):

1. Pages-Projekt → **Custom domains → Set up a custom domain**
2. `gartenpflegeservicebuzhala.de` + `www.gartenpflegeservicebuzhala.de` eintragen
3. Cloudflare erstellt automatisch die nötigen DNS-Records
4. SSL/TLS-Mode: **Full (strict)**

## Phase 5 — Workers

### Contact-Form Worker (`workers/contact/`)

```toml
# wrangler.toml
name = "buzhala-contact"
main = "src/index.js"
compatibility_date = "2024-09-23"

[vars]
DESTINATION_EMAIL = "gartenpflegebuzhala@gmail.com"
```

```js
// src/index.js
export default {
  async fetch(request, env) {
    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }
    const form = await request.formData();
    const name = form.get("name");
    const phone = form.get("phone");
    const message = form.get("message");
    // ... validation, dann Mailversand via MailChannels (in Workers inkl.)
    return new Response("OK", { status: 200 });
  },
};
```

### Reviews-Worker (`workers/reviews/`)

Pullt einmal täglich Google Places API, cached in KV, liefert JSON an Frontend.

```toml
# wrangler.toml
name = "buzhala-reviews"
main = "src/index.js"
compatibility_date = "2024-09-23"

[[kv_namespaces]]
binding = "REVIEWS_CACHE"
id = "<nach-wrangler-kv-create>"

[vars]
GOOGLE_PLACES_API_KEY = "<secret>"
PLACE_ID = "<aus Google Maps URL extrahieren>"
```

```js
// src/index.js — Cache-aside-Pattern, fetcht nur wenn Cache abgelaufen
```

## Phase 6 — Deployment-Pipeline

Git-Push → Cloudflare Pages baut + deployed → Site live.

```bash
git add .
git commit -m "..."
git push origin main
# Cloudflare deployed in 30-60 Sek.
```

---

## Aktuelle Architektur

```
User → gartenpflegeservicebuzhala.de
         ↓
     Cloudflare Pages (Static HTML)
         ↓
     ├── index.html (One-Pager)
     ├── impressum.html, datenschutz.html, cookies.html
     └── /images/, /videos/
         ↓
     Cloudflare Worker /api/contact    → Mail via MailChannels
     Cloudflare Worker /api/reviews    → Google Places API + KV-Cache
```

## Secrets & ENV-Vars

| Variable | Wo setzen | Zweck |
|---|---|---|
| `CLOUDFLARE_API_TOKEN` | GitHub Secrets / lokal | Wrangler-Deploy |
| `DESTINATION_EMAIL` | Worker env | Ziel-Adresse für Kontaktformular |
| `GOOGLE_PLACES_API_KEY` | Worker secret | Reviews-Pull |
| `PLACE_ID` | Worker env | Google-Place-Identifier |
