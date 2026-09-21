# Conversion-Audit — 2026-09-21

**Methode:** `landing-page-conversion-audit` Skill.
**Inputs:** Page URL, Mobile-Screenshot 390x844, index.html-Source.

## TL;DR

- 3 Findings gefixt (Commit a7e77f2): Dead-Handler, Telefon required, Trust-Signal
- 3 Findings bewusst weggelassen: Preis-Pille im Hero, extra Sticky-Button, Hero-Video-Optimierung
- 1 Finding offen: Analytics / Conversion-Tracking
- 1 Korrektur an eigener Diagnose: Daten gingen nie verloren, der echte Worker-Fetch lief die ganze Zeit

## Verdict

Für eine lokale B2C-Service-Site überdurchschnittlich stark. Above-the-fold ist klar, Trust-Signale prominent, 3 Tap-to-Call-Optionen im Sticky-Header, Form sauber. Die einzige echte strukturelle Lücke ist fehlende Conversion-Messung — ohne sie kann nicht priorisiert werden welche der "weicheren" Findings (Preis-Pille, Sticky-Button) tatsächlich was bringen würden.

## Findings

| # | Finding | Status | Impact |
|---|---|---|---|
| 1 | Dead-Code-Submit-Handler zeigte falsche Success-Message | ✅ gefixt (a7e77f2) | UX-Bug |
| 2 | Telefon-Feld nicht required | ✅ gefixt (a7e77f2) | medium |
| 3 | Kein Trust-Signal direkt am Submit-Button | ✅ gefixt (a7e77f2) | medium |
| 4 | Keine Analytics / Conversion-Tracking | ⏸️ offen | hoch |
| 5 | Preis-Range nicht above-the-fold | ❌ bewusst weggelassen | low-medium |
| 6 | Sticky-Mobile-Call-Button fehlt | ❌ nicht nötig (Header hat 3 Tap-to-Call-Buttons) | — |
| 7 | Hero-Video auf Mobile kostet Bandwidth | ❌ bewusst weggelassen | low |

## Offen: Analytics

Kein GA4, Plausible, Matomo, Meta-Pixel. Cloudflare zeigt nur Traffic-Totals, aber nicht welcher CTA geklickt wird, wo User abspringen, wie viele Form-Submits ankommen, Anrufe vs. Form.

**Empfehlung:** Plausible Analytics (DSGVO-konform, kein Cookie-Banner nötig in DE). ~10 Min Setup, ~9 €/Monat. Conversion-Events: `form-submit`, `tel-click`.

## Was schon gut ist (nicht anfassen)

- Above-the-fold Mobile: Klar, ein primärer CTA, keine competing actions
- Sticky-Header mit 3 Tap-to-Call-Optionen (Festnetz, Mobil, WhatsApp)
- Schema.org LocalBusiness + FAQ + Breadcrumb (GEO/AI-optimiert)
- Trust-Bar mit 4 Pills unter dem Hero
- Topic-Dropdown im Form (spart Tipparbeit)
- DSGVO-Consent Pflichtfeld im Form
- Vorher/Nachher-Slider mit 10 Projekten (Drag-Handle)
- Click-to-Load Google-Maps (Datenschutz-konform)
- Cache-Control, COOP, CORP via `_headers`

## Nächste Schritte

1. Plausible Analytics einrichten — sobald Daten fließen, ist datenbasierte Priorisierung der weichen Findings möglich
2. Nach ~14 Tagen Mess-Daten: Drop-off-Analyse auf Mobile, Telefon-vs-Form-Conversion-Rate prüfen
3. Wenn Conversion-Messung da: Hero-Variante A/B testen (mit/ohne Preis-Pille), Sticky-Call-Button evaluieren
