import { renderHeader } from '../components/Header.js';
import { renderFooter } from '../components/Footer.js';
import { buildSkills }  from '../components/Skills.js';
import { initSEO }      from '../utils/seo.js';
import { SITE }         from '../config/site.config.js';

initSEO({ title: `Skills & Credentials — ${SITE.name}`, pageId: 'skills',
  description: 'Technical skills, IBM certifications, education, and experience of Utkarsh Singh.' });

await renderHeader();

const main = document.querySelector('#main-content');
if (main) {
  main.innerHTML = await buildSkills();
  if (window.lucide) lucide.createIcons();
}

await renderFooter();
