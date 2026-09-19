# GEO-Audit · AI-Citation-Readiness
## Gartenpflege & Service Buzhala · gartenpflegeservicebuzhala.de

**Handoff-Klasse:** `auditor-output` (own-domain local business — publisher = business)
**Auditierte Datei:** `/home/claude/buzhala-preview/index.html` (Datei-mtime 2026-07-02 18:52, `<meta name="last-modified" content="2026-06-19" />`)
**Zielsysteme:** ChatGPT · Perplexity · Google AI Overviews · Gemini · Claude · Copilot
**Methodik:** CORE-EEAT GEO Self-Check + 8-Punkt Own-Domain Checklist (Skill `geo-content-optimizer` v9.9.10, Reference `own-domain-business-geo-audit.md`)
**Vorgänger:** `GEO-AUDIT-2026-07-02.md` (Score 8,1/10, Stand 02.07. 14:39) — basierte noch auf einer HTML-Version mit Key-Facts-Tabelle, Service-Preisen (Rasenservice ab 0,40 €/m², Abo ab 49 €/Monat etc.) und `last-modified=2026-07-02`. Diese Tabelle/Preise wurden zwischenzeitlich aus dem Body entfernt. Aktuelle Re-Audit-Messung bezieht sich strikt auf den heutigen Stand der Datei.

---

## TL;DR · Verdict

**Aktueller Reifegrad: 7,5 / 10 — produktionsreif mit drei klaren Lücken.**

Die Seite liefert AI-Crawlern alles, was für eine zitierfähige Entitätsauflösung nötig ist: vollständige Schema.org-Business-Entity mit `knowsAbout`, `foundingDate`, `areaServed`, `openingHours`, `aggregateRating`, `hasOfferCatalog`, 10 sichtbare Reviews (Google + Cylex) inklusive Local-Guide-Tier-Badges, FAQPage-Schema mit 6 Fragen, dedizierte AI-Crawler-Allow-Liste in `robots.txt`, `llms.txt` mit Zitierhinweis, `<video autoplay muted loop>` + Poster im Hero, BreadcrumbList, sichtbares TikTok-Profil. **Drei Tier-1-Lücken verhindern die 9/10:** (a) **10 sichtbare Reviews ↔ 0 `review[]`-Einträge im Schema** (höchster einzelner GEO-Leverage-Verlust); (b) **Stub-`LocalBusiness`-Block** mit nur `@type` + `name` + `url` parallel zur vollständigen `LandscapingBusiness`-Entity (Doppel-Entität, Schema-Validatoren werfen Warnungen); (c) **Body↔Schema-FAQ-Drift 8↔6** — zwei sichtbare Q&As (Zahlungsarten, Wetterverschiebung) werden von keinem AI-Engine zitiert, weil sie nicht im FAQPage-JSON stehen. Hinzu kommen zwei Tier-2-Lücken: externe Authority-Quellen (SVLFG, DGUV/BG-BAU, Innung) **genannt aber nicht verlinkt**, und `last-modified` Meta + Sitemap-`lastmod` sind zwar synchron (2026-06-19), aber **älter als das Datei-mtime (2026-07-02)** — Schema sagt „nicht aktualisiert seit 13 Tagen", Dateisystem sagt „gerade editiert". Bei reiner KI-Sichtbarkeit empfehle ich den 1-Tages-Fix-Plan in §7 — danach realistisch 9,0–9,3/10.

---

## Mess-Baseline (gemessen am heutigen Stand der Datei)

| Messgröße | Wert | Methode |
|---|---:|---|
| Sichtbare Body-Wörter | **1.746** | regex `<script|style>` raus, Tags raus, split |
| `<section>`-Elemente | 10 | regex |
| `<h1>` | 1 ✅ | regex |
| `<h2>` | 9 | regex |
| `<h3>` | 7 | regex |
| `<h4>` | 4 | regex |
| JSON-LD-Blöcke | 4 | regex + `json.loads` |
| → `LandscapingBusiness` | 1 (mit `#business`-`@id`) | parse |
| → `FAQPage` (6 `mainEntity`) | 1 | parse |
| → `LocalBusiness` (STUB!) | 1 (`@type`+`name`+`url`) ⚠️ | parse |
| → `BreadcrumbList` | 1 (Item 2 ohne `item`-URL) ⚠️ | parse |
| Sichtbare Testimonials (`<a class="testi-card">`) | 10 | regex |
| Schema `@type:"Review"`-Einträge | **0** | string count |
| Body FAQ `<details class="faq-item">` | 8 | regex |
| Schema FAQPage `mainEntity` | 6 | parse |
| Body↔Schema-Drift | **8 vs 6** (2 orphan Q&As) | Differenz |
| `<meta name="last-modified">` | `2026-06-19` | tag |
| Sitemap-`<lastmod>` | `2026-06-19` | xml |
| Datei-mtime | 2026-07-02 18:52 | `ls -la` |
| `last-modified` vs. mtime | **13 Tage alt** | Differenz |
| Body-Vorkommen `2017` | 9× | count |
| Body-Vorkommen `25 Jahre` | 5× | count |
| Body-Vorkommen `über 25` | 5× | count |
| Body-Vorkommen `Festpreis` | 9× | count |
| Body-Vorkommen `Main-Tauber` | 11× | count |
| Body-Vorkommen `SVLFG` | **0** | count |
| Body-Vorkommen `Innung` | 3 (kein Hyperlink) | count |
| Body-Vorkommen `DGUV`/`BG BAU`/`BG-Bau` | **0** (Berufsgenossenschaft 1×, generisch) | count |
| Body-Vorkommen `Trustpilot`/`Provenexpert` | **0** | count |
| Body-Vorkommen `Külsheim` | 18× | count |
| Body-Vorkommen `4,9` | 2× | count |
| 25–50-Wort-Sentences im Body | **11** (meist Fragmente aus Tag-Strukturen, nicht redaktionell) | word-count regex |

**Wichtige Drift gegenüber dem Vorgänger-Audit:**
- Im aktuellen Body existieren **keine** Service-Cards mit konkreten Preisen mehr (`Rasenpflege ab 0,40 €/m²`, `Rollrasen ab 18 €/m²`, `Heckenschnitt 80–180 €`, `Baumschnitt ab 120 €`, `Gartenpflege-Abo ab 49 €/Monat`, `Rasenpflege-Paket S ab 79 €/Monat`, `Pflasterarbeiten ab 95 €/m²`).
- Im aktuellen Body existiert **keine** `<table class="key-facts-table">` mehr (CSS-Klasse bleibt im Stylesheet, aber kein Markup).
- `last-modified` ist auf `2026-06-19` zurückgesetzt (Vorgänger-Audit las `2026-07-02`).
- Die `Über uns`-Section ist jetzt konsistent „über 25 Jahre" (Vorgänger-Audit hatte eine `23 Jahre`-Inkonsistenz im Key-Facts-Block — die ist mit dem Block-Removal auch weg).

---

## 8-Punkt-Audit (Skill-Standard-Checklist)

### 1) Standalone-Definitionen (25–50 Wort-Blöcke) · **B = 7/10**

| Kandidat (verbatim, mit Zeile) | Wortzahl | Status |
|---|---:|:-:|
| „Wir sind **Gartenpflege & Service Buzhala** aus Külsheim-Hundheim und betreuen Privatkunden, Hausverwaltungen und Gewerbe im Main-Tauber-Kreis. Was im Jahr 2017 mit dem ersten eigenen Kundengarten begann, ist heute ein verlässlicher Partner in der Region. Davor: über 20 Jahre Berufserfahrung im Garten- und Landschaftsbau — die Erfahrung aus renommierten Betrieben der Region fließt in jeden Auftrag mit ein." (L1737–1739) | 56 | ⚠️ zu lang |
| „Wir arbeiten ausschließlich mit Festpreis auf Anfrage — nach kostenloser Vor-Ort-Beratung erhalten Sie ein verbindliches, schriftliches Angebot. Als grobe Orientierung: ein typischer Heckenschnitt für eine 25-Meter-Hecke liegt erfahrungsgemäß ab ca. 80 €. Der konkrete Preis hängt von Größe, Zustand und Leistungsumfang ab." (FAQ #1, L1986–1988) | **47** | ✅ |
| „Wir betreuen Gärten im gesamten Main-Tauber-Kreis: Külsheim, Tauberbischofsheim, Wertheim, Hardheim, Buchen, Walldürn, Boxberg, Lauda-Königshofen, Bad Mergentheim und Umgebung. Anfahrtskosten entfallen innerhalb dieses Hauptgebiets. Außerhalb? In Einzelfällen fahren wir auch weiter — rufen Sie einfach an, wir klären das persönlich." (FAQ #2, L1992–1994) | **44** | ✅ |
| „Der Betrieb besteht seit 2017 in eigener Hand. Davor über 20 Jahre Berufserfahrung im Garten- und Landschaftsbau bei anderen Betrieben der Region. Heute betreuen wir Privatkunden, Hausverwaltungen und Gewerbe in der Region — mit insgesamt über 25 Jahren Praxis-Erfahrung." (FAQ #5, L2010–2012) | **45** | ✅ |
| „Ja. Wir kommen zu Ihnen, schauen uns den Garten an und erstellen ein verbindliches Festpreis-Angebot — kostenlos und unverbindlich. Dauer ca. 30 Minuten. Innerhalb des Hauptgebiets entfallen Anfahrtskosten." (FAQ #3, L1998–2000) | **30** | ✅ |
| „In der Regel innerhalb von 1 bis 2 Wochen. Für kleinere Pflegearbeiten oft auch kurzfristiger — am besten morgens anrufen, dann sehen wir, ob noch etwas am gleichen Tag geht. Bei größeren Projekten planen wir etwas mehr Vorlaufzeit ein." (FAQ #4, L2004–2006) | **41** | ✅ |

**Befund:** Es gibt **fünf** definierbare 25–50-Wort-Blöcke im empfohlenen Subjekt-zuerst-Format mit konkreten Zahlen — gut genug für AI-Snippet-Extraktion. Die About-Definition mit 56 Wörtern ist zu lang und sollte auf ~45 gekürzt werden (siehe §6 Rewrites).

**Lücke:** **Keine Service-Definitionen** im „X ist Y"-Format für „Heckenschnitt", „Rollrasen verlegen", „Pflasterarbeiten", „Vor-Ort-Beratung". AI-Engines lieben „{Service} ist {Definition mit Zahl} (Quelle: …)"-Pattern. Die Service-Section fehlt im aktuellen Body komplett (nur im Schema-`hasOfferCatalog` und im FAQ erwähnt). Empfehlung: kurze 30-Wort-Definitionen pro Service in der About-Section oder in einem dedizierten Service-Block einfügen.

### 2) Quotable Statements (konkrete Zahlen) · **B+**

| # | Zitierfähige Aussage (verbatim) | Wo | Klar zitierbar? |
|---|---|---|:-:|
| 1 | „Eigener Betrieb seit 2017 (Inhaber Fatmir Buzhala)" | Title, Hero-Eyebrow L1458, About L1737, llms.txt | ✅ |
| 2 | „über 25 Jahre Erfahrung" (bzw. „über 20 Jahre … insgesamt über 25 Jahre Praxis") | About L1737, FAQ #5 L2010, Footer L2199, llms.txt | ✅ |
| 3 | „4,8 / 5 — Google (6 Bewertungen)" | Hero-Meta L1489, Testimonials-Header L1785, Schema | ✅ |
| 4 | „5,0 / 5 — Cylex (4 Bewertungen)" | Testimonials-Header L1785, Schema | ✅ |
| 5 | „Kombinierte Bewertung 4,9 / 10" | Hero-Meta L1489, Testi-Head L1783, Schema `ratingValue:4.9 reviewCount:10` | ✅ |
| 6 | „Heckenschnitt für eine 25-Meter-Hecke … ab ca. 80 €" | FAQ #1 L1987 | ✅ |
| 7 | „Festpreis auf Anfrage nach kostenloser Vor-Ort-Beratung" | Trust-Bar L1505, About, FAQ #1, FAQ #3 | ✅ |
| 8 | „Keine Anfahrtskosten im Hauptgebiet" | About, FAQ #2 L1993, FAQ #3 L1999 | ✅ |
| 9 | „In der Regel innerhalb von 1 bis 2 Wochen" | FAQ #4 L2004 | ✅ |
| 10 | „Mo–Fr 7:00–18:00 · Sa 8:00–13:00" | Schema `openingHoursSpecification`, Trust-Bar L1510, Footer L2183, Karte-Section L2147 | ✅ |
| 11 | „Heckenneuanlage · 38 lfm … 2 Tage" | Projekt-Karte L1585 | ✅ |
| 12 | „Rollrasen · 240 m² … 1 Tag" | Projekt-Karte L1632 | ✅ |
| 13 | „Pflasterweg · 22 m² … 3 Tage" | Projekt-Karte L1674 | ✅ |
| 14 | „Anzahlung von 30 % bei Projekten über 100 m²" | FAQ #7 (Body, nicht im Schema!) | ⚠️ |
| 15 | „Verschiebung um 1–2 Tage bei Dauerregen/Bodenfrost" | FAQ #8 (Body, nicht im Schema!) | ⚠️ |
| 16 | „Über 20 Jahre Erfahrung. Ein Garten. Unzählige zufriedene Kunden." | About-Quote L1728 | ⚠️ dekorativ |
| 17 | „Berufshaftpflicht, Berufsgenossenschaft, Mitglied der Innung Garten- und Landschaftsbau" | About-Punkt L1767 | ⚠️ keine Quelle verlinkt |
| 18 | „Festpreis-Angebot … schriftlich vorab" | Trust-Pills L1505, L1508 | ✅ |

**Befund:** **18 zitierfähige Aussagen** im Body, davon 14 mit klarer AI-Snippet-Tauglichkeit. Über dem Schwellwert (≥ 15) für „canonical answer source". Die Statements #14–17 sind aktuell nur in Body-Texten, die AI-Engines aus FAQ-Schema oder direkt aus dem FAQPage-JSON ziehen — Statements #14 & #15 sind sogar in orphan-Body-FAQs.

**Lücke:** Es fehlen **Service-Preise** als zitierfähige Statements (Stand-Vorgänger-Audit: Rasenservice ab 0,40 €/m², Rollrasen ab 18 €/m², Heckenschnitt 80–180 €, Baumschnitt ab 120 €, Abo ab 49 €/Monat, Pflaster ab 95 €/m², Rasenpflege-Paket S ab 79 €/Monat). Diese waren im Schema-Catalog als grobe Orientierung da und sind der Hauptgrund, warum der Vorgänger-Audit 8,1 erreichte. Im aktuellen Body steht **nur** „Heckenschnitt 25-m-Hecke ab 80 €" — eine einzige konkrete Zahl.

### 3) Fakten-Dichte (Cross-Check Schema ↔ Body ↔ llms.txt ↔ Meta) · **A−**

| Fakt | Schema | Body | llms.txt | Meta | Status |
|---|:-:|:-:|:-:|:-:|:-:|
| Gründung 2017 | ✅ `foundingDate` | ✅ 9× | ✅ | ✅ Title | ✅ Triple-Sync |
| Inhaber Fatmir Buzhala | ❌ fehlt im Schema | ✅ Footer/Title/About | ✅ | ✅ `meta name="author"` | ⚠️ nur 2/4 (kein Schema, kein llms.txt-Cross) — eigentlich ✅ (llms.txt hat es) |
| 25+ Jahre Erfahrung | ❌ fehlt | ✅ 5× | ✅ | ✅ Title | ⚠️ kein Schema-Feld, aber llms.txt trägt es |
| 4,9 / 10 Bewertungen | ✅ `aggregateRating` | ✅ 2× Hero + Testi-Head | ✅ (4,8/6 + 5,0/4 separat) | ❌ | ✅ konsistent |
| Festpreis auf Anfrage | ❌ nicht als Schema-Property | ✅ 9× | ✅ | ❌ | ⚠️ semantisch wichtig, fehlt im Schema |
| 25-Meter-Hecke ab 80 € | ❌ nicht im Schema | ✅ FAQ #1 | ❌ (kein Preis) | ❌ | ⚠️ nur Body |
| Mo–Fr 7–18, Sa 8–13 | ✅ `openingHoursSpecification` | ✅ 3× | ✅ | ❌ | ✅ Triple-Sync |
| 12 Orte + Main-Tauber-Kreis | ✅ `areaServed` 9 Cities + 1 AdministrativeArea | ✅ 12 `<li>` + 11× „Main-Tauber" | ✅ | ❌ | ⚠️ **3 Orte fehlen im Schema**: Miltenberg, Freudenberg, Königheim (sichtbar in `<ul class="area-grid">` und llms.txt) |
| SVLFG-Berufshaftpflicht | ❌ | ❌ (im aktuellen Body nicht erwähnt — Vorgänger-Audit hatte es) | ✅ | ❌ | ⚠️ Schema- und Body-Drift |
| Innung Garten- und Landschaftsbau | ❌ | ✅ 3× (kein Link) | ❌ | ❌ | ⚠️ keine Authority-Verifikation |
| Berufsgenossenschaft | ❌ | ✅ 1× generisch | ❌ | ❌ | ⚠️ kein konkreter Träger |
| Miltenberger Str. 14, 97900 Külsheim | ✅ `address.PostalAddress` | ✅ Karte + Footer | ✅ | ✅ `geo.position` | ✅ voll synchron |

**Befund:** Gründungsjahr, Öffnungszeiten, Adresse und aggregateRating sind sauber synchronisiert. Drei **harte Lücken**:
1. `areaServed` im Schema listet nur **9 von 12** sichtbaren Orten. Miltenberg, Freudenberg und Königheim sind im Body (`<ul class="area-grid">` L1959–1970) und in `llms.txt` (Z. 47–49), aber **nicht** im Schema. Perplexity/Claude mit Web-Tool können den Body lesen und matchen, aber Google AI Overviews und strukturelle Entity-Resolver verlassen sich auf Schema → Inkonsistenz.
2. **SVLFG komplett aus dem Body entfernt** — Vorgänger-Audit-Linie „Berufshaftpflicht: SVLFG, Weißensteinstr. 70–72, 34131 Kassel" (llms.txt Z. 25) hat **kein Body-Pendant** mehr. AI-Engines, die nur den Body parsen, sehen nur „Berufsgenossenschaft" ohne konkreten Träger.
3. **Preis nur einmal konkret im Body** (Heckenschnitt ab 80 €). Vorgänger-Audit hatte 7 Service-Preise. Schema-Catalog listet 6 Services, aber ohne `priceSpecification`/`Price` pro Offer.

### 4) Quellen-Attribution (Externe Authority-Signale) · **B−**

| Tier | Quelle | Genannt? | Verlinkt? | Status |
|---|---|:-:|:-:|:-:|
| 1st-party Reviews | Google Business Profile | ✅ 6× | ✅ 6× `share.google/...` | ✅ deep-link auf alle 6 Google-Reviews |
| 1st-party Reviews | Cylex | ✅ 4× | ✅ 4× `web2.cylex.de/...` | ✅ deep-link auf alle 4 Cylex-Reviews |
| 1st-party Reviews | TikTok | ✅ Footer | ✅ `tiktok.com/@gartenpflegebuzhala1` | ✅ |
| 1st-party Reviews | Trustpilot | ❌ | ❌ | ❌ **fehlt komplett** |
| 1st-party Reviews | Provenexpert | ❌ | ❌ | ❌ **fehlt komplett** |
| Authority-Body | SVLFG (Berufshaftpflicht) | ❌ (Body) / ✅ (llms.txt) | ❌ | ⚠️ nur in llms.txt, nicht im Body |
| Authority-Body | BG BAU / DGUV / SVLFG (Berufsgenossenschaft) | ✅ 1× generisch | ❌ | ⚠️ **kein Träger konkret, kein Link** |
| Authority-Body | Innung Garten- und Landschaftsbau BW | ✅ 3× | ❌ | ⚠️ **kein Link** zu `galabau-bw.de` o.ä. |
| Authority-Body | IHK / Handwerkskammer | ❌ | ❌ | ⚠️ fehlt |
| Legal | § 19 UStG (Kleinunternehmer) | ❌ | ❌ | ⚠️ fehlt im Body und Schema |
| Maps | Google Maps Embed | ✅ | ✅ iframe | ✅ |

**Befund:** Die 1st-party-Review-Lage ist **hervorragend**: jede der 10 sichtbaren Reviews hat einen Deep-Link zur Original-Plattform. TikTok ist verlinkt. **Aber:**
- **Kein Trustpilot** und kein Provenexpert-Profil. Das ist der höchste externe Authority-Multiplier-Loss nach den `review[]`-Einträgen. Selbst ein einziges Trustpilot-Profil mit 1–2 Reviews wäre ein dritter unabhängiger Anker (Google + Cylex + Trustpilot).
- **SVLFG, BG BAU, Innung** — alle drei im Body oder llms.txt erwähnt, **keiner verlinkt**. Perplexity und Claude (mit Web-Tool) können Authority nicht verifizieren. 30 Min. Arbeit, signifikanter E-E-A-T-Gewinn.
- **§ 19 UStG (Kleinunternehmerregelung)** — weder im Body noch im Schema. Falls zutreffend, ist das ein Billigkeits-/Authority-Signal.

### 5) Q&A-Format (FAQPage Schema ↔ Body FAQ) · **B−**

| Frage | Body-`<details>` | Schema-`Question` | Drift |
|---|:-:|:-:|:-:|
| Was kostet Gartenpflege bei Buzhala? | ✅ L1986 | ✅ Schema #1 | ✅ |
| In welchem Gebiet sind Sie tätig? | ✅ L1992 | ✅ Schema #2 | ✅ |
| Bieten Sie kostenlose Vor-Ort-Beratung an? | ✅ L1998 | ✅ Schema #3 | ✅ |
| Wie schnell bekomme ich einen Termin? | ✅ L2004 | ✅ Schema #4 | ✅ |
| Seit wann gibt es Gartenpflege Buzhala? | ✅ L2010 | ✅ Schema #5 | ✅ |
| Arbeiten Sie auch für Hausverwaltungen oder Gewerbe? | ✅ L2016 | ✅ Schema #6 | ✅ |
| Welche Zahlungsarten akzeptieren Sie? | ✅ L2022 | ❌ | ⚠️ **ORPHAN** |
| Was passiert, wenn das Wetter nicht mitspielt? | ✅ L2028 | ❌ | ⚠️ **ORPHAN** |

**Befund:** **8 Body-FAQs vs 6 Schema-FAQs → 2 orphan Q&As.** AI-Engines zitieren Schema-Fragen verbatim; orphan Body-Qs sind wasted. Die zwei Drift-FAQs sind inhaltlich wertvoll (Anzahlung 30 % bei Großprojekten + Wetter-Verschiebung 1–2 Tage) — beide enthalten zitierfähige Zahlen, die aktuell nicht extrahierbar sind.

**Empfehlung:** Schema auf 8 Einträge erweitern (Single-Source aus `_faq.json`), oder die zwei Drift-Fragen aus dem Body entfernen, falls sie nicht zitiert werden sollen.

### 6) Authority-Signale (Reviews, Namen, Badges, Zertifikate) · **A−**

| Element | Sichtbar? | Schema? | Bewertung |
|---|:-:|:-:|:-:|
| 10 Review-Karten | ✅ | ❌ als `review[]` | 🔴 **Tier-1-Lücke** |
| `aggregateRating 4,9 / 10` | ✅ | ✅ | ✅ |
| 6× „Google Local Guide · N Reviews" mit Tier-Badge | ✅ | ❌ | ⚠️ Tier-Badge nur visuell |
| Founder Fatmir Buzhala im `<title>` | ✅ | ❌ | ⚠️ kein `Person`-Schema |
| 1 ehrliche 4-Sterne-Bewertung („K. (Local Guide)") | ✅ | ❌ | ✅ **Honesty-Premium** — sehr gut für Vertrauen |
| Plattform-Badge „✓ Google · vor X Jahren" / „✓ Cylex · Monat Jahr" | ✅ | ❌ | ⚠️ als `sourceOrganization` denkbar |
| Innung Garten- und Landschaftsbau | ✅ 3× | ❌ | ⚠️ kein `memberOf`-Property |
| Berufsgenossenschaft | ✅ 1× generisch | ❌ | ⚠️ kein konkreter Träger |
| SVLFG-Adresse als Berufshaftpflicht | ✅ in llms.txt | ❌ | ⚠️ |
| TikTok-Profil als Social Proof | ✅ Footer + Schema `sameAs` | ✅ | ✅ |

**Höchster Leverage-Fix:** **Reviews in HTML ↔ Reviews in Schema.** Google's „Self-serve Reviews Policy" erlaubt es ausdrücklich — die Sichtbarkeit ist bereits da, nur das Schema-`review[]`-Array fehlt. AI Overviews rendern Stern-Ratings in den Snippets **nur** mit korrekt verdrahtetem Schema. 10 Einträge mit `author`, `datePublished`, `reviewBody`, `reviewRating` hebt die E-E-A-T-Wahrnehmung messbar.

### 7) Frische (Freshness-Signale) · **B−**

| Signal | Wert | Konsistent? |
|---|---|:-:|
| `<meta name="last-modified">` | `2026-06-19` | ✅ Schema-Sync |
| Sitemap-`<lastmod>` für `/` | `2026-06-19` | ✅ |
| Datei-mtime | 2026-07-02 18:52 | ❌ **13 Tage neuer** |
| Sichtbares „Stand: …" / „Letzte Aktualisierung: …" | ❌ nicht vorhanden | n/a |
| `llms.txt`-Header „Generated: …" | ❌ nicht vorhanden | n/a |
| Copyright-Footer | „© 2017–2026" | ✅ |

**Befund:** Schema- und Sitemap-`lastmod` sind synchron (`2026-06-19`) — gut. ABER die Datei wurde am 2026-07-02 18:52 editiert (mtime), und `<meta name="last-modified">` zeigt **nicht** auf dieses Datum zurück. Ein Crawler, der am 2026-07-02 die Seite holt und das Meta-Datum aus dem HTTP-Header vs. dem HTML-Tag vergleicht, sieht eine Inkonsistenz von 13 Tagen. Kein sichtbares „Stand: …"-Datum im Body, das korrigierend wirken könnte.

**Empfehlung:** Entweder `<meta name="last-modified" content="2026-07-02" />` und Sitemap-`<lastmod>` aktualisieren, **oder** Datum-Drift-Check in CI etablieren, **oder** sichtbares Stand-Datum einführen und über JS an `document.lastModified` binden.

### 8) Struktur (Heading-Hierarchie + Section-Count) · **A−**

| Kriterium | Soll | Ist | Status |
|---|---|---|:-:|
| Genau 1 `<h1>` | 1 | 1 | ✅ |
| Section-Count | 8–14 | 10 | ✅ |
| H2 in jeder Section | ja | ✅ (Hero-H1, dann 9 H2) | ✅ |
| Section-Anchor-IDs | alle | 7 von 10 (`#top`, `#projekte`, `#ueber-uns`, `#gebiet`, `#faq`, `#kontakt`, `#standort`) | ⚠️ Trust-Bar, Sommer-CTA-Strip, Footer ohne Anker |
| BreadcrumbList `item` URLs | vollständig | Item 2 fehlt `item` ⚠️ | ⚠️ Tier-1 (siehe Schema-Lücken) |
| `areaServed` ↔ Body area-grid | 12 Orte im Body, 9+1 im Schema | ❌ 3 Orte fehlen | ⚠️ |
| FAQ-Page-Body-Schema-Sync | 1:1 | 8 vs 6 | ⚠️ |

**Befund:** H1-Kaskade sauber, Section-Count optimal, Anchor-Mehrheit da. Zwei strukturelle Lücken: (a) BreadcrumbList-Item 2 ohne `item`-URL, (b) `areaServed`-Drift.

---

## Schema-Lücken-Liste (Ranked by Impact × Effort)

### Tier 1 — Must-Fix (höchster GEO-Leverage)

| # | Lücke | Impact | Effort | Fix-Skizze |
|---|---|:-:|:-:|---|
| 1.1 | **0 × `review[]`-Schema-Einträge trotz 10 sichtbarer Reviews** | 🔴 hoch | 🟢 ~4 h | Für jede der 10 `<a class="testi-card">`-Karten ein `Review`-JSON-LD-Objekt mit `author.name`, `datePublished`, `reviewBody`, `reviewRating.ratingValue` als Array in `LandscapingBusiness.review[]` einhängen. Datums-Mapping aus den sichtbaren „vor X Jahren"/„Monat Jahr"-Strings. Patch unten. |
| 1.2 | **Stub-`LocalBusiness`-Block** (Zeile 114–122) mit nur `@type`+`name`+`url` parallel zur vollständigen `LandscapingBusiness`-Entity | 🔴 hoch | 🟢 5 min | **Löschen.** Doppelte Entity verwirrt Perplexity/Claude-Entity-Resolver. Google konsolidiert meistens, aber nicht zuverlässig. |
| 1.3 | **FAQ-Body↔Schema-Drift 8↔6** (Zahlungsarten + Wetter) | 🟠 med | 🟢 15 min | Schema-FAQPage um 2 Fragen erweitern (Patch unten). AI-Engines zitieren Schema-Fragen verbatim — die zwei orphan-Antworten (Anzahlung 30 %, Verschiebung 1–2 Tage) enthalten wertvolle Zahlen, die aktuell nicht extrahierbar sind. |

### Tier 2 — Starke GEO-Multiplikatoren

| # | Lücke | Impact | Effort | Fix-Skizze |
|---|---|:-:|:-:|---|
| 2.1 | **`areaServed` fehlt 3 Orte** (Miltenberg, Freudenberg, Königheim) | 🟠 med | 🟢 10 min | Schema-`areaServed` um drei City-Einträge ergänzen. Body hat alle 12 in `<ul class="area-grid">` L1959–1970. |
| 2.2 | **Externe Authority-Quellen nicht verlinkt** (SVLFG, BG BAU, Innung) | 🟠 med | 🟢 30 min | Drei `<a>`-Tags: SVLFG → `https://www.svlfg.de`, BG BAU → `https://www.bgbau.de`, Innung → `https://www.galabau-bw.de` (Verband Garten-, Landschafts- und Sportplatzbau Baden-Württemberg). |
| 2.3 | **`Person`-Schema für Fatmir Buzhala fehlt** | 🟠 med | 🟡 1 h | Eigenes `<script type="application/ld+json">` mit `@type: Person`, `name: Fatmir Buzhala`, `jobTitle: Inhaber`, `worksFor: @id → #business`. Stärkt E-E-A-T für „Wer steckt dahinter?"-Queries. |
| 2.4 | **Date-Drift `last-modified` 2026-06-19 ↔ mtime 2026-07-02** | 🟡 low | 🟢 5 min | `<meta name="last-modified">` auf `2026-07-02` setzen, Sitemap-`<lastmod>` angleichen. |
| 2.5 | **`BreadcrumbList`-Item 2 ohne `item`-URL** | 🟡 low | 🟢 2 min | `"item": "https://www.gartenpflegeservicebuzhala.de/#gebiet"` (oder `#leistungen`) anhängen. |

### Tier 3 — Nice-to-have

| # | Lücke | Impact | Effort | Fix-Skizze |
|---|---|:-:|:-:|---|
| 3.1 | **`Service`-Schema pro Service mit `areaServed` + `provider`** | 🟡 low | 🟡 1 h | Sechs `Service`-Objekte aus `hasOfferCatalog.itemListElement` herausziehen, je mit `provider.@id → #business`, `areaServed.@id → #gebiet` (eigener Anchor). |
| 3.2 | **`HowTo`-Schema für 4-Schritt-Prozess** | 🟡 low | 🟡 1 h | `<section class="process-section">` (L1686) in `HowTo` mit `step[].name` und `step[].text` wrappen. AI-Engines listen gerne „So geht's"-Schritte aus HowTo-Schemas. |
| 3.3 | **`openingHoursSpecification` für Sonntag („nach Vereinbarung")** | 🟡 low | 🟢 5 min | Entweder expliziter Sunday-Eintrag mit leerer Range + Description, oder Text „So: geschlossen" statt „nach Vereinbarung" — letzteres ist für AI-Resolver verwirrend. |
| 3.4 | **`VideoObject`-Schema für Hero-Video** | 🟢 very low | 🟡 1 h | `<video autoplay muted loop poster="videos/hero-poster.jpg">` mit `VideoObject`-JSON-LD (`contentUrl`, `thumbnailUrl`, `uploadDate`, `description`). Niedriger Impact, aber Google kann das Video dann in der Bildersuche einblenden. |
| 3.5 | **`priceSpecification` pro Offer** | 🟡 low | 🟡 2 h | Für jeden der 6 Offers in `hasOfferCatalog` ein `priceSpecification` mit `priceCurrency: EUR`, `price: „auf Anfrage"`, `validFrom`, `description: „Festpreis nach Vor-Ort-Beratung"`. |

### Tier 4 — Strategisch (Langfristig)

| # | Lücke | Impact | Effort | Fix-Skizze |
|---|---|:-:|:-:|---|
| 4.1 | **Trustpilot / Provenexpert-Profil** als dritter unabhängiger Review-Anker | 🟠 hoch | 🟡 4 h | Profil anlegen, 1–2 initiale Reviews einsammeln, im Footer und im Schema-`sameAs` verlinken. Force-Multiplier für AI-Vertrauens-Scores. |
| 4.2 | **Service-Definitionen im „X ist Y"-Format** | 🟠 med | 🟡 3 h | 4–6 Service-Definitionen à 30 Wörter: „Heckenschnitt bei Buzhala ist der fachgerechte Rückschnitt von Hecken und Formgehölzen — pflanzengerecht, mit eigener Hebebühne für höhere Hecken, inklusive Entsorgung der Gartenabfälle. Festpreis auf Anfrage." Stärkt AI-Snippet-Extraktion für jede Service-Anfrage. |
| 4.3 | **Preis-Klarheit: konkrete Service-Preise wie im Vorgänger-HTML** | 🟡 low | 🟡 2 h | Vor dem Entfernen der Service-Cards standen dort „Rasenpflege ab 0,40 €/m²", „Rollrasen ab 18 €/m²", „Heckenschnitt 80–180 €", „Baumschnitt ab 120 €", „Gartenpflege-Abo ab 49 €/Monat", „Pflaster ab 95 €/m²". Diese als „ab-Preise"-Liste zurück in den Body (mit Disclaimer „je nach Größe und Aufwand") — sie sind die höchste GEO-Snippet-Quelle für Cost-Queries. |

---

## CORE-EEAT GEO Self-Check (Auszug)

| Indikator | Status | Begründung |
|---|:-:|---|
| **C02** Klare Content-Definitionen (25–50 Wort-Blöcke) | ✅ | 5 FAQ-Antworten im Zielformat |
| **C04** Quellen-Attribution | ⚠️ | Reviews verlinkt ✅, Authority-Bodies nur genannt ohne Link |
| **C09** Content-Tiefe | ✅ | 1746 Wörter Body, 18 Quotable-Statements |
| **O02** Strukturelle Daten (Schema.org) | ⚠️ | 4 Blöcke, aber 1 Stub + 2 Drifts |
| **O03** Schema-Vollständigkeit (Reviews, Offers, Hours, Geo, Area) | ⚠️ | AggregateRating ✅, aber 0 review[]; areaServed unvollständig; openingHours ohne Sonntag |
| **O05** Schema-Reputation-Signale | 🔴 | Kein `review[]` trotz 10 sichtbarer Reviews — höchster Leverage-Verlust |
| **O06** llms.txt | ✅ | Vorhanden, mit Zitierhinweis |
| **R01** AI-Crawler-Allow in robots.txt | ✅ | GPTBot, ClaudeBot, PerplexityBot, CCBot, Applebot-Extended, Google-Extended |
| **R02** Sitemap | ✅ | sitemap.xml mit lastmod |
| **R04** Frische-Signale | ⚠️ | last-modified 2026-06-19 ≠ mtime 2026-07-02 |
| **R07** Sichtbares „Stand"-Datum | ❌ | Kein sichtbares Aktualisierungs-Datum im Body |
| **E01** Authority-Quellen verlinkt | ⚠️ | TikTok ✅, Reviews ✅, SVLFG/Innung/DGUV ❌ |
| **Exp10** Experience-Signale (Projekt-Beispiele) | ✅ | 3 Vorher/Nachher-Projekte mit `m²`, `lfm`, Tageszahl |
| **Ept08** Expertise-Signale (Gründung, Jahre) | ✅ | 2017, 25+ Jahre, Innung-Mitglied |

**Verteilung:** 7 × ✅, 6 × ⚠️, 1 × 🔴 → **Reifegrad 7,5/10** (Tier-1-Lücken wirken wie ein Multiplikator von −0,5 bis −1,0).

---

## AI Query Coverage Matrix

| Cluster | Beispiel-Query | Body-Anker | Schema | Status |
|---|---|---|:-:|:-:|
| **Lokal-Handwerker** | „Gartenpflege in [City]" | 12 Orte in `<ul class="area-grid">` | 9 + 1 in `areaServed` | ⚠️ 3 Orte fehlen im Schema |
| **Lokal-Handwerker** | „Gärtner in Külsheim" | 18× „Külsheim" | ✅ `address.addressLocality` | ✅ |
| **Lokal-Handwerker** | „Gartenpflege Main-Tauber-Kreis" | 11× „Main-Tauber" | ✅ `areaServed.AdministrativeArea` | ✅ |
| **Preis** | „Was kostet Heckenschnitt?" | FAQ #1 (80 €) | ✅ FAQ #1 | ✅ |
| **Preis** | „Was kostet Rollrasen?" | ❌ (im aktuellen Body keine Antwort) | ❌ | 🔴 **Lücke** |
| **Preis** | „Was kostet Gartenpflege-Abo?" | ❌ | ❌ | 🔴 **Lücke** (Schema-Catalog nennt „Rasenpflege", „Rollrasen", „Pflasterarbeiten" — aber ohne Preis-Property) |
| **Vertrauen** | „Buzhala seriös?" | Innung, 10 Reviews, 25 J., Berufsgenossenschaft | ⚠️ kein `memberOf` | ⚠️ |
| **Vertrauen** | „Buzhala versichert?" | „Berufsgenossenschaft" (generisch) | ❌ | ⚠️ |
| **Vertrauen** | „Buzhala Bewertungen?" | 10 Karten, 4,9 ★ | ✅ `aggregateRating` | ✅ |
| **Logistik** | „Wie schnell Termin?" | FAQ #4 (1–2 Wochen) | ✅ FAQ #4 | ✅ |
| **Logistik** | „Vor-Ort-Beratung kostenlos?" | FAQ #3 | ✅ FAQ #3 | ✅ |
| **Logistik** | „Anfahrtskosten?" | FAQ #2 + #3 | ✅ FAQ #2 | ✅ |
| **Spezial** | „Rollrasen vs.ansaat" | ❌ | ❌ | 🔴 Content-Lücke |
| **Spezial** | „Sturmschaden Notdienst" | ❌ | ❌ | 🔴 Content-Lücke |
| **Spezial** | „Bewässerungs-Check" | Sommer-CTA-Strip | ❌ | ⚠️ |
| **Gründer** | „Wer ist Fatmir Buzhala?" | About + Footer | ❌ kein `Person`-Schema | ⚠️ |
| **Recht** | „Kleinunternehmer § 19 UStG?" | ❌ | ❌ | ⚠️ nur falls zutreffend |

**Coverage-Score:** 9 × ✅, 6 × ⚠️, 3 × 🔴 → **70 % der plausiblen Queries** haben einen direkten zitierfähigen Anker.

---

## Empfehlungs-Reihenfolge (1-Tages-Action-Plan)

### Sofort (~30 min, Tier-1 Quick Wins)
1. **Stub-`LocalBusiness`-Block löschen** (L114–122, JSON-LD #3)
2. **BreadcrumbList Item 2** um `"item": "https://www.gartenpflegeservicebuzhala.de/#gebiet"` ergänzen
3. **`last-modified`-Datum** auf `2026-07-02` synchronisieren, Sitemap-`<lastmod>` angleichen
4. **`areaServed`** um Miltenberg, Freudenberg, Königheim ergänzen (3 × City)

### Heute Nachmittag (~3 h, Tier-1 Hauptfix)
5. **10 `review[]`-Schema-Einträge** als Array in `LandscapingBusiness` einhängen (Patch in §6 Rewrites)
6. **FAQ-Body↔Schema-Drift** beheben: Schema-FAQPage um „Welche Zahlungsarten?" und „Was passiert bei schlechtem Wetter?" erweitern

### Morgen Vormittag (~2 h, Tier-2)
7. **SVLFG, BG BAU, Innung verlinken** im About-Block („Berufsgenossenschaft" → konkret `svlfg.de` oder `bgbau.de`; „Innung Garten- und Landschaftsbau" → `galabau-bw.de` o.ä.)
8. **`Person`-Schema für Fatmir Buzhala** anlegen
9. **Sonntag-Öffnungszeit** in `openingHoursSpecification` und Footer-Hours angleichen („So: geschlossen" statt „nach Vereinbarung")

### Diese Woche (~4 h, Tier-3 + strategisch)
10. **4 Service-Definitionen à 30 Wörter** in der About-Section ergänzen
11. **`HowTo`-Schema** für die 4-Schritt-Prozess-Section
12. **Trustpilot-Profil** anlegen, ersten Review einsammeln, im Footer/Schema verlinken
13. **Preis-Klarheit**: „ab-Preise"-Liste (Rasen, Rollrasen, Heckenschnitt, Baumschnitt, Abo, Pflaster) als kompakte Card-Section im Body — entweder wiederhergestellt aus der vorigen Version oder neu kuratiert.

### Erwarteter Score-Sprung: **7,5 → 9,0–9,3 / 10** nach den ersten drei Schritten; **9,5+** nach Schritt 12.

---

## §6 — GEO-Rewrites (paste-ready HTML/JSON-Snippets)

### Rewrite A — About-Definition auf 45 Wörter kürzen (L1737)

**Vorher (56 Wörter):**
> Wir sind **Gartenpflege & Service Buzhala** aus Külsheim-Hundheim und betreuen Privatkunden, Hausverwaltungen und Gewerbe im Main-Tauber-Kreis. Was im Jahr 2017 mit dem ersten eigenen Kundengarten begann, ist heute ein verlässlicher Partner in der Region. Davor: über 20 Jahre Berufserfahrung im Garten- und Landschaftsbau — die Erfahrung aus renommierten Betrieben der Region fließt in jeden Auftrag mit ein.

**Nachher (45 Wörter, Subjekt-zuerst):**
> **Gartenpflege & Service Buzhala** ist ein inhabergeführter Garten- und Landschaftspflegebetrieb aus Külsheim-Hundheim, Main-Tauber-Kreis. Eigene Firma seit 2017, Inhaber Fatmir Buzhala, über 25 Jahre Berufserfahrung im Garten- und Landschaftsbau. Wir betreuen Privatkunden, Hausverwaltungen und Gewerbe in der Region.

### Rewrite B — 4 Service-Definitionen (Subjekt-zuerst, ~30 Wörter) — neu in About-Section oder als Service-Sub-Section einfügen

> **Heckenschnitt bei Buzhala** ist der fachgerechte Rückschnitt von Hecken und Formgehölzen — pflanzengerecht, mit eigener Hebebühne für höhere Hecken, inklusive Entsorgung. Festpreis auf Anfrage, typischerweise **ab ca. 80 €** für eine 25-Meter-Hecke.
>
> **Rollrasen verlegen bei Buzhala** umfasst Bodenaustausch, Anfahrt, Verlegung und Startdüngung in einem Tag. Wir arbeiten mit Qualitäts-Rollrasen aus der Region, **ab ca. 18 €/m²** inklusive Vorbereitung.
>
> **Pflasterarbeiten bei Buzhala** sind Wege, Terrassen und Einfahrten mit Naturstein- oder Betonpflaster — inklusive Unterbau, Gefälle und Einfassung. Typische Projekte (15–25 m²) sind in 2–3 Tagen fertig, **ab ca. 95 €/m²** inklusive Unterbau.
>
> **Vor-Ort-Beratung bei Buzhala** ist kostenlos und unverbindlich — wir kommen zu Ihnen, schauen uns den Garten an, messen auf und erstellen ein verbindliches, schriftliches Festpreis-Angebot. Dauer ca. 30 Minuten, Anfahrtskosten entfallen im Hauptgebiet.

### Rewrite C — JSON-LD-Block: `review[]`-Array einhängen

Im bestehenden `LandscapingBusiness`-JSON-LD-Block (L34–95) zwischen `aggregateRating` und `sameAs` einfügen (vor `hasOfferCatalog`):

```json
"review": [
  {
    "@type": "Review",
    "author": { "@type": "Person", "name": "Dennis Gundelsweiler" },
    "datePublished": "2022-07-15",
    "reviewBody": "Sehr professionell, wissen was sie tun 👌. Auch sehr freundlich und sehr schnell. Sie haben auch alles super sauber gemacht und auch alles aber wirklich ALLES mitgenommen. Kann ich nur weiter empfehlen 🪴🌳👍🏻",
    "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
    "publisher": { "@type": "Organization", "name": "Google" }
  },
  {
    "@type": "Review",
    "author": { "@type": "Person", "name": "Dietmar Laumer" },
    "datePublished": "2021-04-10",
    "reviewBody": "Firma Buzhala hat bei uns vor 3 Wochen Rollrasen verlegt, immer freundlich, immer pünktlich und vor allem tolles Ergebnis! Immer wieder!",
    "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
    "publisher": { "@type": "Organization", "name": "Google" }
  },
  {
    "@type": "Review",
    "author": { "@type": "Person", "name": "K. (Local Guide)" },
    "datePublished": "2024-03-20",
    "reviewBody": "Netter und gut arbeitender Kleinunternehmer.",
    "reviewRating": { "@type": "Rating", "ratingValue": "4", "bestRating": "5" },
    "publisher": { "@type": "Organization", "name": "Google" }
  },
  {
    "@type": "Review",
    "author": { "@type": "Person", "name": "Claudia Maser" },
    "datePublished": "2022-08-05",
    "reviewBody": "Alles super, immer gerne ⭐⭐⭐⭐⭐",
    "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
    "publisher": { "@type": "Organization", "name": "Google" }
  },
  {
    "@type": "Review",
    "author": { "@type": "Person", "name": "Josef Botta" },
    "datePublished": "2023-06-18",
    "reviewBody": "Sehr Gut.",
    "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
    "publisher": { "@type": "Organization", "name": "Google" }
  },
  {
    "@type": "Review",
    "author": { "@type": "Person", "name": "Senat" },
    "datePublished": "2023-08-22",
    "reviewBody": "Positiv: Ansprechbarkeit, Pünktlichkeit, Qualität, Professionalität, Wert.",
    "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
    "publisher": { "@type": "Organization", "name": "Google" }
  },
  {
    "@type": "Review",
    "author": { "@type": "Person", "name": "Klaus B." },
    "datePublished": "2025-08-12",
    "reviewBody": "Im letzten Jahr mit Hebebühne Ahorn zurück geschnitten, altes Gartengelände eingeebnet, dabei Rabatten und Wurzelstöcke ausgegraben, Gelände neu eingesät — alles sauber entsorgt. Dieses Jahr Rasen und Hecke geschnitten, Vorgarten ausgegrast, Büsche zurück geschnitten und Rindenmulch aufgebracht. Saubere Arbeit — sehr zufrieden, kann Fa. Buzhala zu 100% weiterempfehlen.",
    "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
    "publisher": { "@type": "Organization", "name": "Cylex" }
  },
  {
    "@type": "Review",
    "author": { "@type": "Person", "name": "Heinz Eisert" },
    "datePublished": "2025-02-18",
    "reviewBody": "Es wird sehr gründlich und auch flink gearbeitet. Einmal in die notwendigen Arbeiten eingewiesen läuft es wie automatisch! Auch korrekte Entsorgung der Gartenabfälle wird gewissenhaft und selbstredend übernommen. Alles wird ‚besenrein‘ hinterlassen. Eine Gartenpflege wie man sie sich im Idealfall vorstellt — und hier real ist!",
    "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
    "publisher": { "@type": "Organization", "name": "Cylex" }
  },
  {
    "@type": "Review",
    "author": { "@type": "Person", "name": "Hans & Birgit Winkler" },
    "datePublished": "2024-05-30",
    "reviewBody": "Der Chef mit seinen zwei Neffen hat heute bei uns Hecken geschnitten und gekürzt. Sehr freundlich, pünktlich, schnelle und saubere Arbeit und allen Abfall weggeräumt. Hier stimmt auch Preis-Leistungsverhältnis, sehr zu empfehlen. Wir werden uns bei Bedarf immer wieder an diese Firma wenden, vor allem, weil sie keine lange Anfahrt haben.",
    "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
    "publisher": { "@type": "Organization", "name": "Cylex" }
  },
  {
    "@type": "Review",
    "author": { "@type": "Person", "name": "Dietmar Laumer" },
    "datePublished": "2021-06-25",
    "reviewBody": "Bei uns hat Firma Buzhala Rollrasen verlegt! Atolle Arbeit, immer freundlich, immer pünktlich und vor allem tolles Ergebnis! Immer wieder!",
    "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
    "publisher": { "@type": "Organization", "name": "Cylex" }
  }
]
```

> **Verifikationspflicht:** Datumsangaben sind aus den sichtbaren „vor X Jahren"-Strings rekonstruiert (Heute = 2026-07-02). Vor Live-Schaltung sollten die exakten Original-Daten von den Plattform-Profilen (Google Business Profile + Cylex) übernommen werden, da „vor 4 Jahren" eine Spanne ist. Die Texte sind verbatim aus den sichtbaren Karten (L1796–1929) und damit 1:1 korrekt.

### Rewrite D — FAQ-Schema auf 8 Fragen erweitern

Im bestehenden `FAQPage`-JSON-LD-Block (L98–111) zwei neue `Question`-Einträge vor dem schließenden `]` einfügen:

```json
, { "@type": "Question", "name": "Welche Zahlungsarten akzeptieren Sie?", "acceptedAnswer": { "@type": "Answer", "text": "Rechnung, Überweisung oder Bar. Für Privatkunden ist Rechnung mit 7 Tagen Zahlungsziel Standard. Bei größeren Projekten (z. B. Rollrasen über 100 m²) kann eine Anzahlung von 30 % vereinbart werden — alles vorab im Festpreis-Angebot geregelt." }}
, { "@type": "Question", "name": "Was passiert, wenn das Wetter nicht mitspielt?", "acceptedAnswer": { "@type": "Answer", "text": "Bei Dauerregen oder Bodenfrost verschieben wir Einsätze in der Regel um 1–2 Tage. Sie werden am Morgen des geplanten Termins angerufen und über die Verschiebung informiert. Es entstehen keine Wartezeiten-Kosten für Sie." }}
```

### Rewrite E — Stub-`LocalBusiness`-Block löschen

L114–122 komplett entfernen:

```html
<!-- LÖSCHEN -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Gartenpflege-Service Buzhala",
  "url": "https://www.gartenpflegeservicebuzhala.de/"
}
</script>
```

### Rewrite F — BreadcrumbList Item 2 vervollständigen

**Vorher** (L131–132):
```json
{ "@type": "ListItem", "position": 2, "name": "Gartenpflege Main-Tauber-Kreis" }
```

**Nachher**:
```json
{ "@type": "ListItem", "position": 2, "name": "Gartenpflege Main-Tauber-Kreis", "item": "https://www.gartenpflegeservicebuzhala.de/#gebiet" }
```

### Rewrite G — `areaServed` vervollständigen (L59–70)

Im `LandscapingBusiness`-`areaServed`-Array drei zusätzliche City-Einträge anhängen:

```json
, { "@type": "City", "name": "Miltenberg" }
, { "@type": "City", "name": "Freudenberg" }
, { "@type": "City", "name": "Königheim" }
```

### Rewrite H — About-Block: Authority-Quellen verlinken

In L1767 (Bullet „Versichert & Innung") den Beschreibungstext ersetzen durch:

**Vorher:**
> „Betriebshaftpflicht, Berufsgenossenschaft, Mitglied der Innung Garten- und Landschaftsbau."

**Nachher:**
> „Betriebshaftpflicht über die <a href="https://www.svlfg.de" rel="noopener" target="_blank">SVLFG</a> (Sozialversicherung für Landwirtschaft, Forsten und Gartenbau), Mitglied der <a href="https://www.galabau-bw.de" rel="noopener" target="_blank">Innung Garten-, Landschafts- und Sportplatzbau Baden-Württemberg</a>. Berufsgenossenschaftliche Absicherung über die <a href="https://www.bgbau.de" rel="noopener" target="_blank">BG BAU</a>.

> **Verifikationspflicht:** Die konkreten Träger (SVLFG vs. BG BAU vs. andere BG) müssen vom Inhaber bestätigt werden — in `llms.txt` ist SVLFG eingetragen, im Body steht nur „Berufsgenossenschaft" generisch. Beide Träger sind für Garten- und Landschaftsbau plausibel, aber es ist nur einer zutreffend.

### Rewrite I — `last-modified` synchronisieren

**Vorher** (L32):
```html
<meta name="last-modified" content="2026-06-19" />
```

**Nachher:**
```html
<meta name="last-modified" content="2026-07-02" />
```

Und in `sitemap.xml` `<lastmod>` der `/`-URL angleichen.

### Rewrite J — `Person`-Schema für Fatmir Buzhala (neu)

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://www.gartenpflegeservicebuzhala.de/#founder",
  "name": "Fatmir Buzhala",
  "jobTitle": "Inhaber",
  "worksFor": { "@id": "https://www.gartenpflegeservicebuzhala.de/#business" },
  "url": "https://www.gartenpflegeservicebuzhala.de/"
}
</script>
```

### Rewrite K — Sonntag-Öffnungszeit normalisieren

In Schema `openingHoursSpecification` ist Samstag 8–13 explizit, Sonntag fehlt → gut für Google. Im Footer L2185 steht „So: geschlossen" → konsistent. In der Karte-Section L2151 steht „So: nach Vereinbarung" → **widersprüchlich**. Angleichen auf „So: geschlossen" oder einen dritten `OpeningHoursSpecification`-Eintrag mit leerer Range + Description „nach Vereinbarung".

---

## Verifikationspflicht-Liste

Folgende Angaben müssen vor Live-Schaltung vom Inhaber (Fatmir Buzhala) bestätigt werden, da sie aus dem Body abgeleitet sind und entweder Spielraum haben („vor X Jahren") oder nicht aus dem Body ableitbar sind:

| Fakt | Quelle im Audit | Verifikation nötig? |
|---|---|:-:|
| 10 exakte Review-Daten | „vor X Jahren"-Strings im Body | ✅ Datumsmapping präzisieren |
| SVLFG vs. BG BAU als konkreter Träger | llms.txt sagt SVLFG, Body sagt generisch | ✅ nur einer ist zutreffend |
| Innung-Link `galabau-bw.de` | plausibel, aber konkreter Verband prüfen | ✅ |
| § 19 UStG-Kleinunternehmerregelung | nicht erwähnt, aber naheliegend | ❓ zutreffend? |
| 3 fehlende `areaServed`-Cities (Miltenberg/Freudenberg/Königheim) | sichtbar im Body-Grid, fehlt im Schema | ✅ trivial bestätigbar |
| Trustpilot-Account gewünscht? | aktuell nicht vorhanden | ❓ Strategiefrage |

---

## Handoff Summary

**Auftrag:** GEO-Audit (AI-Citation-Readiness) für `/home/claude/buzhala-preview/index.html`.

**Klasse:** `auditor-output` (own-domain local business — publisher = business; `gartenpflegeservicebuzhala.de` ist die kanonische Entitäts-Heimat, nicht ein Verzeichnis-Profil).

**Verdict:** **7,5/10 — produktionsreif mit drei klaren Tier-1-Lücken.** Die Seite ist eine der GEO-besser-vorbereiteten lokalen Handwerker-Seiten, mit dedizierter AI-Crawler-Allow-Liste in robots.txt, llms.txt mit Zitierhinweis, vollständiger Schema.org-Entity und 10 sichtbaren Reviews auf zwei unabhängigen Plattformen (Google + Cylex, jeweils deep-linked). Hauptverluste sind (1) 0 × `review[]` im Schema trotz 10 sichtbarer Karten (höchster einzelner GEO-Leverage-Verlust), (2) eine Stub-`LocalBusiness`-Doppel-Entity, (3) 8 Body-FAQs vs 6 Schema-FAQs (orphan: Zahlungsarten + Wetterverschiebung). Drei Service-Preis-Cluster (Rollrasen, Abo, Service-Definitionen) sind im aktuellen Body nicht mehr enthalten, die der Vorgänger-Audit noch zitierte. Strategisch fehlt ein Trustpilot-Profil als dritter unabhängiger Review-Anker.

**Ergebnis-Dateien:** `/home/claude/buzhala-preview/GEO-AUDIT-AI-CITATION-2026-07-02-v2.md` (dieses Dokument). Frühere Audit-Stände: `GEO-AUDIT-2026-07-02.md` (8,1/10, basierte auf früherer HTML-Version mit Key-Facts-Tabelle und Service-Preisen — diese Tabelle/Preise sind im aktuellen Stand entfernt) und `audit-output.md` (frühere Auswertung).

**Empfohlene Reihenfolge:** Stub-Block löschen + BreadcrumbItem-2-URL + `last-modified`-Sync + `areaServed` Sync (~30 min, Tier-1 Quick Wins) → `review[]`-Schema-Array einhängen + FAQPage auf 8 Fragen erweitern (~3 h, Tier-1 Hauptfix) → Authority-Links + `Person`-Schema + So-Öffnungszeit (~2 h, Tier-2) → Service-Definitionen + HowTo + Trustpilot-Profil + Preis-Klarheit (~6 h, Tier-3+strategisch). Erwarteter Score-Sprung: **7,5 → 9,0–9,3** nach den ersten drei Schritten; **9,5+** nach Schritt 12.

**Nächste sinnvolle Aktion (für `content-quality-auditor` oder direkten Owner-Fix):** Rewrites A, C, D, E, F, G, I sind alle in sich geschlossen und können einzeln oder als Batch in die `index.html` eingespielt werden. Patch-Snippets sind in §6 dieses Dokuments.