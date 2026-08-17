/* =============================================================
   TALKSLIST.JS — Talks page body
   ============================================================= */

import { fetchJSON } from '../core/data.js';
import { icon } from '../core/icons.js';
import { buildPageHeader } from './PageHeader.js';

export async function buildTalksPage() {
  const data = await fetchJSON('./content/talks.json');
  const talks = (data?.talks ?? []).sort((a, b) => (a.displayPriority ?? 99) - (b.displayPriority ?? 99));
  const training = data?.training ?? [];

  const header = buildPageHeader({
    eyebrow: 'Talks',
    title: 'Talks, posters &amp; mentorship',
    subtitle: 'Invited talks, conference presentations, and community mentorship across the quantum computing and Qiskit ecosystem.',
    stats: [
      { value: `${talks.length}`, label: 'Talks & posters' },
      { value: `${training.length}`, label: 'Mentorship roles' },
    ],
  });

  return `
    ${header}
    <section class="section section--tight">
      <div class="container">
        <div class="card-grid card-grid--2" data-reveal-group>
          ${talks.map((t) => talkCard(t)).join('')}
        </div>
      </div>
    </section>

    ${training.length ? `
      <section class="section section--alt">
        <div class="container">
          <div class="section-header">
            <p class="section-eyebrow">Community</p>
            <h2 class="section-title">Mentorship &amp; training</h2>
          </div>
          <div class="card-grid" data-reveal-group>
            ${training.map((t) => trainingCard(t)).join('')}
          </div>
        </div>
      </section>
    ` : ''}
  `;
}

function talkCard(t) {
  return `
    <article class="card tilt-perspective reveal-fade" data-tilt>
      ${t.featured ? `<span class="featured-badge pill pill--accent">${icon.star(12)} Featured</span>` : ''}
      <div class="card__meta">${t.type?.replace('-', ' ')} · ${t.year}</div>
      <h3 class="card__title">${t.title}</h3>
      <p class="card__desc">${t.description}</p>
      ${t.award ? `<div class="award-strip">${icon.trophy(14)} ${t.award}</div>` : ''}
      <div class="card__tags">
        ${(t.tags ?? []).map((tag) => `<span class="tag">${tag}</span>`).join('')}
      </div>
      <div class="card__footer">
        <span class="status-dot status-dot--published">${t.event}</span>
        <span class="card__meta" style="margin:0;">${t.location}</span>
      </div>
    </article>
  `;
}

function trainingCard(t) {
  return `
    <article class="card tilt-perspective reveal-fade" data-tilt>
      <div class="card__top">
        <div class="skill-card__icon">${icon.users(20)}</div>
        <span class="card__index">${t.year}</span>
      </div>
      <h3 class="card__title">${t.title}</h3>
      <p class="card__desc">${t.description}</p>
      <span class="pill">${t.organization}</span>
    </article>
  `;
}
