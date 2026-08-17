/* =============================================================
   TILT.JS — Pointer-driven 3D tilt for [data-tilt] elements
   ============================================================= */

export function initTilt(root = document) {
  if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const els = root.querySelectorAll('[data-tilt]');
  els.forEach((el) => {
    const maxTilt = parseFloat(el.dataset.tiltMax || '8');

    if (!el.querySelector('.tilt-glare')) {
      const glare = document.createElement('span');
      glare.className = 'tilt-glare';
      glare.setAttribute('aria-hidden', 'true');
      el.appendChild(glare);
    }
    const glare = el.querySelector('.tilt-glare');

    el.addEventListener('pointermove', (e) => {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      const rotateY = (px - 0.5) * maxTilt * 2;
      const rotateX = (0.5 - py) * maxTilt * 2;
      el.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(6px)`;
      glare.style.setProperty('--glare-x', `${px * 100}%`);
      glare.style.setProperty('--glare-y', `${py * 100}%`);
    });

    el.addEventListener('pointerleave', () => {
      el.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
    });
  });
}
