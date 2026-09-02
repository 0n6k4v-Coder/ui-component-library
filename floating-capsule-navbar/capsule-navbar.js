/**
 * Capsule Navbar — reusable, dependency-free component script.
 *
 * - Supports multiple instances on one page (queries by data-attribute,
 *   not id, so nothing collides).
 * - Re-entrant safe: calling CapsuleNavbar.init() again (e.g. after an
 *   AJAX/SPA content swap) skips instances already wired up.
 * - Adds `will-change` only for the duration of the open/close
 *   transition, then releases it — keeps compositing layers cheap.
 * - Escape key and outside click close the panel; clicking a link
 *   inside the expanded canvas closes it too.
 */
(function () {
  'use strict';

  function initOne(root) {
    if (root.dataset.cnbInit === 'true') return;
    root.dataset.cnbInit = 'true';

    var toggle = root.querySelector('[data-capsule-navbar-toggle]');
    var panel  = root.querySelector('[data-capsule-navbar-panel]');
    if (!toggle || !panel) return;

    function setOpen(isOpen) {
      root.classList.toggle('capsule-navbar--open', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
      toggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');

      root.classList.add('capsule-navbar--animating');
      panel.addEventListener('transitionend', function onEnd(e) {
        if (e.target !== panel) return;
        root.classList.remove('capsule-navbar--animating');
        panel.removeEventListener('transitionend', onEnd);
      });
    }

    toggle.addEventListener('click', function () {
      setOpen(!root.classList.contains('capsule-navbar--open'));
    });

    root.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && root.classList.contains('capsule-navbar--open')) {
        setOpen(false);
        toggle.focus();
      }
    });

    panel.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });

    document.addEventListener('click', function (e) {
      if (root.classList.contains('capsule-navbar--open') && !root.contains(e.target)) {
        setOpen(false);
      }
    });
  }

  function init(context) {
    var scope = context || document;
    scope.querySelectorAll('[data-capsule-navbar]').forEach(initOne);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { init(); });
  } else {
    init();
  }

  // Exposed so a host app can re-run init() after injecting new markup.
  window.CapsuleNavbar = { init: init };
})();