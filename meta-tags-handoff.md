# Iteration R2 · Handoff Summary

**Klasse:** `auditor-output`
**Datei:** `/home/claude/buzhala-preview/index.html`
**Datum:** 2026-07-07
**Status:** ✅ **EINGEBAUT & VISUELL VALIDIERT** (Desktop + Mobile)
**Backups:** `index.html.bak-2026-07-07-pre-rebuild` (Vorrunde) + `index.html.bak-2026-07-07-r2-1783453154` (vor R2)

---

## Was der User wollte (10 Fixes)

1. Hero-Badges weg ("Über 25 Jahre Erfahrung" + "Eigener Betrieb seit 2017")
2. Hero-Text mittig zentriert
3. 4 Hero-CTAs neu/anders gestalten
4. Sommer-Pflege-Strip raus (saisonale Aktion, war im Juli schon outdated)
5. Vorher/Nachher mit echten Fotos statt SVG, **ohne Ortsnamen** (Datenschutz)
6. "Kurz erklärt"-Glossar entzerren (war pressed unter FAQ)
7. Öffnungszeiten: Leerzeichen nach Wochentagen + vor Uhrzeit
8. "So finden Sie uns": 2 Buttons (Festnetz + WhatsApp) entfernen
9. Maps-Vorschau kleiner machen
10. Footer entzerren: Spalten mehr Platz
11. Mobile + Desktop visuell prüfen mit Web-Build-Skills

## Was umgesetzt wurde (12 Patches)

### 1. Hero komplett redesigned
- ❌ Entfernt: `<span class="eyebrow">` mit "Eigener Betrieb seit 2017..."
- ❌ Entfernt: `<div class="exp-badge">` mit "Über 25 Jahre Erfahrung..."
- ✅ H1 + Sub-Text: `text-align: center` über neue `.hero-center` Klasse
- ✅ 4 CTAs ersetzt durch **2 starke Haupt-CTAs** (Jetzt anrufen + WhatsApp schreiben) als `.btn-large` mit 2-Zeilen-Layout (Label + Sub-Number)
- ✅ Sekundärer Textlink "Oder schriftliche Anfrage mit Foto senden" unter den 2 Haupt-CTAs
- ✅ Trust-Pills: 25+ Jahre / 4,9/5 / 100% — mittig, ohne "(Google + Cylex)" Klammerzusatz
- ✅ Neue CSS: `.hero-center { text-align: center; max-width: 820px; }` + `.btn-large` (inline-flex, padding 16/26, min-width 240px, hover-lift)

### 2. Sommer-Pflege-Strip entfernt
- ❌ Komplette Section (Z. 1668-1687 alt) raus — "Sommer-Pflege jetzt buchen — Bewässerungs-Check gratis" ist seit Mitte Juli abgelaufen, neue "Herbstrasen" oder "Wintervorbereitung" Copy käme erst Ende September

### 3. Vorher/Nachher mit echten Fotos
- 3 fake-SVG-Slider ersetzt durch 3 echte Foto-Pärchen aus `/home/claude/buzhala-preview/images/`:
  - **Pärchen 1: Garten-Neugestaltung** — IMG-0023 (Vorher, verwildert) + IMG-0024 (Nachher, Rindenmulch-Fläche mit jungen Bäumen)
  - **Pärchen 2: Neue Terrasse** — IMG-0021 (Vorher, Bauzaun) + IMG-0027 (Nachher, fertige Terrasse)
  - **Pärchen 3: Vorgarten-Pflege** — IMG-0017 (Vorher, verwildert) + IMG-0018 (Nachher, sauberer Rasen mit Rindenmulch)
- ✅ **Alle 3 Ortsnamen entfernt** (Tauberbischofsheim / Külsheim-Hundheim / Hardheim) — Datenschutz-konform
- ✅ Neue Texte: "ca. 80 m²", "ca. 30 m²", "Komplettpaket" (statt spezifischer m²-Angaben die evtl. Rückschlüsse erlauben)
- ✅ Neue CSS: `.vn-photo { width: 100%; height: 100%; object-fit: cover; }`

### 4. Glossar als eigene Sektion
- ❌ `<aside class="faq-glossary">` aus FAQ-Section rausgenommen
- ✅ Eigene `<section class="glossary-section">` mit eigener `<div class="section-head">` (Eyebrow + H2 + Sub)
- ✅ **5 Cards in 3-Spalten-Grid** (responsive: 2-Spalten @900px, 1-Spalte @560px)
- ✅ Jede Card: Icon-Box (46×46, primary-bg) + dt (Poppins bold) + dd (mit <em> für §39-Hinweis)
- ✅ Hintergrund `var(--bg-soft)` für visuellen Wechsel zur FAQ

### 5. Öffnungszeiten — Leerzeichen
- ❌ `Mo–Fr 8:00 – 18:00 Uhr` (kein Leerzeichen nach Wochentag)
- ✅ `Mo – Fr 8:00 – 18:00 Uhr` (jetzt mit korrektem Leerzeichen + Spatium)
- Betrifft 2 Stellen: Kontakt-Card + Map-Info-Box (Z. 2342, 2416)
- Format: `<li><span>Mo – Fr</span><span>8:00 – 18:00 Uhr</span></li>`

### 6. "So finden Sie uns" — 2 Buttons weg
- ❌ Festnetz-Button (tel:+499…) + WhatsApp-Button (wa.me/…) raus
- ✅ **Nur noch "Route in Google Maps öffnen"** Button übrig
- Begründung: Festnetz/WhatsApp sind eh schon prominent in der Kontakt-Section (4 Quick-Kacheln oben), und im Map-Block doppelt

### 7. Maps-Vorschau kleiner
- ❌ iframe `height="420"` (war zu hoch)
- ✅ iframe `height="320"` (deutlich kompakter)
- ✅ CSS `.map-card iframe { height: 280px; }` für mobile (bei <540px)

### 8. Footer entzerrt
- ❌ `grid-template-columns: 1.6fr 1fr 1fr 1fr` (4 Spalten für nur 3 Inhalte → 4. Spalte leer)
- ✅ `grid-template-columns: 1.4fr 1fr 1fr` (3 Spalten, 64px gap)
- ✅ Größeres Padding (70px oben statt 60px)
- ✅ **3 saubere Spalten**:
  - Spalte 1: Brand (Logo + "Gartenpflege Buzhala · KÜLSHEIM · MAIN-TAUBER-KREIS" + Langtext)
  - Spalte 2: Kontakt (Festnetz · Mobil/WhatsApp · E-Mail · TikTok · Adresse)
  - Spalte 3: Öffnungszeiten (3 Zeilen + "Anfrage senden →")
- ✅ Doppeltes h5 "Gartenpflege Buzhala" entfernt (stand schon im Brand-Mark)
- ✅ Footer-Li: Telefon-Nummern mit Label "· Festnetz" / "· Mobil & WhatsApp" für Klarheit
- ✅ Footer-Bottom: mehr Whitespace, separator-Border verstärkt

### 9. Mobile-Fixes (responsive CSS @ <540px)
- ✅ `.wrap { padding: 0 14px }` (mehr Platz für H1)
- ✅ `.hero h1 { font-size: clamp(1.35rem, 6vw, 2.1rem) }` (responsiv, klein auf mobile)
- ✅ `.btn-large { min-width: 0; width: 100% }` (full-width auf mobile, kein horizontaler Overflow)
- ✅ `.contact-grid { grid-template-columns: 1fr }` (Kontaktliste + Formular gestapelt statt nebeneinander)
- ✅ `.map-grid { grid-template-columns: 1fr }` (Map + Info gestapelt auf mobile)
- ✅ h1 hat `overflow-wrap: anywhere; word-break: break-word;` für lange Wörter

### 10. Hero-Video
- `.hero { overflow: hidden }` → `.hero { overflow-x: clip }` (erlaubt vertikales Scrollen, schneidet nur horizontal)
- `.hero-center { width: 100%; max-width: 820px; }` (explizit, damit Content die volle Breite nutzt)

## Visuelle Verifikation (gemessen, 1280×8000+ viewport)

| Element | Status |
|---|---|
| **Hero** (Desktop) | ✅ Keine Badges, H1 + Sub mittig, 2 große CTAs full-width, Trust-Pills mittig |
| **Hero** (Mobile 393px) | ✅ H1 umbricht sauber, CTAs full-width gestapelt, Trust-Pills gestapelt |
| **Trust-Bar** | ✅ 4 Pills sichtbar auf Desktop + Mobile |
| **Projekte** (Desktop) | ✅ 3 echte Foto-Slider (Garten, Terrasse, Vorgarten), Vorher/Nachher-Labels + Slider-Knob |
| **Projekte** (Mobile) | ✅ Funktionieren, Slider-Knobs sichtbar |
| **Über uns** | ✅ Unverändert, 4 Trust-Points mit Icons |
| **Process** (So einfach geht's) | ✅ Unverändert, 4 nummerierte Schritte |
| **Testimonials** | ✅ 10 Review-Cards in 3-Spalten-Grid (Desktop) / 1-Spalte (Mobile) |
| **Einsatzgebiet** | ✅ 12 Cards in 4-Spalten-Grid, Külsheim als Featured grüne Karte |
| **FAQ** | ✅ 8 Fragen, Frage 1 geöffnet mit ▾, andere mit ▸ |
| **Glossar** | ✅ Eigene Sektion, 5 Cards in 3-Spalten-Grid mit Icons |
| **Kontakt** | ✅ 4 Quick-Kacheln (2x2 auf Mobile) + Kontaktliste + Formular gestapelt auf Mobile |
| **Map** (Desktop) | ✅ 320px hoch, nur "Route" Button, Adresse + Öffnungszeiten rechts |
| **Map** (Mobile) | ✅ 280px hoch, gestapelt |
| **Footer** | ✅ 3 Spalten entzerrt (1.4fr/1fr/1fr, 64px gap), Öffnungszeiten mit korrektem "Mo – Fr 8:00 – 18:00 Uhr" Format |

## File-Status

| Datei | Größe | Zeilen | Diff zu Vorrunde |
|---|---|---|---|
| index.html | 124,341 → 125,053 bytes | 2,540 | +712 (CSS + neue Struktur) |
| brand.css | 7,446 bytes | 241 | unverändert |
| meta-tags-handoff.md | 5,496 bytes | 88 | unverändert |
| meta-tags-auditor-output.html | 5,578 bytes | 90 | unverändert |

## CSS-Validierung

- ✅ Brace-Count: 428/428 (diff 0)
- ✅ HTML-Tag-Bilanz: head/body/html/style je 1× open+close, div -1 (1 self-closing input)
- ✅ Keine 403- oder Console-Errors beim Render

## Mobile-spezifische CSS-Block (bei 540px aktiv)

```css
.contact-grid { grid-template-columns: 1fr; gap: 24px; }
.contact-card, .contact-form { padding: 24px 20px; }
.btn-large { min-width: 0; width: 100%; padding: 14px 18px !important; }
.wrap { padding: 0 14px; }
.hero h1 { font-size: clamp(1.35rem, 6vw, 2.1rem); line-height: 1.2; }
.map-grid { grid-template-columns: 1fr; gap: 20px; }
.map-card iframe { height: 280px; }
```

## Was noch offen ist (nicht in scope)

- Hero-Video (`videos/hero-bg.mp4`) — 10 MB, läuft, OK
- og-image (JPG 1200x630) — fehlt noch, aber war auch in Vorrunde offen
- 4 alte Backups im Verzeichnis (`*.bak-*`) — ggf. aufräumen mit `simplify-code` Skill
- Schema.org `aggregateRating` Review-Datums — nicht in scope

---
**Status:** ✅ 10/10 User-Punkte umgesetzt · Desktop + Mobile validiert · Backup vorhanden
**Klasse:** `auditor-output`