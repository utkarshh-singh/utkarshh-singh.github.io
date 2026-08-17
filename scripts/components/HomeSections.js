/* =============================================================
   HOMESECTIONS.JS — Homepage body below the hero:
   currently / research preview / projects preview / patents strip /
   journey timeline / skills strip / services preview
   ============================================================= */

import { fetchJSON } from '../core/data.js';
import { icon } from '../core/icons.js';

export async function buildHomeSections() {
  const [identity, pubs, projects, patents, exp, skills, services] = await Promise.all([
    fetchJSON('./content/identity.json'),
    fetchJSON('./content/publications.json'),
    fetchJSON('./content/projects.json'),
    fetchJSON('./content/patents.json'),
    fetchJSON('./content/experience.json'),
    fetchJSON('./content/skills.json'),
    fetchJSON('./content/services.json'),
  ]);

  const featuredPubs = (pubs?.publications ?? []).filter((p) => p.featured).slice(0, 3);
  const featuredProjects = (projects?.projects ?? []).filter((p) => p.featured).slice(0, 3);
  const featuredPatents = (patents?.patents ?? []).slice(0, 3);
  const experience = (exp?.experience ?? []).sort((a, b) => (a.displayPriority ?? 99) - (b.displayPriority ?? 99));
  const highlightSkills = skills?.highlightSkills ?? [];
  const featuredServices = (services?.services ?? []).filter((s) => s.featured).slice(0, 3);

  return `
    ${currentlySection(identity)}
    ${researchPreview(featuredPubs)}
    ${projectsPreview(featuredProjects)}
    ${patentsStrip(featuredPatents)}
    ${journeyTimeline(experience)}
    ${skillsStrip(highlightSkills)}
    ${servicesPreview(featuredServices)}
  `;
}

function currentlySection(identity) {
  const status = identity?.currentStatus;
  if (!status) return '';
  return `
    <section class="section section--tight">
      <div class="container">
        <div class="card glow-border reveal-fade" style="display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:1.5rem;">
          <div style="display:flex; align-items:center; gap:1rem;">
            <span class="contact-avail-dot" aria-hidden="true"></span>
            <div>
              <p class="card__meta" style="margin-bottom:0.3rem;">Currently</p>
              <p style="font-size:var(--fs-md); font-weight:600;">${status.role} at ${status.institution}</p>
            </div>
          </div>
          <span class="pill pill--accent">PhD completed · ${status.phdYear}</span>
        </div>
      </div>
    </section>
  `;
}

function researchPreview(pubs) {
  if (!pubs.length) return '';
  return `
    <section class="section">
      <div class="container">
        <div class="section-header" style="display:flex; align-items:flex-end; justify-content:space-between; flex-wrap:wrap; gap:1rem; max-width:none;">
          <div>
            <p class="section-eyebrow">Research</p>
            <h2 class="section-title">Selected publications</h2>
          </div>
          <a href="./research.html" class="link-underline">All publications ${icon.arrow(14)}</a>
        </div>
        <div class="card-grid card-grid--2" data-reveal-group>
          ${pubs.map((p) => `
            <article class="card tilt-perspective reveal-fade" data-tilt>
              <div class="card__meta">${p.venue} · ${p.year}</div>
              <h3 class="card__title">${p.title}</h3>
              <p class="card__desc">${p.abstract}</p>
              <div class="card__footer">
                <span class="status-dot status-dot--${p.status}">${p.status}</span>
                ${p.links?.doi ? `<a class="card__link" href="${p.links.doi}" target="_blank" rel="noopener noreferrer">Read ${icon.external()}</a>` : ''}
              </div>
            </article>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}

function projectsPreview(projects) {
  if (!projects.length) return '';
  return `
    <section class="section section--alt">
      <div class="container">
        <div class="section-header" style="display:flex; align-items:flex-end; justify-content:space-between; flex-wrap:wrap; gap:1rem; max-width:none;">
          <div>
            <p class="section-eyebrow">Projects</p>
            <h2 class="section-title">What I've been building</h2>
          </div>
          <a href="./projects.html" class="link-underline">All projects ${icon.arrow(14)}</a>
        </div>
        <div class="card-grid card-grid--2" data-reveal-group>
          ${projects.map((p) => `
            <article class="card tilt-perspective reveal-fade" data-tilt>
              <div class="card__meta">${(p.category ?? '').replace('-', ' ')}</div>
              <h3 class="card__title">${p.title}</h3>
              <p class="card__desc">${p.description}</p>
              <div class="card__tags">${(p.tags ?? []).slice(0, 3).map((t) => `<span class="tag">${t}</span>`).join('')}</div>
            </article>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}

function patentsStrip(patents) {
  if (!patents.length) return '';
  return `
    <section class="section">
      <div class="container">
        <div class="section-header" style="display:flex; align-items:flex-end; justify-content:space-between; flex-wrap:wrap; gap:1rem; max-width:none;">
          <div>
            <p class="section-eyebrow">IP</p>
            <h2 class="section-title">Patents in flight</h2>
          </div>
          <a href="./patents.html" class="link-underline">All patents ${icon.arrow(14)}</a>
        </div>
        <div class="card-grid" data-reveal-group>
          ${patents.map((p) => `
            <article class="card tilt-perspective reveal-fade" data-tilt>
              <div class="card__top">${icon.shield(20)}<span class="status-dot status-dot--${p.status}">${p.status}</span></div>
              <h3 class="card__title" style="font-size:var(--fs-md);">${p.shortTitle}</h3>
              <p class="card__meta" style="margin:0;">${p.organization} · ${p.filingYear}</p>
            </article>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}

function journeyTimeline(experience) {
  if (!experience.length) return '';
  return `
    <section class="section section--alt">
      <div class="container">
        <div class="section-header">
          <p class="section-eyebrow">Journey</p>
          <h2 class="section-title">Where the work has taken me</h2>
        </div>
        <div class="timeline" style="max-width:52rem;">
          ${experience.map((e) => `
            <div class="timeline-item ${e.current ? 'timeline-item--current' : ''} reveal-fade">
              <div class="timeline-item__dot"></div>
              <div class="timeline-item__period">${formatDate(e.startDate)} — ${e.current ? 'Present' : formatDate(e.endDate)}</div>
              <h4 class="timeline-item__title">${e.role}</h4>
              <p class="timeline-item__org">${e.organization} <span class="timeline-item__loc">· ${e.location}</span></p>
              ${e.highlights?.length ? `<ul class="timeline-item__highlights">${e.highlights.slice(0, 2).map((h) => `<li>${h}</li>`).join('')}</ul>` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}

function skillsStrip(highlights) {
  if (!highlights.length) return '';
  return `
    <section class="section section--tight">
      <div class="container">
        <div class="section-header" style="display:flex; align-items:flex-end; justify-content:space-between; flex-wrap:wrap; gap:1rem; max-width:none;">
          <div>
            <p class="section-eyebrow">Toolkit</p>
            <h2 class="section-title">Core competencies</h2>
          </div>
          <a href="./skills.html" class="link-underline">Full skill map ${icon.arrow(14)}</a>
        </div>
        <div class="reveal-fade" style="display:flex; flex-wrap:wrap; gap:0.7rem;">
          ${highlights.map((s) => `<span class="pill pill--accent" style="font-size:var(--fs-sm); padding:0.6em 1.1em;">${s}</span>`).join('')}
        </div>
      </div>
    </section>
  `;
}

function servicesPreview(services) {
  if (!services.length) return '';
  return `
    <section class="section section--alt">
      <div class="container">
        <div class="section-header" style="display:flex; align-items:flex-end; justify-content:space-between; flex-wrap:wrap; gap:1rem; max-width:none;">
          <div>
            <p class="section-eyebrow">Work with me</p>
            <h2 class="section-title">Consulting &amp; training</h2>
          </div>
          <a href="./services.html" class="link-underline">All services ${icon.arrow(14)}</a>
        </div>
        <div class="card-grid" data-reveal-group>
          ${services.map((s) => `
            <article class="card tilt-perspective reveal-fade" data-tilt>
              <h3 class="card__title" style="font-size:var(--fs-md);">${s.name}</h3>
              <p class="card__desc">${s.tagline}</p>
            </article>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const [year, month] = dateStr.split('-');
  if (!month) return year;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[parseInt(month, 10) - 1]} ${year}`;
}
