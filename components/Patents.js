/* =============================================================
   PATENTS.JS — Patents Section
   Reads from: content/patents.json
   ============================================================= */

import { fetchJSON } from '../utils/render.js';

export async function buildPatents() {
  const data = await fetchJSON('./content/patents.json');
  if (!data) return errorState();

  const patents = data.patents ?? [];

  return `
    <section class="patents-section section" aria-labelledby="patents-heading">
      <div class="container">

        <div class="section-header">
          <div class="section-label">Intellectual Property</div>
          <h2 class="section-title" id="patents-heading">Patents</h2>
          <p class="section-subtitle">
            Pending international patents filed under WIPO covering novel quantum
            machine learning architectures and methods.
          </p>
        </div>

        <div class="patents-grid" role="list" aria-label="Patents">
          ${patents.map((patent, i) => patentCard(patent, i)).join('')}
        </div>

        <!-- Patent disclaimer -->
        <p class="patents-note">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          All patents are pending and filed internationally under WIPO.
          Patent numbers and full claims available upon request.
        </p>

      </div>
    </section>
  `;
}

function patentCard(patent, index) {
  const statusClass = {
    'Pending':  'status--ongoing',
    'Granted':  'status--active',
    'Filed':    'status--ongoing',
  }[patent.status] ?? 'status--ongoing';

  return `
    <article class="patent-card card card--featured" role="listitem" id="patent-${index}">

      <!-- Number + Status row -->
      <div class="patent-card__top">
        <span class="patent-card__number">
          ${shieldIcon()} Patent ${index + 1}
          ${patent.applicationNumber ? `<span class="patent-card__appnum">#${patent.applicationNumber}</span>` : ''}
        </span>
        <span class="proj-status ${statusClass}">
          <span class="proj-status__dot"></span>
          ${patent.status ?? 'Pending'}
        </span>
      </div>

      <!-- Title -->
      <h3 class="card__title">${patent.title}</h3>

      <!-- Summary -->
      <p class="card__body">${patent.summary ?? patent.description ?? ''}</p>

      <!-- Meta row -->
      <div class="patent-card__meta">
        ${patent.filingDate ? `
          <div class="patent-card__meta-item">
            <span class="patent-card__meta-label">Filed</span>
            <span class="patent-card__meta-value">${patent.filingDate}</span>
          </div>` : ''}
        ${patent.jurisdiction ? `
          <div class="patent-card__meta-item">
            <span class="patent-card__meta-label">Jurisdiction</span>
            <span class="patent-card__meta-value">${patent.jurisdiction}</span>
          </div>` : ''}
        ${patent.inventors ? `
          <div class="patent-card__meta-item">
            <span class="patent-card__meta-label">Inventors</span>
            <span class="patent-card__meta-value">${patent.inventors.join(', ')}</span>
          </div>` : ''}
        ${patent.organization ? `
          <div class="patent-card__meta-item">
            <span class="patent-card__meta-label">Assignee</span>
            <span class="patent-card__meta-value">${patent.organization}</span>
          </div>` : ''}
      </div>

      <!-- Tags: claims / technology area -->
      ${(patent.tags ?? patent.technicalAreas ?? []).length > 0 ? `
        <div class="card__tags">
          ${(patent.tags ?? patent.technicalAreas ?? []).map(t =>
            `<span class="tag tag--primary">${t}</span>`
          ).join('')}
        </div>
      ` : ''}

      <!-- ✅ ADD THIS BLOCK -->
      ${patent.url ? `
        <div class="patent-card__footer">
          <a href="${patent.url}"
            target="_blank"
            rel="noopener noreferrer"
            class="patent-card__link">
            View on Google Patents
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2.5"
              stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
          </a>
        </div>
      ` : ''}
    </article>
  `;
}

function shieldIcon() {
  return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="2" stroke-linecap="round"
    stroke-linejoin="round" aria-hidden="true">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>`;
}
function errorState() {
  return `<section class="section"><div class="container">
    <p class="error-state">Could not load patents. Check content/patents.json.</p>
  </div></section>`;
}
