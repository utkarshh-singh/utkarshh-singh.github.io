/* =============================================================
   PATENTSLIST.JS — Patents page body
   ============================================================= */

import { fetchJSON } from '../core/data.js';
import { icon } from '../core/icons.js';
import { buildPageHeader } from './PageHeader.js';

export async function buildPatentsPage() {
  const data = await fetchJSON('./content/patents.json');
  const patents = (data?.patents ?? []).sort((a, b) => (a.displayPriority ?? 99) - (b.displayPriority ?? 99));

  const header = buildPageHeader({
    eyebrow: 'Patents',
    title: 'Filed &amp; pending IP',
    subtitle: 'WIPO patent applications protecting resource-efficient quantum algorithms — from kernel methods to neural architectures and reservoir computing feature maps.',
    stats: [
      { value: `${patents.length}`, label: 'Applications' },
      { value: `${new Set(patents.map((p) => p.organization)).size}`, label: 'Filing bodies' },
    ],
  });

  return `
    ${header}
    <section class="section section--tight">
      <div class="container">
        <div class="card-grid card-grid--2" data-reveal-group>
          ${patents.map((p, i) => patentCard(p, i)).join('')}
        </div>
      </div>
    </section>
  `;
}

function patentCard(p, i) {
  return `
    <article class="card tilt-perspective reveal-fade" data-tilt>
      <div class="card__top">
        <span class="card__index">${String(i + 1).padStart(2, '0')} / ${p.organization}</span>
        ${icon.shield(18)}
      </div>
      <h3 class="card__title">${p.title}</h3>
      <p class="card__desc">${p.summary}</p>
      <div class="card__tags">
        ${(p.tags ?? []).slice(0, 4).map((t) => `<span class="tag">${t}</span>`).join('')}
      </div>
      <div class="card__footer">
        <span class="status-dot status-dot--${p.status}">${p.status} · ${p.filingYear}</span>
        <div class="card__links">
          ${p.url ? `<a class="card__link" href="${p.url}" target="_blank" rel="noopener noreferrer">View filing ${icon.external()}</a>` : `<span class="card__meta" style="margin:0;">Filing in progress</span>`}
        </div>
      </div>
    </article>
  `;
}
