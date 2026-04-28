/* =============================================================
   ROUTER.JS — Active Page Detection
   
   In multi-page mode, we need to know WHICH page is currently
   open so the nav can highlight the right item.
   
   HOW IT WORKS:
   1. Reads the current page's filename from window.location
   2. Compares it to each nav item's href
   3. Adds aria-current="page" and class="active" to the match
   4. Also handles the edge case of "/" or "" meaning "index.html"
   
   USAGE: Called automatically by Header.js after nav renders.
   You never need to call this directly.
   ============================================================= */


/**
 * Detect the current page and mark the matching nav link as active.
 * @param {string} navSelector - CSS selector for the <nav> element
 */
export function setActiveNavItem(navSelector = '.site-nav') {
  const nav = document.querySelector(navSelector);
  if (!nav) return;

  // Get the current page filename (e.g. "research.html")
  const currentPath = window.location.pathname;
  const currentFile = currentPath.split('/').pop() || 'index.html';

  // Normalize: empty string or "/" → "index.html"
  const currentPage = (currentFile === '' || currentFile === '/') 
    ? 'index.html' 
    : currentFile;

  // Find all nav links and mark the matching one
  const links = nav.querySelectorAll('a[data-page-id]');
  links.forEach(link => {
    const linkFile = link.getAttribute('href').split('/').pop();
    const isActive = linkFile === currentPage;

    link.classList.toggle('active', isActive);
    link.setAttribute('aria-current', isActive ? 'page' : 'false');
  });
}


/**
 * Get the current page ID (e.g. "research", "projects", "home").
 * Useful for page-specific logic in components.
 * @returns {string} page ID
 */
export function getCurrentPageId() {
  const filename = window.location.pathname.split('/').pop() || 'index.html';
  return filename.replace('.html', '') || 'home';
}
