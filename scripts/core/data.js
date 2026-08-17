/* =============================================================
   DATA.JS — JSON fetch + DOM injection helpers
   ============================================================= */

const cache = new Map();

export async function fetchJSON(path) {
  if (cache.has(path)) return cache.get(path);
  try {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`Failed to load ${path}: ${response.status}`);
    const data = await response.json();
    cache.set(path, data);
    return data;
  } catch (error) {
    console.error('[data.js] fetchJSON error:', error);
    return null;
  }
}

export function renderTo(selector, html) {
  const el = document.querySelector(selector);
  if (!el) return;
  el.innerHTML = html;
}
