/* ==========================================================================
   SAFELY — Interactions
   Nav, onglets, FAQ, formulaire. Rien de plus.
   ========================================================================== */

(() => {
  'use strict';

  const nav = document.getElementById('siteNav');
  const navToggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const progressBar = document.getElementById('progressBar');

  /* ------------------------------------------------------------- Scroll UI */
  const onScroll = () => {
    const y = window.scrollY;

    if (nav) nav.classList.toggle('is-scrolled', y > 8);

    if (progressBar) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = max > 0 ? y / max : 0;
      progressBar.style.width = `${Math.min(100, Math.max(0, ratio * 100))}%`;
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ----------------------------------------------------------- Mobile menu */
  if (navToggle && mobileMenu) {
    const setMenu = (open) => {
      navToggle.setAttribute('aria-expanded', String(open));
      navToggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
      mobileMenu.hidden = !open;
    };

    navToggle.addEventListener('click', () => {
      setMenu(navToggle.getAttribute('aria-expanded') !== 'true');
    });

    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => setMenu(false));
    });

    document.querySelectorAll('.nav__cta').forEach((link) => {
      link.addEventListener('click', () => setMenu(false));
    });

    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape') return;
      if (navToggle.getAttribute('aria-expanded') !== 'true') return;
      setMenu(false);
      navToggle.focus();
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth >= 1024) setMenu(false);
    });
  }

  /* --------------------------------------------------------------- Tabs */
  const tabs = Array.from(document.querySelectorAll('.tab'));

  const activateTab = (tab) => {
    tabs.forEach((item) => {
      const active = item === tab;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-selected', String(active));
      item.tabIndex = active ? 0 : -1;

      const panel = document.getElementById(item.getAttribute('aria-controls'));
      if (panel) panel.hidden = !active;
    });
  };

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => activateTab(tab));

    tab.addEventListener('keydown', (event) => {
      if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
      event.preventDefault();

      const index = tabs.indexOf(tab);
      const next = event.key === 'ArrowRight'
        ? tabs[(index + 1) % tabs.length]
        : tabs[(index - 1 + tabs.length) % tabs.length];

      next.focus();
      activateTab(next);
    });
  });

  /* ---------------------------------------------------------------- FAQ */
  const faqs = Array.from(document.querySelectorAll('.faq'));

  faqs.forEach((faq) => {
    faq.addEventListener('toggle', () => {
      if (!faq.open) return;
      faqs.forEach((other) => {
        if (other !== faq) other.open = false;
      });
    });
  });

  /* --------------------------------------------------------- Waitlist form */
  const form = document.getElementById('waitlistForm');
  const note = document.getElementById('waitlistNote');

  if (form && note) {
    const input = form.querySelector('input[type="email"]');
    const defaultNote = note.textContent.trim();
    let resetTimer;

    const restore = () => {
      note.classList.remove('is-success');
      note.textContent = defaultNote;
    };

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const value = input.value.trim();
      const valid = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(value);

      window.clearTimeout(resetTimer);

      if (!valid) {
        form.classList.add('is-error');
        note.classList.remove('is-success');
        note.textContent = 'Il manque juste une adresse email valide pour vous prévenir.';
        input.focus();
        window.setTimeout(() => form.classList.remove('is-error'), 600);
        return;
      }

      form.classList.remove('is-error');
      note.classList.add('is-success');
      note.textContent = 'C’est noté. Vous serez parmi les premières personnes informées du lancement de SAFELY.';
      form.reset();
      input.blur();

      resetTimer = window.setTimeout(restore, 9000);
    });

    input.addEventListener('input', () => {
      if (!form.classList.contains('is-error')) return;
      form.classList.remove('is-error');
      restore();
    });
  }

  /* ---------------------------------------------------------------- Year */
  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
