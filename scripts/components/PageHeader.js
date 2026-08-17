/* =============================================================
   PAGEHEADER.JS — Shared hero strip for interior pages
   ============================================================= */

export function buildPageHeader({ eyebrow, title, subtitle, stats = [] }) {
  return `
    <section class="page-header">
      <div class="glow-blob" aria-hidden="true"></div>
      <div class="container page-header__inner">
        <p class="section-eyebrow reveal-fade is-visible">${eyebrow}</p>
        <h1 class="page-header__title reveal-fade is-visible">${title}</h1>
        <p class="page-header__subtitle reveal-fade is-visible">${subtitle}</p>
        ${stats.length ? `
          <div class="page-header__stats reveal-fade is-visible">
            ${stats.map((s) => `
              <div class="hero-stat">
                <span class="hero-stat__number" data-counter="${s.value}">0</span>
                <span class="hero-stat__label">${s.label}</span>
              </div>
            `).join('')}
          </div>
        ` : ''}
      </div>
    </section>
  `;
}
