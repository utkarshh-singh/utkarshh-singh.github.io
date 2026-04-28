import { renderHeader } from '../components/Header.js';
import { renderFooter } from '../components/Footer.js';
import { buildTalks }   from '../components/Talks.js';
import { initSEO }      from '../utils/seo.js';
import { SITE }         from '../config/site.config.js';

initSEO({
  title:       `Talks & Training — ${SITE.name}`,
  description: 'Conference talks, presentations, and quantum computing workshops by Utkarsh Singh.',
  pageId:      'talks',
});
await renderHeader();
const main = document.querySelector('#main-content');
if (main) {
  main.innerHTML = await buildTalks();
  if (window.lucide) lucide.createIcons();
}
await renderFooter();
