/* =============================================================
   HEADER.JS — Floating glass pill navigation, injected on every page
   ============================================================= */

import { fetchJSON } from '../core/data.js';
import { initTheme, toggleTheme, sunIcon, moonIcon, getTheme } from '../core/theme.js';
import { SITE } from '../../config/site.config.js';

export async function renderHeader() {
  initTheme();

  const navData = await fetchJSON('./data/nav.json');
  const navItems = navData?.items?.filter((i) => i.visible) ?? [];

  const headerEl = document.querySelector('#site-header');
  if (!headerEl) return;

  headerEl.className = 'site-header';
  headerEl.innerHTML = `
    <div class="nav-inner" role="navigation" aria-label="Main navigation">
      <a href="./index.html" class="nav-logo" aria-label="${SITE.name} — Home">
        ${logoMark()}
        <span class="nav-logo__text">
          <span class="nav-logo__name">${SITE.name}</span>
          <span class="nav-logo__title">Quantum ML Researcher</span>
        </span>
      </a>

      <ul class="nav-links" role="list" id="nav-links">
        ${navItems.map((item, i) => `
          <li style="--i:${i}">
            <a href="${item.href}" data-page-id="${item.id}" aria-current="false">${item.label}</a>
          </li>
        `).join('')}
        <li class="nav-cta-mobile" aria-hidden="true"><a href="./contact.html">Get in touch</a></li>
      </ul>

      <div class="nav-actions">
        <button class="nav-theme-toggle" data-theme-toggle aria-label="Toggle theme" title="Toggle theme">
          ${getTheme() === 'dark' ? moonIcon() : sunIcon()}
        </button>
        <a href="./contact.html" class="nav-cta hidden-mobile">Contact</a>
        <button class="nav-toggle" id="nav-toggle" aria-expanded="false" aria-controls="nav-links" aria-label="Open navigation menu">
          <span class="nav-toggle__bar"></span>
          <span class="nav-toggle__bar"></span>
          <span class="nav-toggle__bar"></span>
        </button>
      </div>
    </div>
  `;

  setActiveNavItem(headerEl);

  const themeBtn = headerEl.querySelector('[data-theme-toggle]');
  themeBtn?.addEventListener('click', toggleTheme);

  const toggle = headerEl.querySelector('#nav-toggle');
  toggle?.addEventListener('click', () => {
    const isOpen = headerEl.classList.toggle('nav--open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  headerEl.querySelectorAll('.nav-links a').forEach((link) => {
    link.addEventListener('click', () => {
      headerEl.classList.remove('nav--open');
      toggle?.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  window.addEventListener('scroll', () => {
    headerEl.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

function setActiveNavItem(headerEl) {
  const currentFile = window.location.pathname.split('/').pop() || 'index.html';
  headerEl.querySelectorAll('a[data-page-id]').forEach((link) => {
    const linkFile = link.getAttribute('href').split('/').pop();
    const isActive = linkFile === currentFile;
    link.classList.toggle('active', isActive);
    link.setAttribute('aria-current', isActive ? 'page' : 'false');
  });
}

function logoMark() {
  return `
    <svg class="nav-logo__mark" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="logo-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0" stop-color="var(--accent-cyan)"/>
          <stop offset="0.5" stop-color="var(--accent-violet)"/>
          <stop offset="1" stop-color="var(--accent-magenta)"/>
        </linearGradient>
      </defs>
      <path d="M6 8 C6 20, 26 20, 26 8" stroke="url(#logo-grad)" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.45"/>
      <path d="M10 7 L10 18 C10 22, 22 22, 22 18 L22 7" stroke="url(#logo-grad)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      <circle cx="16" cy="22" r="2.2" fill="url(#logo-grad)"/>
      <circle cx="10" cy="7" r="1.4" fill="url(#logo-grad)" opacity="0.6"/>
      <circle cx="22" cy="7" r="1.4" fill="url(#logo-grad)" opacity="0.6"/>
    </svg>
  `;
}
