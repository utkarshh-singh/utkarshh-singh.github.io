/* =============================================================
   THEME.JS — Light/dark toggle with localStorage persistence
   ============================================================= */

const STORAGE_KEY = 'theme-preference';

let current = 'dark';

export function initTheme() {
  const stored = safeGet(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') {
    current = stored;
  } else {
    current = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }
  apply(current);

  window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
    if (safeGet(STORAGE_KEY)) return; // user has an explicit preference
    current = e.matches ? 'light' : 'dark';
    apply(current);
    syncToggleButtons();
  });
}

export function toggleTheme() {
  current = current === 'dark' ? 'light' : 'dark';
  apply(current);
  safeSet(STORAGE_KEY, current);
  syncToggleButtons();
}

export function getTheme() {
  return current;
}

function apply(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', theme === 'dark' ? '#050609' : '#f3f4f9');
}

function syncToggleButtons() {
  document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
    const isDark = current === 'dark';
    btn.innerHTML = isDark ? sunIcon() : moonIcon();
    btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  });
}

function safeGet(key) {
  try { return localStorage.getItem(key); } catch { return null; }
}
function safeSet(key, value) {
  try { localStorage.setItem(key, value); } catch { /* ignore */ }
}

export function sunIcon() {
  return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;
}
export function moonIcon() {
  return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
}
