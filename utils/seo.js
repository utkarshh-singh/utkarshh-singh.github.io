/* =============================================================
   SEO.JS — Dynamic Meta Tag Injector
   
   HOW IT WORKS:
   Each page calls initSEO({ title, description, ... }) to
   inject the correct <meta> tags for that page.
   
   This handles:
   - <title> tag
   - meta description
   - Open Graph (og:*) for social sharing previews
   - Twitter card meta
   - Canonical URL
   
   HOW TO MODIFY SEO FOR A PAGE:
   In the page's .js file (e.g. pages/research.js), call:
   
     initSEO({
       title: "Research — Utkarsh Singh",
       description: "Publications and research in quantum ML...",
       pageId: "research"
     });
   
   The function merges your overrides with SITE defaults.
   ============================================================= */

import { SITE } from '../config/site.config.js';


/**
 * Initialize SEO meta tags for the current page.
 * Call this near the top of each page's JS module.
 * 
 * @param {Object} options
 * @param {string} [options.title]       - Page title (appended with site name)
 * @param {string} [options.description] - Page meta description
 * @param {string} [options.pageId]      - Page ID for canonical URL
 * @param {string} [options.ogImage]     - Override Open Graph image
 * @param {string} [options.type]        - OG type: "website" | "article"
 */
export function initSEO({
  title       = SITE.title,
  description = SITE.description,
  pageId      = 'home',
  ogImage     = SITE.ogImage,
  type        = 'website'
} = {}) {

  // ─── <title> ─────────────────────────────────────────────
  document.title = title;

  // ─── Canonical URL ────────────────────────────────────────
  const pageFile  = pageId === 'home' ? 'index.html' : `${pageId}.html`;
  const canonical = `${SITE.url}${SITE.basePath}/${pageFile}`;
  setMeta('canonical', canonical, 'link', 'href');

  // ─── Standard meta ────────────────────────────────────────
  setMeta('description',          description);
  setMeta('author',               SITE.author);

  // ─── Open Graph ───────────────────────────────────────────
  setOG('og:title',               title);
  setOG('og:description',         description);
  setOG('og:type',                type);
  setOG('og:url',                 canonical);
  setOG('og:image',               `${SITE.url}${SITE.basePath}/${ogImage}`);
  setOG('og:site_name',           SITE.name);
  setOG('og:locale',              SITE.locale);

  // ─── Twitter Card ─────────────────────────────────────────
  setOG('twitter:card',           'summary_large_image');
  setOG('twitter:title',          title);
  setOG('twitter:description',    description);
  setOG('twitter:image',          `${SITE.url}${SITE.basePath}/${ogImage}`);
  if (SITE.twitterHandle) {
    setOG('twitter:creator',      `@${SITE.twitterHandle}`);
  }
}


/* ─── Internal helpers ───────────────────────────────────────*/

function setMeta(name, content, tag = 'meta', attr = 'content') {
  if (!content) return;

  // Try to find existing tag
  let el = document.querySelector(
    tag === 'link'
      ? `link[rel="${name}"]`
      : `meta[name="${name}"]`
  );

  if (!el) {
    el = document.createElement(tag);
    if (tag === 'link') {
      el.setAttribute('rel', name);
    } else {
      el.setAttribute('name', name);
    }
    document.head.appendChild(el);
  }

  el.setAttribute(attr, content);
}

function setOG(property, content) {
  if (!content) return;
  let el = document.querySelector(`meta[property="${property}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('property', property);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}
