/* =============================================================
   PAGES/RESEARCH.JS — Research / Publications Page
   
   Loads: Research.js (full publications with filters)
   Data:  content/publications.json
   ============================================================= */

import { renderHeader }  from '../components/Header.js';
import { renderFooter }  from '../components/Footer.js';
import { buildResearch, initResearchFilters } from '../components/Research.js';
import { initSEO }       from '../utils/seo.js';
import { SITE }          from '../config/site.config.js';

initSEO({
  title:       `Research & Publications — ${SITE.name}`,
  description: 'Peer-reviewed publications in quantum machine learning, ' +
               'variational quantum algorithms, and hybrid quantum-classical systems.',
  pageId:      'research',
  type:        'website',
});

await renderHeader();

const main = document.querySelector('#main-content');
if (main) {
  main.innerHTML = await buildResearch();

  // Wire up filter buttons and interactive features AFTER HTML is in DOM
  initResearchFilters();

  // Initialize Lucide icons
  if (window.lucide) lucide.createIcons();
}

await renderFooter();
