/* =============================================================
   RESEARCHLIST.JS — Publications page body
   ============================================================= */

import { fetchJSON } from '../core/data.js';
import { icon } from '../core/icons.js';
import { buildPageHeader } from './PageHeader.js';

export async function buildResearchPage() {
  const data = await fetchJSON('./content/publications.json');
  const pubs = (data?.publications ?? []).sort((a, b) => (a.displayPriority ?? 99) - (b.displayPriority ?? 99));

  const allTags = [...new Set(pubs.flatMap((p) => p.tags ?? []))].slice(0, 10);

  const header = buildPageHeader({
    eyebrow: 'Research',
    title: 'Publications & preprints',
    subtitle: 'Peer-reviewed papers and preprints on resource-efficient quantum machine learning — kernels, neural architectures, reservoir computing, and applied quantum AI.',
    stats: [
      { value: `${pubs.length}`, label: 'Publications' },
      { value: `${pubs.filter((p) => p.status === 'published').length}`, label: 'Published' },
      { value: `${new Set(pubs.map((p) => p.venue)).size}`, label: 'Venues' },
    ],
  });

  return `
    ${header}
    <section class="section section--tight">
      <div class="container">
        <div class="filter-bar" id="research-filters" role="group" aria-label="Filter publications by tag">
          <button class="filter-chip is-active" data-filter="all">All</button>
          ${allTags.map((t) => `<button class="filter-chip" data-filter="${t}">${t}</button>`).join('')}
        </div>

        <div class="card-grid card-grid--2" id="research-grid" data-reveal-group>
          ${pubs.map((p, i) => publicationCard(p, i)).join('')}
        </div>
      </div>
    </section>
  `;
}

function publicationCard(p, i) {
  const tags = (p.tags ?? []).join(',');
  return `
    <article class="card tilt-perspective reveal-fade" data-tilt data-tags="${tags}">
      ${p.featured ? `<span class="featured-badge pill pill--accent">${icon.star(12)} Featured</span>` : ''}
      <div class="card__meta">${p.venue ?? ''} · ${p.year ?? ''}${typeof p.citedBy === 'number' && p.citedBy > 0 ? ` · Cited by ${p.citedBy}` : ''}</div>
      <h3 class="card__title">${p.title}</h3>
      <p class="card__desc">${p.abstract ?? ''}</p>
      ${p.award ? `<div class="award-strip">${icon.trophy(14)} ${p.award}</div>` : ''}
      <div class="card__tags">
        ${(p.tags ?? []).map((t) => `<span class="tag">${t}</span>`).join('')}
      </div>
      <div class="card__footer">
        <span class="status-dot status-dot--${p.status}">${p.status}</span>
        <div class="card__links">
          ${p.links?.doi ? `<a class="card__link" href="${p.links.doi}" target="_blank" rel="noopener noreferrer">DOI ${icon.external()}</a>` : ''}
          ${p.links?.arxiv ? `<a class="card__link" href="https://arxiv.org/abs/${p.links.arxiv}" target="_blank" rel="noopener noreferrer">arXiv ${icon.external()}</a>` : ''}
          ${p.relatedPatent ? `<a class="card__link" href="./patents.html">Related patent ${icon.external()}</a>` : ''}
        </div>
      </div>
    </article>
  `;
}

export function initResearchInteractions() {
  const filterBar = document.getElementById('research-filters');
  const grid = document.getElementById('research-grid');
  if (!filterBar || !grid) return;

  filterBar.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-chip');
    if (!btn) return;
    filterBar.querySelectorAll('.filter-chip').forEach((c) => c.classList.remove('is-active'));
    btn.classList.add('is-active');
    const filter = btn.dataset.filter;
    grid.querySelectorAll('.card').forEach((card) => {
      const tags = card.dataset.tags?.split(',') ?? [];
      const show = filter === 'all' || tags.includes(filter);
      card.style.display = show ? '' : 'none';
    });
  });
}
