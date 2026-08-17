/* =============================================================
   BOOT.JS — Shared page bootstrap: runs before + after content render
   ============================================================= */

import { initLoader } from './loader.js';
import { initCursor } from './cursor.js';
import { initParticles } from './particles.js';
import { initTilt } from './tilt.js';
import { initReveal } from './reveal.js';
import { initMagnetic } from './magnetic.js';
import { initCounters } from './counters.js';

export function bootPageStart() {
  initLoader();
  initCursor();
  initParticles();
}

export function bootPageEnd(root = document) {
  if (window.lucide) window.lucide.createIcons();
  initTilt(root);
  initReveal(root);
  initMagnetic(root);
  initCounters(root);
}
