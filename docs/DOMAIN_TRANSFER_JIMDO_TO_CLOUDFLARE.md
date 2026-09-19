# Domain-Transfer: gartenpflegeservicebuzhala.de von Jimdo zu Cloudflare Registrar

**Geschätzter Gesamtaufwand:** 30–45 Min aktiv + 5–7 Tage Wartezeit (Pending-Phase)
**Geschätzte Ersparnis:** ~290 €/Jahr (300 € Jimdo → ~8 € Cloudflare Registrar + 0 € Cloudflare Pages)

---

## Voraussetzungen

- [ ] Admin-Zugang zum Jimdo-Account (E-Mail + Passwort)
- [ ] Cloudflare-Account (kostenlos) — siehe `docs/CLOUDFLARE_SETUP.md`
- [ ] Aktuelle WHOIS-Daten (admin-c) müssen korrekt sein, sonst schickt Denic eine Bestätigungs-Mail

## Ablauf

### 1. Bei Jimdo: Auth-Code (auch „EPP-Code" oder „Transfer-Code") beantragen

1. Jimdo-Login auf https://account.jimdo.com
2. **Einstellungen → Domains → gartenpflegeservicebuzhala.de**
3. Auf „Domain transferieren" oder „Auth-Code anfordern" klicken
4. Auth-/Transfer-Code kommt per E-Mail (kann bis zu 24 h dauern)
5. **Wichtig:** Code sicher speichern — du brauchst ihn nur einmal bei Cloudflare

**Falls Jimdo keinen Button zeigt:** Support kontaktieren (chat.jimdo.com), Transfer-Code anfordern. Antwortzeit meist <24 h.

### 2. Cloudflare: Domain hinzufügen + Transfer starten

1. Login auf https://dash.cloudflare.com
2. **„Add a site" → `gartenpflegeservicebuzhala.de`**
3. Plan: **Free** (reicht für statische Sites locker)
4. Cloudflare scannt vorhandene DNS-Records → **ALLE übernehmen** (besonders wichtig: A-Records für Jimdo-Site, sonst ist die Seite für 24 h weg)
5. Nameserver-Wechsel: Cloudflare zeigt dir 2 Nameserver (`ada.ns.cloudflare.com`, `bob.ns.cloudflare.com` o.ä.) — **die noch NICHT bei Jimdo eintragen**, erst nach dem Transfer

### 3. Transfer-Code einlösen

1. In Cloudflare: **„Registrar Transfer"** (nicht „DNS only")
2. Auth-Code aus Schritt 1 eingeben
3. Kontaktdaten bestätigen (müssen mit WHOIS übereinstimmen)
4. **~8 €/Jahr** (Cloudflare verlangt 1 Jahr Verlängerung als Transfer-Gebühr — .de-Domains werden trotzdem günstiger als bei Jimdo)
5. Bezahlen

### 4. Warten (5–7 Tage)

- Denic schickt **Bestätigungs-Mail an den admin-c der Domain** (deine E-Mail)
- **Link in dieser Mail klicken** — sonst wird der Transfer storniert
- Status in Cloudflare zeigt „Pending" mit voraussichtlichem Abschluss-Datum

### 5. Nameserver umstellen

**ERST NACH erfolgreichem Transfer** (Status: „Active" in Cloudflare):

1. Im Cloudflare-Dashboard: **DNS → Records**
2. Jimdo-Records löschen
3. Neue Records für Cloudflare Pages setzen (CNAME auf `gartenpflege-buzhala.pages.dev`)
4. SSL/TLS auf **Full (strict)** setzen

### 6. Jimdo-Site löschen

**Erst nachdem** die neue Seite 24–48 h stabil lief:
1. Jimdo-Account → Einstellungen → Website löschen
2. Abo kündigen (falls noch nicht automatisch)

---

## Was schiefgehen kann

| Problem | Lösung |
|---|---|
| Auth-Code kommt nicht | Jimdo-Support kontaktieren, alternative: im Account-POST-Eingang nach „Domain transfer" suchen |
| Cloudflare kann Domain nicht hinzufügen | Meist alte DNS-Records blockieren. Jimdo-DNS komplett löschen, dann nochmal versuchen |
| Transfer hängt >7 Tage | Denic-Bestätigungs-Mail nochmal anfordern (Cloudflare-Support macht das) |
| Umlaut/Special-Chars in Kontaktdaten | Vorher auf ASCII umstellen, sonst Denic-Reject |
| Seite ist während Transfer down | DNS vorher spiegeln (Schritt 2.4.) — die Site läuft bis Schritt 5 auf Jimdo weiter |

## Kosten-Vergleich

| | Jimdo (jetzt) | Cloudflare (neu) |
|---|---|---|
| Domain .de/Jahr | inkludiert | ~8 € |
| Hosting/Monat | ~25 € | 0 € (Pages Free-Tier) |
| SSL | inkludiert | 0 € (auto) |
| **Total/Jahr** | **~300 €** | **~8 €** |
| **Ersparnis** | | **~292 €** |
