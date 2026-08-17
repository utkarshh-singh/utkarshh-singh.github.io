/* =============================================================
   CONTACTSECTION.JS — Contact page body
   ============================================================= */

import { fetchJSON } from '../core/data.js';
import { icon } from '../core/icons.js';
import { buildPageHeader } from './PageHeader.js';
import { SITE } from '../../config/site.config.js';

export async function buildContactPage() {
  const links = await fetchJSON('./content/links.json');
  const linkMap = Object.fromEntries((links?.social ?? []).map((l) => [l.platform, l]));

  const socialLinks = [
    { label: 'LinkedIn', data: linkMap['LinkedIn'], icon: icon.linkedin() },
    { label: 'GitHub', data: linkMap['GitHub'], icon: icon.github() },
    { label: 'Google Scholar', data: linkMap['Google Scholar'], icon: icon.graduation() },
    { label: 'Instagram', data: linkMap['Instagram'], icon: icon.instagram() },
    { label: 'Shabdras', data: linkMap['Shabdras'], icon: icon.feather() },
  ].filter((l) => l.data);

  const intents = [
    { icon: icon.flask(), title: 'Research Collaboration', desc: 'Joint publications, shared experiments, or academic partnerships in QML.' },
    { icon: icon.briefcase(), title: 'Consulting & Industry', desc: 'Quantum ML strategy, hybrid model development, or team training programs.' },
    { icon: icon.mic(), title: 'Speaking & Events', desc: 'Conference talks, workshops, panels, or guest lectures on quantum ML.' },
  ];

  const header = buildPageHeader({
    eyebrow: 'Contact',
    title: "Let's work together",
    subtitle: 'Open to research collaborations, consulting engagements, speaking invitations, and general questions.',
  });

  return `
    ${header}

    <section class="section section--tight">
      <div class="container">
        <div class="contact-avail reveal-fade is-visible">
          <span class="contact-avail-dot"></span>
          <span>Currently accepting new collaborations for 2026</span>
        </div>
      </div>
    </section>

    <section class="section section--tight">
      <div class="container">
        <div class="contact-intents" data-reveal-group>
          ${intents.map((i) => `
            <div class="card contact-intent-card reveal-fade">
              <div class="contact-intent-icon">${i.icon}</div>
              <h3>${i.title}</h3>
              <p>${i.desc}</p>
            </div>
          `).join('')}
        </div>

        <div class="contact-main-grid">
          <div class="contact-info reveal-fade">
            <h2>Direct contact</h2>
            <a href="mailto:${SITE.email}" class="btn btn--primary" data-magnetic="0.2">${icon.mail()} Send email</a>
            <p class="contact-info-label">Also reachable on</p>
            <ul class="contact-social-list" role="list">
              ${socialLinks.map((l) => `
                <li>
                  <a href="${l.data.url}" target="_blank" rel="noopener noreferrer" class="contact-social-item">
                    ${l.icon}<span>${l.label}</span>${icon.external()}
                  </a>
                </li>
              `).join('')}
            </ul>
          </div>

          <div class="contact-form-wrap reveal-fade">
            <h2>Send a message</h2>
            <form class="contact-form" action="${SITE.formspreeAction}" method="POST">
              <div class="form-row">
                <div class="form-group">
                  <label for="contact-name">Your name</label>
                  <input type="text" id="contact-name" name="name" placeholder="Jane Smith" required autocomplete="name">
                </div>
                <div class="form-group">
                  <label for="contact-email">Email address</label>
                  <input type="email" id="contact-email" name="email" placeholder="jane@example.com" required autocomplete="email">
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
                <textarea id="contact-message" name="message" rows="5" placeholder="Tell me about your project or question…" required></textarea>
              </div>
              <button type="submit" class="btn btn--primary contact-submit">Send message ${icon.send()}</button>
            </form>
          </div>
        </div>

        <div class="contact-call-card reveal-fade">
          <div>
            <h2>Prefer to talk directly?</h2>
            <p>Book a 30-minute call — no back-and-forth emails needed.</p>
          </div>
          <a href="${SITE.calendlyUrl}" target="_blank" rel="noopener noreferrer" class="btn btn--ghost" data-magnetic="0.2">${icon.calendar()} Open Calendly</a>
        </div>
      </div>
    </section>
  `;
}
