import { renderHeader }            from '../components/Header.js';
import { renderFooter }            from '../components/Footer.js';
import { buildContact, initContactForm } from '../components/Contact.js';
import { initSEO }                 from '../utils/seo.js';
import { SITE }                    from '../config/site.config.js';

initSEO({
  title:       `Contact — ${SITE.name}`,
  description: 'Get in touch with Utkarsh Singh for research collaboration, consulting, or speaking.',
  pageId:      'contact',
});
await renderHeader();
const main = document.querySelector('#main-content');
if (main) {
  main.innerHTML = await buildContact();
  initContactForm();
  if (window.lucide) lucide.createIcons();
}
await renderFooter();
