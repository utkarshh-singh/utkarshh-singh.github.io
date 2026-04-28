/* =============================================================
   THEME.JS — Light/Dark Mode Toggle Logic
   
   HOW IT WORKS:
   1. On page load: reads DEFAULT_MODE from theme.config.js
      - "system" → checks prefers-color-scheme
      - "light" or "dark" → uses that directly
   2. Applies data-theme and data-palette to <html>
   3. The toggle button (in Header.js) calls toggleTheme()
   4. State is stored in memory (not localStorage — for GitHub
      Pages compatibility). Resets to default on new tab/visit.
   
   NOTE: If you want persistence across page visits, you can
   add localStorage here later. Right now it's intentionally
   kept simple.
   ============================================================= */

import { DEFAULT_MODE, PALETTE } from '../config/theme.config.js';

// In-memory state (resets per page load)
let currentTheme = 'light';

/**
 * Initialize the theme system. Call this once on page load,
 * before any content renders. Header.js calls this automatically.
 */
export function initTheme() {
  // Apply the palette from config
  document.documentElement.setAttribute('data-palette', PALETTE);

  // Determine initial theme
  if (DEFAULT_MODE === 'system') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    currentTheme = prefersDark ? 'dark' : 'light';
  } else {
    currentTheme = DEFAULT_MODE;
  }

  applyTheme(currentTheme);

  // Listen for OS theme changes (only in "system" mode)
  if (DEFAULT_MODE === 'system') {
    window.matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', e => {
        currentTheme = e.matches ? 'dark' : 'light';
        applyTheme(currentTheme);
        updateToggleButton();
      });
  }
}


/**
 * Toggle between light and dark mode.
 * Called when the user clicks the theme toggle button.
 */
export function toggleTheme() {
  currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
  applyTheme(currentTheme);
  updateToggleButton();
}


/**
 * Get the current theme string.
 * @returns {'light'|'dark'}
 */
export function getTheme() {
  return currentTheme;
}


/* ─── Internal helpers ───────────────────────────────────────*/

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
}

function updateToggleButton() {
  const btn = document.querySelector('[data-theme-toggle]');
  if (!btn) return;

  const isDark = currentTheme === 'dark';
  btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  btn.innerHTML = isDark ? sunIcon() : moonIcon();
}

function sunIcon() {
  return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" 
    stroke="currentColor" stroke-width="2" stroke-linecap="round" 
    stroke-linejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/>
    <line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/>
    <line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>`;
}

function moonIcon() {
  return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" 
    stroke="currentColor" stroke-width="2" stroke-linecap="round" 
    stroke-linejoin="round" aria-hidden="true">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>`;
}
