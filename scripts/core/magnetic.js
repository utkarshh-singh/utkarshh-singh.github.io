/* =============================================================
   MAGNETIC.JS — Subtle magnetic pull toward the cursor
   ============================================================= */

export function initMagnetic(root = document) {
  if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  root.querySelectorAll('[data-magnetic]').forEach((el) => {
    const strength = parseFloat(el.dataset.magnetic || '0.35');

    el.addEventListener('pointermove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) * strength;
      const y = (e.clientY - rect.top - rect.height / 2) * strength;
      el.style.transform = `translate(${x}px, ${y}px)`;
    });

    el.addEventListener('pointerleave', () => {
      el.style.transform = 'translate(0, 0)';
    });
  });
}
