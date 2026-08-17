import { bootPageStart, bootPageEnd } from '../core/boot.js';
import { renderHeader } from '../components/Header.js';
import { renderFooter } from '../components/Footer.js';
import { buildTalksPage } from '../components/TalksList.js';
import { initSEO } from '../core/seo.js';
import { SITE } from '../../config/site.config.js';

bootPageStart();

initSEO({
  title: `Talks — ${SITE.name}`,
  description: 'Invited talks, conference presentations, and mentorship by Utkarsh Singh.',
  pageId: 'talks',
});

await renderHeader();

const main = document.querySelector('#main-content');
if (main) {
  main.innerHTML = await buildTalksPage();
}

await renderFooter();
bootPageEnd();
