import { bootPageStart, bootPageEnd } from '../core/boot.js';
import { renderHeader } from '../components/Header.js';
import { renderFooter } from '../components/Footer.js';
import { buildServicesPage } from '../components/ServicesList.js';
import { initSEO } from '../core/seo.js';
import { SITE } from '../../config/site.config.js';

bootPageStart();

initSEO({
  title: `Services — ${SITE.name}`,
  description: 'Quantum machine learning consulting, model development, and training services.',
  pageId: 'services',
});

await renderHeader();

const main = document.querySelector('#main-content');
if (main) {
  main.innerHTML = await buildServicesPage();
}

await renderFooter();
bootPageEnd();
