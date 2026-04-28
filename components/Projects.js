/* =============================================================
   PROJECTS.JS — Research Projects & Domain Work Section
   
   Reads from:  content/projects.json
   
   Features:
   - Project cards with status badge (Active / Completed / Ongoing)
   - Domain category filter (auto-generated from data)
   - Tech stack tags per project
   - GitHub + Paper + Demo links
   - "Featured" project gets a larger card treatment
   ============================================================= */

import { fetchJSON } from '../utils/render.js';

export async function buildProjects() {
  const data = await fetchJSON('./content/projects.json');
  if (!data) return errorState();

  const projects = data.projects ?? [];
  const domains  = [...new Set(projects.map(p => p.domain).filter(Boolean))].sort();

  return `
    <section class="projects-section section section--alt" aria-labelledby="projects-heading">
      <div class="container">

        <div class="section-header">
          <div class="section-label">Work</div>
          <h2 class="section-title" id="projects-heading">Projects</h2>
          <p class="section-subtitle">
            Research prototypes, open-source tools, and applied quantum ML experiments
            spanning multiple domains.
          </p>
        </div>

        <!-- Domain Filter -->
        <div class="filter-bar" role="group" aria-label="Filter projects by domain">
          <button class="filter-btn filter-btn--active"
                  data-filter-type="all" data-filter-value="all"
                  aria-pressed="true">
            All <span class="filter-count">${projects.length}</span>
          </button>
          ${domains.map(d => `
            <button class="filter-btn"
                    data-filter-type="domain"
                    data-filter-value="${d}"
                    aria-pressed="false">
              ${d}
            </button>
          `).join('')}
        </div>

        <p class="sr-only" aria-live="polite" aria-atomic="true" id="proj-filter-status"></p>

        <!-- Projects Grid -->
        <div class="proj-grid" id="proj-grid" role="list">
          ${projects.map((proj, i) => projectCard(proj, i)).join('')}
        </div>

        <div class="empty-state" id="proj-empty" hidden aria-hidden="true">
          <p class="empty-state__text">No projects match this filter.</p>
          <button class="btn btn--ghost btn--sm" id="proj-empty-reset">Clear filter</button>
        </div>

      </div>
    </section>
  `;
}

function projectCard(proj, index) {
  const statusClass = {
    'Active':    'status--active',
    'Completed': 'status--done',
    'Ongoing':   'status--ongoing',
    'In Progress': 'status--ongoing',
  }[proj.status] ?? 'status--done';

  const techTags = (proj.technologies ?? proj.tech ?? []);

  return `
    <article class="proj-card card ${proj.featured ? 'proj-card--featured card--featured' : ''}"
             role="listitem"
             data-domain="${proj.domain ?? ''}"
             id="proj-${index}">

      <!-- Top row -->
      <div class="proj-card__top">
        <span class="proj-status ${statusClass}">
          <span class="proj-status__dot"></span>
          ${proj.status ?? 'Research'}
        </span>
        ${proj.featured ? `<span class="tag tag--primary">Featured</span>` : ''}
        ${proj.domain ? `<span class="tag tag--muted">${proj.domain}</span>` : ''}
      </div>

      <!-- Title + Description -->
      <h3 class="card__title">${proj.name ?? proj.title}</h3>
      <p class="card__body">${proj.description ?? proj.summary ?? ''}</p>

      <!-- Tech Stack -->
      ${techTags.length > 0 ? `
        <div class="card__tags proj-card__tech" aria-label="Technologies used">
          ${techTags.map(t => `<span class="tag tag--muted">${t}</span>`).join('')}
        </div>
      ` : ''}

      <!-- Links -->
      <div class="proj-card__links">
        ${proj.github ? `
          <a href="${proj.github}" class="card__link" target="_blank" rel="noopener noreferrer">
            ${githubIcon()} GitHub
          </a>` : ''}
        ${proj.paper ?? proj.paperUrl ? `
          <a href="${proj.paper ?? proj.paperUrl}" class="card__link" target="_blank" rel="noopener noreferrer">
            ${paperIcon()} Paper
          </a>` : ''}
        ${proj.demo ?? proj.demoUrl ? `
          <a href="${proj.demo ?? proj.demoUrl}" class="card__link" target="_blank" rel="noopener noreferrer">
            ${externalIcon()} Demo
          </a>` : ''}
      </div>

    </article>
  `;
}

export function initProjectFilters() {
  const grid    = document.querySelector('#proj-grid');
  const empty   = document.querySelector('#proj-empty');
  const status  = document.querySelector('#proj-filter-status');
  const reset   = document.querySelector('#proj-empty-reset');
  if (!grid) return;

  document.querySelectorAll('.projects-section .filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.projects-section .filter-btn').forEach(b => {
        b.classList.remove('filter-btn--active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('filter-btn--active');
      btn.setAttribute('aria-pressed', 'true');

      const type  = btn.dataset.filterType;
      const value = btn.dataset.filterValue;
      const cards = grid.querySelectorAll('.proj-card');
      let visible = 0;

      cards.forEach(card => {
        const show = type === 'all' || card.dataset.domain === value;
        card.hidden = !show;
        if (show) visible++;
      });

      if (empty) {
        empty.hidden = visible > 0;
        empty.setAttribute('aria-hidden', visible > 0 ? 'true' : 'false');
      }
      if (status) status.textContent = `Showing ${visible} project${visible !== 1 ? 's' : ''}`;
    });
  });

  reset?.addEventListener('click', () => {
    document.querySelector('.projects-section [data-filter-type="all"]')?.click();
  });
}

function githubIcon() {
  return `<svg width="12" height="12" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="2" stroke-linecap="round"
    stroke-linejoin="round" aria-hidden="true">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61
    c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0
    19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1
    A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7
    A3.37 3.37 0 0 0 9 18.13V22"/></svg>`;
}
function paperIcon() {
  return `<svg width="12" height="12" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="2" stroke-linecap="round"
    stroke-linejoin="round" aria-hidden="true">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <polyline points="10 9 9 9 8 9"/></svg>`;
}
function externalIcon() {
  return `<svg width="12" height="12" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="2" stroke-linecap="round"
    stroke-linejoin="round" aria-hidden="true">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
    <polyline points="15 3 21 3 21 9"/>
    <line x1="10" y1="14" x2="21" y2="3"/></svg>`;
}
function errorState() {
  return `<section class="section"><div class="container">
    <p class="error-state">Could not load projects. Check content/projects.json.</p>
  </div></section>`;
}
