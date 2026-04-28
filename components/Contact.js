import { fetchJSON }  from '../utils/render.js';
import { SITE }       from '../config/site.config.js';

export async function buildContact() {
  const [identity, links] = await Promise.all([
    fetchJSON('./content/identity.json'),
    fetchJSON('./content/links.json'),
  ]);

  const email   = SITE.email;
  const social  = links?.social ?? [];

  return `
    <section class="contact-section section" aria-labelledby="contact-heading">
      <div class="container">

        <div class="section-header">
          <div class="section-label">Contact</div>
          <h2 class="section-title" id="contact-heading">Get in Touch</h2>
          <p class="section-subtitle">
            Open to research collaborations, consulting engagements, speaking
            invitations, and general questions.
          </p>
        </div>

        <div class="contact-grid">

          <!-- Left: Links + info -->
          <div class="contact-info">
            ${email ? `
              <a href="mailto:${email}" class="contact-email">
                ${mailIcon()} ${email}
              </a>
            ` : ''}

            <div class="contact-social">
              <p class="contact-social__label">Also reachable on</p>
              <div class="contact-social__links">
                ${social.map(link => `
                  <a href="${link.url}"
                     class="contact-social__item"
                     target="_blank"
                     rel="noopener noreferrer"
                     aria-label="${link.platform}">
                    <span class="contact-social__name">${link.platform}</span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round" aria-hidden="true">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                      <polyline points="15 3 21 3 21 9"/>
                      <line x1="10" y1="14" x2="21" y2="3"/>
                    </svg>
                  </a>
                `).join('')}
              </div>
            </div>

            <div class="contact-availability">
              <span class="proj-status status--active">
                <span class="proj-status__dot"></span>
                Available for consulting & collaborations
              </span>
            </div>
          </div>

          <!-- Right: Contact form -->
          <form class="contact-form" id="contact-form" novalidate>
            <div class="contact-form__group">
              <label for="cf-name" class="contact-form__label">Your Name</label>
              <input type="text" id="cf-name" name="name"
                     class="contact-form__input"
                     placeholder="Jane Smith" autocomplete="name" required />
            </div>
            <div class="contact-form__group">
              <label for="cf-email" class="contact-form__label">Email Address</label>
              <input type="email" id="cf-email" name="email"
                     class="contact-form__input"
                     placeholder="jane@example.com" autocomplete="email" required />
            </div>
            <div class="contact-form__group">
              <label for="cf-subject" class="contact-form__label">Subject</label>
              <select id="cf-subject" name="subject" class="contact-form__input">
                <option value="">Select a topic…</option>
                <option>Research Collaboration</option>
                <option>Consulting Inquiry</option>
                <option>Speaking / Workshop</option>
                <option>General Question</option>
              </select>
            </div>
            <div class="contact-form__group">
              <label for="cf-message" class="contact-form__label">Message</label>
              <textarea id="cf-message" name="message"
                        class="contact-form__input contact-form__textarea"
                        rows="5"
                        placeholder="Tell me about your project or question…"
                        required></textarea>
            </div>
            <button type="submit" class="btn btn--primary contact-form__submit">
              Send Message
              <svg class="btn__arrow" width="16" height="16" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
            <p class="contact-form__note" id="cf-feedback" aria-live="polite"></p>
          </form>

        </div>
      </div>
    </section>
  `;
}

export function initContactForm() {
  const form     = document.querySelector('#contact-form');
  const feedback = document.querySelector('#cf-feedback');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Sending…';

    // Formspree integration — replace YOUR_FORM_ID in site.config.js
    const formspreeId = window.__SITE_CONFIG?.formspreeId;
    if (!formspreeId) {
      // Fallback: mailto link
      const data   = new FormData(form);
      const body   = encodeURIComponent(`Name: ${data.get('name')}\nMessage: ${data.get('message')}`);
      const email  = document.querySelector('a[href^="mailto:"]')?.href?.replace('mailto:','');
      window.location.href = `mailto:${email}?subject=${encodeURIComponent(data.get('subject') || 'Contact')}&body=${body}`;
      btn.disabled = false;
      btn.textContent = 'Send Message';
      return;
    }

    try {
      const res = await fetch(`https://formspree.io/f/${formspreeId}`, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form),
      });
      if (res.ok) {
        form.reset();
        if (feedback) {
          feedback.textContent = `✓ Message sent! I'll get back to you soon.`;
          feedback.style.color = 'var(--color-success)';
        }
      } else throw new Error();
    } catch {
      if (feedback) {
        feedback.textContent = 'Something went wrong. Please email directly.';
        feedback.style.color = 'var(--color-error)';
      }
    } finally {
      btn.disabled = false;
      btn.textContent = 'Send Message';
    }
  });
}

function mailIcon() {
  return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="2" stroke-linecap="round"
    stroke-linejoin="round" aria-hidden="true">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>`;
}
