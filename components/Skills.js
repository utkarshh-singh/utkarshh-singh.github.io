/* =============================================================
   SKILLS.JS — Skills + Certifications + Education Section
   
   Reads from:
   - content/skills.json
   - content/certifications.json
   - content/education.json
   - content/experience.json
   
   Renders:
   1. Skill groups (grouped by category, no progress bars)
   2. Certifications grid (Credly badges + IBM badges)
   3. Education timeline
   4. Experience timeline
   ============================================================= */

import { fetchJSON } from '../utils/render.js';

export async function buildSkills() {
  const [skillsData, certsData, eduData, expData] = await Promise.all([
    fetchJSON('./content/skills.json'),
    fetchJSON('./content/certifications.json'),
    fetchJSON('./content/education.json'),
    fetchJSON('./content/experience.json'),
  ]);

  return `
    <!-- Skills -->
    <section class="skills-section section section--alt" aria-labelledby="skills-heading">
      <div class="container">
        <div class="section-header">
          <div class="section-label">Expertise</div>
          <h2 class="section-title" id="skills-heading">Skills & Tools</h2>
          <p class="section-subtitle">
            Technical proficiencies across quantum computing, machine learning,
            and software engineering.
          </p>
        </div>
        <div class="skills-grid">
          ${buildSkillGroups(skillsData)}
        </div>
      </div>
    </section>

    <!-- Certifications -->
    <section class="certs-section section" aria-labelledby="certs-heading">
      <div class="container">
        <div class="section-header">
          <div class="section-label">Credentials</div>
          <h2 class="section-title" id="certs-heading">Certifications</h2>
          <p class="section-subtitle">
            Verified credentials from IBM, industry bodies, and academic institutions.
            <a href="https://www.credly.com/users/utkarsh-singh.0a82c607/badges"
               target="_blank" rel="noopener noreferrer"
               class="inline-link">View all on Credly ↗</a>
          </p>
        </div>
        <div class="certs-grid">
          ${buildCertCards(certsData)}
        </div>
      </div>
    </section>

    <!-- Education + Experience -->
    <section class="timeline-section section section--alt" aria-labelledby="timeline-heading">
      <div class="container">
        <div class="timeline-cols">

          <!-- Education -->
          <div class="timeline-col">
            <div class="section-label" id="edu-heading">Education</div>
            <div class="timeline" aria-label="Education history">
              ${buildTimeline(eduData?.education ?? [], 'edu')}
            </div>
          </div>

          <!-- Experience -->
          <div class="timeline-col">
            <div class="section-label" id="exp-heading">Experience</div>
            <div class="timeline" aria-label="Work experience">
              ${buildTimeline(expData?.experience ?? [], 'exp')}
            </div>
          </div>

        </div>
      </div>
    </section>
  `;
}

/* ─── Skill Groups ───────────────────────────────────────────*/
function buildSkillGroups(data) {
  if (!data) return '<p class="error-state">Could not load skills.</p>';

  // Support both flat {categories:[]} and nested structures
  const categories = data.categories ?? data.skillGroups ?? [];

  if (!categories.length) {
    // Fallback: render flat skill list
    const skills = data.skills ?? data.technical ?? [];
    return `<div class="skill-group">
      <div class="skill-group__tags">
        ${skills.map(s => `<span class="tag tag--muted">${s}</span>`).join('')}
      </div>
    </div>`;
  }

  return categories.map(cat => `
    <div class="skill-group card card--compact">
      <h3 class="skill-group__name">
        ${categoryIcon(cat.label ?? cat.name ?? cat.category)} ${cat.label ?? cat.name ?? cat.category}
      </h3>
      <div class="skill-group__tags">
        ${(cat.skills ?? cat.items ?? []).map(skill => {
          const name  = typeof skill === 'string' ? skill : skill.name;
          const level = typeof skill === 'object' ? skill.level : null;
          return `<span class="tag tag--muted ${level === 'Expert' ? 'tag--expert' : ''}">${name}</span>`;
        }).join('')}
      </div>
    </div>
  `).join('');
}

/* ─── Certifications ─────────────────────────────────────────*/
function buildCertCards(data) {
  if (!data) return '<p class="error-state">Could not load certifications.</p>';

  const all = [
    ...(data.certifications ?? []),
    ...(data.ibmBadges ?? []),
    ...(data.leadership ?? []),
  ];

  if (!all.length) return '<p class="error-state">No certifications found.</p>';

  return all.map(cert => `
    <div class="cert-card card card--compact">
      <div class="cert-card__top">
        <span class="tag tag--primary">${cert.issuer ?? cert.organization ?? 'IBM'}</span>
        ${cert.year ?? cert.date ? `
          <span class="cert-card__year">${cert.year ?? cert.date}</span>
        ` : ''}
      </div>
      <h4 class="cert-card__title">${cert.name ?? cert.title}</h4>
      ${cert.credentialUrl ?? cert.url ? `
        <a href="${cert.credentialUrl ?? cert.url}"
           class="card__link" target="_blank" rel="noopener noreferrer"
           aria-label="Verify ${cert.name ?? cert.title}">
          ${externalIcon()} Verify
        </a>
      ` : ''}
    </div>
  `).join('');
}

/* ─── Timeline (Education + Experience) ─────────────────────*/
function buildTimeline(items, prefix) {
  if (!items.length) return '<p class="timeline__empty">No entries.</p>';

  return items.map((item, i) => `
    <div class="timeline-item" id="${prefix}-${i}">
      <div class="timeline-item__dot"></div>
      <div class="timeline-item__content">
        <div class="timeline-item__period">
          ${item.startDate ? formatExpDate(item.startDate) : (item.startYear ?? '')} — ${item.current && !item.endDate && !item.endYear ? 'Present' : item.endDate ? formatExpDate(item.endDate) : (item.endYear ?? '')}
        </div>
        <h4 class="timeline-item__title">
          ${item.degree ?? item.role ?? item.title ?? ''}
        </h4>
        <p class="timeline-item__org">
          ${item.institution ?? item.university ?? item.organization ?? item.company ?? ''}
          ${item.location ? `<span class="timeline-item__loc">· ${item.location}</span>` : ''}
        </p>
        ${item.thesis ? `<p class="timeline-item__note">Thesis: ${item.thesis}</p>` : ''}
        ${item.description ? `<p class="timeline-item__note">${item.description}</p>` : ''}
        ${item.gpa ? `<p class="timeline-item__note">GPA: ${item.gpa}</p>` : ''}
      </div>
    </div>
  `).join('');
}

/* ─── Icon helpers ───────────────────────────────────────────*/
function categoryIcon(name = '') {
  const n = name.toLowerCase();
  if (n.includes('quantum'))   return '⚛️';
  if (n.includes('machine') || n.includes('ml') || n.includes('ai')) return '🧠';
  if (n.includes('language') || n.includes('programm')) return '💻';
  if (n.includes('framework') || n.includes('library'))  return '📦';
  if (n.includes('cloud') || n.includes('devops'))       return '☁️';
  if (n.includes('data'))      return '📊';
  if (n.includes('tool'))      return '🔧';
  return '✦';
}
function externalIcon() {
  return `<svg width="12" height="12" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="2" stroke-linecap="round"
    stroke-linejoin="round" aria-hidden="true">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
    <polyline points="15 3 21 3 21 9"/>
    <line x1="10" y1="14" x2="21" y2="3"/></svg>`;
}

function formatExpDate(dateStr) {
  if (!dateStr) return '';
  const [year, month] = dateStr.split('-');
  if (!month) return year;
  const months = ['Jan','Feb','Mar','Apr','May','Jun',
                  'Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${months[parseInt(month) - 1]} ${year}`;
}