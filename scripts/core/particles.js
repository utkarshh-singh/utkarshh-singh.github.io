/* =============================================================
   PARTICLES.JS — Ambient drifting starfield, fixed behind content.
   Lightweight 2D canvas, used site-wide (every page).
   ============================================================= */

export function initParticles() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let width, height, dpr;
  let points = [];
  let mouseX = 0.5, mouseY = 0.5;
  let raf = null;
  let visible = true;

  const DENSITY = 18000; // px^2 per point

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const count = Math.round((width * height) / DENSITY);
    points = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.2 + 0.3,
      vx: (Math.random() - 0.5) * 0.06,
      vy: (Math.random() - 0.5) * 0.06,
      tw: Math.random() * Math.PI * 2,
    }));
  }

  function accentColor() {
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    return isDark ? '245, 247, 255' : '20, 22, 40';
  }

  function draw(t) {
    ctx.clearRect(0, 0, width, height);
    const rgb = accentColor();
    const dx = (mouseX - 0.5) * 14;
    const dy = (mouseY - 0.5) * 14;

    for (const p of points) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = width; if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height; if (p.y > height) p.y = 0;

      const twinkle = 0.35 + Math.abs(Math.sin(t * 0.0006 + p.tw)) * 0.4;
      ctx.beginPath();
      ctx.arc(p.x + dx, p.y + dy, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${rgb}, ${twinkle * 0.5})`;
      ctx.fill();
    }

    if (!reduced) raf = requestAnimationFrame(draw);
  }

  resize();
  draw(0);

  if (!reduced) {
    window.addEventListener('pointermove', (e) => {
      mouseX = e.clientX / width;
      mouseY = e.clientY / height;
    }, { passive: true });

    document.addEventListener('visibilitychange', () => {
      visible = document.visibilityState === 'visible';
      if (visible && !raf) raf = requestAnimationFrame(draw);
      else if (!visible && raf) { cancelAnimationFrame(raf); raf = null; }
    });
  }

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { resize(); if (reduced) draw(0); }, 200);
  });
}
