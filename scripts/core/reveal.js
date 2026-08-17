/* =============================================================
   REVEAL.JS — Scroll-triggered reveal for [data-reveal] elements
   ============================================================= */

export function initReveal(root = document) {
  const els = root.querySelectorAll('.reveal-fade:not(.is-visible)');
  if (!els.length) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    els.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  els.forEach((el, i) => {
    if (!el.style.transitionDelay) {
      const group = el.closest('[data-reveal-group]');
      const stagger = group ? Math.min(i % 8, 8) * 70 : 0;
      el.style.transitionDelay = `${stagger}ms`;
    }
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
  );

  els.forEach((el) => observer.observe(el));
}
