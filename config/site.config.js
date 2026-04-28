/* =============================================================
   SITE.CONFIG.JS — Global Site Settings
   
   This controls site-wide behavior. Edit this file to:
   - Change SEO defaults
   - Toggle sections on/off
   - Change contact email
   - Switch page mode (multi-page is current)
   ============================================================= */

export const SITE = {
  /* ─── Identity ─────────────────────────────────────────── */
  name:        "Utkarsh Singh",
  title:       "Utkarsh Singh — Quantum Machine Learning Researcher",
  description: "Quantum ML researcher, engineer, and consultant. PhD in Quantum Machine Learning, University of Ottawa. Building practical, resource-efficient quantum intelligence.",
  url:         "https://utkarshsingh.com",       // ← Update when deployed
  author:      "Utkarsh Singh",
  locale:      "en_CA",

  /* ─── Contact ───────────────────────────────────────────── */
  email:       "singhutkarsh529@gmail.com",                 // ← Add your email

  /* ─── Page Mode ─────────────────────────────────────────── */
  // "multi-page" = each section is a separate HTML file
  // "single-page" = all sections on index.html (future option)
  mode: "multi-page",

  /* ─── Navigation / Page Visibility ──────────────────────── 
     Set visible: false to hide a page from the nav.
     Set visible: true to show it.
     The order here controls the nav order.
  ──────────────────────────────────────────────────────────── */
  pages: [
    { id: "home",         label: "Home",           file: "index.html",    visible: true  },
    { id: "research",     label: "Research",        file: "research.html", visible: true  },
    { id: "projects",     label: "Projects",        file: "projects.html", visible: true  },
    { id: "patents",      label: "Patents",         file: "patents.html",  visible: true  },
    { id: "skills",       label: "Skills",          file: "skills.html",   visible: true  },
    { id: "talks",        label: "Talks",           file: "talks.html",    visible: true  },
    { id: "services",     label: "Services",        file: "services.html", visible: true  },
    { id: "contact",      label: "Contact",         file: "contact.html",  visible: true  },
  ],

  /* ─── SEO / Open Graph ───────────────────────────────────── */
  ogImage:     "./assets/images/og-image.jpg",
  twitterHandle: "",                             // ← Add if you have one

  /* ─── GitHub Pages ──────────────────────────────────────── */
  // If deploying to a subdirectory (e.g. github.com/user/repo),
  // set basePath to "/repo-name". For custom domain, leave as "".
  basePath: "",
};
