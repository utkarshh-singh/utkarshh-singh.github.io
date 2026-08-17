/* =============================================================
   COUNTERS.JS — Animate numeric stats up when scrolled into view
   ============================================================= */

export function initCounters(root = document) {
  const els = root.querySelectorAll('[data-counter]');
  if (!els.length) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const run = (el) => {
    const raw = el.dataset.counter;
    const match = raw.match(/^(\d+(?:\.\d+)?)(.*)$/);
    if (!match) { el.textContent = raw; return; }
    const [, numStr, suffix] = match;
    const target = parseFloat(numStr);
    const decimals = (numStr.split('.')[1] || '').length;

    if (reduced) { el.textContent = `${numStr}${suffix}`; return; }

    const duration = 1400;
    const start = performance.now();

    function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const value = (target * eased).toFixed(decimals);
      el.textContent = `${value}${suffix}`;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        run(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });

  els.forEach((el) => observer.observe(el));
}
