/* =============================================================
   HOMEPREVIEWS.JS — Homepage preview sections
   
   Shows teasers of each major section with "View all →" links.
   Never renders full section content — that lives on each page.
   
   Reads from:
   - content/publications.json  (3 featured papers)
   - content/projects.json      (3 featured projects)
   - content/patents.json       (count + 1-line summary)
   - content/experience.json    (for stats bar)
   ============================================================= */

import { fetchJSON } from '../utils/render.js';

export async function buildHomePreviews() {
  const [pubs, projs, patents, exp, skills] = await Promise.all([
    fetchJSON('./content/publications.json'),
    fetchJSON('./content/projects.json'),
    fetchJSON('./content/patents.json'),
    fetchJSON('./content/experience.json'),
    fetchJSON('./content/skills.json'),
  ]);

  const publications = (pubs?.publications ?? []);
  const featured     = publications.filter(p => p.featured).slice(0, 3);
  const projects     = (projs?.projects ?? []).filter(p => p.featured).slice(0, 3);
  const patentList   = (patents?.patents ?? []);
  const yearsExp     = new Date().getFullYear() - 2019; // PhD started ~2019

  return `
    <!-- ── Research Preview ──────────────────────────────────── -->
    <section class="home-preview section section--alt" aria-labelledby="preview-research-heading">
      <div class="container">
        <div class="preview-header">
          <div>
            <div class="section-label">Research</div>
            <h2 class="preview-title" id="preview-research-heading">Featured Publications</h2>
          </div>
          <a href="./research.html" class="preview-link">
            View all ${publications.length} papers
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round" aria-hidden="true">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </a>
        </div>
        <div class="preview-list">
          ${featured.map(pub => pubPreviewCard(pub)).join('')}
        </div>
      </div>
    </section>

    <!-- ── Projects Preview ──────────────────────────────────── -->
    <section class="home-preview section" aria-labelledby="preview-projects-heading">
      <div class="container">
        <div class="preview-header">
          <div>
            <div class="section-label">Work</div>
            <h2 class="preview-title" id="preview-projects-heading">Featured Projects</h2>
          </div>
          <a href="./projects.html" class="preview-link">
            View all projects
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round" aria-hidden="true">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </a>
        </div>
        <div class="preview-cards">
          ${projects.length > 0
            ? projects.map(proj => projectPreviewCard(proj)).join('')
            : defaultProjectCards()
          }
        </div>
      </div>
    </section>

    <!-- ── Patents Teaser ────────────────────────────────────── -->
    <section class="home-preview section section--alt" aria-labelledby="preview-patents-heading">
      <div class="container">
        <div class="patents-teaser card card--featured">
          <div class="patents-teaser__left">
            <div class="section-label" id="preview-patents-heading">Intellectual Property</div>
            <h2 class="preview-title">${patentList.length} Pending Patents</h2>
            <p class="patents-teaser__desc">
              International WIPO filings covering novel quantum kernel methods,
              quantum neural network architectures, and quantum reservoir computing systems.
            </p>
            <a href="./patents.html" class="btn btn--primary">
              View Patents
              <svg class="btn__arrow" width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </a>
          </div>
          <div class="patents-teaser__right" aria-hidden="true">
            <div class="patents-teaser__shield">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="1.2" stroke-linecap="round"
                stroke-linejoin="round" opacity="0.25">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              <span class="patents-teaser__count">${patentList.length}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── Contact CTA Strip ─────────────────────────────────── -->
    <section class="home-cta section" aria-label="Contact call to action">
      <div class="container">
        <div class="cta-strip">
          <div class="cta-strip__text">
            <h2 class="cta-strip__heading">Open to collaborations & consulting</h2>
            <p class="cta-strip__sub">
              Research partnerships · Industry projects · Speaking invitations
            </p>
          </div>
          <div class="cta-strip__actions">
            <a href="./contact.html" class="btn btn--primary btn--lg">Get in Touch</a>
            <a href="./services.html" class="btn btn--ghost btn--lg">View Services</a>
          </div>
        </div>
      </div>
    </section>
  `;
}

/* ── Sub-renderers ───────────────────────────────────────── */

function pubPreviewCard(pub) {
  const authors = (pub.authors ?? []).map(a =>
    a.includes('Utkarsh') ? `<strong>${a}</strong>` : a
  ).join(', ');

  return `
    <div class="pub-preview-card">
      <div class="pub-preview-card__meta">
        <span class="tag tag--muted">${pub.venue ?? pub.journal ?? 'Preprint'}</span>
        ${pub.award ? `<span class="tag tag--primary">🏆 ${pub.award}</span>` : ''}
        <span class="pub-preview-card__year">${pub.year}</span>
      </div>
      <h3 class="pub-preview-card__title">
        ${pub.doiUrl
          ? `<a href="${pub.doiUrl}" target="_blank" rel="noopener noreferrer">${pub.title}</a>`
          : pub.title}
      </h3>
      <p class="pub-preview-card__authors">${authors}</p>
      <div class="card__tags">
        ${(pub.tags ?? []).slice(0,4).map(t => `<span class="tag tag--muted">${t}</span>`).join('')}
      </div>
    </div>
  `;
}

function projectPreviewCard(proj) {
  const statusClass = { 'Active': 'status--active', 'Completed': 'status--done',
    'Ongoing': 'status--ongoing', 'In Progress': 'status--ongoing' }[proj.status] ?? 'status--done';

  return `
    <div class="proj-preview-card card">
      <div class="proj-card__top">
        <span class="proj-status ${statusClass}">
          <span class="proj-status__dot"></span>${proj.status ?? 'Research'}
        </span>
        ${proj.domain ? `<span class="tag tag--muted">${proj.domain}</span>` : ''}
      </div>
      <h3 class="card__title">${proj.name ?? proj.title}</h3>
      <p class="card__body">${proj.description ?? ''}</p>
      <div class="card__tags">
        ${(proj.technologies ?? proj.tech ?? []).slice(0,3).map(t =>
          `<span class="tag tag--muted">${t}</span>`).join('')}
      </div>
    </div>
  `;
}

function defaultProjectCards() {
  const defaults = [
    { title: 'Resource-Efficient Quantum Kernels', domain: 'Quantum ML', status: 'Completed',
      desc: 'Novel kernel methods reducing circuit depth for near-term quantum advantage.' },
    { title: 'Quantum Reservoir Computing', domain: 'Time-Series', status: 'Active',
      desc: 'Temporal data processing using quantum dynamical systems as reservoirs.' },
    { title: 'MOF Hydrogen Storage Discovery', domain: 'Materials Science', status: 'Completed',
      desc: 'Active learning + quantum ML for accelerating material discovery pipelines.' },
  ];
  return defaults.map(d => `
    <div class="proj-preview-card card">
      <div class="proj-card__top">
        <span class="proj-status ${d.status === 'Active' ? 'status--active' : 'status--done'}">
          <span class="proj-status__dot"></span>${d.status}
        </span>
        <span class="tag tag--muted">${d.domain}</span>
      </div>
      <h3 class="card__title">${d.title}</h3>
      <p class="card__body">${d.desc}</p>
    </div>
  `).join('');
}

