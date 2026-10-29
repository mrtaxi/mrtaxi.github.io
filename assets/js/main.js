/* ============================================================
   Max — portfolio
   Vanilla JS: nav state, mobile menu, tabs, scroll reveal.
   ============================================================ */

(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── navigation: shrink on scroll ────────────────────── */

  var nav = document.getElementById('nav');

  function onScroll() {
    if (!nav) { return; }
    nav.classList.toggle('is-scrolled', window.scrollY > 50);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── mobile menu ─────────────────────────────────────── */

  var menuBtn = document.getElementById('menu-btn');
  var menu = document.getElementById('menu');

  function setMenu(open) {
    if (!menu || !menuBtn) { return; }
    menu.hidden = !open;
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) {
      var first = menu.querySelector('a');
      if (first) { first.focus(); }
    }
  }

  if (menuBtn && menu) {
    menuBtn.addEventListener('click', function () {
      setMenu(menu.hidden);
    });

    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) { setMenu(false); }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !menu.hidden) {
        setMenu(false);
        menuBtn.focus();
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 768 && !menu.hidden) { setMenu(false); }
    });
  }

  /* ── work tabs ───────────────────────────────────────── */

  var tabList = document.querySelector('.jobs__tabs');
  var tabs = tabList ? Array.prototype.slice.call(tabList.querySelectorAll('[role="tab"]')) : [];
  var highlight = tabList ? tabList.querySelector('.jobs__highlight') : null;

  function moveHighlight(tab) {
    if (!highlight || !tabList || !tab) { return; }
    var horizontal = window.getComputedStyle(tabList).flexDirection === 'row';

    if (horizontal) {
      highlight.style.width = tab.offsetWidth + 'px';
      highlight.style.height = '2px';
      highlight.style.transform = 'translateX(' + tab.offsetLeft + 'px)';
    } else {
      highlight.style.width = '2px';
      highlight.style.height = tab.offsetHeight + 'px';
      highlight.style.transform = 'translateY(' + tab.offsetTop + 'px)';
    }
  }

  function selectTab(index, focus) {
    if (!tabs.length) { return; }
    index = (index + tabs.length) % tabs.length;

    tabs.forEach(function (tab, i) {
      var selected = i === index;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;

      var panel = document.getElementById(tab.getAttribute('aria-controls'));
      if (panel) { panel.hidden = !selected; }
    });

    moveHighlight(tabs[index]);
    if (focus) { tabs[index].focus(); }
  }

  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () { selectTab(i, false); });

    tab.addEventListener('keydown', function (e) {
      var key = e.key;
      if (key === 'ArrowDown' || key === 'ArrowRight') {
        e.preventDefault(); selectTab(i + 1, true);
      } else if (key === 'ArrowUp' || key === 'ArrowLeft') {
        e.preventDefault(); selectTab(i - 1, true);
      } else if (key === 'Home') {
        e.preventDefault(); selectTab(0, true);
      } else if (key === 'End') {
        e.preventDefault(); selectTab(tabs.length - 1, true);
      }
    });
  });

  if (tabs.length) {
    selectTab(0, false);
    /* offsets shift once webfonts land */
    window.addEventListener('load', function () {
      var active = tabList.querySelector('[aria-selected="true"]');
      moveHighlight(active);
    });
    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        moveHighlight(tabList.querySelector('[aria-selected="true"]'));
      }, 120);
    });
  }

  /* ── scroll reveal ───────────────────────────────────── */

  var revealables = document.querySelectorAll('.reveal');

  if (reduceMotion || !('IntersectionObserver' in window)) {
    Array.prototype.forEach.call(revealables, function (el) {
      el.classList.add('is-visible');
    });
  } else {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });

    Array.prototype.forEach.call(revealables, function (el) {
      observer.observe(el);
    });
  }

  /* ── footer year ─────────────────────────────────────── */

  var year = document.getElementById('year');
  if (year) { year.textContent = String(new Date().getFullYear()); }
})();
