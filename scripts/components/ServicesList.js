/* =============================================================
   SERVICESLIST.JS — Services page body
   ============================================================= */

import { fetchJSON } from '../core/data.js';
import { icon } from '../core/icons.js';
import { buildPageHeader } from './PageHeader.js';
import { SITE } from '../../config/site.config.js';

const ICON_MAP = {
  search: icon.search,
  layers: icon.layers,
  'graduation-cap': icon.graduation,
};

export async function buildServicesPage() {
  const data = await fetchJSON('./content/services.json');
  const services = (data?.services ?? []).sort((a, b) => (a.displayPriority ?? 99) - (b.displayPriority ?? 99));

  const header = buildPageHeader({
    eyebrow: 'Services',
    title: 'Advisory &amp; hands-on QML work',
    subtitle: 'Practical support for teams exploring quantum machine learning — from feasibility and strategy through prototype development and structured training.',
  });

  return `
    ${header}
    <section class="section section--tight">
      <div class="container">
        <div class="card-grid" data-reveal-group>
          ${services.map((s) => serviceCard(s)).join('')}
        </div>
      </div>
    </section>

    <section class="section section--alt">
      <div class="container">
        <div class="contact-call-card reveal-fade">
          <div>
            <h2>Have a use case in mind?</h2>
            <p>Tell me about your team, timeline, and where quantum machine learning might fit — I'll follow up with a candid read on feasibility.</p>
          </div>
          <a href="mailto:${SITE.email}" class="btn btn--primary" data-magnetic="0.2">Start a conversation ${icon.arrow()}</a>
        </div>
      </div>
    </section>
  `;
}

function serviceCard(s) {
  const iconFn = ICON_MAP[s.icon] ?? icon.layers;
  return `
    <article class="card tilt-perspective reveal-fade" data-tilt>
      <div class="skill-card__icon" style="margin-bottom:1.1rem;">${iconFn(22)}</div>
      <h3 class="card__title">${s.name}</h3>
      <p class="card__meta" style="text-transform:none; letter-spacing:0; font-family:var(--font-body); font-size:var(--fs-sm); color:var(--text-dim);">${s.tagline}</p>
      <p class="card__desc">${s.description}</p>
      <div class="card__tags">
        ${(s.deliverables ?? []).map((d) => `<span class="tag">${d}</span>`).join('')}
      </div>
      <div class="card__footer" style="border-top:none; padding-top:0;">
        <span class="card__meta" style="margin:0;">For: ${(s.targetClients ?? []).slice(0, 2).join(', ')}</span>
      </div>
    </article>
  `;
}
