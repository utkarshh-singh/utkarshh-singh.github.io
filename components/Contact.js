/* =============================================================
   CONTACT.JS — Redesigned Contact Page Component

   Layout:
   - Hero strip: headline + subtext
   - Three-column intent cards (Research / Consulting / Speaking)
   - Two-column main section:
       Left:  Email + social links (clean list)
       Right: Contact form (Formspree)
   - Full-width Calendly booking section
   - Availability badge

   HOW TO MODIFY:
   - Email / links     → content/contact.json
   - Calendly URL      → change CALENDLY_URL constant below
   - Intent cards text → contactIntents array below
   ============================================================= */

import { fetchJSON } from '../utils/render.js';
import { SITE }      from '../config/site.config.js';

// ─── UPDATE THIS with your real Calendly link ────────────────
const CALENDLY_URL = 'https://calendly.com/singhutkarsh529';


export async function buildContact() {
  const linksData = await fetchJSON('./content/links.json');

  const email = SITE.email;

  const linkMap = Object.fromEntries(
    (linksData?.social ?? []).map(l => [l.platform, l.url])
  );

  const socialLinks = [
    { label: 'LinkedIn',       href: linkMap['LinkedIn']       ?? '#', icon: linkedinIcon()  },
    { label: 'GitHub',         href: linkMap['GitHub']         ?? '#', icon: githubIcon()    },
    { label: 'Google Scholar', href: linkMap['Google Scholar'] ?? '#', icon: scholarIcon()   },
    { label: 'Instagram',      href: linkMap['Instagram']      ?? '#', icon: instagramIcon() },
    { label: 'Shabdras',       href: linkMap['Shabdras']       ?? '#', icon: featherIcon()   },
  ];

  const intents = [
    {
      icon: flaskIcon(),
      title: 'Research Collaboration',
      desc: 'Joint publications, shared experiments, or academic partnerships in QML.',
    },
    {
      icon: briefcaseIcon(),
      title: 'Consulting & Industry',
      desc: 'Quantum ML strategy, hybrid model development, or team training programs.',
    },
    {
      icon: micIcon(),
      title: 'Speaking & Events',
      desc: 'Conference talks, workshops, panels, or guest lectures on quantum ML.',
    },
  ];

  return `
    <div class="contact-page">

      <!-- ── Page Header ─────────────────────────────────── -->
      <section class="contact-header">
        <div class="container">
          <p class="contact-eyebrow">CONTACT</p>
          <h1 class="contact-title">Let's Work Together</h1>
          <p class="contact-subtitle">
            Open to research collaborations, consulting engagements,
            speaking invitations, and general questions.
          </p>
          <div class="contact-availability">
            <span class="contact-avail-dot"></span>
          </div>
        </div>
      </section>

      <!-- ── Intent Cards ─────────────────────────────────── -->
      <section class="contact-intents">
        <div class="container">
          <div class="contact-intents-grid">
            ${intents.map(i => `
              <div class="contact-intent-card">
                <div class="contact-intent-icon">${i.icon}</div>
                <h3>${i.title}</h3>
                <p>${i.desc}</p>
              </div>
            `).join('')}
          </div>
        </div>
      </section>

      <!-- ── Main: Links + Form ────────────────────────────── -->
      <section class="contact-main">
        <div class="container">
          <div class="contact-main-grid">

            <!-- Left: Direct contact -->
            <div class="contact-info">
              <h2>Direct Contact</h2>

              <a href="mailto:${email}" class="btn btn--primary contact-email-btn"
                style="display:inline-flex; align-items:center; gap:0.5rem; margin-top:0.75rem;">
                ${mailIcon()}
                Send Email
              </a>

              <p class="contact-info-label">Also reachable on</p>
              <ul class="contact-social-list" role="list">
                ${socialLinks.map(l => `
                  <li>
                    <a href="${l.href}" target="_blank" rel="noopener noreferrer"
                       class="contact-social-item">
                      ${l.icon}
                      <span>${l.label}</span>
                      ${externalIcon()}
                    </a>
                  </li>
                `).join('')}
              </ul>
            </div>

            <!-- Right: Contact form via Formspree -->
            <div class="contact-form-wrap">
              <h2>Send a Message</h2>
              <form class="contact-form"
                    action="https://formspree.io/f/xdayqnkj"
                    method="POST">

                <div class="form-row">
                  <div class="form-group">
                    <label for="contact-name">Your Name</label>
                    <input type="text" id="contact-name" name="name"
                           placeholder="Jane Smith" required autocomplete="name">
                  </div>
                  <div class="form-group">
                    <label for="contact-email">Email Address</label>
                    <input type="email" id="contact-email" name="email"
                           placeholder="jane@example.com" required autocomplete="email">
                  </div>
                </div>

                <div class="form-group">
                  <label for="contact-subject">Subject</label>
                  <select id="contact-subject" name="subject">
                    <option value="" disabled selected>Select a topic…</option>
                    <option value="research">Research Collaboration</option>
                    <option value="consulting">Consulting / Industry</option>
                    <option value="speaking">Speaking Invitation</option>
                    <option value="general">General Question</option>
                  </select>
                </div>

                <div class="form-group">
                  <label for="contact-message">Message</label>
                  <textarea id="contact-message" name="message" rows="5"
                    placeholder="Tell me about your project or question…"
                    required></textarea>
                </div>

                <button type="submit" class="btn btn--primary contact-submit">
                  Send Message
                  ${sendIcon()}
                </button>

              </form>
            </div>

          </div>
        </div>
      </section>

      <!-- ── Calendly Booking ──────────────────────────────── -->
      <section class="contact-calendly">
        <div class="container">
          <div class="contact-calendly-header">
            <div class="contact-calendly-text">
              <p class="contact-eyebrow">SCHEDULE A CALL</p>
              <h2>Book a 30-Minute Call</h2>
              <p>Prefer to talk directly? Pick a time that works for you —
                 no back-and-forth emails needed.</p>
            </div>
            <a href="${CALENDLY_URL}" target="_blank" rel="noopener noreferrer"
               class="btn btn--primary">
              ${calendarIcon()}
              Open Calendly
            </a>
          </div>

          <!-- Inline Calendly embed -->
          <!-- Inline Calendly embed — iframe method -->
          <div class="contact-calendly-embed">
            <iframe
              src="${CALENDLY_URL}?embed_domain=utkarshh-singh.github.io&embed_type=Inline"
              width="100%"
              height="700"
              frameborder="0"
              title="Schedule a call with Utkarsh Singh"
              loading="lazy"
              allow="payment">
            </iframe>
          </div>
        </div>
      </section>

    </div>
  `;
}


/**
 * Init Calendly inline widget after HTML is injected.
 */
export function initCalendly() {

}

function renderCalendlyWidget(el, url) {
  if (window.Calendly) {
    el.innerHTML = '';
    window.Calendly.initInlineWidget({
      url,
      parentElement: el,
      prefill: {},
      utm: {}
    });
  }
}


/* ─── Icons ──────────────────────────────────────────────── */
function mailIcon() {
  return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="2" stroke-linecap="round"
    stroke-linejoin="round" aria-hidden="true">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>`;
}
function externalIcon() {
  return `<svg width="12" height="12" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="2" stroke-linecap="round"
    stroke-linejoin="round" aria-hidden="true">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
    <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
  </svg>`;
}
function sendIcon() {
  return `<svg width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="2" stroke-linecap="round"
    stroke-linejoin="round" aria-hidden="true">
    <line x1="22" y1="2" x2="11" y2="13"/>
    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>`;
}
function calendarIcon() {
  return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="2" stroke-linecap="round"
    stroke-linejoin="round" aria-hidden="true">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>`;
}
function flaskIcon() {
  return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="2" stroke-linecap="round"
    stroke-linejoin="round" aria-hidden="true">
    <path d="M9 3h6m-6 0v6l-4 10h14L15 9V3"/>
  </svg>`;
}
function briefcaseIcon() {
  return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="2" stroke-linecap="round"
    stroke-linejoin="round" aria-hidden="true">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
  </svg>`;
}
function micIcon() {
  return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="2" stroke-linecap="round"
    stroke-linejoin="round" aria-hidden="true">
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
    <path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/>
    <line x1="8" y1="23" x2="16" y2="23"/>
  </svg>`;
}
function linkedinIcon() {
  return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="2" stroke-linecap="round"
    stroke-linejoin="round" aria-hidden="true">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
  </svg>`;
}
function githubIcon() {
  return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="2" stroke-linecap="round"
    stroke-linejoin="round" aria-hidden="true">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
  </svg>`;
}
function scholarIcon() {
  return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="2" stroke-linecap="round"
    stroke-linejoin="round" aria-hidden="true">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
    <path d="M6 12v5c3 3 9 3 12 0v-5"/>
  </svg>`;
}
function instagramIcon() {
  return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="2" stroke-linecap="round"
    stroke-linejoin="round" aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>`;
}
function featherIcon() {
  return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="2" stroke-linecap="round"
    stroke-linejoin="round" aria-hidden="true">
    <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"/>
    <line x1="16" y1="8" x2="2" y2="22"/>
    <line x1="17.5" y1="15" x2="9" y2="15"/>
  </svg>`;
}
