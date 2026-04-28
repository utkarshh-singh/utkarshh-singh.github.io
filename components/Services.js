import { fetchJSON } from '../utils/render.js';

export async function buildServices() {
  const data = await fetchJSON('./content/services.json');
  if (!data) return errorState();

  const services = data.services ?? data.offerings ?? [];
  const pricing  = data.pricing  ?? null;

  return `
    <section class="services-section section section--alt" aria-labelledby="services-heading">
      <div class="container">
        <div class="section-header">
          <div class="section-label">Consulting</div>
          <h2 class="section-title" id="services-heading">Services</h2>
          <p class="section-subtitle">
            Specialized consulting in quantum machine learning — from research
            collaboration to implementation and team training.
          </p>
        </div>

        <div class="services-grid">
          ${services.map((svc, i) => serviceCard(svc, i)).join('')}
        </div>

        ${pricing ? `
          <div class="services-pricing card card--featured">
            <h3 class="section-label" style="margin-bottom:var(--space-4)">Engagement Model</h3>
            <div class="pricing-grid">
              ${Object.entries(pricing).map(([key, val]) => `
                <div class="pricing-item">
                  <span class="pricing-item__label">${key}</span>
                  <span class="pricing-item__value">${val}</span>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- CTA -->
        <div class="services-cta">
          <p class="services-cta__text">
            Interested in working together? Let's discuss your project.
          </p>
          <a href="./contact.html" class="btn btn--primary btn--lg">
            Get in Touch
            <svg class="btn__arrow" width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round" aria-hidden="true">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </a>
        </div>

      </div>
    </section>
  `;
}

function serviceCard(svc, i) {
  const title = svc.title ?? svc.name ?? '';
  const desc  = svc.description ?? svc.summary ?? '';
  const items = svc.deliverables ?? svc.includes ?? svc.items ?? [];
  const icon  = svc.icon ?? serviceIcon(title);

  return `
    <div class="service-card card" id="service-${i}">
      <div class="service-card__icon" aria-hidden="true">${icon}</div>
      <h3 class="card__title">${title}</h3>
      <p class="card__body">${desc}</p>
      ${items.length ? `
        <ul class="service-card__list" role="list">
          ${items.map(item => `
            <li class="service-card__list-item">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2.5" stroke-linecap="round"
                stroke-linejoin="round" aria-hidden="true">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              ${item}
            </li>
          `).join('')}
        </ul>
      ` : ''}
    </div>
  `;
}

function serviceIcon(title = '') {
  const t = title.toLowerCase();
  if (t.includes('consult') || t.includes('adviso')) return '🧠';
  if (t.includes('research') || t.includes('collab')) return '🔬';
  if (t.includes('train') || t.includes('workshop')) return '📚';
  if (t.includes('develop') || t.includes('implement')) return '⚙️';
  if (t.includes('audit') || t.includes('review'))   return '🔍';
  return '✦';
}
function errorState() {
  return `<section class="section"><div class="container">
    <p class="error-state">Could not load services. Check content/services.json.</p>
  </div></section>`;
}
