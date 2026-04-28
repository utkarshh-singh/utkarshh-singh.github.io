import { renderHeader }  from '../components/Header.js';
import { renderFooter }  from '../components/Footer.js';
import { buildServices } from '../components/Services.js';
import { initSEO }       from '../utils/seo.js';
import { SITE }          from '../config/site.config.js';

initSEO({
  title:       `Services — ${SITE.name}`,
  description: 'Quantum ML consulting, research collaboration, and training services by Utkarsh Singh.',
  pageId:      'services',
});
await renderHeader();
const main = document.querySelector('#main-content');
if (main) {
  main.innerHTML = await buildServices();
  if (window.lucide) lucide.createIcons();
}
await renderFooter();
