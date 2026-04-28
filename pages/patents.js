import { renderHeader } from '../components/Header.js';
import { renderFooter } from '../components/Footer.js';
import { buildPatents } from '../components/Patents.js';
import { initSEO }      from '../utils/seo.js';
import { SITE }         from '../config/site.config.js';

initSEO({ title: `Patents — ${SITE.name}`, pageId: 'patents',
  description: '3 pending WIPO patents in quantum machine learning by Utkarsh Singh.' });

await renderHeader();

const main = document.querySelector('#main-content');
if (main) {
  main.innerHTML = await buildPatents();
  if (window.lucide) lucide.createIcons();
}

await renderFooter();
