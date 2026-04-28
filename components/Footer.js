/* =============================================================
   FOOTER.JS — Shared Site Footer Component
   
   Injected into every page via #site-footer.
   
   What it renders:
   - Brand column: logo + tagline + social links (from links.json)
   - Navigation column: page links (from nav.json)
   - Connect column: email CTA + description
   - Bottom bar: copyright (year auto-updates) + subtle links
   
   HOW TO MODIFY:
   - Social links → edit content/links.json
   - Nav links    → edit data/nav.json
   - Email        → edit config/site.config.js (SITE.email)
   - Tagline      → edit content/identity.json (tagline)
   ============================================================= */

import { fetchJSON }  from '../utils/render.js';
import { SITE }       from '../config/site.config.js';


/**
 * Render the site footer into #site-footer.
 * Call this once per page, after page content renders.
 */
export async function renderFooter() {
  const footerEl = document.querySelector('#site-footer');
  if (!footerEl) return;

  // Fetch data in parallel
  const [identityData, linksData, navData] = await Promise.all([
    fetchJSON('./content/identity.json'),
    fetchJSON('./content/links.json'),
    fetchJSON('./data/nav.json'),
  ]);

  const tagline  = identityData?.tagline ?? 'Researcher. Engineer. Builder.';
  const name     = identityData?.fullName ?? SITE.name;
  const email    = SITE.email;
  const navItems = navData?.items?.filter(i => i.visible) ?? [];

  // Show only priority 1 social links in footer
  const socialLinks = linksData?.social
    ?.filter(l => l.priority <= 2)
    ?? [];

  footerEl.className = 'site-footer';
  footerEl.innerHTML = `
    <div class="container">
      <div class="footer-inner">

        <!-- Column 1: Brand -->
        <div class="footer-brand">
          <a href="./index.html" class="footer-logo" aria-label="${name} — Home">
            ${logoMark()}
            <span class="footer-logo__name">${name}</span>
          </a>
          <p class="footer-tagline">${tagline}</p>
          <div class="footer-social" role="list" aria-label="Social links">
            ${socialLinks.map(link => `
              <a href="${link.url}"
                 role="listitem"
                 aria-label="${link.platform}"
                 target="_blank"
                 rel="noopener noreferrer"
                 title="${link.platform}">
                ${socialIcon(link.icon)}
              </a>
            `).join('')}
          </div>
        </div>

        <!-- Column 2: Navigation -->
        <nav class="footer-nav" aria-label="Footer navigation">
          <h4>Pages</h4>
          <ul role="list">
            ${navItems.map(item => `
              <li>
                <a href="${item.href}">${item.label}</a>
              </li>
            `).join('')}
          </ul>
        </nav>

        <!-- Column 3: Connect -->
        <div class="footer-connect">
          <h4>Connect</h4>
          <p>Open to research collaborations, consulting, and speaking opportunities.</p>
          ${email ? `
            <a href="mailto:${email}" class="footer-email-link">
              ${mailIcon()}
              ${email}
            </a>
          ` : ''}
        </div>

      </div>

      <!-- Bottom Bar -->
      <div class="footer-bottom">
        <p class="footer-copyright">
          &copy; <span id="footer-year"></span> ${name}. All rights reserved.
        </p>
        <div class="footer-bottom-links">
          <a href="https://github.com/utkarshh-singh" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href="https://scholar.google.com/citations?user=zWTAuq0AAAAJ" target="_blank" rel="noopener noreferrer">Google Scholar</a>
          <a href="https://www.credly.com/users/utkarsh-singh.0a82c607/badges" target="_blank" rel="noopener noreferrer">Credly</a>
        </div>
      </div>

    </div>
  `;

  // Auto-update copyright year
  const yearEl = footerEl.querySelector('#footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}


/* ─── Social Icon Map ────────────────────────────────────────
   Maps icon names from links.json to inline SVG.
   To add a new icon: add a case below.
   ──────────────────────────────────────────────────────────── */
function socialIcon(name) {
  const size = `width="16" height="16"`;
  const base = `viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"`;

  const icons = {
    linkedin: `<svg ${size} ${base}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>`,
    github:   `<svg ${size} ${base}><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>`,
    'graduation-cap': `<svg ${size} ${base}><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`,
    award:    `<svg ${size} ${base}><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>`,
    instagram:`<svg ${size} ${base}><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>`,
    feather:  `<svg ${size} ${base}><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"/><line x1="16" y1="8" x2="2" y2="22"/><line x1="17.5" y1="15" x2="9" y2="15"/></svg>`,
  };

  return icons[name] ?? icons['award'];
}

function mailIcon() {
  return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="2" stroke-linecap="round"
    stroke-linejoin="round" aria-hidden="true">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>`;
}

function logoMark() {
  return `
    <svg class="footer-logo__mark" width="24" height="24" viewBox="0 0 32 32" fill="none"
         xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M6 8 C6 20, 26 20, 26 8" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" fill="none" opacity="0.35"/>
      <path d="M10 7 L10 18 C10 22, 22 22, 22 18 L22 7"
            stroke="currentColor" stroke-width="2.2"
            stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      <circle cx="16" cy="22" r="2.2" fill="currentColor"/>
      <circle cx="10" cy="7"  r="1.4" fill="currentColor" opacity="0.5"/>
      <circle cx="22" cy="7"  r="1.4" fill="currentColor" opacity="0.5"/>
    </svg>
  `;
}
