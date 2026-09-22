/* ============================================================
   Gartenpflege Buzhala · Click-Stats Frontend-Tracker
   ----------------------------------------------------------
   Sendet einen anonymen Click-Event pro Klick auf die drei
   mobilen Sticky-Buttons (Festnetz/Mobil/WhatsApp) an den
   buzhala-stats Worker. KEIN Cookie, KEIN LocalStorage,
   KEIN User-Identifier. Failt silent — blockiert niemals
   den eigentlichen Klick-Flow (tel:/wa.me-Navigation).

   Reload nach Deploy: Browser-Cache leeren oder ?v=2 bumpen.
   ============================================================ */
(function () {
  'use strict';

  var ENDPOINT = 'https://buzhala-stats.workers.dev/count';
  var BUTTON_CLASSES = ['smfest', 'smcall', 'smwa'];

  function getButtonId(anchor) {
    for (var i = 0; i < BUTTON_CLASSES.length; i++) {
      if (anchor.classList.contains(BUTTON_CLASSES[i])) return BUTTON_CLASSES[i];
    }
    return null;
  }

  function send(buttonId) {
    try {
      var payload = JSON.stringify({ button: buttonId });
      var blob = new Blob([payload], { type: 'application/json' });

      // Prefer sendBeacon (fire-and-forget, survives navigation)
      if (navigator.sendBeacon) {
        var ok = navigator.sendBeacon(ENDPOINT, blob);
        if (ok) return;
        // sendBeacon returns false if browser rejects (e.g. payload too large
        // or quota) — fall through to fetch keepalive.
      }

      // Fallback: fetch with keepalive
      if (typeof fetch === 'function') {
        fetch(ENDPOINT, {
          method: 'POST',
          body: payload,
          headers: { 'Content-Type': 'application/json' },
          keepalive: true,
          mode: 'cors',
        }).catch(function () { /* swallow */ });
      }
    } catch (e) {
      // Tracking darf nie den User-Flow stören
    }
  }

  function handle(event) {
    var anchor = event.target.closest && event.target.closest('a');
    if (!anchor) return;
    var buttonId = getButtonId(anchor);
    if (!buttonId) return;
    send(buttonId);
    // default action (tel:, wa.me, etc.) läuft weiter — kein preventDefault
  }

  // Event-Delegation am document, robust gegen späte Header-Mounts
  // durch partials.js (das Script läuft mit defer NACH partials.js).
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      document.addEventListener('click', handle, { passive: true });
    });
  } else {
    document.addEventListener('click', handle, { passive: true });
  }
})();
