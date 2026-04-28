/* =============================================================
   THEME.CONFIG.JS — Your Theme Control Panel
   
   This is the ONE file you edit to change the website's look.
   
   HOW TO SWITCH THEME:
     Change PALETTE to one of: "teal" | "midnight" | "sage" | "slate" | "copper" | "lavender"
   
   HOW TO CHANGE ANIMATION LEVEL:
     Change ANIMATION to: "none" | "minimal" | "moderate" | "expressive"
   
   HOW TO SET DEFAULT COLOR MODE:
     Change DEFAULT_MODE to: "system" | "light" | "dark"
     "system" = follows the user's OS setting automatically
   ============================================================= */

export const PALETTE       = "lavender";       // Active color palette
export const DEFAULT_MODE  = "system";     // "system" | "light" | "dark"
export const ANIMATION     = "expressive";    // "none" | "minimal" | "moderate" | "expressive"

/* ─── Palette Descriptions ───────────────────────────────────
   Reference guide — do not change these, just read them
   when picking your palette.

   "teal"      → warm beige + deep teal. Scientific, precise, trustworthy. (DEFAULT)
   "midnight"  → cool gray + electric indigo. Technical, dramatic, modern.
   "sage"      → warm stone + forest green. Calm authority, sustainability.
   "slate"     → cool gray + steel blue. Corporate, clean documentation feel.
   "copper"    → warm cream + burnished copper. Entrepreneurial, warm authority.
   ──────────────────────────────────────────────────────────── */

/* ─── Typography Presets ─────────────────────────────────────
   These map to font pairings loaded in each HTML file's <head>.
   Change TYPOGRAPHY to switch the font pair.

   "zodiak-satoshi"  → Zodiak (display) + Satoshi (body) — elegant, scientific (DEFAULT)
   "instrument-work" → Instrument Serif + Work Sans — editorial, warm
   "cabinet-inter"   → Cabinet Grotesk + Inter — modern, minimal
   "boska-general"   → Boska + General Sans — expressive, bold
   ──────────────────────────────────────────────────────────── */
export const TYPOGRAPHY = "zodiak-satoshi";

export const FONT_PAIRS = {
  "zodiak-satoshi": {
    displayFont:  "Zodiak",
    bodyFont:     "Satoshi",
    displayCDN:   "https://api.fontshare.com/v2/css?f[]=zodiak@400,500,600,700&display=swap",
    bodyCDN:      "https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500,700&display=swap",
  },
  "instrument-work": {
    displayFont:  "Instrument Serif",
    bodyFont:     "Work Sans",
    displayCDN:   "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap",
    bodyCDN:      "https://fonts.googleapis.com/css2?family=Work+Sans:wght@300..700&display=swap",
  },
  "cabinet-inter": {
    displayFont:  "Cabinet Grotesk",
    bodyFont:     "Inter",
    displayCDN:   "https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@400,500,700,800&display=swap",
    bodyCDN:      "https://fonts.googleapis.com/css2?family=Inter:wght@300..700&display=swap",
  },
  "boska-general": {
    displayFont:  "Boska",
    bodyFont:     "General Sans",
    displayCDN:   "https://api.fontshare.com/v2/css?f[]=boska@400,500,700&display=swap",
    bodyCDN:      "https://api.fontshare.com/v2/css?f[]=general-sans@300,400,500,700&display=swap",
  }
};

/* ─── Animation Timing Maps ──────────────────────────────────
   Controls how animated the site feels globally.
   Components read ANIMATION and apply the right intensity.
   ──────────────────────────────────────────────────────────── */
export const ANIMATION_CONFIG = {
  none:       { scrollReveal: false, hoverScale: false,  staggerDelay: 0 },
  minimal:    { scrollReveal: true,  hoverScale: false,  staggerDelay: 60 },
  moderate:   { scrollReveal: true,  hoverScale: true,   staggerDelay: 80 },
  expressive: { scrollReveal: true,  hoverScale: true,   staggerDelay: 100 }
};
