/* =============================================================
   HOME.JS — Homepage (index.html)

   Shows:
   ✅ Hero section (full)
   ✅ Stats bar  (counts: papers, patents, projects, years)
   ✅ Research preview (3 featured papers → link to /research.html)
   ✅ Projects preview (3 featured projects → link to /projects.html)
   ✅ Patents teaser (count + summary → link to /patents.html)
   ✅ Contact CTA strip

   Does NOT render full Research / Projects / Skills / Talks / Services pages.
   Those live on their own dedicated HTML pages.
   ============================================================= */

import { renderHeader }  from '../components/Header.js';
import { renderFooter }  from '../components/Footer.js';
import { buildHero }     from '../components/Hero.js';
import { buildHomePreviews } from '../components/HomePreviews.js';
import { initSEO }       from '../utils/seo.js';
import { SITE }          from '../config/site.config.js';

initSEO({
  title:       SITE.name,
  description: SITE.description,
  pageId:      'home',
  type:        'website',
});

await renderHeader();

const main = document.querySelector('#main-content');
if (main) {
  const [heroHTML, previewsHTML] = await Promise.all([
    buildHero(),
    buildHomePreviews(),
  ]);

  main.innerHTML = heroHTML + previewsHTML;

  if (window.lucide) lucide.createIcons();

  // Scroll reveal
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
      }),
      { threshold: 0.07, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
  }
}

await renderFooter();
