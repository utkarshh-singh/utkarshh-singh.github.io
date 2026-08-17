/* =============================================================
   LOADER.JS — Brief first-visit preloader (once per session)
   ============================================================= */

export function initLoader() {
  const seen = sessionStorage.getItem('us-loader-seen');
  const el = document.getElementById('preloader');
  if (!el) return;

  if (seen || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    el.remove();
    return;
  }

  sessionStorage.setItem('us-loader-seen', '1');
  const hide = () => {
    el.classList.add('is-hidden');
    setTimeout(() => el.remove(), 650);
  };

  if (document.readyState === 'complete') {
    setTimeout(hide, 500);
  } else {
    window.addEventListener('load', () => setTimeout(hide, 400));
    setTimeout(hide, 1800); // safety fallback
  }
}
