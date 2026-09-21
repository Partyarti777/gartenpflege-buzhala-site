# Conversion-Audit — 2026-09-21

**Methode:** `landing-page-conversion-audit` Skill (autonnel, 61.4K installs).
**Inputs:** Page URL, gerenderte Mobile-Screenshot (390x844), index.html-Source.
**Fehlend:** Traffic-Quelle + Ad/Keyword, Sessions/Conversions der letzten 14-30 Tage, Funnel-Drop-off-Daten, Device-Split → quantitative Aussagen unten sind Schätzungen.

## Verdict

Für eine lokale B2C-Service-Site überdurchschnittlich stark: Above-the-fold ist klar, Trust-Signale prominent, 3 Tap-to-Call-Optionen im Sticky-Header, Form sauber. **Aber ein redundanter Submit-Handler zeigte sofort eine Erfolgsmeldung, bevor der echte Worker-Fetch durch war** — visuell irritierend, Daten gingen aber nicht verloren (der zweite Handler sendete korrekt). Dazu zwei strukturelle Lücken (Analytics, Telefon-Validierung), die Messen und Antworten erschweren.

## Findings (priorisiert nach erwartetem Impact)

### 1. 🔴 Dead-Code-Handler zeigte falsche Success-Message
**Status:** ✅ **Gefixt** (Commit heute)
**Element:** `index.html` Zeile 2486-2500 (alter inline-Handler).
**Failure mode:** Ein zweiter Submit-Handler war im DOM geblieben, der beim Klick sofort `submit.textContent = 'Vielen Dank! Wir melden uns noch heute.'` setzte — **bevor** der echte Worker-Fetch (Handler 2 ab Zeile 2585) überhaupt durch war. Datenverlust: nein (Handler 2 sendete korrekt an Resend). UX: irritierend.
**Fix:** Kompletter Block gelöscht.
**Korrektur meiner ursprünglichen Diagnose:** Handler 2 ruft `fetch(WORKER_URL, { method: 'POST', body: formData })` korrekt auf — der Worker schickt via Resend Mails an `gartenpflegebuzhala@gmail.com`. Daten gingen nie verloren, nur die UX war kaputt.

### 2. 🟠 Keine Analytics / Conversion-Tracking
**Status:** ⏸️ **Offen — User-Entscheidung**
**Element:** gesamtes `<head>`.
**Failure mode:** Kein GA4, kein Plausible, kein Matomo, kein Meta-Pixel. Cloudflare zeigt nur Traffic-Totals, aber nicht welcher CTA geklickt wird, wo User abspringen, wie viele Form-Submits tatsächlich ankommen, Anrufe vs. Form.
**Empfehlung:** Plausible Analytics (DSGVO-konform out-of-the-box, kein Cookie-Banner nötig in DE). ~10 Min Aufwand, ~9 €/Monat.

### 3. 🟡 Telefon-Feld war nicht `required`
**Status:** ✅ **Gefixt** (Commit heute)
**Element:** `<input id="phone" name="phone" type="tel">` Zeile 2386.
**Failure mode:** User konnte Form mit nur E-Mail + Topic abschicken. Wenn die E-Mail im Spam landet, kein schneller Kontaktweg. Telefon ist bei lokalen Dienstleistern deutlich zuverlässiger als E-Mail.
**Fix:** `required` Attribut hinzugefügt. E-Mail bleibt optional.
**Hinweis:** Die Worker-Validation (`workers/contact/src/index.js:119`) erlaubt weiterhin `phone ODER email` — wenn jemand per Noscript oder altem Browser durchkommt, schlägt der Worker nicht sofort fehl.

### 4. 🟡 Kein Trust-Signal direkt am Submit-Button
**Status:** ✅ **Gefixt** (Commit heute)
**Element:** `<button id="contact-submit">` Zeile 2417.
**Failure mode:** Button-Text war gut, aber direkt daneben standen keine Sterne / Antwortzeit / DSGVO-Hinweis. Trust-Signale weiter oben im Hero und in Testimonials, aber nicht an der Entscheidungsstelle.
**Fix:** Inline-Pille direkt unter Button: `★★★★★ 4,9/5 · Antwort meist noch heute · DSGVO-konform`.

### 5. 🟢 Preis-Range nicht above-the-fold
**Status:** ❌ **Bewusst weggelassen** (User-Entscheidung)
FAQ nennt "ab ca. 80 €" für eine 25-m-Hecke, im Hero steht nur "Festpreis auf Anfrage". User hat sich gegen Preis-Pille im Hero entschieden.

### 6. 🟢 Sticky-Mobile-Call-Button fehlt
**Status:** ❌ **Nicht nötig** (User-Hinweis)
Header hat bereits 3 Tap-to-Call-Buttons (Festnetz, Mobil, WhatsApp) im Sticky-Bereich — das deckt den Use-Case ab.

### 7. 🟢 Hero-Video auf Mobile frisst Bandwidth
**Status:** ❌ **Bewusst weggelassen** (User-Entscheidung)
`preload="metadata"` ist OK. Auf 3G/4G ~200-500 KB pro Besuch. Optimierung möglich (Connection-Type-Check), aber nicht priorisiert.

## Was schon gut ist (nicht anfassen)

- ✅ Above-the-fold Mobile (390x844): Klar, ein primärer CTA, keine competing actions
- ✅ Sticky-Header mit 3 Tap-to-Call-Optionen
- ✅ Schema.org LocalBusiness + FAQ + Breadcrumb (GEO/AI-optimiert)
- ✅ Trust-Bar mit 4 Pills unter dem Hero
- ✅ Topic-Dropdown im Form (spart Tipparbeit)
- ✅ DSGVO-Consent Pflichtfeld im Form
- ✅ Vorher/Nachher-Slider mit 10 Projekten (Drag-Handle)
- ✅ Click-to-Load Google-Maps (Datenschutz-konform)
- ✅ Sticky-Header mit `scroll-margin-top: 72px` (Smooth-Scroll ohne Overlap)
- ✅ Cache-Control, COOP, CORP via `_headers` (separate Security-Härtung)

## Nächste Schritte (Empfehlung)

1. **Plausible Analytics einrichten** (~10 Min, ~9 €/Monat) — gibt endlich Mess-Daten, um die nächsten Fixes zu priorisieren
2. **Nach 14 Tagen mit Daten:** Drop-off-Analyse auf Mobile, Telefon-vs-Form-Conversion-Rate prüfen
3. **Wenn Conversion-Messung da ist:** Hero-Variante A/B testen (mit/ohne Preis-Pille), Sticky-Call-Button evaluieren
