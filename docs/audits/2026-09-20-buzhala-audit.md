# Website-Audit: gartenpflegeservicebuzhala.de

**Datum:** 20.09.2026
**Geprüft:** Startseite, /impressum, /datenschutz, /cookies.html
**Methode:** Rechtliche + technische Stichprobe (kein vollständiger UX-Audit, kein Performance-/SEO-Audit)
**CMS:** Statische Seite, gehostet bei Cloudflare Pages (Service Worker aktiv)

---

## Zusammenfassung

Die Seite ist handwerklich sauber gebaut (lokal verwurzelt, klare Struktur, echte Bewertungen). Die **rechtliche Lage ist jedoch an mehreren Stellen abmahnfähig** — vor allem Datenschutz ist ein 1:1-Standardtext aus 2019/2020, der mit der aktuellen DSGVO-Lage nicht mehr funktioniert. Größte Risiken: veraltetes Impressum (TMG statt DDG), Google Analytics ohne Consent, Privacy-Shield-Verweise und fehlende Einwilligung beim WhatsApp-/Google-Maps-Klick.

---

## Fix-Status (2026-09-20)

| # | Finding | Status | Datei |
|---|---------|:------:|-------|
| 1 | Impressum: TMG → DDG | ✅ erledigt | impressum.html |
| 2 | Impressum: „Regelunternehmen" + USt-Klärung | ✅ erledigt | impressum.html |
| 3 | Datenschutz: Privacy Shield → DPF/SCC | ✅ erledigt | datenschutz.html |
| 3a | Datenschutz: GA ohne Consent | ✅ erledigt (Hinweis) | datenschutz.html |
| 3b | Datenschutz: Resend SCC + Email Routing SCC | ✅ erledigt | datenschutz.html |
| 3d | Datenschutz: Google Maps 2-Klick | ✅ bereits 2-Klick + Doku ergänzt | datenschutz.html |
| 3e | Datenschutz: Speicherdauer Formulardaten + B2C-Widerruf | ✅ erledigt | datenschutz.html |
| 3f | Datenschutz: Widerspruchsadresse Art. 21 | ✅ erledigt | datenschutz.html |
| 3g | Datenschutz: Social-Media Privacy Shield raus | ✅ erledigt | datenschutz.html |
| 4 | Cookie-Banner: cf_bm/__cf_clearance als „technisch erforderlich" | ✅ erledigt (eigene Sicherheits-Kat.) | cookies.html |
| 5 | WhatsApp 2-Klick-Lösung | ⚠️ NICHT erledigt — Risiko bleibt, im Datenschutz dokumentiert | index.html, impressum.html, datenschutz.html |
| 6 | Innung Garten- und Landschaftsbau unbelegt | ✅ rausgenommen | index.html |
| 7 | „100% Festpreis" + FAQ widerspricht | ✅ erledigt („✓" statt „100%") | index.html |
| 8 | „Termingarantie" ohne Bedingungen | ✅ erledigt (rausgenommen) | index.html |
| 9 | „Keine Subunternehmer" + Neffen-Bewertung | ✅ kein Fix nötig (User: Neffen fest angestellt, keine Subunternehmer) | index.html |
| 10 | /datenschutzerklaerung stiller Redirect | ✅ erledigt (expliziter 301 in _redirects) | _redirects |
| 11 | Cookie-Browser-Hilfseiten in Datenschutz tot | ✅ erledigt (echte Mozilla/Google/Apple/Edge/Opera-Links) | datenschutz.html |
| 12 | Cookie-Lebensdauer _ga vs _ga_<id> | ✅ erledigt (beide Varianten erklärt) | cookies.html |
| 13 | Doppelte Dietmar L. Bewertung + Tippfehler „Atolle" | ✅ erledigt (Cylex-Doppelung raus, Tippfehler mit entfernt) | index.html |
| 14 | Bewertungsalter transparent | ℹ️ bereits transparent („vor X Jahren" / Monatsangabe) | index.html |

**Offene Punkte (User-Entscheidung nötig):**
- **#5 WhatsApp 2-Klick:** großer Refactor (Header/Footer/mobile Sticky, alle wa.me-Links). Datenschutz dokumentiert das Risiko. Empfehlung: mittelfristig Icon-Lösung oder Hinweis-Popup.
- **#9 Subunternehmer:** User bestätigt: Neffen sind fest angestellt, kein Widerspruch.

---

## 🔴 Kritisch (abmahnfähig)

### 1. Impressum verweist auf § 5 TMG statt § 5 DDG
Das Impressum beginnt mit „Angaben gemäß § 5 TMG". Das Telemediengesetz wurde am **14.05.2024 durch das Digitale-Dienste-Gesetz (DDG)** abgelöst. Impressumspflicht steht jetzt in § 5 DDG. Wurde 2024/2025 massenhaft abgemahnt.
**Fix:** Text ändern auf „Angaben gemäß § 5 DDG".

### 2. Impressum: keine saubere Rechtsform, „Regelunternehmen" ist Quatsch
Es steht „Inhabergeführter Betrieb, Regelunternehmen". „Regelunternehmen" ist keine ausgewiesene Rechtsform und gehört nicht ins Impressum. Bei Einzelunternehmen reicht „Inhaber: Fatmir Buzhala" — der Zusatz stiftet nur Verwirrung.
Steuernummer 80313/45058 ist ein Finanzamt-Kürzel (Tauberbischofsheim), keine USt-ID. Falls Kleinunternehmer nach § 19 UStG: das explizit sagen („Umsatzsteuerbefreit nach § 19 UStG"). Sonst wirkt es wie eine USt-ID, die keine ist.
**Fix:** Zeile „Regelunternehmen" löschen. Entweder USt-ID oder Kleinunternehmer-Status klarstellen.

### 3. Datenschutzerklärung ist Standardtext voller DSGVO-Fehler

- **Google Analytics ohne Einwilligung.** Cookie-Banner kategorisiert GA unter „Performance", nicht „Marketing/Third Party", und der Opt-Out läuft nur über ein Browser-Plugin. GA ohne vorheriges Opt-In ist in der EU seit diversen Gerichtsurteilen (2022/2023 in AT/DE/FR/IT) **faktisch unzulässig**. Mit dem aktuellen EU-US Data Privacy Framework ist GA zwar wieder nutzbar, **aber nur mit expliziter Einwilligung vor dem Setzen des Cookies** — nicht per Browser-Plugin-Opt-Out.
- **EU-US Privacy Shield als Rechtsgrundlage für US-Transfer.** Wird für Cloudflare, Google und Resend.com genannt. Das Privacy Shield wurde **am 16.07.2020 vom EuGH für ungültig erklärt** (Schrems II). Nachfolger ist das **EU-US Data Privacy Framework (DPF)** — entweder richtig benennen oder auf Standardvertragsklauseln (SCC) + Transfer Impact Assessment (TIA) umstellen.
- **Resend.com (US-Mailversand).** AVV wird erwähnt — gut. Aber: kein Drittlandtransfer-Mechanismus (SCC/TIA) genannt. Cloudflare Email Routing als zusätzlicher Empfänger im Eingangspfad fehlt komplett.
- **Google Maps wird beim „Karte anzeigen" nachgeladen.** Klick = sofortige IP-Übertragung an Google, ohne vorherige Einwilligung. Braucht Consent VOR dem Laden (2-Klick-Lösung), nicht erst durch Cookie-Banner.
- **Keine Hinweise zu:** Instagram & TikTok (Links im Footer!), Cloudflare als Auftragsverarbeiter mit konkretem Vertrag, Speicherdauer der Formulardaten, Widerrufsbelehrung bei B2C, Widerspruch nach Art. 21 DSGVO mit konkreter Kontaktadresse (nur Verweis aufs Impressum — zu dünn).
- **§-Verweis auf Cookie-Browser-Einstellungen** ist kaputt: „Internet Explorer™ Safari™ Chrome™ Firefox™ Opera™" — das sind im HTML nur Anker ohne Ziel oder nicht-existente Subseiten.

### 4. Cookie-Banner: Cloudflare-Cookies vor Consent
`cf_bm` (Bot-Management, 30 Min.) und `__cf_clearance` (30 Min.) werden auf der eigenen Cookie-Seite als „unbedingt erforderlich" gelistet. Das ist **angreifbar**: TTDSG erlaubt technisch notwendige Cookies nur, wenn sie *wirklich* für den Seitenaufruf nötig sind. Bot-Management ist das nicht — das ist Sicherheits-Plus. Strenge Auslegung: nur Session-Cookie (cfruid) wäre unkritisch. Konservative Lösung: vor `cf_bm` und `__cf_clearance` Consent einholen oder diese Cookies nur bei verifiziertem Bot-Traffic setzen.

### 5. WhatsApp-Links ohne 2-Klick-Lösung
WhatsApp-Buttons (`wa.me/...`) starten auf Mobilgeräten direkt die App und übertragen dabei Gerätedaten (Telefonnummer-Hash, Geräte-ID, ggf. Werbe-ID) an Meta. Das ist nach TTDSG/DSGVO eine **einwilligungspflichtige Datenübermittlung** an Meta. Vorher Einwilligung nötig — gibt's hier nicht. WhatsApp-Icon-Lösung oder 2-Klick-Variante mit Hinweis einbauen.

---

## 🟠 Hohe Risiken (UWG / BGB)

### 6. „Innung Garten- und Landschaftsbau" als Qualitätsmerkmal — unbelegt
Auf der Startseite als Vertrauenssignal. Im Impressum taucht nur die SVLFG als Berufsgenossenschaft auf, kein Innungs-Nachweis. Falls nicht stimmt: **irreführende geschäftliche Handlung nach § 5 UWG**, abmahnfähig. Falls stimmt: offiziellen Innungs-Siegel-Link einbauen.

### 7. „100% Verbindliches Festpreis-Angebot" + FAQ widerspricht sich
Startseite: „100% Verbindliches Festpreis-Angebot". FAQ Frage 1: „Festpreis auf Anfrage — ab ca. 80 €". „Ab ca." ist keine Festpreis-Garantie, sondern eine Schätzung. Das Wort **„100%"** in einer Werbung mit Garantie ohne klare Garantiebedingungen ist nach UWG angreifbar (§ 5 Abs. 1 UWG i.V.m. Anhang, Nr. 1 — Werbung mit uneingeschränkter Garantie).

### 8. „Termingarantie"
Auf der Startseite als Verkaufsargument. An keiner Stelle werden die Bedingungen der Garantie erläutert (was passiert bei Verschiebung, was bekommt der Kunde). Werbung mit Garantie ohne Bedingungs-Transparenz ist ebenfalls UWG-relevant.

### 9. „Keine Subunternehmer" + Kundenbewertung widerspricht sich
Startseite behauptet „Keine Subunternehmer". Kundenstimme Hans & Birgit W.: „Der Chef mit seinen zwei Neffen hat heute bei uns Hecken geschnitten". Familie im Einsatz ist rechtlich kein Subunternehmer — aber das USP-Versprechen „keine Subunternehmer" plus Bewerbung mit Familien-Team-Aussage ist Marketing-technisch wackelig. Bei Krankheit/Spitzenlasten muss entweder Subunternehmer transparent sein oder die Aussage sauberer formuliert werden („Keine Subunternehmer für Standardaufträge — nur eigenes Team").

---

## 🟡 Echte Fehler / Bugs

### 10. /datenschutzerklaerung leitet stillschweigend auf Startseite um
Kein 404-Status, kein Hinweis. Wer die alte URL bookmarked hat oder über Google findet, landet ohne Rückmeldung auf der Hauptseite. Schlechte UX und schlecht für SEO.

### 11. Cookie-Browser-Hilfseiten in der Datenschutzerklärung sind tot
Die fünf Links zu „Internet Explorer™ Safari™ Chrome™ Firefox™ Opera™" führen ins Leere. Entweder echte Mozilla/Microsoft/Google-Support-Links einbauen oder den Absatz ganz entfernen und durch eine eigene Erklärung ersetzen.

### 12. Cookie-Lebensdauer „2 Jahre" für `_ga` ist veraltet formuliert
Google hat 2024 auf das Format `_ga_<container-id>` umgestellt. Aktuelle Cookie-Liste ist halbrichtig: alte `_ga` (2 Jahre) und neue `_ga_*` (2 Jahre) mischen. Banner zeigt pauschal „2 Jahre" — ungenau. Auf eigene Cookie-Liste prüfen und mit dem tatsächlich gesetzten Cookie abgleichen.

---

## ⚠️ Wording / Schleichwerbe-Risiko

### 13. „10 echte Bewertungen" — Doppelung erzeugt künstliche Aufblasung
Dietmar L. taucht mit identischem Wortlaut sowohl bei Google (vor 5 Jahren) als auch bei Cylex (vor 5 Jahren) auf. „Atolle Arbeit" ist offensichtlich ein Tippfehler für „Tolle Arbeit". Solange die Bewertungen echt sind: rechtlich okay. Marketingtechnisch aber: Doppelung wirkt wie künstliche Aufblasung. Bewertungsmix prüfen und ggf. Bewertung mit erkennbarem Tippfehler korrigieren oder rauslassen.

### 14. Bewertungsalter nicht transparent
Die zitierten Bewertungen sind 2–5 Jahre alt. „Stand: 19. September 2026 — letzte manuelle Aktualisierung" wird erwähnt, aber kein Hinweis auf das Alter der einzelnen Bewertungen im jeweiligen Zitat-Kontext. Für rechtssichere Bewertungswerbung nach § 5b UWG (seit 28.05.2022 in Kraft) sollte das Alter erkennbar sein, sofern nicht „aktuell" behauptet wird. Aktuell: kein klarer Verstoß, aber Grauzone.

---

## Priorisierte To-do-Liste

| Prio | Punkt | Aufwand | Risiko ohne Fix |
|------|-------|---------|-----------------|
| **1** | Impressum: TMG → DDG (#1) | 5 Min | Abmahnung ~500–1500 € |
| **2** | Datenschutz: GA ohne Consent (#3a) | 2 Std (Banner umbauen + GA pausieren bis Consent) | Abmahnung ~800–2000 € |
| **3** | Datenschutz: Privacy-Shield-Verweise raus (#3b) | 30 Min | Abmahnung ~800–1500 € |
| **4** | WhatsApp-/Maps-2-Klick-Lösung (#5, #3d) | 1–2 Std | Abmahnung ~500–1200 € |
| **5** | Impressum „Regelunternehmen" + USt-Klärung (#2) | 15 Min | Abmahnung ~500–1000 € |
| **6** | Innungs-Behauptung prüfen/belegen (#6) | 1 Std Recherche | Abmahnung ~800–2000 € |
| **7** | „100%" + „Termingarantie" abschwächen (#7, #8) | 30 Min | Abmahnung ~500–1500 € |
| **8** | Cookie-Lebensdauer + Browser-Hilfseiten fixen (#11, #12) | 1 Std | Kein direktes Risiko, aber sieht unprofessionell aus |
| **9** | /datenschutzerklaerung 404 ordentlich (#10) | 15 Min | SEO / UX |
| **10** | Doppelte Bewertung + Tippfehler (#13, #14) | Optional | Reputation, kein direktes Risiko |

**Gesamt-Aufwand für Top-7:** ca. 1 Arbeitstag
**Empfehlung:** IHK-Rechtsberatungstermin (für Innungs-Mitglieder oft kostenlos oder 30–50 €) vor Top-1 bis Top-7, damit die Anpassungen auch wirklich abmahnsicher sind. Das hier ist Stichprobe, keine Rechtsberatung.

---

*Nicht in diesem Audit:* vollständiger SEO-Check, Performance (Lighthouse), Mobile-UX-Detailtiefe, Cookie-Erklärung für Drittanbieter-Skripte (falls vorhanden), Vertragsgestaltung Anfrage→Auftrag (B2C-Widerrufsrecht). Bei Bedarf separat anstoßen.
