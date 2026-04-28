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

  const categories = data.categories ?? data.skillGroups ?? [];

  if (!categories.length) {
    const skills = data.skills ?? data.technical ?? [];
    return `<div class="skill-group__tags">
      ${skills.map(s => `<span class="tag tag--muted">${s}</span>`).join('')}
    </div>`;
  }

  return `
    <div class="skills-tabs">
      <!-- Tab Nav -->
      <div class="skills-tabs__nav" role="tablist">
        ${categories.map((cat, i) => `
          <button
            class="skills-tabs__tab ${i === 0 ? 'is-active' : ''}"
            role="tab"
            aria-selected="${i === 0}"
            aria-controls="skills-panel-${i}"
            id="skills-tab-${i}"
            onclick="
              this.closest('.skills-tabs').querySelectorAll('.skills-tabs__tab').forEach(t => { t.classList.remove('is-active'); t.setAttribute('aria-selected','false'); });
              this.closest('.skills-tabs').querySelectorAll('.skills-tabs__panel').forEach(p => p.classList.remove('is-active'));
              this.classList.add('is-active');
              this.setAttribute('aria-selected','true');
              document.getElementById('skills-panel-${i}').classList.add('is-active');
            ">
            ${cat.label ?? cat.name ?? cat.category}
          </button>
        `).join('')}
      </div>

      <!-- Tab Panels -->
      <div class="skills-tabs__panels">
        ${categories.map((cat, i) => `
          <div class="skills-tabs__panel ${i === 0 ? 'is-active' : ''}"
               role="tabpanel"
               id="skills-panel-${i}"
               aria-labelledby="skills-tab-${i}">
            <div class="skill-group__tags">
              ${(cat.skills ?? cat.items ?? []).map(skill => {
                const name  = typeof skill === 'string' ? skill : skill.name;
                const level = typeof skill === 'object' ? skill.level : null;
                return `<span class="tag tag--muted ${level === 'expert' ? 'tag--expert' : ''}">${name}</span>`;
              }).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

/* ─── Certifications ─────────────────────────────────────────*/
function buildCertCards(data) {
  if (!data) return '<p class="error-state">Could not load certifications.</p>';

  const certifications = data.certifications ?? [];
  const badges = data.badges ?? [];
  const awards = data.awards ?? [];

  const groups = [
    { label: 'Certifications', icon: '🎓', items: certifications, type: 'cert' },
    { label: 'Badges',         icon: '🏅', items: badges,         type: 'badge' },
    { label: 'Awards',         icon: '🏆', items: awards,         type: 'award' },
  ].filter(g => g.items.length > 0);

  return `
    <div class="creds-tabs">
      <div class="creds-tabs__nav" role="tablist">
        ${groups.map((g, i) => `
          <button class="creds-tabs__tab ${i === 0 ? 'is-active' : ''}"
            role="tab" aria-selected="${i === 0}"
            aria-controls="creds-panel-${i}"
            onclick="
              this.closest('.creds-tabs').querySelectorAll('.creds-tabs__tab').forEach(t => { t.classList.remove('is-active'); t.setAttribute('aria-selected','false'); });
              this.closest('.creds-tabs').querySelectorAll('.creds-tabs__panel').forEach(p => p.classList.remove('is-active'));
              this.classList.add('is-active'); this.setAttribute('aria-selected','true');
              document.getElementById('creds-panel-${i}').classList.add('is-active');
            ">
            ${g.icon} ${g.label}
            <span class="creds-tabs__count">${g.items.length}</span>
          </button>
        `).join('')}
      </div>

      <div class="creds-tabs__panels">
        ${groups.map((g, i) => `
          <div class="creds-tabs__panel ${i === 0 ? 'is-active' : ''}"
              role="tabpanel" id="creds-panel-${i}">
            <div class="creds-slider">
              <button class="creds-slider__btn" aria-label="Previous" onclick="
                this.nextElementSibling.scrollBy({ left: -300, behavior: 'smooth' })">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
              </button>
              <div class="creds-grid">
                ${g.items.map(item => credCard(item, g.type)).join('')}
              </div>
              <button class="creds-slider__btn" aria-label="Next" onclick="
                this.previousElementSibling.scrollBy({ left: 300, behavior: 'smooth' })">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function credCard(item, type) {
  const title      = item.name ?? item.title ?? '';
  const displayName = item.displayName ?? title;
  const org        = item.issuer ?? item.issuerShort ?? item.organization ?? '';
  const year       = item.year ?? item.date ?? '';
  const url        = item.credentialUrl ?? item.url ?? null;
  const desc       = item.description ?? '';
  const group      = item.group ?? '';

  const typeIcon = { cert: '📜', badge: '🏅', award: '🏆' }[type] ?? '✦';

  return `
    <div class="cred-card ${item.featured ? 'cred-card--featured' : ''}">
      <div class="cred-card__header">
        <div class="cred-card__meta">
          ${org ? `<span class="cred-card__org">${org}</span>` : ''}
          ${year ? `<span class="cred-card__year">${year}</span>` : ''}
        </div>
        ${group ? `<span class="cred-card__group">${group}</span>` : ''}
      </div>
      <h4 class="cred-card__title">${displayName}</h4>
      ${desc ? `<p class="cred-card__desc">${desc}</p>` : ''}
      ${url ? `
        <a href="${url}" target="_blank" rel="noopener noreferrer" class="cred-card__link">
          Verify ${externalIcon()}
        </a>
      ` : ''}
    </div>
  `;
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