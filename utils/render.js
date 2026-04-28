/* =============================================================
   RENDER.JS — JSON Fetcher & HTML Injector
   
   This is the core utility that powers the content system.
   
   HOW IT WORKS:
   1. fetchJSON(path)       → loads a JSON file, returns the data
   2. renderTo(id, html)    → injects HTML string into a DOM element
   3. fetchAndRender(...)   → combines both: fetch → transform → inject
   
   EXAMPLE USAGE in a component:
   
     import { fetchAndRender } from '../utils/render.js';
     
     fetchAndRender(
       '#publications-list',           // DOM target
       './content/publications.json',  // data source
       (data) => data.publications     // extract the array
         .map(pub => `<div class="card">${pub.title}</div>`)
         .join('')
     );
   ============================================================= */


/**
 * Fetch a JSON file and return its parsed contents.
 * @param {string} path - Relative path to the JSON file
 * @returns {Promise<any>} - Parsed JSON data
 */
export async function fetchJSON(path) {
  try {
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`Failed to load ${path}: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`[render.js] fetchJSON error:`, error);
    return null;
  }
}


/**
 * Inject an HTML string into a DOM element by selector.
 * @param {string} selector - CSS selector (e.g. '#publications-list')
 * @param {string} html     - HTML string to inject
 */
export function renderTo(selector, html) {
  const el = document.querySelector(selector);
  if (!el) {
    console.warn(`[render.js] renderTo: element "${selector}" not found`);
    return;
  }
  el.innerHTML = html;
}


/**
 * Fetch JSON, transform it with a builder function, inject result.
 * 
 * @param {string}   selector  - DOM target selector
 * @param {string}   jsonPath  - Path to the JSON file
 * @param {Function} builder   - (data) => HTML string
 * @param {string}   [loading] - Optional loading state HTML
 */
export async function fetchAndRender(selector, jsonPath, builder, loading = '') {
  const el = document.querySelector(selector);
  if (!el) return;

  // Show loading state while fetching
  if (loading) el.innerHTML = loading;

  const data = await fetchJSON(jsonPath);
  if (!data) {
    el.innerHTML = `<p class="error-state">Content could not be loaded.</p>`;
    return;
  }

  el.innerHTML = builder(data);
}


/**
 * Skeleton loader HTML — use as the 'loading' argument above.
 * @param {number} count - How many skeleton cards to show
 * @returns {string} HTML string of skeleton cards
 */
export function skeletonCards(count = 3) {
  return Array(count).fill(0).map(() => `
    <div class="card skeleton-card" aria-hidden="true">
      <div class="skeleton skeleton-heading"></div>
      <div class="skeleton skeleton-text"></div>
      <div class="skeleton skeleton-text"></div>
      <div class="skeleton skeleton-text" style="width:60%"></div>
    </div>
  `).join('');
}
