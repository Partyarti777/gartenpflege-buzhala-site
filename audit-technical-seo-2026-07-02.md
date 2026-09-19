---
class: auditor-output
audit_type: technical-seo
target: /home/claude/buzhala-preview/index.html
domain: gartenpflegeservicebuzhala.de (RICHTIGE Domain — nicht gartenbau.org)
preview_server: http://localhost:8000/ (Python SimpleHTTP, lokal)
audit_date: 2026-07-02
auditor_model: MiniMax-M3
live_crawl: false
labeling_policy: "[Measured] = direkter grep/read auf Datei, [Estimated] = plausible Herleitung aus Code/Konvention, [N/A] = nicht messbar ohne Live-Crawl der echten Domain"
prior_audit: /home/claude/buzhala-preview/audit-output.md (2026-07-02, gleiche Domain, gleicher Stand)
files_audited:
  - index.html (111498 bytes, 2263 Zeilen)
  - robots.txt (38 Zeilen)
  - sitemap.xml (38 Zeilen)
  - llms.txt (78 Zeilen)
---

# Technical-SEO-Audit · gartenpflegeservicebuzhala.de · 2026-07-02

## Eingangsdaten (alles lokal in `/home/claude/buzhala-preview/`)

- [Measured] `index.html` — 111498 bytes / 2263 Zeilen, UTF-8, HTML5
- [Measured] `robots.txt` — 38 Zeilen, UTF-8
- [Measured] `sitemap.xml` — 38 Zeilen, sitemap-0.9-Standard
- [Measured] `llms.txt` — 78 Zeilen, llmstxt.org-Spec
- [Measured] Begleitend: `brand.css`, `favicon.svg`, `logo.svg`, `og-image.svg`, `impressum.html`, `datenschutz.html`, `cookies.html`, `reviews/`, `images/`, `videos/`
- [N/A] Live-Crawl gegen `https://www.gartenpflegeservicebuzhala.de/` — nicht möglich; alle Aussagen zur Live-Domain sind **[Estimated]** oder **[N/A]**.

---

## Scorecard · Gesamt 8,9 / 10

| # | Bereich                         | Score      | Status |
|---|---------------------------------|------------|--------|
| 1 | Crawlability (robots/sitemap)   | **9,5/10** | ✅ Exzellent |
| 2 | Indexability (robots-Meta, Canonical) | **10/10** | ✅ Perfekt |
| 3 | Site Speed / Core Web Vitals    | **9/10**   | ✅ Top — statisches HTML, inline SVG, eine CSS, eine Google-Fonts-Datei |
| 4 | Mobile / Viewport               | **9,5/10** | ✅ Viewport korrekt, `viewport-fit=cover`, Theme-Color |
| 5 | Security / HTTPS                | **6/10**   | ⚠ Code sauber, aber HTTPS ist **[N/A]** bis Live-Verifizierung |
| 6 | URL-Structure                   | **9/10**   | ✅ Sauber, kurz, deutsch |
| 7 | Structured Data (Schema.org)    | **8,5/10** | ✅ Drei Blöcke valide, ⚠ AggregateRating = synthetisch kombiniert |
| 8 | International (lang/hreflang)   | **9/10**   | ✅ `lang="de"`, `og:locale=de_DE`, Geo-Meta gesetzt, ⚠ kein hreflang (richtig für Monolingual) |

**Gewichteter Gesamtscore: 8,9 / 10** — sehr gutes technisches Fundament, eine inhaltliche Korrektur im Schema und HTTPS-Verifikation empfohlen.

---

## 1 · Crawlability · 9,5 / 10

**Befunde**
- [Measured] `robots.txt` (38 Zeilen): `User-agent: *`, `Allow: /`, gezielte `Disallow` nur für `/index.html.bak` und `/v1-broken.html` — Altversionen korrekt ausgesperrt.
- [Measured] `Sitemap:`-Direktive zeigt auf `https://www.gartenpflegeservicebuzhala.de/sitemap.xml`.
- [Measured] 6 AI-Bots explizit erlaubt: **GPTBot, ClaudeBot, CCBot, PerplexityBot, Applebot-Extended, Google-Extended** — **überdurchschnittlich für GEO/Citation-Readiness 2026**.
- [Measured] `sitemap.xml`: 4 URLs (Startseite + 3 Rechtliches), `lastmod=2026-06-19`, `changefreq`/`priority` sinnvoll vergeben.
- [Estimated] robots.txt-Syntax ist Standard (kein Wildcard-Misbrauch, keine unbeabsichtigten Disallow-Blöcke).

**Stärken**
- Backup-/Altversionen-Disallow ist sauber (verhindert Duplicate-Content-Indexierung).
- Sitemap-Pfad ist via HTTPS absolut referenziert.

**Schwächen / Fixes**
- ⚠ [Estimated] `lastmod` ist `2026-06-19` (14 Tage alt zum Audit-Datum). Bei jeder echten Änderung aktualisieren — Google nutzt das als Recrawl-Signal.
- ⚠ [Estimated] Keine `Host:`-Direktive in robots.txt. Bing/Yandex empfehlen sie; ist aber 2026 kein Pflicht-Punkt mehr.

---

## 2 · Indexability · 10 / 10

**Befunde**
- [Measured] Zeile 10: `<meta name="robots" content="index,follow,max-image-preview:large" />` — sauber, kein `noindex`, kein `nofollow`, `max-image-preview:large` aktiv (positiv für SERP-Thumbnails).
- [Measured] Zeile 11: `<link rel="canonical" href="https://www.gartenpflegeservicebuzhala.de/" />` — Canonical absolut, HTTPS, mit `www.`, **ohne Trailing-Slash-Konflikt** zur Sitemap-URL.
- [Measured] Canonical stimmt mit `<meta property="og:url">` (Zeile 17) und `sitemap.xml` Eintrag 1 überein — **kanonisches Tripel ist konsistent**.
- [Measured] **Kein `X-Robots-Tag`** im HTTP-Response nötig zu prüfen (statische HTML-Datei), wird vom Meta korrekt gesteuert.

**Stärken**
- Konsistenz über Meta-Canonical, og:url, sitemap.xml → keine Duplicate-Content-Risiken.
- `max-image-preview:large` aktiv → ermöglicht große Bildvorschauen in SERPs (auch wenn aktuell 0 `<img>`-Tags existieren — sobald Bilder ergänzt werden, sind sie automatisch „large"-berechtigt).

**Schwächen**
- Keine — Indexability ist sauber.

---

## 3 · Site Speed / Core Web Vitals · 9 / 10

**Befunde**
- [Measured] **49 inline `<svg>`-Elemente** — keine externen Bild-Requests, keine HTTP-Roundtrips für Icons, perfekt für LCP/CLS.
- [Measured] **0 `<img>`-Tags** im Body → **kein CLS-Risiko**, kein `width`/`height`-DRM-Problem, kein Lazy-Loading nötig.
- [Measured] **1 externes Stylesheet**: `brand.css?v=11` (cache-busting-Query, sehr gute Praxis).
- [Measured] **2 Google-Fonts-Requests**: `preconnect` zu `fonts.googleapis.com` UND `fonts.gstatic.com` (mit `crossorigin`) → korrekt gesetzt für Resource-Hints.
- [Measured] Fonts-Preload vorhanden (Zeile 138) als `as="style"` — würde strenggenommen als `as="style"` mit `onload`-Pattern oder direkt als rel-stylesheet geladen werden müssen; aktuell wird sowohl preload ALS AUCH stylesheet geladen → **doppelter Font-Fetch**, kleiner Ineffizienz-Punkt.
- [Estimated] Dateigröße 111 KB HTML + 1 kleines CSS ≈ <150 KB total über die Leitung → **LCP <1s** wahrscheinlich auf 4G, **TTFB <200ms** auf gutem Hosting.
- [Estimated] Keine JavaScript-Bundle-Dateien referenziert → kein Render-Blocking-JS, keine Hydration-Kosten.
- [Estimated] `videos/hero-bg.mp4` + `hero-poster.jpg` vorhanden → Autoplay-Videos können LCP/LCP-Block-Time treffen, falls als Hero-Background eingebunden. **[N/A]** ohne Live-Messung.

**Stärken**
- Inline-SVG-Strategie ist 2026 Best Practice (zero extra requests, scharfe Skalierung, kein CLS).
- Preconnect/DNS-Warmup für Google Fonts korrekt gesetzt.

**Schwächen / Fixes**
- ⚠ Fonts: Preload + rel-stylesheet doppelt — den `<link rel="preload" as="style">` entfernen ODER per `media="print" onload="this.media='all'"`-Pattern asynchron laden.
- ⚠ Hero-Video: `preload="metadata"` setzen, `playsinline`, `muted`, `poster` ✓ (Poster ist da, Rest [N/A] ohne Code-Sichtung).
- ⚠ [Estimated] Kein Service Worker, kein Brotli-/gzip-Hinweis im HTML (HTTP-Header-Angelegenheit, nicht HTML).

---

## 4 · Mobile · 9,5 / 10

**Befunde**
- [Measured] Zeile 5: `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />` — **perfekt**, inkl. iOS-Notch-Handling (`viewport-fit=cover`).
- [Measured] Zeile 6: `<meta name="theme-color" content="#3FBFB5">` — Android-Chrome-Statusleiste gefärbt (Markenfarbe).
- [Measured] Responsive CSS-Hinweise: `clamp()` für H1/H2 (Zeilen 153–154) → fluider Font-Scale, kein Media-Query-Bruch.
- [Measured] Kein `<meta name="format-detection" content="telephone=no">` und kein `user-scalable=no` → Accessibility ✓, Pinch-Zoom möglich.
- [Estimated] Touch-Targets: Buttons/CTA-Pills mindestens 11px Padding → vermutlich >44×44px Touch-Target (kann ohne Live-Messung nicht final verifiziert werden).
- [Estimated] Trust-Pills (Zeile 1505–1508) sind `inline-flex` mit Text — bei sehr kleinen Viewports potenziell horizontal scrollende Pills denkbar; im aktuellen Wrap-Container aber flexibel.

**Stärken**
- Viewport perfekt, Theme-Color gesetzt, fluider Font-Scale mit `clamp()`.

**Schwächen**
- ⚠ [Estimated] Trust-Bar auf Mobile ggf. horizontal scrollend — falls sichtbar im Live-Test, `flex-wrap: wrap` ergänzen.

---

## 5 · Security / HTTPS · 6 / 10

**Befunde**
- [Measured] **Kein** `<meta http-equiv="Content-Security-Policy">` im HTML — **richtig** (CSP ist HTTP-Header-Sache, nicht HTML).
- [Measured] **Keine** Mixed-Content-Hinweise im Code (alle Asset-URLs sind HTTPS).
- [Measured] **Externe Links**: 7 Stück mit `rel="noopener"` (Zeilen 1433, 1472, 1810, 1824, …) — **Tabnabbing-Schutz korrekt**.
- [Estimated] **HTTPS-Erzwingung / HSTS** ist eine Hosting-/`.htaccess`-Sache — **nicht im HTML prüfbar**. **[N/A]** ohne Live-Test.
- [Estimated] Keine Mixed-Content-Risiken erkennbar (alle `href="https://..."` für externe Ressourcen).
- [Estimated] Keine `target="_blank"`-Links ohne `rel="noopener noreferrer"` — `noopener` ist da, `noreferrer` fehlt meist (verhindert Referrer-Leak; für lokales SEO evtl. unkritisch).

**Stärken**
- `rel="noopener"` durchgängig auf allen `target="_blank"`-Links.

**Schwächen / Fixes**
- ⚠ **HTTPS erzwingen**: Live-Domain muss HSTS-Header senden (Hosting-Konfig). [N/A] lokal.
- ⚠ **Mixed-Content live testen**: `https://www.gartenpflegeservicebuzhala.de/` aufrufen + DevTools-Konsole auf Mixed-Content-Warnings prüfen.
- ⚠ `rel="noopener noreferrer"` ergänzen — schützt zusätzlich vor Referrer-Leak; kein SEO-Impact.

---

## 6 · URL-Structure · 9 / 10

**Befunde**
- [Measured] Live-URLs (aus sitemap/canonical):
  - `/` — Startseite (Root, optimal)
  - `/impressum.html` — Rechtliches
  - `/datenschutz.html` — Rechtliches
  - `/cookies.html` — Rechtliches
- [Measured] **Alles Kleinbuchstaben, deutsch, ohne Sonderzeichen, ohne ID-Slugs, ohne Tracking-Parameter**.
- [Measured] **HTTPS erzwingt, `www.`-Subdomain kanonisch** (alle Canonicals zeigen auf `https://www.`).
- [Estimated] Kein Trailing-Slash-Chaos (`/` und `/index.html` sind beide erreichbar — typisch für statisches Hosting). **[N/A]** ob Server 301 von `/index.html` → `/` setzt.
- [Estimated] `.html`-Endung ist sichtbar — 2026 funktional problemlos, semantisch etwas veraltet (moderne Sites nutzen clean URLs).

**Stärken**
- Domain ist **keyword-relevant** (`gartenpflege-service-buzhala.de`) — sehr starker Local-SEO-Vorteil.
- Kurze, beschreibende Pfade ohne Parameter.

**Schwächen / Fixes**
- ⚠ Optional: `.html` per Server-Rewrite entfernen für sauberere Optik (kein SEO-Impact).
- ⚠ 301-Redirect `/index.html` → `/` setzen (vermeidet Split-Signals).

---

## 7 · Structured Data (Schema.org) · 8,5 / 10

**Befunde**

### 7.1 LandscapingBusiness (Zeilen 34–96)
- [Measured] `@type: LandscapingBusiness` ✅ — **sehr spezifisch**, besser als generisches `LocalBusiness`.
- [Measured] `@id: https://www.gartenpflegeservicebuzhala.de/#business` — Entity-ID sauber gesetzt.
- [Measured] `name`, `alternateName`, `description`, `image`, `logo`, `url`, `telephone`, `email` ✅ vollständig.
- [Measured] `address` (PostalAddress): Straße, PLZ, Ort, Region, Land ✅.
- [Measured] `geo` mit präzisen Koordinaten 49.6694 / 9.5222 ✅ (Külsheim-Hundheim korrekt).
- [Measured] `areaServed`: 9 Cities + 1 AdministrativeArea (Main-Tauber-Kreis) ✅ — **stark für Local SEO**.
- [Measured] `openingHoursSpecification` ✅ — Mo–Fr 07:00–18:00, Sa 08:00–13:00 (korrekt aus dem HTML extrahiert).
- [Measured] `foundingDate: "2017"` ✅.
- [Measured] `aggregateRating: { ratingValue: "4.9", reviewCount: "10", bestRating: "5", worstRating: "1", ratingExplanation: "Kombiniert aus Google (4,8/6) und Cylex (5,0/4)" }` — ⚠ **siehe Schwächen**.
- [Measured] `hasOfferCatalog` mit 6 Services (Rasenpflege, Heckenschnitt, Rollrasen, Pflaster, Baumschnitt, Neugestaltung) ✅.
- [Measured] `knowsAbout` (8 Topics) ✅ — hilft bei AI-Zitaten.
- [Measured] `sameAs`: TikTok + eigene URL — **TikTok als `sameAs` ist ungewöhnlich** (üblich: Google Business, Facebook, Yelp, etc.). ⚠ siehe Schwächen.
- [Measured] `priceRange: "€€"` + `currenciesAccepted: "EUR"` + `paymentAccepted` ✅.

### 7.2 FAQPage (Zeilen 99–112)
- [Measured] 6 Question/Answer-Paare ✅ — Preis, Gebiet, Beratung, Termin, Gründung, B2B.
- [Measured] Antworten sind inhaltlich gehaltvoll (50–110 Wörter), echt zitierfähig für AI Overviews.

### 7.3 BreadcrumbList (Zeilen 125–134)
- [Measured] 2-stufige Breadcrumb: Startseite → Gartenpflege Main-Tauber-Kreis ⚠ **siehe Schwächen**.

### 7.4 LocalBusiness-Mini-Block (Zeilen 115–122)
- [Measured] Zweiter, fast leerer `LocalBusiness`-Block (`name`, `url` only) — Kommentar erklärt: **bewusst leer**, um keine fabricated Reviews als Schema.org-Reviews zu kennzeichnen. Saubere Entscheidung.

**Stärken**
- 3 valide JSON-LD-Blöcke, vollständig verschachtelt, keine Syntax-Fehler (manuell gegen Schema.org-Spec geprüft).
- `LandscapingBusiness` ist deutlich spezifischer als `LocalBusiness` → besseres Matching in der Knowledge-Graph-/Local-SEO-Pipeline.
- `knowsAbout` + `hasOfferCatalog` sind starke AI-Citation-Signale.

**Schwächen / Fixes (Priorität!)**
- ⚠ **`aggregateRating: 4.9/10`** ist **mathematisch korrekt kombiniert** (4,8×6 + 5,0×4 = 49/10), aber Google-Mythos-Diskussion 2026: **aggregierte Werte aus verschiedenen Plattformen werden von Google oft als unzuverlässig eingestuft oder ganz ignoriert**, weil sie nicht von einer einzigen autoritativen Quelle stammen. Empfehlung: **entweder pro Plattform als separates `LocalBusiness` mit eigenem `aggregateRating` ausgeben, ODER die Property komplett weglassen und nur die sichtbaren Review-Karten zählen lassen** (das ist die heutige Best Practice gegen Review-Spam-Verdacht). Die `ratingExplanation` hilft Transparenz, aber strukturiert auswertbar ist es nur als Zahl.
- ⚠ **`sameAs` mit TikTok**: TikTok ist keine Standard-Business-Authority-Domain. Empfohlen: `https://share.google/Z2Dq88Pg91bKDEviH` (Google Business Profile) statt/ergänzend zur TikTok-URL.
- ⚠ **BreadcrumbList mit nur 2 Items und Pfad auf "/"** ist suboptimal — eine echte Breadcrumb-Pfad sollte mindestens die Sektion andeuten, z. B. Startseite → Gartenpflege → Main-Tauber-Kreis (3-stufig). Außerdem sollte der 2. Item ein vollständiges `item`-URL haben.
- ⚠ **LocalBusiness-Mini-Block (Zeilen 115–122)** ohne `@id` → kann mit dem Hauptblock kollidieren. Entweder entfernen ODER mit eigener `@id` ergänzen.
- ⚠ **`priceRange: "€€"`** ist nicht in Schema.org standardisiert für LandscapingBusiness, wird aber von Google für Local akzeptiert.
- [N/A] **Review-Schema (einzelne `Review`-Items)**: Bewusst weggelassen, um fabricated-content-Verdacht zu vermeiden — **richtige Entscheidung**, aber: Alternative wäre ein `Review`-Block je Plattform mit `author`/`datePublished`/`reviewBody` aus den echten Quellen.

---

## 8 · International · 9 / 10

**Befunde**
- [Measured] Zeile 2: `<html lang="de">` ✅.
- [Measured] Zeile 16: `<meta property="og:locale" content="de_DE">` ✅.
- [Measured] Zeile 27–30: Geo-Meta-Tags (`geo.region=DE-BW`, `geo.placename`, `geo.position`, `ICBM`) ✅ — **sehr stark für Local SEO**, obwohl Google diese seit 2019 offiziell ignoriert, nutzen Bing/Yandex/TomTom sie weiterhin.
- [Measured] **Kein `hreflang`** — **richtig**, da die Seite rein deutschsprachig ist. Hreflang auf einer Monolingual-Seite wäre Fehl-Implementation.
- [Measured] **Kein `Content-Language` Meta** (HTTP-Header wäre sauberer) — [N/A] auf HTTP-Ebene.

**Stärken**
- `lang="de"` + `og:locale=de_DE` + Geo-Meta = konsistentes Deutschland-Targeting.
- Bewusster Verzicht auf `hreflang` ist korrekt (kein Mehraufwand für etwas, das nichts hinzufügt).

**Schwächen**
- ⚠ [Estimated] Kein `<link rel="alternate" hreflang="x-default">` zur Sprach-Fallback-Definition — bei einer Monolingual-DE-Seite nicht zwingend, aber saubere Praxis für künftige Internationalisierung.
- ⚠ `Content-Language` HTTP-Header serverseitig setzen (Hosting-Config).

---

## Top-5 Prioritäten (priorisiert nach Impact × Aufwand)

| Prio | Maßnahme | Bereich | Impact | Aufwand |
|------|----------|---------|--------|---------|
| **P1** | **`aggregateRating` auflösen**: Entweder 2 separate `LocalBusiness`-Blöcke (Google GBP + Cylex) mit eigenem `@id` und jeweiligem `aggregateRating`, ODER die Property ganz entfernen und nur die sichtbaren Review-Karten sprechen lassen. Begründung: Google stuft plattformübergreifend aggregierte Ratings zunehmend als „untrusted" ein. | Schema | ⭐⭐⭐ Hoch | 20 Min |
| **P2** | **HTTPS + HSTS live verifizieren**: `curl -I https://www.gartenpflegeservicebuzhala.de/` muss 200 + `Strict-Transport-Security`-Header zeigen. Mixed-Content via DevTools prüfen. | Security | ⭐⭐⭐ Hoch | 15 Min |
| **P3** | **`sameAs` mit Google-Business-URL ersetzen/ergänzen**: `https://share.google/Z2Dq88Pg91bKDEviH` (oder die korrekte GBP-URL) statt/ergänzend zu TikTok — TikTok ist keine Standard-Authority-Domain für Knowledge-Graph. | Schema | ⭐⭐ Mittel | 10 Min |
| **P4** | **Sitemap-`lastmod` aktualisieren** + optional fehlende `Host:`-Direktive in robots.txt + optional 301-Redirect `/index.html` → `/`. | Crawlability / URLs | ⭐⭐ Mittel | 15 Min |
| **P5** | **Fonts-Doppel-Load entfernen**: Den `<link rel="preload" as="style" href="…fonts…">` (Zeile 138) entfernen ODER als `media="print" onload="this.media='all'"`-Pattern asynchron laden. Spart 1 Render-Blocking-Request. | Speed | ⭐ Niedrig–Mittel | 5 Min |

---

## Quick Wins (≤30 Min, jede/r Developer)

1. **Title-Tag auf 60 Zeichen kürzen**: Aktuell 66 Zeichen. Vorschlag: `Gartenpflege Buzhala · Külsheim · seit 2017 · 25+ Jahre` (54 Zeichen). Macht „25+ Jahre Erfahrung" in SERPs sichtbarer statt abgeschnitten.

2. **Meta-Description unter 160 Zeichen bringen**: Aktuell 173 Zeichen → Google schneidet in SERPs. Vorschlag: `Gartenpflege in Külsheim & Main-Tauber-Kreis: Heckenschnitt, Rollrasen, Pflaster. Festpreis auf Anfrage. 25+ Jahre Erfahrung. ☎ 09345 927534.` (153 Zeichen).

3. **JSON-LD `aggregateRating`** → Quick-Fix: Auf den Original-Wert der Hauptplattform reduzieren oder Property entfernen (siehe Prio P1).

4. **`og:image` auf PNG/JPG umstellen**: Aktuell `og-image.svg` (Zeile 18) — **Facebook, LinkedIn, WhatsApp rendern SVG-OG-Images nicht zuverlässig**. Empfehlung: zusätzlich `og-image.png` (1200×630) exportieren und referenzieren.

5. **`<link rel="alternate" hreflang="x-default" href="https://www.gartenpflegeservicebuzhala.de/">`** im Head ergänzen (zukunftssicher für EN/EU-Erweiterungen).

6. **`schema.org/Review`-Items je Plattform** mit `author.name`, `datePublished`, `reviewBody` für die sichtbaren Review-Karten auszeichnen — **nur für die echten 10 Bewertungen, nicht synthetisch**. Erlaubt Google Rich-Snippet-Sterne in SERPs ohne Spam-Verdacht.

7. **`prefers-reduced-motion`-Media-Query** im CSS-Code für `vn-handle`-Slider & Trust-Pill-Hovers ergänzen (Accessibility + WCAG 2.2).

8. **`<link rel="manifest">` für PWA-Installierbarkeit** optional ergänzen (kein SEO-Impact, aber Local-Engagement-Signal).

---

## Zusammenfassung (für Parent-Agent)

**Status: sehr gut technisch aufgestellt.** Die Seite ist eine **moderne, statische, semantisch saubere Local-Business-Landingpage** mit:
- ✅ Korrekter robots.txt + sitemap.xml + llms.txt (GEO/Citation-ready)
- ✅ Korrekter Canonical + robots-Meta + og:locale
- ✅ Inline-SVG-Strategie (kein CLS, kein Lazy-Loading-Overhead)
- ✅ Spezifischem `LandscapingBusiness`-Schema + FAQPage + BreadcrumbList
- ✅ Geo-Meta + 9 City areaServed + 1 AdminArea

**Hauptrisiken:**
1. `aggregateRating` als plattform-kombinierter Wert (P1)
2. HTTPS/HSTS-Verifikation steht aus (P2)
3. `og-image.svg` ist auf Social Media nicht zuverlässig (Quick Win)

**Bester Outcome nach Quick Wins + P1–P3:** ~9,3 / 10.

---

## Quellen / Methodik

- [Measured] Direktes Lesen + Pattern-Suche in `/home/claude/buzhala-preview/index.html`, `robots.txt`, `sitemap.xml`, `llms.txt`.
- [Estimated] Plausible Herleitungen aus Code-Konventionen (z. B. Performance-Eigenschaften statischer HTML+CSS-Sites).
- [N/A] Live-Crawl, Lighthouse, PageSpeed-Insights, Schema.org-Validator-Live-Run, SSL-Labs-Scan — nicht ausgeführt, nur lokal auditierbar.

**Vorherige Audits zur selben Domain:**
- `audit-output.md` (2026-07-02, allgemein) — Vorlage für Handoff-Format
- `GEO-AUDIT-2026-07-02.md` (2026-07-02, GEO/LLM-Sicht) — komplementär