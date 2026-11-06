/* ============================================================
   Autoškola Nečas — sdílený JavaScript
   ============================================================ */

(function () {
  'use strict';

  /* ── Nav: scroll shadow + průhlednost nad hero ── */
  const navEl = document.getElementById('siteNav');
  const heroEl = document.getElementById('hero') || document.querySelector('.page-hero__photo');
  const pageHeroEl = document.querySelector('.page-hero');
  if (navEl) {
    if (!heroEl && pageHeroEl) navEl.classList.add('is-solid');
    const updateNav = () => {
      const atTop = !!heroEl && window.scrollY < 10;
      navEl.classList.toggle('is-transparent', atTop);
      navEl.classList.toggle('is-scrolled', !!heroEl && !atTop && window.scrollY > 8);
    };
    updateNav();
    window.addEventListener('scroll', updateNav, { passive: true });
  }

  /* ── Nav: mobilní drawer ── */
  const burger = document.getElementById('burgerBtn');
  const drawer = document.getElementById('navDrawer');
  const drawerClose = document.getElementById('drawerClose');

  if (burger && drawer) {
    let drawerScrollY = 0;

    const openDrawer = () => {
      drawerScrollY = window.scrollY;
      document.body.style.top = `-${drawerScrollY}px`;
      drawer.classList.add('is-open');
      document.body.classList.add('drawer-open');
    };

    const closeDrawer = () => {
      drawer.classList.remove('is-open');
      document.body.classList.remove('drawer-open');
      document.body.style.top = '';
      window.scrollTo({ top: drawerScrollY, behavior: 'instant' });
    };

    burger.addEventListener('click', openDrawer);
    if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
    drawer.addEventListener('click', e => { if (e.target === drawer) closeDrawer(); });

    drawer.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', e => {
        const href = a.getAttribute('href') || '';
        if (href.startsWith('#')) {
          e.preventDefault();
          closeDrawer();
          const target = document.getElementById(href.slice(1));
          if (target) {
            const navH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 63;
            requestAnimationFrame(() => requestAnimationFrame(() => {
              window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - navH, behavior: 'smooth' });
            }));
          }
        } else {
          closeDrawer();
        }
      });
    });
  }

  /* ── Scroll animations (data-anim) ── */
  const animEls = document.querySelectorAll('[data-anim]');
  if (animEls.length) {
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
      }, { threshold: 0.12 });
      animEls.forEach(el => io.observe(el));
    } else {
      animEls.forEach(el => el.classList.add('in'));
    }
  }

  /* ── Proces: postupné zvýraznění kroků při scrollu (mobil/tablet) ── */
  const processTrack = document.querySelector('.process__steps');
  const processSteps = processTrack ? Array.from(processTrack.querySelectorAll('.step')) : [];
  /* Na tabletu jsou kroky ve dvou sloupcích, takže dvojice projdou středem
     obrazovky naráz. Výška řádku se proto rozdělí mezi jeho sloupce a kroky
     v řádku se zvýrazní postupně zleva doprava. */
  if (processSteps.length) {
    let ticking = false;
    const updateSteps = () => {
      ticking = false;
      const mid = window.innerHeight / 2;
      // offsetTop místo getBoundingClientRect — náběhová animace (data-anim)
      // kroky posouvá transformem a zkreslila by rozdělení do řádků.
      const trackTop = processTrack.getBoundingClientRect().top;
      const rows = [];
      processSteps.forEach(s => {
        const top = trackTop + s.offsetTop, bottom = top + s.offsetHeight;
        const row = rows.find(x => x.top === top);
        if (row) { row.steps.push(s); row.bottom = Math.max(row.bottom, bottom); }
        else rows.push({ top, bottom, steps: [s] });
      });
      const row = rows.find(x => mid >= x.top && mid < x.bottom);
      if (!row) return;
      const i = Math.min(row.steps.length - 1, Math.floor((mid - row.top) / (row.bottom - row.top) * row.steps.length));
      processTrack.classList.add('is-scrolling');
      processSteps.forEach(s => s.classList.toggle('is-active', s === row.steps[i]));
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(updateSteps); } };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
  }

  /* ── FAQ accordion ── */
  document.querySelectorAll('.faq__q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq__item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq__item.open').forEach(o => o.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

})();
