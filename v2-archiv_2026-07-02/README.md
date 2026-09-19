# v2-Archiv — Buzhala Layout-Variante 2

Eingemottet am 2026-07-02. War als "zweites Layout" parallel zu v1 aufgesetzt, aber **nicht** durch die 6-Skill-SEO-Polish-Runde (Steps 32-60, Session 2026-06-19) gegangen.

## Warum archiviert, nicht gelöscht?

- Design-Ansätze könnten für v1-Refactor relevant sein (sauberere Hierarchie, weniger H2-Overload, kürzere Ladezeit)
- v2-Designideen evtl. in v1 einbauen (Hybrid-Option aus Frage)

## Warum v2 nicht v1 ist

| Punkt | v1 (live) | v2 (Archiv) |
|---|---|---|
| Größe | 110 KB | 75 KB |
| Sections (H2) | 11 | 5 |
| Key-Facts-Tabelle | ✅ | ❌ |
| Service-Gebiet-Section | ✅ | ❌ |
| Pricing-Section | ✅ | ❌ |
| Story/Inhaber-Section | ✅ ("Wir") | ❌ |
| Vorher/Nachher | ✅ | ✅ |
| FAQ | ausführlich | kürzer |
| WhatsApp-Link | `wa.me/4915734405927` (Mobil) ✅ | `wa.me/499345927534` (Festnetz!) ❌ — Bug |
| Festnetz-tel:-Link | 4× | 5× |
| Mobil-tel:-Link | 5× | 5× |
| 6-Skill-SEO-Patches (Steps 32-60) | ✅ alle drin | ❌ nicht eingearbeitet |
| Sternchen-Bytes-Fix | ✅ | ❌ (unverifiziert) |
| Bewertungs-Box-Größe | ✅ gleich groß | n/a (Boxen fehlen) |
| Canonical dedupliziert | ✅ | n/a |
| Cylex-URL korrekt | ✅ | n/a |

## Kritische Bugs in v2

1. **WhatsApp-Link zeigt aufs Festnetz** — `wa.me/499345927534` ist die Festnetz-Nummer. WhatsApp existiert nur auf der Mobil-Nummer `01573 4405927`. Klick → "Nummer nicht bei WhatsApp" → Bounce. Würde sofort ~30% Mobile-Conversion killen.

## Entscheidung 2026-07-02

User-Anfrage: "Welche findest du besser?" → v1. Grund: konsequenter zu Ende gedacht, alle Patches drin, keine Bugs, mehr Conversion-relevante Sections.

User hat dann auf Frage "Was machen wir mit v2?" nicht geantwortet → pragmatische Entscheidung: archivieren statt löschen, beide Server-Ports (:8001) laufen noch 2 Min weiter bis ich sie stoppe.