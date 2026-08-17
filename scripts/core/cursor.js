/* =============================================================
   CURSOR.JS — Custom magnetic dot + ring cursor
   ============================================================= */

export function initCursor() {
  if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.body.classList.add('has-custom-cursor');

  const dot = document.createElement('div');
  dot.className = 'cursor-dot';
  const ring = document.createElement('div');
  ring.className = 'cursor-ring';
  document.body.append(dot, ring);

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    document.body.classList.add('cursor-ready');
  }, { passive: true });

  function loop() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  const interactiveSelector = 'a, button, [data-tilt], [data-cursor-hover], input, textarea, select';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest?.(interactiveSelector)) ring.classList.add('is-active');
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest?.(interactiveSelector)) ring.classList.remove('is-active');
  });

  window.addEventListener('mouseleave', () => {
    dot.style.opacity = '0';
    ring.style.opacity = '0';
  });
  window.addEventListener('mouseenter', () => {
    dot.style.opacity = '1';
    ring.style.opacity = '1';
  });
}
