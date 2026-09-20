/* 2-Klick-Loesung fuer externe Dienste (WhatsApp, Instagram, TikTok, Google Maps)
   Echte 2-Klick mit <dialog>-Modal statt window.confirm().
   Consent wird in localStorage (buzhala_ext_consent_v1) gespeichert.
*/
(function () {
  'use strict';

  var KEY = 'buzhala_ext_consent_v1';

  var SERVICES = {
    whatsapp: {
      name: 'WhatsApp',
      icon: '💬',
      color: '#25D366',
      text: 'Beim Öffnen werden Gerätedaten (Telefonnummer-Hash, Geräte-ID, ggf. Werbe-ID) an Meta Platforms Ireland Ltd. übertragen — noch bevor Sie eine Nachricht senden. Auf mobilen Geräten öffnet sich WhatsApp direkt als App.',
      cta: 'WhatsApp öffnen'
    },
    instagram: {
      name: 'Instagram',
      icon: '📷',
      color: '#E1306C',
      text: 'Beim Besuch unseres Instagram-Profils werden Daten an Meta Platforms Ireland Ltd. übertragen (IP-Adresse, Browser-Informationen).',
      cta: 'Instagram öffnen'
    },
    tiktok: {
      name: 'TikTok',
      icon: '🎵',
      color: '#000000',
      text: 'Beim Besuch unserer TikTok-Seite werden Daten an TikTok Technology Ltd. übertragen (IP-Adresse, Browser-Informationen).',
      cta: 'TikTok öffnen'
    },
    googlemaps: {
      name: 'Google Maps',
      icon: '📍',
      color: '#4285F4',
      text: 'Beim Öffnen von Google Maps werden Ihre IP-Adresse und ggf. Standortdaten an Google Ireland Ltd. übertragen. Auf Smartphones wird die Google-Maps-App geöffnet.',
      cta: 'Google Maps öffnen'
    },
    cylex: {
      name: 'Cylex',
      icon: '📒',
      color: '#f47b00',
      text: 'Beim Besuch unserer Cylex-Seite werden Daten an Cylex (sector9 GmbH, Bremen) übertragen (IP-Adresse, Browser-Informationen).',
      cta: 'Cylex öffnen'
    }
  };

  function getConsent() {
    try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) { return {}; }
  }
  function setConsent(service) {
    var c = getConsent();
    c[service] = true;
    try { localStorage.setItem(KEY, JSON.stringify(c)); } catch (e) {}
  }

  var modal = null;
  var confirmBtn = null;
  var cancelBtn = null;
  var closeBtn = null;
  var currentSvc = null;
  var currentHref = null;

  function buildModal() {
    if (modal) return modal;
    modal = document.createElement('dialog');
    modal.className = 'ext-2click-modal';
    modal.setAttribute('aria-labelledby', 'ext-2click-title');
    modal.setAttribute('aria-describedby', 'ext-2click-text');
    modal.innerHTML =
      '<button type="button" class="ext-2click-close" aria-label="Schließen">&times;</button>' +
      '<div class="ext-2click-header">' +
        '<span class="ext-2click-icon" aria-hidden="true"></span>' +
        '<h2 id="ext-2click-title"></h2>' +
      '</div>' +
      '<p id="ext-2click-text" class="ext-2click-text"></p>' +
      '<p class="ext-2click-link" aria-hidden="true"></p>' +
      '<div class="ext-2click-actions">' +
        '<button type="button" class="ext-2click-cancel">Abbrechen</button>' +
        '<button type="button" class="ext-2click-confirm"></button>' +
      '</div>';
    document.body.appendChild(modal);
    confirmBtn = modal.querySelector('.ext-2click-confirm');
    cancelBtn = modal.querySelector('.ext-2click-cancel');
    closeBtn = modal.querySelector('.ext-2click-close');

    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', function (e) {
      // Klick auf Backdrop schließt
      if (e.target === modal) closeModal();
    });
    modal.addEventListener('cancel', function (e) {
      // ESC-Taste
      e.preventDefault();
      closeModal();
    });
    confirmBtn.addEventListener('click', function () {
      if (!currentSvc || !currentHref) return;
      setConsent(currentSvc);
      window.open(currentHref, '_blank', 'noopener');
      closeModal();
    });
    return modal;
  }

  function openModal(service, href) {
    var info = SERVICES[service];
    if (!info) return;
    currentSvc = service;
    currentHref = href;
    buildModal();
    var icon = modal.querySelector('.ext-2click-icon');
    icon.textContent = info.icon;
    icon.style.background = info.color;
    modal.querySelector('#ext-2click-title').textContent = info.name + ' öffnen?';
    modal.querySelector('#ext-2click-text').textContent = info.text;
    try { modal.querySelector('.ext-2click-link').textContent = decodeURIComponent(href); }
    catch (e) { modal.querySelector('.ext-2click-link').textContent = href; }
    confirmBtn.textContent = info.cta;
    if (typeof modal.showModal === 'function') {
      modal.showModal();
    } else {
      // Fallback: altes setAttribute('open')
      modal.setAttribute('open', '');
    }
  }

  function closeModal() {
    if (modal && modal.open) {
      if (typeof modal.close === 'function') modal.close();
      else modal.removeAttribute('open');
    }
    currentSvc = null;
    currentHref = null;
  }

  function bind() {
    document.querySelectorAll('a.ext-2click').forEach(function (a) {
      // Verhindere doppelte Bindung
      if (a.__extBound) return;
      a.__extBound = true;
      a.addEventListener('click', function (e) {
        var svc = a.getAttribute('data-service');
        var href = a.getAttribute('data-href') || a.getAttribute('href');
        if (!svc || !href || href === '#') return;
        var consent = getConsent();
        if (consent[svc]) {
          // Bereits zugestimmt
          window.open(href, '_blank', 'noopener');
          return;
        }
        e.preventDefault();
        openModal(svc, href);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bind);
  } else {
    bind();
  }
})();
