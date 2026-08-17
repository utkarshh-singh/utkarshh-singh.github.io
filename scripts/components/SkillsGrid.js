/* =============================================================
   SKILLSGRID.JS — Skills page: orbit visual, category cards,
   credentials tabs, education + experience timelines.
   ============================================================= */

import { fetchJSON } from '../core/data.js';
import { icon } from '../core/icons.js';

const CATEGORY_ICON = {
  quantumMachineLearning: icon.atom,
  machineLearning: icon.brain,
  quantumComputing: icon.cpu,
  softwareTools: icon.code,
  leadership: icon.users,
};

// Shorter labels for the orbit pills only (category lists + aria-label
// still use the full skill name) — keeps pill width predictable so the
// two rings never overlap regardless of which skills are highlighted.
const ORBIT_LABEL = {
  'Quantum Reservoir Computing': 'QRC',
  'Technical Lectures': 'Lectures',
  'Circuit Design': 'Circuits',
  'Git & GitHub': 'GitHub',
};

export async function buildSkillsPage() {
  const [skills, certs, edu, exp] = await Promise.all([
    fetchJSON('./content/skills.json'),
    fetchJSON('./content/certifications.json'),
    fetchJSON('./content/education.json'),
    fetchJSON('./content/experience.json'),
  ]);

  const categories = skills?.categories ?? [];
  const highlights = skills?.highlightSkills ?? [];
  const skillCount = categories.reduce((n, c) => n + (c.skills?.length ?? 0), 0);
  const credentialCount = (certs?.certifications?.length ?? 0) + (certs?.badges?.length ?? 0);

  return `
    <section class="page-header skills-hero">
      <div class="glow-blob" aria-hidden="true"></div>
      <div class="container">
        <div class="skills-hero__grid">
          <div class="page-header__inner reveal-fade is-visible">
            <p class="section-eyebrow">Skills</p>
            <h1 class="page-header__title">Expertise &amp; credentials</h1>
            <p class="page-header__subtitle">Technical depth across quantum machine learning, quantum computing, classical ML, and the tools used to ship research into working systems.</p>
            <div class="page-header__stats">
              <div class="hero-stat">
                <span class="hero-stat__number" data-counter="${skillCount}">0</span>
                <span class="hero-stat__label">Skills tracked</span>
              </div>
              <div class="hero-stat">
                <span class="hero-stat__number" data-counter="${credentialCount}">0</span>
                <span class="hero-stat__label">Credentials</span>
              </div>
            </div>
          </div>

          <div class="orbit reveal-fade is-visible" aria-label="Highlighted skills: ${highlights.join(', ')}">
            <div class="orbit__ring" aria-hidden="true"></div>
            <div class="orbit__ring orbit__ring--2" aria-hidden="true"></div>
            <div class="orbit__core">${icon.atom(28)}</div>
            ${orbitRing(highlights.filter((_, i) => i % 2 === 0), 'outer', 0)}
            ${orbitRing(highlights.filter((_, i) => i % 2 !== 0), 'inner', 36)}
          </div>
        </div>
      </div>
    </section>

    <section class="section section--tight">
      <div class="container">
        <div class="section-header">
          <p class="section-eyebrow">Breakdown</p>
          <h2 class="section-title">Skills by category</h2>
        </div>
        ${skillCategoryTabs(categories)}
      </div>
    </section>

    <section class="section section--alt">
      <div class="container">
        <div class="section-header">
          <p class="section-eyebrow">Credentials</p>
          <h2 class="section-title">Certifications, badges &amp; awards</h2>
          <p class="section-subtitle">
            Verified credentials from IBM, AWS, and academic institutions.
            <a href="https://www.credly.com/users/utkarsh-singh.0a82c607/badges" target="_blank" rel="noopener noreferrer" class="link-underline">View all on Credly ↗</a>
          </p>
        </div>
        ${credentialTabs(certs)}
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="timeline-cols">
          <div class="timeline-col">
            <p class="section-eyebrow" id="edu-heading">Education</p>
            <div class="timeline" aria-labelledby="edu-heading">${buildTimeline(edu?.education ?? [], 'degree')}</div>
          </div>
          <div class="timeline-col">
            <p class="section-eyebrow" id="exp-heading">Experience</p>
            <div class="timeline" aria-labelledby="exp-heading">${buildTimeline(exp?.experience ?? [], 'role')}</div>
          </div>
        </div>
      </div>
    </section>
  `;
}

function orbitRing(skills, variant, phaseOffset) {
  return `
    <div class="orbit__group orbit__group--${variant}">
      ${skills.map((name, i) => orbitItem(name, i, skills.length, phaseOffset)).join('')}
    </div>
  `;
}

function orbitItem(name, i, total, phaseOffset) {
  const angle = (360 / total) * i + phaseOffset;
  const label = ORBIT_LABEL[name] ?? name;
  return `
    <div class="orbit__item" style="--angle:${angle}deg;">
      <span class="pill pill--accent" title="${name}">${label}</span>
    </div>
  `;
}

function skillCategoryTabs(categories) {
  const totalSkills = categories.reduce((n, c) => n + (c.skills?.length ?? 0), 0);
  return `
    <div class="tab-group" data-tab-group>
      <div class="tab-group__nav" role="tablist" aria-label="Skill categories">
        <button class="tab-group__tab is-active" role="tab" data-tab="0" aria-selected="true">
          ${icon.layers(14)} All <span class="tab-group__count">${totalSkills}</span>
        </button>
        ${categories.map((cat, i) => {
          const iconFn = CATEGORY_ICON[cat.id] ?? icon.cpu;
          return `
            <button class="tab-group__tab" role="tab" data-tab="${i + 1}" aria-selected="false">
              ${iconFn(14)} ${cat.label} <span class="tab-group__count">${cat.skills?.length ?? 0}</span>
            </button>
          `;
        }).join('')}
      </div>
      <div class="tab-group__panels">
        ${skillAllPanel(categories, totalSkills)}
        ${categories.map((cat, i) => skillCategoryPanel(cat, i + 1)).join('')}
      </div>
    </div>
  `;
}

function skillAllPanel(categories, totalSkills) {
  const allSkills = categories.flatMap((cat) => (cat.skills ?? []).map((s) => ({ ...s, categoryLabel: cat.label })));
  return `
    <div class="tab-group__panel is-active" data-panel="0">
      <div class="skill-panel__head">
        <div class="skill-panel__icon">${icon.layers(26)}</div>
        <div>
          <h3 class="skill-panel__title">All Skills</h3>
          <p class="skill-panel__count">${totalSkills} skills across ${categories.length} categories</p>
        </div>
      </div>
      <div class="skill-chip-cloud">
        ${allSkills.map((s) => `
          <span class="skill-chip ${s.level === 'working' ? 'skill-chip--working' : ''}" title="${s.categoryLabel} · ${s.level ?? ''}">
            <span class="skill-chip__dot" aria-hidden="true"></span>${s.name}
          </span>
        `).join('')}
      </div>
    </div>
  `;
}

function skillCategoryPanel(cat, i) {
  const iconFn = CATEGORY_ICON[cat.id] ?? icon.cpu;
  const skills = cat.skills ?? [];
  return `
    <div class="tab-group__panel" data-panel="${i}">
      <div class="skill-panel__head">
        <div class="skill-panel__icon">${iconFn(26)}</div>
        <div>
          <h3 class="skill-panel__title">${cat.label}</h3>
          <p class="skill-panel__count">${skills.length} skill${skills.length === 1 ? '' : 's'}</p>
        </div>
      </div>
      <div class="skill-chip-cloud">
        ${skills.map((s) => `
          <span class="skill-chip ${s.level === 'working' ? 'skill-chip--working' : ''}" title="${s.level ?? ''}">
            <span class="skill-chip__dot" aria-hidden="true"></span>${s.name}
          </span>
        `).join('')}
      </div>
    </div>
  `;
}

function credentialTabs(certs) {
  const groups = [
    { label: 'Certifications', icon: icon.graduation(14), items: certs?.certifications ?? [] },
    { label: 'Badges', icon: icon.award(14), items: certs?.badges ?? [] },
    { label: 'Awards', icon: icon.trophy(14), items: certs?.awards ?? [] },
  ].filter((g) => g.items.length);

  return `
    <div class="tab-group" data-tab-group>
      <div class="tab-group__nav" role="tablist" aria-label="Credential type">
        ${groups.map((g, i) => `
          <button class="tab-group__tab ${i === 0 ? 'is-active' : ''}" role="tab" data-tab="${i}" aria-selected="${i === 0}">
            ${g.icon} ${g.label} <span class="tab-group__count">${g.items.length}</span>
          </button>
        `).join('')}
      </div>
      <div class="tab-group__panels">
        ${groups.map((g, i) => `
          <div class="tab-group__panel ${i === 0 ? 'is-active' : ''}" data-panel="${i}">
            <div class="creds-grid">
              ${g.items.map((item) => credCard(item)).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function credCard(item) {
  const title = item.displayName ?? item.name ?? '';
  const org = item.issuerShort ?? item.issuer ?? item.organization ?? '';
  const url = item.credentialUrl ?? null;
  return `
    <div class="cred-card">
      <div class="cred-card__header">
        <div class="cred-card__meta"><span>${org}</span>${item.year ? `<span>· ${item.year}</span>` : ''}</div>
        ${item.group ? `<span class="cred-card__group">${item.group}</span>` : ''}
      </div>
      <h4 class="cred-card__title">${title}</h4>
      ${item.description ? `<p class="cred-card__desc">${item.description}</p>` : ''}
      ${url ? `<a class="cred-card__link" href="${url}" target="_blank" rel="noopener noreferrer">Verify ${icon.external()}</a>` : ''}
    </div>
  `;
}

function buildTimeline(items, titleKey) {
  if (!items.length) return '<p class="timeline__empty">No entries.</p>';
  return items.map((item, i) => {
    const isCurrent = item.current === true;
    const period = item.startDate
      ? `${formatDate(item.startDate)} — ${item.current ? 'Present' : formatDate(item.endDate)}`
      : `${item.startYear} — ${item.status === 'completed' && item.endYear ? item.endYear : 'Present'}`;
    return `
      <div class="timeline-item ${isCurrent ? 'timeline-item--current' : ''}">
        <div class="timeline-item__dot"></div>
        <div class="timeline-item__period">${period}</div>
        <h4 class="timeline-item__title">${item[titleKey] ?? item.title ?? ''}${item.specialization ? ` · ${item.specialization}` : ''}</h4>
        <p class="timeline-item__org">${item.institution ?? item.organization ?? ''}${item.location ? ` <span class="timeline-item__loc">· ${item.location}</span>` : ''}</p>
        ${item.thesis ? `<p class="timeline-item__note">Thesis: ${item.thesis}</p>` : ''}
        ${item.highlights?.length ? `<ul class="timeline-item__highlights">${item.highlights.map((h) => `<li>${h}</li>`).join('')}</ul>` : ''}
      </div>
    `;
  }).join('');
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const [year, month] = dateStr.split('-');
  if (!month) return year;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[parseInt(month, 10) - 1]} ${year}`;
}

export function initSkillsInteractions() {
  document.querySelectorAll('[data-tab-group]').forEach((group) => {
    group.querySelectorAll('.tab-group__tab').forEach((tab) => {
      tab.addEventListener('click', () => {
        const idx = tab.dataset.tab;
        group.querySelectorAll('.tab-group__tab').forEach((t) => {
          t.classList.toggle('is-active', t === tab);
          t.setAttribute('aria-selected', String(t === tab));
        });
        group.querySelectorAll('.tab-group__panel').forEach((p) => p.classList.toggle('is-active', p.dataset.panel === idx));
      });
    });
  });
}
