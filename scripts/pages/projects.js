import { bootPageStart, bootPageEnd } from '../core/boot.js';
import { renderHeader } from '../components/Header.js';
import { renderFooter } from '../components/Footer.js';
import { buildProjectsPage } from '../components/ProjectsList.js';
import { initSEO } from '../core/seo.js';
import { SITE } from '../../config/site.config.js';

bootPageStart();

initSEO({
  title: `Projects — ${SITE.name}`,
  description: 'Applied and experimental quantum machine learning projects by Utkarsh Singh.',
  pageId: 'projects',
});

await renderHeader();

const main = document.querySelector('#main-content');
if (main) {
  main.innerHTML = await buildProjectsPage();
}

await renderFooter();
bootPageEnd();
