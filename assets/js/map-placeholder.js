/* 2-Klick-Loesung fuer die eingebettete Google-Maps-Karte.
   Erst nach Klick wird das iframe geladen und damit die Einwilligung erteilt.
*/
(function () {
  'use strict';
  function loadMap(el) {
    var s = el.getAttribute('data-src');
    if (!s) return;
    var f = document.createElement('iframe');
    f.src = s;
    f.width = '100%';
    f.height = '380';
    f.style.border = '0';
    f.setAttribute('allowfullscreen', '');
    f.setAttribute('loading', 'lazy');
    f.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
    f.setAttribute('title', 'Karte: Gartenpflege Buzhala, Külsheim-Hundheim');
    el.parentNode.replaceChild(f, el);
  }
  function bind() {
    document.querySelectorAll('.map-placeholder').forEach(function (el) {
      if (el.__mapBound) return;
      el.__mapBound = true;
      el.addEventListener('click', function () { loadMap(el); });
      el.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); loadMap(el); }
      });
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bind);
  } else {
    bind();
  }
})();
