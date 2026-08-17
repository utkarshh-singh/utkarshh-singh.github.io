/* =============================================================
   HERO.JS — Home page hero: kinetic type + WebGL constellation
   ============================================================= */

import { fetchJSON } from '../core/data.js';
import { SITE } from '../../config/site.config.js';

export async function buildHero() {
  const identity = await fetchJSON('./content/identity.json');
  if (!identity) return `<section class="hero"><div class="container"><p>Loading…</p></div></section>`;

  const name = identity.fullName ?? 'Utkarsh Singh';
  const [firstName, ...rest] = name.split(' ');
  const lastName = rest.join(' ');
  const location = identity.location?.display ?? '';
  const bio = identity.bio?.medium ?? '';
  const avatar = identity.avatar ?? '';
  const roles = identity.positioning?.length ? identity.positioning : [identity.primaryTitle ?? 'Researcher'];

  const chips = [
    { label: 'PhD · Quantum ML', icon: graduationIcon() },
    { label: '3 Pending Patents', icon: shieldIcon() },
    { label: 'Qiskit Advocate', icon: awardIcon() },
    { label: 'NRC Award 2024', icon: starIcon() },
  ];

  const stats = [
    { number: '5+', label: 'Publications' },
    { number: '3', label: 'Patents Filed' },
    { number: '13+', label: 'Credentials' },
    { number: '6+', label: 'Years in QML' },
  ];

  return `
    <section class="hero" aria-labelledby="hero-name">
      <canvas id="hero-canvas" aria-hidden="true"></canvas>
      <div class="hero-canvas-fallback" aria-hidden="true"></div>

      <div class="hero-chip-field" aria-hidden="true">
        ${chips.map((c, i) => `
          <div class="hero-chip glass hero-chip--${i + 1}" data-tilt data-tilt-max="6">
            ${c.icon}<span>${c.label}</span>
          </div>
        `).join('')}
      </div>

      <div class="container">
        <div class="hero-inner">
          <div class="hero-intro-row reveal-fade is-visible">
            ${avatar ? `
              <span class="hero-portrait">
                <img src="${avatar}" alt="Portrait of ${name}" width="84" height="84" loading="eager" decoding="async" />
              </span>
            ` : ''}
            <div class="hero-eyebrow-row">
              <span class="pill pill--accent pill--dot">Available for research &amp; consulting</span>
              <span class="pill">${location}</span>
            </div>
          </div>

          <h1 class="hero-name reveal-fade is-visible" id="hero-name">
            <span>${firstName}</span>
            <span class="hero-name__accent">${lastName || firstName}</span>
          </h1>

          <div class="hero-role-cycle reveal-fade is-visible" aria-hidden="true">
            <div class="hero-role-track" id="hero-role-track">
              ${roles.map((r) => `<span>// ${r}</span>`).join('')}
              <span>// ${roles[0]}</span>
            </div>
          </div>
          <p class="visually-hidden" style="position:absolute;width:1px;height:1px;overflow:hidden;">${roles.join('. ')}</p>

          <p class="hero-bio reveal-fade is-visible">${bio}</p>

          <div class="hero-actions reveal-fade is-visible">
            <a href="./research.html" class="btn btn--primary" data-magnetic="0.2">
              View Research ${arrowIcon()}
            </a>
            <a href="${SITE.cvPath}" download class="btn btn--ghost" data-magnetic="0.2">
              Download CV
            </a>
            <a href="https://scholar.google.com/citations?user=zWTAuq0AAAAJ" target="_blank" rel="noopener noreferrer" class="link-underline">
              Google Scholar ↗
            </a>
          </div>

          <div class="hero-stats reveal-fade is-visible">
            ${stats.map((s) => `
              <div class="hero-stat">
                <span class="hero-stat__number" data-counter="${s.number.replace(/[^\d.]/g, '')}${s.number.replace(/[\d.]/g, '')}">0</span>
                <span class="hero-stat__label">${s.label}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <div class="hero-scroll-cue" aria-hidden="true">
        <span>Scroll</span>
        <span class="hero-scroll-cue__line"></span>
      </div>
    </section>
  `;
}

export function initHeroInteractions() {
  const track = document.getElementById('hero-role-track');
  if (track) {
    const items = track.children.length;
    let idx = 0;
    setInterval(() => {
      idx++;
      track.style.transform = `translateY(-${idx * (100 / items)}%)`;
      if (idx === items - 1) {
        setTimeout(() => {
          track.style.transition = 'none';
          idx = 0;
          track.style.transform = 'translateY(0)';
          requestAnimationFrame(() => { track.style.transition = ''; });
        }, 720);
      }
    }, 2600);
  }

  const canvas = document.getElementById('hero-canvas');
  if (canvas) {
    import('../three/hero-scene.js').then(({ initHeroScene }) => initHeroScene(canvas));
  }
}

function arrowIcon() {
  return `<svg class="btn__arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`;
}
function graduationIcon() {
  return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`;
}
function shieldIcon() {
  return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`;
}
function awardIcon() {
  return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>`;
}
function starIcon() {
  return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
}
