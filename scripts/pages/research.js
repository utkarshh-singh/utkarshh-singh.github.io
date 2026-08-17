import { bootPageStart, bootPageEnd } from '../core/boot.js';
import { renderHeader } from '../components/Header.js';
import { renderFooter } from '../components/Footer.js';
import { buildResearchPage, initResearchInteractions } from '../components/ResearchList.js';
import { initSEO } from '../core/seo.js';
import { SITE } from '../../config/site.config.js';

bootPageStart();

initSEO({
  title: `Research — ${SITE.name}`,
  description: 'Publications and preprints in quantum machine learning by Utkarsh Singh.',
  pageId: 'research',
});

await renderHeader();

const main = document.querySelector('#main-content');
if (main) {
  main.innerHTML = await buildResearchPage();
  initResearchInteractions();
}

await renderFooter();
bootPageEnd();
