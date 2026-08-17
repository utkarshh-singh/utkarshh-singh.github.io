import { bootPageStart, bootPageEnd } from '../core/boot.js';
import { renderHeader } from '../components/Header.js';
import { renderFooter } from '../components/Footer.js';
import { buildPatentsPage } from '../components/PatentsList.js';
import { initSEO } from '../core/seo.js';
import { SITE } from '../../config/site.config.js';

bootPageStart();

initSEO({
  title: `Patents — ${SITE.name}`,
  description: 'Filed and pending WIPO patent applications by Utkarsh Singh in quantum machine learning.',
  pageId: 'patents',
});

await renderHeader();

const main = document.querySelector('#main-content');
if (main) {
  main.innerHTML = await buildPatentsPage();
}

await renderFooter();
bootPageEnd();
