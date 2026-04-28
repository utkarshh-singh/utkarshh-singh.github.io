/* =============================================================
   HERO.JS — Home Page Hero Section
   
   Reads from:
   - content/identity.json  → name, bio, tagline, title, avatar
   - content/certifications.json → featured badges
   
   Renders into: #main-content (via pages/home.js)
   
   HOW TO MODIFY:
   - Change bio text      → content/identity.json (bio.medium)
   - Change tagline       → content/identity.json (tagline)
   - Change credential badges shown → look for heroCredentials below
   - Change CTA buttons   → heroActions() function below
   - Change stats         → heroStats() function below
   ============================================================= */

import { fetchJSON } from '../utils/render.js';


/**
 * Build and return the hero section HTML string.
 * Called by pages/home.js.
 * @returns {Promise<string>} HTML string
 */
export async function buildHero() {
  const [identity, credsData] = await Promise.all([
    fetchJSON('./content/identity.json'),
    fetchJSON('./content/certifications.json'),
  ]);

  if (!identity) return `<section class="hero"><div class="container"><p>Loading…</p></div></section>`;

  const name      = identity.fullName      ?? 'Utkarsh Singh';
  const title     = identity.primaryTitle  ?? 'Quantum ML Researcher';
  const location  = identity.location?.display ?? 'Ottawa, Canada';
  const tagline   = identity.tagline       ?? 'Researcher. Engineer. Builder.';
  const bio       = identity.bio?.medium   ?? '';
  const avatar    = identity.avatar        ?? '';

  // Pick the 4 most impactful credential badges for the hero
  const heroCredentials = [
    { label: 'PhD · Quantum ML · uOttawa',    icon: graduationIcon() },
    { label: '3 Pending WIPO Patents',         icon: shieldIcon()     },
    { label: 'Qiskit Advocate',            icon: awardIcon()      },
    { label: 'NRC / Deep Tech Award 2024',     icon: starIcon()       },
  ];

  // Stats row
  const stats = [
    { number: '5',  label: 'Publications' },
    { number: '3',  label: 'Patents'      },
    { number: '13+', label: 'IBM Badges'  },
  ];

  return `
    <section class="hero" aria-labelledby="hero-name">
      <div class="container">
        <div class="hero-inner">

          <!-- Left: Text Content -->
          <div class="hero-content">

            <!-- Label -->
            <p class="hero-label reveal reveal--d1" aria-label="Role and location">
              ${title} &nbsp;·&nbsp; ${location}
            </p>

            <!-- Name -->
            <h1 class="hero-name reveal reveal--d2" id="hero-name">
              ${name}
            </h1>

            <!-- Rule -->
            <hr class="hero-rule reveal reveal--d2" aria-hidden="true" />

            <!-- Tagline -->
            <p class="hero-tagline reveal reveal--d3">
              ${tagline}
            </p>

            <!-- Bio -->
            <p class="hero-bio reveal reveal--d3">
              ${bio}
            </p>

            <!-- Credential Badges -->
            <div class="hero-badges reveal reveal--d4" role="list" aria-label="Key credentials">
              ${heroCredentials.map(c => `
                <span class="hero-badge" role="listitem">
                  ${c.icon}
                  ${c.label}
                </span>
              `).join('')}
            </div>

            <!-- CTA Buttons -->
            <div class="hero-actions reveal reveal--d4">
              <a href="./research.html" class="btn btn--primary">
                View Research
                ${arrowIcon()}
              </a>
              <a href="./assets/utkarsh-singh-cv.pdf"
                download
                class="hero-btn hero-btn--secondary">
                Download CV
              </a>
              <a href="https://scholar.google.com/citations?user=zWTAuq0AAAAJ"
                 class="btn btn--ghost btn--sm"
                 target="_blank"
                 rel="noopener noreferrer">
                Google Scholar ↗
              </a>
            </div>

            <!-- Stats -->
            <div class="hero-stats reveal reveal--d5" aria-label="Key numbers">
              ${stats.map(s => `
                <div class="hero-stat">
                  <span class="hero-stat__number">${s.number}</span>
                  <span class="hero-stat__label">${s.label}</span>
                </div>
              `).join('')}
            </div>

          </div><!-- /.hero-content -->


          <!-- Right: Avatar Visual -->
          <div class="hero-visual reveal reveal--d2" aria-hidden="true">
            <div class="hero-avatar-wrap">
              <div class="hero-avatar-ring-2"></div>
              <div class="hero-avatar-ring"></div>

              ${avatar
                ? `<img
                     src="${avatar}"
                     alt="Portrait of ${name}"
                     class="hero-avatar"
                     width="280"
                     height="280"
                     loading="eager"
                     decoding="async"
                   />`
                : `<div class="hero-avatar-placeholder">
                     ${personIcon()}
                   </div>`
              }

              <!-- Floating chip -->
              <div class="hero-avatar-chip">
                ${awardIcon()}
                PhD
              </div>
            </div>
          </div><!-- /.hero-visual -->

        </div><!-- /.hero-inner -->
      </div><!-- /.container -->
    </section>
  `;
}


/**
 * Activate scroll reveal animations on hero elements.
 * Call after the HTML is injected into the DOM.
 */
export function initHeroReveal() {
  const elements = document.querySelectorAll('.hero .reveal');

  if (!elements.length) return;

  // If user prefers reduced motion — skip animations, show everything
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    elements.forEach(el => el.classList.add('visible'));
    return;
  }

  // Intersection Observer — reveals elements as they enter viewport
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // Only animate once
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach(el => observer.observe(el));
}


/* ─── Inline SVG Icons ───────────────────────────────────────
   Kept here so Hero.js has zero external icon dependencies.
   ──────────────────────────────────────────────────────────── */
function arrowIcon() {
  return `<svg class="btn__arrow" width="16" height="16" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" stroke-width="2"
    stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12 5 19 12 12 19"/>
  </svg>`;
}

function graduationIcon() {
  return `<svg width="12" height="12" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="2" stroke-linecap="round"
    stroke-linejoin="round" aria-hidden="true">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
    <path d="M6 12v5c3 3 9 3 12 0v-5"/>
  </svg>`;
}

function shieldIcon() {
  return `<svg width="12" height="12" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="2" stroke-linecap="round"
    stroke-linejoin="round" aria-hidden="true">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>`;
}

function awardIcon() {
  return `<svg width="12" height="12" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="2" stroke-linecap="round"
    stroke-linejoin="round" aria-hidden="true">
    <circle cx="12" cy="8" r="6"/>
    <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
  </svg>`;
}

function starIcon() {
  return `<svg width="12" height="12" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="2" stroke-linecap="round"
    stroke-linejoin="round" aria-hidden="true">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02
                     12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>`;
}

function personIcon() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
    aria-hidden="true">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>`;
}
