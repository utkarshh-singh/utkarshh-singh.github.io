/* =============================================================
   EXPERIENCE.JS — Standalone experience renderer
   
   Used by Skills.js internally (timeline).
   Can also be imported separately if needed.
   Reads from: content/experience.json
   ============================================================= */

import { fetchJSON } from '../utils/render.js';

export async function buildExperience() {
  const data = await fetchJSON('./content/experience.json');
  if (!data) return '<p class="error-state">Could not load experience.</p>';

  const jobs = data.experience ?? [];

  return `
    <section class="experience-section section" aria-labelledby="exp-standalone-heading">
      <div class="container">
        <div class="section-header">
          <div class="section-label">Career</div>
          <h2 class="section-title" id="exp-standalone-heading">Experience</h2>
        </div>
        <div class="timeline" style="padding-left: var(--space-6); position: relative;">
          <div style="position:absolute;left:7px;top:8px;bottom:8px;width:1px;background:var(--color-divider)"></div>
          ${jobs.map((job, i) => `
            <div class="timeline-item" id="exp-standalone-${i}">
              <div class="timeline-item__dot"></div>
              <div class="timeline-item__content">
                <div class="timeline-item__period">
                  ${job.startYear ?? job.start ?? ''} — ${job.endYear ?? job.end ?? 'Present'}
                </div>
                <h4 class="timeline-item__title">${job.role ?? job.title ?? ''}</h4>
                <p class="timeline-item__org">
                  ${job.organization ?? job.company ?? ''}
                  ${job.location ? `<span class="timeline-item__loc"> · ${job.location}</span>` : ''}
                </p>
                ${job.description ? `<p class="timeline-item__note">${job.description}</p>` : ''}
                ${(job.highlights ?? []).length ? `
                  <ul class="service-card__list" role="list" style="margin-top:var(--space-2)">
                    ${job.highlights.map(h => `
                      <li class="service-card__list-item">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" stroke-width="2.5" stroke-linecap="round"
                          stroke-linejoin="round" aria-hidden="true">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        ${h}
                      </li>`).join('')}
                  </ul>` : ''}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}
