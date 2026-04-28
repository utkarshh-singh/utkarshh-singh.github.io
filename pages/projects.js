import { renderHeader } from '../components/Header.js';
import { renderFooter } from '../components/Footer.js';
import { buildProjects, initProjectFilters } from '../components/Projects.js';
import { initSEO }      from '../utils/seo.js';
import { SITE }         from '../config/site.config.js';

initSEO({ title: `Projects — ${SITE.name}`, pageId: 'projects',
  description: 'Research projects and applied quantum ML experiments by Utkarsh Singh.' });

await renderHeader();

const main = document.querySelector('#main-content');
if (main) {
  main.innerHTML = await buildProjects();
  initProjectFilters();
  if (window.lucide) lucide.createIcons();
}

await renderFooter();
