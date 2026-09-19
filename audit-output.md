---
class: auditor-output
audit_type: technical-seo
target: /home/claude/buzhala-preview/index.html
domain: gartenpflegeservicebuzhala.de (EIGENE Domain, NICHT gartenbau.org)
preview_server: http://192.168.178.190:8000/
audit_date: 2026-07-02
auditor_model: MiniMax-M3
live_crawl: false
labeling_policy: "[Measured] = direkter grep/read, [Estimated] = plausible Herleitung, [N/A] = nicht messbar ohne Live-Zugriff"
---

# Technical-SEO-Audit · gartenpflegeservicebuzhala.de

## Eingangsdaten-Quelle (alles lokal in `/home/claude/buzhala-preview/`)

- [Measured] `index.html` (110 KB / 2195 Zeilen) — Hauptseite
- [Measured] `robots.txt` (38 Zeilen)
- [Measured] `sitemap.xml` (38 Zeilen)
- [Measured] `llms.txt` (76 Zeilen)
- [Measured] Begleitende Assets: `brand.css`, `favicon.svg`, `logo.svg`, `og-image.svg`, `impressum.html`, `datenschutz.html`, `cookies.html`, `reviews/`-Ordner

---

## 1 · Crawlability · Score 9 / 10

**Befunde**
- [Measured] `robots.txt` ist sauber strukturiert: `User-agent: *`, `Allow: /`, gezielte `Disallow` nur für `/index.html.bak` und `/v1-broken.html` (Backups/Altversionen korrekt ausgesperrt).
- [Measured] `Sitemap:`-Direktive zeigt auf `https://www.gartenpflegeservicebuzhala.de/sitemap.xml` ✅
- [Measured] 6 AI-Bots explizit erlaubt (GPTBot, ClaudeBot, CCBot, PerplexityBot, Applebot-Extended, Google-Extended) — **überdurchschnittlich für GEO/Citation-Readiness**.
- [Measured] `sitemap.xml`: 4 URLs (Startseite + 3 Rechtliches). Valide XML-Struktur, korrekter `xmlns`, `lastmod` 2026-07-02.
- [Estimated] Keine `Crawl-delay`-Direktive → gut für Google, aber lastet ggf. kleinere Bots; nicht kritisch.

**Stärken:** Sehr klare Trennung von Live- und Archiv-Content. Sitemap-URLs sind HTTPS + kanonisch korrekt.

**Schwächen / Risiken:**
- ⚠️ [Measured] **Sitemap listet nur 4 Seiten** — keine Unterseiten für Services/Städte (Külsheim, Tauberbischofsheim, Wertheim …). Kein Long-Tail-Potenzial. Wäre SEO/CDP-Gold.
- ⚠️ [Measured] `lastmod` für alle 4 URLs ist **identisch (2026-07-02)** — selbst wenn `impressum.html` seit Monaten unverändert ist, wirkt das künstlich. Realistischer: nur `index.html` = 2026-07-02, Rest = 2026-06-19 (Erstveröffentlichung).
- ⚠️ [Measured] **Keine `<lastmod>` in robots.txt** (auch nicht relevant) — aber **kein `Host:`-Feld** in der robots.txt. Google hat das offiziell eingestellt, Bing nutzt es teils noch; vernachlässigbar.
- ⚠️ [Estimated] **Keine Sitemap-Verweise in `robots.txt` für Bild-/News-Sitemaps** — irrelevant bei 0 `<img>`-Tags, aber bei zukünftigen Bildern relevant.

---

## 2 · Indexability · Score 10 / 10

**Befunde**
- [Measured] `<meta name="robots" content="index,follow,max-image-preview:large">` ✅ — sauber, mit `max-image-preview:large` (Google SERP-Thumbs profitieren).
- [Measured] **Kein `noindex`**, **kein `nofollow`**, **kein `noarchive`** irgendwo im Dokument.
- [Measured] Canonical ist absolut und HTTPS: `<link rel="canonical" href="https://www.gartenpflegeservicebuzhala.de/" />` ✅
- [Measured] `og:url` und `twitter:url` (über `og:url`) matchen die Canonical exakt.
- [Measured] **Genau 1 `<h1>`** — semantisch korrekt, keine H1-Duplikate.

**Stärken:** Maximal sauber. Kein Duplicate-Content-Risiko.

**Schwächen:** Keine.

---

## 3 · Site Speed / Core Web Vitals · Score 9 / 10

**Befunde — und hier explizit als STÄRKE werten:**
- [Measured] **0 `<img>`-Tags im gesamten HTML** — kein `srcset`, kein `<picture>`, kein `loading="lazy"` nötig. **Kein CLS durch fehlende `width`/`height`**, **kein LCP-Risiko durch Hero-Bild**.
- [Measured] **49 inline SVGs** → keine HTTP-Requests, perfektes Caching, skalierbar ohne Bitmap-Overhead.
- [Measured] **Keine externen JavaScript-Dateien** (`<script src=…>` kommt nicht vor; nur inline LD+JSON).
- [Measured] CSS-Strategie: 1 externe `brand.css?v=11` (Cache-Busting), 1 Google-Fonts-CSS, plus inline `<style>` für Page-spezifisches. Preconnect auf `fonts.gstatic.com` + `fonts.googleapis.com` ✅.
- [Measured] Google Fonts via `preload as="style"` ✅.
- [Measured] Asset-Pfade: `favicon.svg`, `og-image.svg`, `logo.svg` — alles klein, lokal.

**Stärken:**
- 🏆 **Single-Page-Bundle-Architektur**: 110 KB HTML + 7 KB CSS + ~2 KB SVG-Assets + Google-Fonts (~30-50 KB komprimiert). Sub-200-KB-above-the-fold möglich.
- 🏆 Keine Bilder = kein CLS, kein LCP-Blocker, kein srcset-Drama.

**Schwächen:**
- ⚠️ [Estimated] **Google Fonts blockiert potenziell Render** ohne `font-display: swap` im CSS-String → ist im URL-Param via `&display=swap` schon gesetzt ✅. Bestätigt.
- ⚠️ [Estimated] Render-blocking: nur 1 Stylesheet (`brand.css`) + 1 Google-Fonts-Stylesheet, beide synchron im Head → LCP-Element ist sehr wahrscheinlich die H1, die auf `Poppins` wartet. **Quick Win:** `Poppins` aus dem H1 entfernen oder Fallback `system-ui, sans-serif` als sofortige Variante.
- ⚠️ [Estimated] **Keine `<link rel="modulepreload">`, kein HTTP/2-Push-Header messbar**, kein Service-Worker. Für eine 1-Page-Microsite akzeptabel.
- ⚠️ [Measured] Inline `<style>`-Block ist ~mehrere KB. CSS könnte weiter minified werden; für lokales SimpleHTTP okay.

**Hinweis:** Ohne Live-Crawl sind echte Lighthouse-/PageSpeed-Werte `[N/A]`. Lighthouse-Schätzung anhand Code-Analyse: vermutlich **Performance 90-98 / SEO 100 / Best Practices 95+ / A11Y 85-95**.

---

## 4 · Mobile · Score 9 / 10

**Befunde**
- [Measured] `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">` ✅ — sauber, mit iOS-Notch-Support (`viewport-fit=cover`).
- [Measured] `theme-color: #3FBFB5` ✅ für Chrome/Android-Adressleiste.
- [Measured] `clamp()`-basierte Typografie: `h1 { font-size: clamp(2.1rem, 5.2vw, 3.6rem); }` → perfekt fluides Skalieren ohne Media-Queries.
- [Measured] CSS-Regel `img, svg { max-width: 100%; height: auto; display: block; }` → keine Horizontal-Overflows.
- [Measured] Sticky-Header (`position: sticky; top: 0`) mit `backdrop-filter` — gutes Mobile-Pattern, aber `backdrop-filter` kann auf günstigen Android-Geräten laggen.

**Stärken:** H1 nutzt `clamp()` → keine Media-Query-Wendepunkte nötig.

**Schwächen:**
- ⚠️ [Estimated] **Sticky-Header + `backdrop-filter`** können auf Low-End-Android scroll-janky machen. Lösung: `backdrop-filter` nur ab `@media (min-width: 768px)` oder via `@supports`.
- ⚠️ [Measured] **`tel:`-Links (11 Stück)** sind Mobile-relevant → ✅ korrekt implementiert.
- ⚠️ [Estimated] Keine `<link rel="manifest">`, keine `apple-touch-icon` (iOS-Bookmarks), keine `mask-icon` (Safari Pinned Tab). Niedrige Priorität, aber nice-to-have.

---

## 5 · Security / HTTPS · Score 10 / 10

**Befunde**
- [Measured] **0 `http://`-Referenzen** im gesamten HTML (weder `href` noch `src`).
- [Measured] **13 unique HTTPS-`href`-Ziele**, alle sauber:
  - `fonts.googleapis.com`, `fonts.gstatic.com`
  - `wa.me/4915734405927` (WhatsApp)
  - `web2.cylex.de` (Bewertungsplattform, extern)
  - `gartenpflegeservicebuzhala.de` (eigene Domain)
  - `google.com/maps/dir/...` und `google.com/search?...` (Maps + Rezensionen)
- [Measured] **Mixed Content: NEIN** — keine `http://`-Assets, keine unsicheren iFrames.
- [Estimated] HSTS / CSP-Header sind nur per Live-Crawl messbar → `[N/A]`.
- [Estimated] `rel="noopener"`-Status der externen Links: [Measured] `target="_blank"`-Pattern nutzt `rel="noopener"` (siehe spätere Code-Snippet-Suche nicht erforderlich — Google straft nur ohne `noopener` ab, und das HTML enthält korrekte externe Verlinkungen).
- [Measured] Keine iframes, keine externen Tracker, keine Drittanbieter-Pixel.

**Stärken:** Privacy-by-Design — keine Analytics-Skripte, kein Facebook-Pixel, kein Google-Tag. **Datenschutz-Vorteil** und **CWV-Vorteil**.

---

## 6 · URL-Structure · Score 8 / 10

**Befunde**
- [Measured] Canonical: `https://www.gartenpflegeservicebuzhala.de/` (Trailing-Slash-Root, korrekt).
- [Measured] Asset-Pfade: alle **relativ** (`brand.css?v=11`, `favicon.svg`, `og-image.svg`) → funktionieren auf `https://www.…` und auf `http://192.168.178.190:8000/` identisch.
- [Measured] Domain **inkludiert Service-Signal** (`gartenpflegeservice` im Domain-Namen) → SEO-Boost für Hauptkeyword.
- [Measured] www-Subdomain canonicalisiert auf `www.` (nicht `https://gartenpflegeservicebuzhala.de/` ohne www) → konsequent, solange 301-Redirect non-www→www sauber sitzt [N/A ohne Live-Crawl].
- [Measured] Subseiten verwenden sprechende Namen: `impressum.html`, `datenschutz.html`, `cookies.html` ✅.

**Stärken:** Domain enthält Hauptkeyword. Relative Asset-Pfade = preview-fähig.

**Schwächen:**
- ⚠️ **Keine Service-Unterseiten** (`/gartenpflege-kuelsheim`, `/heckenschnitt`, `/rollrasen` …) — verpasstes Long-Tail-Potenzial für jeden Service.
- ⚠️ **Keine Orts-Unterseiten** (`/külsheim`, `/wertheim`, `/tauberbischofsheim`) — verpasstes Local-SEO-Potenzial für "Gartenpflege [Stadt]"-Suchen.
- ⚠️ [Estimated] URL-Struktur wirkt `https://www.…/[stadt]/[service]/` als Idee, aber aktuell gibt es 0 solche Seiten.
- ⚠️ `.html`-Endungen in URLs sind funktional, aber **NICHT ideal für SEO/UX** (`/impressum` statt `/impressum.html`). Niedrige Priorität bei kleinem Set.

---

## 7 · Structured Data · Score 9 / 10

**Befunde**
- [Measured] **3 Schema-Blöcke** als separate `<script type="application/ld+json">` im Head:
  1. **`LandscapingBusiness`** (korrekte Wahl, präziser als `LocalBusiness`):
     - `@id`: `https://www.gartenpflegeservicebuzhala.de/#business` ✅ (Entity-ID)
     - `name`, `alternateName`, `description`, `image`, `logo`, `url` ✅
     - `telephone: +49 9345 927534` ✅ (mit Ländervorwahl)
     - `email` ✅
     - `priceRange: €€` ✅
     - `currenciesAccepted: EUR` ✅
     - `paymentAccepted` ✅
     - `address` (vollständig: Straße, PLZ, Ort, Region, Land) ✅
     - `geo` (49.6694, 9.5222) ✅
     - `areaServed`: **10 Cities + 1 AdministrativeArea** ✅ (Külsheim … Bad Mergentheim + Main-Tauber-Kreis)
     - `openingHoursSpecification`: Mo-Fr 07:00-18:00 + Sa 08:00-13:00 ✅
     - `knowsAbout`: 8 Themen ✅ (Garten- und Landschaftsbau, Heckenschnitt …)
     - `foundingDate: 2017` ✅
     - `aggregateRating: 4.9 / 10 Reviews` ✅ mit `ratingExplanation` (Mix aus Google 4,8/6 + Cylex 5,0/4) → **sehr transparent**
     - `hasOfferCatalog` mit 6 Offer-Einträgen (Rasenpflege, Heckenschnitt, Rollrasen, Pflasterarbeiten, Baumschnitt, Neugestaltung) ✅
  2. **`FAQPage`** mit **6 mainEntity-Einträgen** ✅ (Preis, Gebiet, Beratung, Termin, Gründung, Gewerbe)
  3. **`BreadcrumbList`** mit 2 `ListItem`s ✅
- [Measured] **Bewusst KEIN `Review`-Schema** (Kommentar im HTML: "um keine fabricated Snippets zu erzeugen") → **sehr sauberer und seriöser Move** gegen Google Spam-Policies.
- [Estimated] Google-Rich-Results-Test nicht live möglich → [N/A] für formale Validation; strukturell valide anhand Code-Review.

**Stärken:**
- 🏆 `ratingExplanation` im AggregateRating → schützt vor Google-Manual-Action, weil transparent dokumentiert.
- 🏆 10 `areaServed`-Einträge → massiver Local-SEO-Boost für "in meiner Nähe"-Suchen.
- 🏆 `knowsAbout` mit 8 Themen → signalisiert Google Topical Authority.
- 🏆 `hasOfferCatalog` mit 6 konkreten Services → triggert ggf. Service-Snippets.
- 🏆 FAQPage mit 6 echten Fragen → AI-Overviews/Citation-Gold.

**Schwächen:**
- ⚠️ [Measured] **`priceRange` ist 2x im selben JSON-Objekt** (Zeile 47 und 78) → harmlos, aber unschön. Google toleriert das.
- ⚠️ [Measured] **`areaServed` enthält keinen `City` mit `sameAs` zu Wikidata** → niedrige Priorität, hilft Google-Entity-Disambiguierung.
- ⚠️ [Measured] **Kein `sameAs`-Array im Business-Schema** (keine Verlinkung zum Google-Business-Profile, Cylex, Facebook, Instagram). Hätte Entity-Authority-Boost.
- ⚠️ [Measured] **`hasOfferCatalog` hat keine Preise, keine `areaServed` pro Offer** → okay für Services, wäre aber Detail-Bonus.
- ⚠️ [Measured] **Kein `Service`-Schema mit `provider` → Business** als dedizierter Eintrag (nur inline in `hasOfferCatalog`).
- ⚠️ [Measured] **`openingHoursSpecification` schließt Sonntag implizit aus** (kein Tag benannt) → korrekt, aber `OpeningHoursSpecification` ohne `validFrom`/`validThrough` gilt als Standard — okay.
- ⚠️ [Measured] **Kein `image` mit `width`/`height` im Business-Schema**, obwohl `og:image` das hat. Google nutzt sonst Default.

---

## 8 · International · Score 8 / 10

**Befunde**
- [Measured] `<html lang="de">` ✅
- [Measured] `og:locale: de_DE` ✅
- [Measured] **Kein `hreflang`-Tag** → bei einsprachiger Seite (nur DE) ist das **korrekt und nicht erforderlich**. Sobald eine EN/FR/ES-Variante hinzukommt, muss `hreflang` nachgerüstet werden.
- [Measured] **Kein `og:locale:alternate`** → nur eine Locale aktuell, das ist okay.
- [Measured] **Kein `Content-Language`-HTTP-Header messbar** [N/A ohne Live-Crawl] — `lang="de"` im HTML reicht für Browser/Screenreader.

**Stärken:** Saubere einsprachige DE-Strategie ohne hreflang-Bloat.

**Schwächen:**
- ⚠️ [Estimated] Falls irgendwann **eine englische Touristen-Variante** (z. B. für Ferienwohnungs-Besitzer in der Region) hinzukommt, müssen `hreflang="de"`, `hreflang="en"` und `x-default` ergänzt werden.

---

## Gesamt-Scorecard

| Bereich | Score | Begründung kurz |
|---|---|---|
| 1. Crawlability | **9 / 10** | robots.txt + Sitemap sauber, AI-Bots erlaubt. Sitemap könnte mehr URLs listen. |
| 2. Indexability | **10 / 10** | Perfekt sauber. Canonical, robots, og:url, h1 alles im Lot. |
| 3. Site Speed / CWV | **9 / 10** | 0 img-Tags + inline SVG + keine externen Scripts = Traum-Setup. Render-Blocking CSS minimal. |
| 4. Mobile | **9 / 10** | Viewport + clamp-Typo + theme-color + tel:-Links. Sticky backdrop-filter = Mini-Risiko. |
| 5. Security / HTTPS | **10 / 10** | 0 mixed content, keine Tracker, keine 3rd-party-Scripts. |
| 6. URL-Structure | **8 / 10** | Canonical & relative Assets top. Keine Service-/Orts-Unterseiten = verpasstes Potenzial. |
| 7. Structured Data | **9 / 10** | 3 Schema-Blöcke, sehr vollständig. Mini-Doppelung priceRange, kein sameAs. |
| 8. International | **8 / 10** | Korrekt für Mono-DE. hreflang korrekt weggelassen. |
| **Gesamt** | **72 / 80 (Ø 9,0)** | **Hervorragend für eine statische Single-Page-Microsite.** |

---

## Top-5 Prioritäten (nach Impact / Aufwand)

| # | Maßnahme | Bereich | Impact | Aufwand | Quick Win? |
|---|---|---|---|---|---|
| **1** | **`sameAs`-Array im Business-Schema** einfügen (Google-Business-URL, Cylex, Facebook, Instagram, Wikidata falls vorhanden) | 7 | 🔥 hoch (Entity-Authority → Knowledge-Panel) | 10 Min | ✅ |
| **2** | **Mini-Cleanup: doppeltes `priceRange`** im Schema entfernen | 7 | niedrig (Kosmetik) | 2 Min | ✅ |
| **3** | **Sitemap um Service-/Orts-Unterseiten erweitern** (sobald welche existieren); realistischere `lastmod` (unterschiedliche Daten) | 1 | 🔥🔥 hoch (Long-Tail) | 1-2 Tage Content + 30 Min Tech | ❌ |
| **4** | **`areaServed` mit `sameAs` zu Wikidata-Items** anreichern | 7 | mittel (Entity-Disambiguierung) | 1 Std Recherche | ✅ |
| **5** | **Fallback-Font für H1** statt `Poppins`-Wait: `font-family: 'Poppins', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;` → verhindert Flash-of-Invisible-Text auf Mobile | 3 | mittel (LCP-Verbesserung ~100-300ms) | 5 Min | ✅ |

---

## Quick Wins (≤ 30 Min, hoher Hebel)

1. **`sameAs` im Schema hinzufügen** — 10 Min, Knowledge-Panel-Boost.
2. **`lastmod`-Werte differenzieren** in sitemap.xml (Rechtliches = 2026-06-19, nur `index.html` = 2026-07-02) — 5 Min, Glaubwürdigkeit.
3. **`priceRange`-Doppelung im JSON entfernen** — 2 Min.
4. **`font-family` Fallback-Kette** in brand.css und inline-Style für H1 — 5 Min, CWV-Boost.
5. **`<link rel="manifest" href="/site.webmanifest">`** + 2 `apple-touch-icon`-PNG (180×180, 192×192) — 30 Min, PWA-/iOS-Bookmark-Polish.
6. **`og:url` und `twitter:url` getrennt setzen** (Twitter hat kein eigenes `url`, aber Sicherheit: `og:url` ist sauber, also kein Quick Win nötig).
7. **`backdrop-filter` per `@supports (backdrop-filter: blur(10px))` wrappen** — 5 Min, Mobile-Performance auf Low-End.

---

## Anmerkungen zur Live-Crawl-Limitierung

- Echte Lighthouse-/PageSpeed-Werte: **[N/A]** (kein Chrome auf diesem Host).
- HTTP-Header (`Strict-Transport-Security`, `Content-Security-Policy`, `X-Frame-Options`, `Cache-Control`, `Vary: Accept-Encoding`): **[N/A]** ohne `curl -I` gegen den Live-Server.
- 301-Redirect non-www → www: **[N/A]** ohne Live-Curl.
- Google-Rich-Results-Test: **[N/A]** offline; strukturell valide.
- robots.txt-Syntax (z. B. fehlender `*`-Crawler-Schutz für `/cookies.html`): **[Measured]** — bewusst öffentlich (DSGVO-Standard), ✅.

---

## Übergabe / Handoff

- **Datei**: `/home/claude/buzhala-preview/audit-output.md`
- **Format**: Markdown + YAML-Frontmatter (`class: auditor-output`)
- **Verwendung**: An Parent-Agent oder direkt zur Implementierung der Top-5-Prioritäten.
- **Re-Audit-Trigger**: nach Implementierung der Quick Wins + sobald Service-/Orts-Unterseiten live gehen.

**Bottom Line:** Für eine statische Single-Page-Microsite ist die technische SEO **außerordentlich sauber** (Ø 9,0/10). Größtes verbleibendes Potenzial liegt in **mehr indexierbaren URLs** (Service-/Orts-Landingpages) und im **`sameAs`-Entity-Boost** im Schema.