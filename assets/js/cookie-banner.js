/* ============================================================
   Gartenpflege Buzhala · Cookie-Banner + Settings-Modal
   Wird auf allen Seiten per <script defer> geladen.
   Injiziert das Banner-HTML einmal in den Body (oder nutzt
   vorhandenes Markup, falls schon im DOM), verdrahtet die
   Buttons und öffnet das Modal bei Klick auf den Footer-Link
   "#openCookieSettings".
   ============================================================ */
(function(){
  'use strict';

  var KEY = 'buzhala_cookie_consent_v1';

  var HTML = [
    '<div id="cookie-banner" class="cookie-banner" role="dialog" aria-live="polite" aria-label="Cookie-Einstellungen" hidden>',
    '  <div class="cookie-inner">',
    '    <div class="cookie-text">',
    '      <strong>🍪 Cookies &amp; Datenschutz</strong>',
    '      <p>Diese Website verwendet Cookies und vergleichbare Technologien. <strong>Notwendige</strong> Cookies sind für den Betrieb erforderlich. <strong>Statistik</strong> hilft uns, die Seite zu verbessern. Details in der <a href="cookies.html">Cookie-Erklärung</a> und <a href="datenschutz.html">Datenschutzerklärung</a>. <button type="button" class="cookie-info-btn" aria-label="Was bedeutet Statistik-Cookie?">ⓘ</button></p>',
    '    </div>',
    '    <div class="cookie-actions">',
    '      <button type="button" class="btn btn-secondary-outline cookie-btn" data-cookie="necessary">Ablehnen</button>',
    '      <button type="button" class="btn btn-secondary-outline" data-cookie="settings">Einstellungen</button>',
    '      <button type="button" class="btn btn-primary cookie-btn" data-cookie="all">Alle akzeptieren</button>',
    '    </div>',
    '  </div>',
    '</div>',
    '',
    '<div id="cookie-settings-modal" class="cookie-settings-modal" role="dialog" aria-modal="true" aria-label="Cookie-Einstellungen" hidden>',
    '  <div class="cookie-settings-card">',
    '    <h3>Cookie-Einstellungen</h3>',
    '    <p class="muted">Wählen Sie, welche Cookies Sie zulassen möchten. Sie können diese Auswahl jederzeit über den Link im Footer ändern. Volle Details finden Sie in unserer <a href="cookies.html">Cookie-Richtlinie</a>.</p>',
    '    <div class="cookie-category required">',
    '      <div class="cat-meta"><strong>Notwendig</strong><span>immer aktiv</span></div>',
    '      <p>Erforderlich für Grundfunktionen wie Seitennavigation und Zugriff auf sichere Bereiche. Ohne diese Cookies kann die Website nicht richtig funktionieren.</p>',
    '    </div>',
    '    <div class="cookie-category">',
    '      <label class="cookie-toggle">',
    '        <input type="checkbox" id="cookie-statistics" />',
    '        <span class="slider"></span>',
    '      </label>',
    '      <div class="cat-meta"><strong>Statistik</strong><span>Anonymisiert</span></div>',
    '      <p>Hilft uns zu verstehen, wie Besucher mit der Website interagieren, durch anonyme Erfassung und Berichterstattung von Daten (z. B. welche Seiten häufig besucht werden).</p>',
    '    </div>',
    '    <div class="cookie-settings-actions">',
    '      <button type="button" class="btn btn-secondary-outline" data-cookie-save>Speichern</button>',
    '      <button type="button" class="btn btn-primary" data-cookie-all>Alle akzeptieren</button>',
    '    </div>',
    '  </div>',
    '</div>'
  ].join('\n');

  // Banner+Modal injizieren, falls noch nicht im DOM (z. B. auf den Subpages).
  if (!document.getElementById('cookie-banner')) {
    document.body.insertAdjacentHTML('beforeend', HTML);
  }

  var banner = document.getElementById('cookie-banner');
  var modal  = document.getElementById('cookie-settings-modal');
  var statBox = document.getElementById('cookie-statistics');
  if (!banner || !modal) return;

  function getConsent() {
    try { return JSON.parse(localStorage.getItem(KEY) || 'null'); }
    catch (e) { return null; }
  }
  function setConsent(c) {
    try {
      localStorage.setItem(KEY, JSON.stringify(Object.assign({ ts: Date.now() }, c)));
      document.body.classList.remove('has-cookie-banner');
      banner.hidden = true;
    } catch (e) {}
  }
  function showBanner() {
    document.body.classList.add('has-cookie-banner');
    banner.hidden = false;
  }
  function showModal() {
    modal.hidden = false;
    var c = getConsent();
    if (c && statBox) statBox.checked = !!c.statistics;
  }
  function hideModal() { modal.hidden = true; }

  var existing = getConsent();
  if (!existing) {
    showBanner();
  } else {
    document.body.classList.remove('has-cookie-banner');
  }

  // Verdrahtung der Banner-Buttons (Ablehnen / Einstellungen / Alle akzeptieren).
  banner.addEventListener('click', function (e) {
    var t = e.target.closest('[data-cookie]');
    if (!t) return;
    var v = t.getAttribute('data-cookie');
    if (v === 'necessary') setConsent({ necessary: true, statistics: false });
    else if (v === 'all') setConsent({ necessary: true, statistics: true });
    else if (v === 'settings') showModal();
  });

  // Verdrahtung der Modal-Aktionen (Speichern / Alle akzeptieren / Backdrop-Klick).
  modal.addEventListener('click', function (e) {
    if (e.target === modal) hideModal();
    var t = e.target.closest('[data-cookie-save]');
    if (t) {
      setConsent({ necessary: true, statistics: !!(statBox && statBox.checked) });
      hideModal();
    }
    t = e.target.closest('[data-cookie-all]');
    if (t) {
      setConsent({ necessary: true, statistics: true });
      hideModal();
    }
  });

  // Footer-Link "Cookie-Einstellungen" öffnet das Modal.
  var footerLink = document.getElementById('openCookieSettings');
  if (footerLink) {
    footerLink.addEventListener('click', function (e) {
      e.preventDefault();
      showModal();
    });
  }

  // Kompatibilitäts-Hook für bestehende inline-Trigger (z. B. CustomEvents).
  window.addEventListener('buzhala:open-cookie-settings', showModal);
})();
