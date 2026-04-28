/* =============================================================
   RESEARCH.JS — Publications & Research Section
   
   Reads from:  content/publications.json
   
   Features:
   - Full publication cards with journal, year, co-authors, DOI
   - Filter by YEAR and TOPIC (tag) — no page reload
   - "Best Paper" and "Featured" award badges
   - Abstract expand/collapse
   - "Cite" copy button (copies BibTeX to clipboard)
   - Accessible: keyboard-navigable filters, ARIA live region
   
   HOW TO ADD A NEW PUBLICATION:
   Edit content/publications.json — add a new object to the
   "publications" array. The filter system updates automatically.
   
   HOW TO CHANGE WHICH FILTERS APPEAR:
   Filters are auto-generated from the data. If you tag a paper
   with a new topic, it appears in the filter automatically.
   ============================================================= */

import { fetchJSON, skeletonCards } from '../utils/render.js';


/* ─── Main builder ───────────────────────────────────────────*/
export async function buildResearch() {
  const data = await fetchJSON('./content/publications.json');
  if (!data) return errorState();

  const pubs = data.publications ?? [];

  // Collect unique years and topics for filter buttons
  const years  = [...new Set(pubs.map(p => p.year))].sort((a,b) => b - a);
  const topics = [...new Set(pubs.flatMap(p => p.tags ?? []))].sort();

  return `
    <section class="research-section section" aria-labelledby="research-heading">
      <div class="container">

        <!-- Section Header -->
        <div class="section-header">
          <div class="section-label">Research</div>
          <h2 class="section-title" id="research-heading">Publications</h2>
          <p class="section-subtitle">
            Peer-reviewed work in quantum machine learning, variational algorithms,
            and hybrid quantum-classical systems.
          </p>
        </div>

        <!-- Filter Bar -->
        <div class="filter-bar" role="group" aria-label="Filter publications">

          <!-- All -->
          <button class="filter-btn filter-btn--active"
                  data-filter-type="all" data-filter-value="all"
                  aria-pressed="true">
            All <span class="filter-count">${pubs.length}</span>
          </button>

          <!-- Year filters -->
          <div class="filter-group" role="group" aria-label="Filter by year">
            ${years.map(y => `
              <button class="filter-btn"
                      data-filter-type="year"
                      data-filter-value="${y}"
                      aria-pressed="false">
                ${y}
              </button>
            `).join('')}
          </div>

          <!-- Topic filters -->
          <div class="filter-group" role="group" aria-label="Filter by topic">
            ${topics.map(t => `
              <button class="filter-btn"
                      data-filter-type="topic"
                      data-filter-value="${t}"
                      aria-pressed="false">
                ${t}
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Live region: announces filter result count to screen readers -->
        <p class="sr-only" aria-live="polite" aria-atomic="true" id="filter-status"></p>

        <!-- Publications Grid -->
        <div class="pub-grid" id="pub-grid" role="list" aria-label="Publications">
          ${pubs.map((pub, i) => publicationCard(pub, i)).join('')}
        </div>

        <!-- Empty state (hidden by default) -->
        <div class="empty-state" id="pub-empty" hidden aria-hidden="true">
          <p class="empty-state__text">No publications match this filter.</p>
          <button class="btn btn--ghost btn--sm" id="pub-empty-reset">Clear filter</button>
        </div>

      </div>
    </section>
  `;
}


/* ─── Publication Card ───────────────────────────────────────*/
function publicationCard(pub, index) {
  const hasAbstract = pub.abstract && pub.abstract.trim().length > 0;
  const hasBibtex   = pub.bibtex  && pub.bibtex.trim().length > 0;
  const cardId      = `pub-${index}`;
  const abstractId  = `abstract-${index}`;

  return `
    <article class="pub-card card"
             role="listitem"
             data-year="${pub.year}"
             data-topics="${(pub.tags ?? []).join(',')}"
             id="${cardId}">

      <!-- Top row: type label + award badge -->
      <div class="pub-card__top">
        <span class="tag tag--muted">${pub.type ?? 'Paper'}</span>
        ${pub.award ? `
          <span class="card__award">
            ${trophyIcon()} ${pub.award}
          </span>
        ` : ''}
        ${pub.featured ? `
          <span class="tag tag--primary">Featured</span>
        ` : ''}
      </div>

      <!-- Title -->
      <h3 class="pub-card__title">
        ${pub.doiUrl
          ? `<a href="${pub.doiUrl}" target="_blank" rel="noopener noreferrer"
               class="pub-card__title-link">${pub.title}</a>`
          : pub.title
        }
      </h3>

      <!-- Authors -->
      <p class="pub-card__authors">
        ${formatAuthors(pub.authors)}
      </p>

      <!-- Venue meta row -->
      <div class="pub-card__meta">
        <span class="pub-card__venue">${pub.journal ?? pub.conference ?? ''}</span>
        ${pub.journal || pub.conference ? `<span class="card__meta-sep">·</span>` : ''}
        <span class="pub-card__year">${pub.year}</span>
        ${pub.volume ? `<span class="card__meta-sep">·</span><span>Vol. ${pub.volume}</span>` : ''}
        ${pub.pages  ? `<span class="card__meta-sep">·</span><span>pp. ${pub.pages}</span>` : ''}
      </div>

      <!-- Abstract (collapsible) -->
      ${hasAbstract ? `
        <div class="pub-abstract" id="${abstractId}" hidden>
          <p class="pub-abstract__text">${pub.abstract}</p>
        </div>
      ` : ''}

      <!-- Tags row -->
      ${(pub.tags ?? []).length > 0 ? `
        <div class="card__tags" aria-label="Topics">
          ${pub.tags.map(tag => `<span class="tag tag--muted">${tag}</span>`).join('')}
        </div>
      ` : ''}

      <!-- Footer: actions -->
      <div class="pub-card__actions">
        <div class="pub-card__links">
          ${pub.doiUrl ? `
            <a href="${pub.doiUrl}" class="card__link" target="_blank"
               rel="noopener noreferrer" aria-label="View paper on DOI">
              ${externalIcon()} DOI
            </a>
          ` : ''}
          ${pub.pdfUrl ? `
            <a href="${pub.pdfUrl}" class="card__link" target="_blank"
               rel="noopener noreferrer" aria-label="Download PDF">
              ${downloadIcon()} PDF
            </a>
          ` : ''}
          ${pub.codeUrl ? `
            <a href="${pub.codeUrl}" class="card__link" target="_blank"
               rel="noopener noreferrer" aria-label="View code">
              ${codeIcon()} Code
            </a>
          ` : ''}
        </div>

        <div class="pub-card__btns">
          ${hasAbstract ? `
            <button class="btn btn--ghost btn--sm pub-abstract-toggle"
                    data-target="${abstractId}"
                    aria-expanded="false"
                    aria-controls="${abstractId}">
              Abstract
            </button>
          ` : ''}
          ${hasBibtex ? `
            <button class="btn btn--ghost btn--sm pub-cite-btn"
                    data-bibtex="${encodeURIComponent(pub.bibtex)}"
                    aria-label="Copy BibTeX citation">
              ${copyIcon()} Cite
            </button>
          ` : ''}
        </div>
      </div>

    </article>
  `;
}


/* ─── Filter Logic ───────────────────────────────────────────*/
export function initResearchFilters() {
  const grid     = document.querySelector('#pub-grid');
  const empty    = document.querySelector('#pub-empty');
  const status   = document.querySelector('#filter-status');
  const emptyRst = document.querySelector('#pub-empty-reset');
  if (!grid) return;

  // All filter buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const type  = btn.dataset.filterType;
      const value = btn.dataset.filterValue;

      // Update button states
      document.querySelectorAll('.filter-btn').forEach(b => {
        b.classList.remove('filter-btn--active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('filter-btn--active');
      btn.setAttribute('aria-pressed', 'true');

      // Filter cards
      const cards   = grid.querySelectorAll('.pub-card');
      let visible   = 0;

      cards.forEach(card => {
        const show = (
          type === 'all' ||
          (type === 'year'  && card.dataset.year   === value) ||
          (type === 'topic' && card.dataset.topics.split(',').includes(value))
        );
        card.hidden = !show;
        if (show) visible++;
      });

      // Empty state
      empty.hidden     = visible > 0;
      empty.setAttribute('aria-hidden', visible > 0 ? 'true' : 'false');

      // Screen reader announcement
      if (status) {
        status.textContent = `Showing ${visible} publication${visible !== 1 ? 's' : ''}`;
      }
    });
  });

  // Reset from empty state button
  emptyRst?.addEventListener('click', () => {
    const allBtn = document.querySelector('[data-filter-type="all"]');
    allBtn?.click();
  });

  // Abstract toggle
  grid.addEventListener('click', e => {
    const toggleBtn = e.target.closest('.pub-abstract-toggle');
    if (!toggleBtn) return;

    const targetId  = toggleBtn.dataset.target;
    const abstractEl = document.getElementById(targetId);
    if (!abstractEl) return;

    const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    abstractEl.hidden = isExpanded;
    toggleBtn.setAttribute('aria-expanded', String(!isExpanded));
    toggleBtn.textContent = isExpanded ? 'Abstract' : 'Hide Abstract';
  });

  // Cite / BibTeX copy
  grid.addEventListener('click', async e => {
    const citeBtn = e.target.closest('.pub-cite-btn');
    if (!citeBtn) return;

    const bibtex = decodeURIComponent(citeBtn.dataset.bibtex ?? '');
    if (!bibtex) return;

    try {
      await navigator.clipboard.writeText(bibtex);
      const orig = citeBtn.innerHTML;
      citeBtn.textContent = '✓ Copied!';
      citeBtn.disabled = true;
      setTimeout(() => {
        citeBtn.innerHTML = orig;
        citeBtn.disabled  = false;
      }, 2000);
    } catch {
      // Fallback for browsers that block clipboard API
      const ta = document.createElement('textarea');
      ta.value = bibtex;
      ta.style.position = 'fixed';
      ta.style.opacity  = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      citeBtn.textContent = '✓ Copied!';
      setTimeout(() => { citeBtn.innerHTML = `${copyIcon()} Cite`; }, 2000);
    }
  });
}


/* ─── Helpers ────────────────────────────────────────────────*/

/**
 * Format author list, bolding "Utkarsh Singh" wherever it appears.
 */
function formatAuthors(authors = []) {
  return authors
    .map(a => a.includes('Singh') && a.includes('Utkarsh')
      ? `<strong>${a}</strong>`
      : a
    )
    .join(', ');
}

function errorState() {
  return `<section class="section"><div class="container">
    <p class="error-state">Could not load publications. Check content/publications.json.</p>
  </div></section>`;
}


/* ─── Inline SVG icons ───────────────────────────────────────*/
function externalIcon() {
  return `<svg width="12" height="12" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="2" stroke-linecap="round"
    stroke-linejoin="round" aria-hidden="true">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
    <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
  </svg>`;
}

function downloadIcon() {
  return `<svg width="12" height="12" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="2" stroke-linecap="round"
    stroke-linejoin="round" aria-hidden="true">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
  </svg>`;
}

function codeIcon() {
  return `<svg width="12" height="12" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="2" stroke-linecap="round"
    stroke-linejoin="round" aria-hidden="true">
    <polyline points="16 18 22 12 16 6"/>
    <polyline points="8 6 2 12 8 18"/>
  </svg>`;
}

function copyIcon() {
  return `<svg width="12" height="12" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="2" stroke-linecap="round"
    stroke-linejoin="round" aria-hidden="true">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
  </svg>`;
}

function trophyIcon() {
  return `<svg width="11" height="11" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="2" stroke-linecap="round"
    stroke-linejoin="round" aria-hidden="true">
    <polyline points="8 21 12 17 16 21"/>
    <line x1="12" y1="17" x2="12" y2="8"/>
    <path d="M7 4H4a2 2 0 0 0-2 2v1c0 3.31 2.69 6 6 6h8c3.31 0 6-2.69 6-6V6a2 2 0 0 0-2-2h-3"/>
    <rect x="7" y="2" width="10" height="6" rx="1"/>
  </svg>`;
}
