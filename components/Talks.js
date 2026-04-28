import { fetchJSON } from '../utils/render.js';

export async function buildTalks() {
  const data = await fetchJSON('./content/talks.json');
  if (!data) return errorState();

  const talks     = data.talks     ?? data.presentations ?? [];
  const training  = data.training  ?? data.workshops     ?? [];

  return `
    <section class="talks-section section" aria-labelledby="talks-heading">
      <div class="container">
        <div class="section-header">
          <div class="section-label">Speaking</div>
          <h2 class="section-title" id="talks-heading">Talks & Training</h2>
          <p class="section-subtitle">
            Conference presentations, invited talks, and quantum computing
            workshops delivered internationally.
          </p>
        </div>

        ${talks.length > 0 ? `
          <h3 class="talks-subheading">Presentations</h3>
          <div class="talks-list" role="list">
            ${talks.map((t, i) => talkCard(t, i, 'talk')).join('')}
          </div>
        ` : ''}

        ${training.length > 0 ? `
          <h3 class="talks-subheading" style="margin-top: var(--space-12)">Workshops & Training</h3>
          <div class="talks-list" role="list">
            ${training.map((t, i) => talkCard(t, i, 'training')).join('')}
          </div>
        ` : ''}
      </div>
    </section>
  `;
}

function talkCard(talk, i, type) {
  const title    = talk.title ?? talk.name ?? '';
  const event    = talk.event ?? talk.conference ?? talk.venue ?? '';
  const location = talk.location ?? '';
  const date     = talk.date ?? talk.year ?? '';
  const url      = talk.url ?? talk.slidesUrl ?? talk.videoUrl ?? '';
  const tags     = talk.tags ?? talk.topics ?? [];

  return `
    <div class="talk-card" role="listitem" id="${type}-${i}">
      <div class="talk-card__date">${date}</div>
      <div class="talk-card__content">
        <h4 class="talk-card__title">
          ${url
            ? `<a href="${url}" target="_blank" rel="noopener noreferrer" class="talk-card__link">${title}</a>`
            : title}
        </h4>
        <p class="talk-card__event">
          ${event}${location ? ` · ${location}` : ''}
        </p>
        ${tags.length ? `
          <div class="card__tags">
            ${tags.map(t => `<span class="tag tag--muted">${t}</span>`).join('')}
          </div>` : ''}
      </div>
      ${url ? `
        <a href="${url}" class="talk-card__action card__link"
           target="_blank" rel="noopener noreferrer" aria-label="View ${title}">
          ${extIcon()} View
        </a>` : ''}
    </div>
  `;
}
function extIcon() {
  return `<svg width="12" height="12" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="2" stroke-linecap="round"
    stroke-linejoin="round" aria-hidden="true">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
    <polyline points="15 3 21 3 21 9"/>
    <line x1="10" y1="14" x2="21" y2="3"/></svg>`;
}
function errorState() {
  return `<section class="section"><div class="container">
    <p class="error-state">Could not load talks. Check content/talks.json.</p>
  </div></section>`;
}
