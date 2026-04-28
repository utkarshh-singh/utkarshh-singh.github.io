/* =============================================================
   HEADER.JS — Shared Site Header Component
   
   This component is injected into every page.
   
   What it does:
   1. Fetches nav items from data/nav.json
   2. Renders the sticky header: logo + nav links + theme toggle + CTA
   3. Initializes the theme system (light/dark)
   4. Marks the active nav item for the current page
   5. Handles mobile hamburger toggle
   6. Adds "scrolled" class when user scrolls past 20px
   
   HOW TO MODIFY THE LOGO:
   - Edit the logoMark() function below (SVG code)
   - Edit the site name in config/site.config.js
   
   HOW TO MODIFY THE NAV:
   - Edit data/nav.json — add, remove, or reorder items
   - Set visible: false to hide a link without deleting it
   ============================================================= */

import { fetchJSON }        from '../utils/render.js';
import { initTheme, toggleTheme, getTheme } from '../utils/theme.js';
import { setActiveNavItem } from '../utils/router.js';
import { SITE }             from '../config/site.config.js';


/**
 * Render the site header into #site-header.
 * Call this once per page, before page content renders.
 */
export async function renderHeader() {
  // 1. Initialize theme first (before anything renders)
  initTheme();

  // 2. Fetch nav data
  const navData = await fetchJSON('./data/nav.json');
  const navItems = navData?.items?.filter(item => item.visible) ?? [];
  const cta = navData?.cta ?? null;

  // 3. Build and inject HTML
  const headerEl = document.querySelector('#site-header');
  if (!headerEl) return;

  headerEl.className = 'site-header';
  headerEl.innerHTML = `
    <div class="container">
      <nav class="nav-inner" aria-label="Main navigation">

        <!-- Logo -->
        <a href="./index.html" class="nav-logo" aria-label="${SITE.name} — Home">
          ${logoMark()}
          <span class="nav-logo__text">
            <span class="nav-logo__name">${SITE.name}</span>
            <span class="nav-logo__title">Quantum ML Researcher</span>
          </span>
        </a>

        <!-- Desktop Navigation Links -->
        <ul class="nav-links" role="list" id="nav-links">
          ${navItems.map(item => `
            <li>
              <a href="${item.href}"
                 data-page-id="${item.id}"
                 aria-current="false">
                ${item.label}
              </a>
            </li>
          `).join('')}

          <!-- CTA inside mobile menu -->
          ${cta ? `<li class="nav-cta-mobile" aria-hidden="true"><a href="${cta.href}">${cta.label}</a></li>` : ''}
        </ul>

        <!-- Right Actions -->
        <div class="nav-actions">
          <!-- Theme Toggle -->
          <button
            class="nav-theme-toggle"
            data-theme-toggle
            aria-label="Switch to dark mode"
            title="Toggle theme">
            ${moonIcon()}
          </button>

          <!-- CTA — desktop only -->
          <a href="./contact.html" class="nav-cta hidden-mobile">Contact</a>

          <!-- Hamburger — mobile only -->
          <button
            class="nav-toggle"
            id="nav-toggle"
            aria-expanded="false"
            aria-controls="nav-links"
            aria-label="Open navigation menu">
            <span class="nav-toggle__bar"></span>
            <span class="nav-toggle__bar"></span>
            <span class="nav-toggle__bar"></span>
          </button>
        </div>

      </nav>
    </div>
  `;

  // 4. Mark active page in nav
  setActiveNavItem('.nav-inner');

  // 5. Wire up theme toggle
  const themeBtn = headerEl.querySelector('[data-theme-toggle]');
  themeBtn?.addEventListener('click', () => {
    toggleTheme();
    // Update icon after toggle
    const isDark = getTheme() === 'dark';
    themeBtn.innerHTML      = isDark ? sunIcon() : moonIcon();
    themeBtn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  });

  // 6. Wire up mobile hamburger
  const toggle  = headerEl.querySelector('#nav-toggle');
  const navEl   = headerEl.closest('.site-header') ?? headerEl;

  toggle?.addEventListener('click', () => {
    const isOpen = navEl.classList.toggle('nav--open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
    // Prevent body scroll when menu is open
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close mobile menu when a link is clicked
  headerEl.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      navEl.classList.remove('nav--open');
      toggle?.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // 7. Scrolled state for shadow
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    header?.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}


/* ─── SVG Logo Mark ──────────────────────────────────────────
   Custom SVG mark for "US" (Utkarsh Singh).
   Design: A quantum-inspired orbital path around a central node,
   built from two overlapping circular arcs — suggesting both
   the "U" letterform and a quantum circuit/orbit.
   
   To redesign: replace the SVG paths below.
   Keep: aria-hidden="true", class="nav-logo__mark"
   ──────────────────────────────────────────────────────────── */
function logoMark() {
  return `
    <svg class="nav-logo__mark" viewBox="0 0 32 32" fill="none"
         xmlns="http://www.w3.org/2000/svg" aria-hidden="true">

      <!-- Outer orbital ring (U-shape, open at top) -->
      <path
        d="M6 8 C6 20, 26 20, 26 8"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        fill="none"
        opacity="0.35"
      />

      <!-- Inner U letterform -->
      <path
        d="M10 7 L10 18 C10 22, 22 22, 22 18 L22 7"
        stroke="currentColor"
        stroke-width="2.2"
        stroke-linecap="round"
        stroke-linejoin="round"
        fill="none"
      />

      <!-- Central quantum node — filled dot -->
      <circle cx="16" cy="22" r="2.2" fill="currentColor" />

      <!-- Small accent dot — top left of U -->
      <circle cx="10" cy="7" r="1.4" fill="currentColor" opacity="0.5" />

      <!-- Small accent dot — top right of U -->
      <circle cx="22" cy="7" r="1.4" fill="currentColor" opacity="0.5" />

    </svg>
  `;
}


/* ─── Icon helpers ───────────────────────────────────────────*/
function moonIcon() {
  return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="2" stroke-linecap="round"
    stroke-linejoin="round" aria-hidden="true">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>`;
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
