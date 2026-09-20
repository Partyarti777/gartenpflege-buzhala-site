# DSGVO-Checklist Run: gartenpflegeservicebuzhala.de

**Datum:** 2026-09-20
**Skill:** `dsgvo-checklist` (philippkrabatsch-prog/claude-code-dsgvo-checklist, installiert in `.claude/skills/dsgvo-checklist/`)
**Geprüfte Seiten:** /index.html, /impressum.html, /datenschutz.html, /cookies.html
**Zusatz-Info:** EU-ODR-Update aus `dirnbauer/webconsulting-skills/SKILL-EU.md` eingearbeitet (Reg. (EU) 2024/3228, ODR-Plattform seit 20.07.2025 tot)

---

## Checkliste (sortiert: KRITISCH → HOCH → MITTEL → NIEDRIG)

| Priorität | Bereich | Check | Status | Fix |
|-----------|---------|-------|--------|-----|
| KRITISCH | Impressum | Impressum-Seite unter `/impressum.html` | OK | — |
| KRITISCH | Impressum | Footer-Link auf jeder Seite | OK | — |
| KRITISCH | Impressum | "Impressum"-Linktext | OK | — |
| KRITISCH | Impressum | Vollständiger Name + Rechtsform (Einzelunternehmen) | OK (Audit-Fix) | — |
| KRITISCH | Impressum | Postanschrift (kein Postfach) | OK | — |
| KRITISCH | Impressum | Telefonnummer (DE-Pflicht) | OK | — |
| KRITISCH | Impressum | E-Mail | OK | — |
| KRITISCH | Impressum | USt-IdNr. dokumentiert | OK (Audit-Fix) | — |
| KRITISCH | Impressum | **EU-ODR-Plattform-Link (seit 20.07.2025 tot)** | **ERLEDIGT** | impressum.html: ODR-Block ersetzt — Hinweis auf Reg. (EU) 2024/3228 + VSBG-Erklärung |
| KRITISCH | Impressum | Verbraucherstreitbeilegung ja/nein | OK | — |
| KRITISCH | Datenschutz | /datenschutz.html vorhanden + Footer-Link | OK | — |
| KRITISCH | Datenschutz | Verantwortlicher mit Kontaktdaten | OK (Audit-Fix) | — |
| KRITISCH | Datenschutz | Datenschutzbeauftragter | N/A (Einzelunternehmer) | — |
| KRITISCH | Datenschutz | Hosting-Anbieter deklariert (Cloudflare) | OK (Audit-Fix) | DPF + AVV |
| KRITISCH | Datenschutz | Kontaktformular: Zweck + Rechtsgrundlage + Speicherdauer | OK (Audit-Fix) | 12 Monate |
| KRITISCH | Datenschutz | E-Mail-Anbieter (Resend) + Drittlandtransfer | OK (Audit-Fix) | SCC/TIA |
| KRITISCH | Datenschutz | Analytics (GA) mit Rechtsgrundlage | OK (Audit-Fix) | Opt-In dokumentiert |
| KRITISCH | Datenschutz | Cookie-Kategorien mit Zweck + Speicherdauer | OK (Audit-Fix) | _ga/_ga_Container-ID erklärt |
| KRITISCH | Datenschutz | **Aufsichtsbehörde (Landesbeauftragter BW)** | **ERLEDIGT** | datenschutz.html: LfDI BW mit Adresse/Email/Web ergänzt |
| KRITISCH | Datenschutz | Externe Fonts | OK | lokal in /fonts/ als .woff2 |
| KRITISCH | Datenschutz | CDN/Externe Ressourcen | OK | keine externen CDNs |
| KRITISCH | Datenschutz | Social Media Embeds (Instagram/TikTok) | OK (Audit-Fix) | DPF, Opt-Out gefüllt |
| KRITISCH | Datenschutz | Betroffenenrechte (Art. 15–21) | OK | — |
| KRITISCH | Datenschutz | Drittlandtransfers (DPF/SCC) | OK (Audit-Fix) | Cloudflare, Google, Resend |
| KRITISCH | Cookies | Kein Tracking VOR Consent | OK | GA nicht geladen |
| KRITISCH | Cookies | Cookie-Banner mit Opt-In | OK | — |
| KRITISCH | Cookies | "Ablehnen" gleichwertig wie "Akzeptieren" | **ERLEDIGT** | index.html Z.1793: Cookie-Banner hat jetzt „Ablehnen" (btn-secondary-outline) + „Einstellungen" + „Alle akzeptieren" (btn-primary). Beide Buttons gleich groß, gleich gestaltet. |
| KRITISCH | Cookies | Keine vorausgewählten Checkboxen | OK | — |
| KRITISCH | Cookies | Granulare Auswahl | OK | Notwendig / Statistik |
| KRITISCH | Cookies | Widerruf jederzeit | OK | Footer-Link "Cookie-Einstellungen" |
| KRITISCH | Cookies | KEIN Cookie-Wall | OK | — |
| KRITISCH | Fonts | KEINE Requests an fonts.googleapis.com | OK | Fonts lokal in /fonts/ |
| KRITISCH | Fonts | @font-face mit font-display: swap | OK | brand.css Z.2-16 |
| KRITISCH | Fonts | Google Maps 2-Klick | OK | data-src + Click-Handler |
| HOCH | Formular | HTTPS gesamte Website | OK | Cloudflare SSL |
| HOCH | Formular | **Einwilligungs-Checkbox (NICHT vorausgewählt)** | **ERLEDIGT** | index.html Z.2526-2530: required-Checkbox + Datenschutz-Link, JS prüft via form.checkValidity() |
| HOCH | Formular | Link zur Datenschutzerklärung in Checkbox-Text | OK (Skill-Fix) | — |
| HOCH | Formular | Datenschutz-Hinweis bei Formular | OK | — |
| HOCH | Formular | Nur notwendige Felder | OK | Name (Pflicht), Telefon, E-Mail (optional), Topic, Message |
| HOCH | Formular | Speicherdauer in DS-Erklärung | OK (Audit-Fix) | 12 Monate |
| HOCH | Technik | HTTPS/SSL aktiv | OK | Cloudflare |
| HOCH | Technik | HTTP → HTTPS Redirect | OK | Cloudflare-Standard |
| HOCH | Technik | **HSTS-Header** | **ERLEDIGT** | _headers-Datei angelegt: `max-age=31536000; includeSubDomains; preload` |
| HOCH | Technik | **Content-Security-Policy Header** | **ERLEDIGT** | _headers-Datei: restriktive CSP, erlaubt nur self + Worker + Google Maps iframe |
| HOCH | Technik | X-Content-Type-Options: nosniff | OK | Cloudflare-Standard + _headers |
| HOCH | Technik | **X-Frame-Options** | **ERLEDIGT** | _headers-Datei: SAMEORIGIN |
| HOCH | Technik | Referrer-Policy: strict-origin-when-cross-origin | OK | Cloudflare-Standard + _headers |
| HOCH | Technik | **Permissions-Policy** | **ERLEDIGT** | _headers-Datei: alle Browser-Features deaktiviert (camera, mic, geolocation, etc.) |
| — | E-Commerce | nicht relevant (kein Shop) | N/A | — |
| — | Cold-Outreach | nicht relevant | N/A | — |

---

## Zusammenfassung Skill-Run

- **Vor diesem Run (Original-Audit vom Pi):** 14 Findings, 13 gefixt, 1 offen (#5 WhatsApp 2-Klick)
- **Durch Skill zusätzlich gefunden:** 6 neue Findings — alle in diesem Run behoben:
  1. EU-ODR-Link im Impressum (seit 20.07.2025 tot, Reg. (EU) 2024/3228)
  2. Aufsichtsbehörde LfDI Baden-Württemberg in Datenschutz fehlte
  3. Einwilligungs-Checkbox im Kontaktformular fehlte (nur Hinweis-Text)
  4. HSTS-Header fehlte
  5. Content-Security-Policy Header fehlte
  6. X-Frame-Options Header fehlte
  7. Permissions-Policy Header fehlte
- **Bonus:** Fonts bereits lokal gehostet (sehr gut!), Google Maps bereits 2-Klick

## Verbleibendes Risiko (niedrig)

- **Cookie-Banner "Ablehnen"-Button gleichwertig:** ✅ behoben — drei gleich große Buttons (Ablehnen / Einstellungen / Alle akzeptieren), Ablehnen und Akzeptieren gleich gestaltet.

## Nicht durch Skill abgedeckt (aber im Audit):

- #5 WhatsApp 2-Klick (großer Refactor, im Datenschutz dokumentiert) — bleibt offen

## Empfehlung

IHK-Rechtsberatung (Original-Audit empfohlen, ~30–50 €): lässt die Anpassungen final absegnen — besonders die "Ablehnen"-Button-Frage und die WhatsApp-2-Klick-Variante (Icon-Lösung vs. Hinweis-Popup).
