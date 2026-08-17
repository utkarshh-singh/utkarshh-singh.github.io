/* =============================================================
   PROJECTSLIST.JS — Projects page body
   ============================================================= */

import { fetchJSON } from '../core/data.js';
import { icon } from '../core/icons.js';
import { buildPageHeader } from './PageHeader.js';

export async function buildProjectsPage() {
  const data = await fetchJSON('./content/projects.json');
  const projects = (data?.projects ?? []).sort((a, b) => (a.displayPriority ?? 99) - (b.displayPriority ?? 99));
  const hackathons = data?.hackathons ?? [];

  const header = buildPageHeader({
    eyebrow: 'Projects',
    title: 'Research-to-outcome builds',
    subtitle: 'Applied and experimental work spanning quantum kernels, neural architectures, reservoir computing, materials discovery, and hardware benchmarking infrastructure.',
    stats: [
      { value: `${projects.length}`, label: 'Projects' },
      { value: `${projects.filter((p) => p.featured).length}`, label: 'Featured' },
      { value: `${hackathons.length}`, label: 'Challenges' },
    ],
  });

  return `
    ${header}
    <section class="section section--tight">
      <div class="container">
        <div class="card-grid card-grid--2" data-reveal-group>
          ${projects.map((p) => projectCard(p)).join('')}
        </div>
      </div>
    </section>

    ${hackathons.length ? `
      <section class="section section--alt">
        <div class="container">
          <div class="section-header">
            <p class="section-eyebrow">Challenges</p>
            <h2 class="section-title">Quantum challenges &amp; hackathons</h2>
          </div>
          <div class="card-grid" data-reveal-group>
            ${hackathons.map((h) => hackathonCard(h)).join('')}
          </div>
        </div>
      </section>
    ` : ''}
  `;
}

function projectCard(p) {
  return `
    <article class="card tilt-perspective reveal-fade" data-tilt>
      ${p.featured ? `<span class="featured-badge pill pill--accent">${icon.star(12)} Featured</span>` : ''}
      <div class="card__meta">${(p.category ?? '').replace('-', ' ')}</div>
      <h3 class="card__title">${p.title}</h3>
      <p class="card__desc">${p.description}</p>
      <div class="card__tags">
        ${(p.tags ?? []).map((t) => `<span class="tag">${t}</span>`).join('')}
      </div>
      <div class="card__footer">
        <span class="status-dot status-dot--published">${p.outcome ?? ''}</span>
        <div class="card__links">
          ${p.relatedPublication ? `<a class="card__link" href="./research.html">Paper ${icon.external()}</a>` : ''}
          ${p.relatedPatent ? `<a class="card__link" href="./patents.html">Patent ${icon.external()}</a>` : ''}
        </div>
      </div>
    </article>
  `;
}

function hackathonCard(h) {
  return `
    <article class="card tilt-perspective reveal-fade" data-tilt>
      <div class="card__top">
        <div class="skill-card__icon">${icon.trophy(20)}</div>
        <span class="card__index">${h.year}</span>
      </div>
      <h3 class="card__title">${h.name}</h3>
      <p class="card__desc">${h.focus}</p>
      <span class="pill pill--accent">${h.achievement}</span>
    </article>
  `;
}
