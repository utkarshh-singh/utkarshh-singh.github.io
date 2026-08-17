import { bootPageStart, bootPageEnd } from '../core/boot.js';
import { renderHeader } from '../components/Header.js';
import { renderFooter } from '../components/Footer.js';
import { buildSkillsPage, initSkillsInteractions } from '../components/SkillsGrid.js';
import { initSEO } from '../core/seo.js';
import { SITE } from '../../config/site.config.js';

bootPageStart();

initSEO({
  title: `Skills — ${SITE.name}`,
  description: 'Technical skills, credentials, education, and experience of Utkarsh Singh.',
  pageId: 'skills',
});

await renderHeader();

const main = document.querySelector('#main-content');
if (main) {
  main.innerHTML = await buildSkillsPage();
  initSkillsInteractions();
}

await renderFooter();
bootPageEnd();
