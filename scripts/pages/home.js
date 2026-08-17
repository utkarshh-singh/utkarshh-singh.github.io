import { bootPageStart, bootPageEnd } from '../core/boot.js';
import { renderHeader } from '../components/Header.js';
import { renderFooter } from '../components/Footer.js';
import { buildHero, initHeroInteractions } from '../components/Hero.js';
import { buildHomeSections } from '../components/HomeSections.js';
import { initSEO } from '../core/seo.js';
import { SITE } from '../../config/site.config.js';

bootPageStart();

initSEO({
  title: SITE.title,
  description: SITE.description,
  pageId: 'home',
});

await renderHeader();

const main = document.querySelector('#main-content');
if (main) {
  const [heroHTML, sectionsHTML] = await Promise.all([buildHero(), buildHomeSections()]);
  main.innerHTML = heroHTML + sectionsHTML;
  initHeroInteractions();
}

await renderFooter();
bootPageEnd(); // scoped to the whole document so header + main + footer all get tilt/reveal/magnetic/counters
