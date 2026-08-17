/* =============================================================
   SEO.JS — Dynamic meta tag injection per page
   ============================================================= */

import { SITE } from '../../config/site.config.js';

export function initSEO({
  title = SITE.title,
  description = SITE.description,
  pageId = 'home',
  ogImage = SITE.ogImage,
  type = 'website',
} = {}) {
  document.title = title;

  const pageFile = pageId === 'home' ? 'index.html' : `${pageId}.html`;
  const canonical = `${SITE.url}${SITE.basePath}/${pageFile}`;
  setMeta('canonical', canonical, 'link', 'href');

  setMeta('description', description);
  setMeta('author', SITE.author);

  setOG('og:title', title);
  setOG('og:description', description);
  setOG('og:type', type);
  setOG('og:url', canonical);
  setOG('og:image', `${SITE.url}${SITE.basePath}/${ogImage.replace('./', '/')}`);
  setOG('og:site_name', SITE.name);
  setOG('og:locale', SITE.locale);

  setOG('twitter:card', 'summary_large_image');
  setOG('twitter:title', title);
  setOG('twitter:description', description);
}

function setMeta(name, content, tag = 'meta', attr = 'content') {
  if (!content) return;
  let el = document.querySelector(tag === 'link' ? `link[rel="${name}"]` : `meta[name="${name}"]`);
  if (!el) {
    el = document.createElement(tag);
    el.setAttribute(tag === 'link' ? 'rel' : 'name', name);
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
