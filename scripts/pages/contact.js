import { bootPageStart, bootPageEnd } from '../core/boot.js';
import { renderHeader } from '../components/Header.js';
import { renderFooter } from '../components/Footer.js';
import { buildContactPage } from '../components/ContactSection.js';
import { initSEO } from '../core/seo.js';
import { SITE } from '../../config/site.config.js';

bootPageStart();

initSEO({
  title: `Contact — ${SITE.name}`,
  description: 'Get in touch with Utkarsh Singh for research collaboration, consulting, or speaking.',
  pageId: 'contact',
});

await renderHeader();

const main = document.querySelector('#main-content');
if (main) {
  main.innerHTML = await buildContactPage();
}

await renderFooter({ showCTA: false });
bootPageEnd();
