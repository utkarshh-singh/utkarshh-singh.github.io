# Utkarsh Singh — Personal Website

Production-quality personal website for a Quantum ML researcher.
Clean architecture · JSON-driven content · Multi-page · GitHub Pages ready.

---

## 🗂️ Project Structure

```
utkarsh-singh/
├── index.html            ← Home page shell
├── research.html         ← Publications page
├── projects.html         ← Projects page
├── patents.html          ← Patents page
├── skills.html           ← Skills + Certifications + Timeline
├── talks.html            ← Talks & Workshops
├── services.html         ← Consulting services
├── contact.html          ← Contact form
│
├── config/
│   ├── site.config.js    ← Site name, URL, email, SEO defaults
│   └── theme.config.js   ← Color palette, fonts, animation settings
│
├── content/              ← ✏️ EDIT THESE to update website content
│   ├── identity.json     ← Name, bio, tagline, avatar path
│   ├── publications.json ← Research papers
│   ├── patents.json      ← Patent filings
│   ├── projects.json     ← Research projects
│   ├── talks.json        ← Talks, workshops
│   ├── skills.json       ← Technical skills by category
│   ├── certifications.json ← IBM badges + credentials
│   ├── experience.json   ← Work history
│   ├── education.json    ← Degrees
│   ├── services.json     ← Consulting offerings
│   └── links.json        ← Social media links
│
├── data/
│   └── nav.json          ← Navigation items, order, visibility
│
├── styles/
│   ├── tokens.css        ← ALL CSS variables (colors, spacing, fonts)
│   ├── theme.css         ← Light/dark mode overrides
│   ├── base.css          ← Reset + body defaults
│   ├── layout.css        ← Grid, containers, section anatomy
│   └── components/       ← One CSS file per component
│
├── components/           ← One JS file per section (render only)
├── pages/                ← One JS file per page (assembly only)
├── utils/                ← render.js, router.js, theme.js, seo.js
└── assets/               ← images/, icons/, fonts/
```

---

## ✏️ How to Edit Content

**All content lives in `content/*.json`. You never need to touch JS or CSS to update text.**

### Update your bio
Edit `content/identity.json`:
```json
{
  "fullName": "Utkarsh Singh",
  "bio": {
    "short": "One sentence version.",
    "medium": "Two sentence version shown in hero.",
    "long": "Full paragraph for about pages."
  },
  "tagline": "Researcher. Engineer. Builder."
}
```

### Add a new publication
Open `content/publications.json` and add to the `publications` array:
```json
{
  "title": "My New Paper Title",
  "authors": ["Utkarsh Singh", "Co-Author Name"],
  "journal": "Nature Quantum Information",
  "year": 2026,
  "abstract": "Paper abstract here...",
  "doiUrl": "https://doi.org/...",
  "bibtex": "@article{...}",
  "tags": ["QML", "variational"],
  "featured": false
}
```
The year and topic filters update automatically — no code changes needed.

### Add a new project
Open `content/projects.json` and add to `projects`:
```json
{
  "name": "My New Project",
  "description": "What it does.",
  "domain": "Quantum Chemistry",
  "status": "Active",
  "technologies": ["Qiskit", "Python"],
  "github": "https://github.com/...",
  "featured": false
}
```

### Add your profile photo
1. Place your photo in `assets/images/avatar.jpg`
2. In `content/identity.json`, set: `"avatar": "./assets/images/avatar.jpg"`

---

## 🎨 How to Change Themes

All visual settings are in `config/theme.config.js`.

### Switch color palette
```js
export const PALETTE = 'teal';     // options: teal | navy | slate | forest | amber
```

### Switch light/dark default
```js
export const DEFAULT_MODE = 'system'; // system | light | dark
```

### Change fonts
```js
export const TYPOGRAPHY = {
  display: "'Zodiak', Georgia, serif",
  body: "'Satoshi', system-ui, sans-serif",
};
```
Then update the `@import` in each HTML file's `<head>` to load your chosen font from Fontshare or Google Fonts.

### Adjust animation speed
```js
export const ANIMATION = {
  intensity: 'moderate', // none | subtle | moderate | expressive
};
```

---

## 🧭 How to Reorder / Hide Navigation

Edit `data/nav.json`:
```json
{ "id": "patents", "label": "Patents", "href": "./patents.html", "visible": false }
```
Set `"visible": false` to hide any page from the nav without deleting it.
Change the array order to reorder the nav links.

---

## 🚀 Deploying to GitHub Pages

### First time setup
```bash
# 1. Create a new repo on GitHub named: yourusername.github.io
# 2. In this folder:
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/yourusername.github.io.git
git push -u origin main
```
GitHub Pages will automatically serve the site at `https://yourusername.github.io`.

### After every content update
```bash
git add content/publications.json   # or whichever file you edited
git commit -m "Add new publication"
git push
```
Site updates in ~60 seconds.

### Important: update site.config.js before deploying
```js
export const SITE = {
  url:      'https://yourusername.github.io',
  basePath: '',   // empty if root repo, or '/repo-name' if project repo
};
```

---

## 🌐 Custom Domain (e.g. utkarshsingh.com)

1. Buy domain from Namecheap / Cloudflare / Google Domains
2. In your GitHub repo → Settings → Pages → Custom domain → enter your domain
3. GitHub creates a `CNAME` file automatically
4. At your registrar, add DNS records:
   ```
   A     @    185.199.108.153
   A     @    185.199.109.153
   A     @    185.199.110.153
   A     @    185.199.111.153
   CNAME www  yourusername.github.io
   ```
5. Wait 24–48 hours for DNS propagation
6. Enable "Enforce HTTPS" in GitHub Pages settings

---

## 📬 Enable Contact Form (Formspree)

The contact form works out-of-the-box as a mailto fallback.
For server-side submission (no email client popup):

1. Sign up at [formspree.io](https://formspree.io) (free tier: 50 submissions/month)
2. Create a form, copy your Form ID (e.g. `xpzgkwvr`)
3. In `config/site.config.js`:
   ```js
   formspreeId: 'xpzgkwvr',
   ```

---

## 🔧 Adding a New Page

1. Create the HTML shell (copy any existing `.html` file, change the script src)
2. Create `pages/mypage.js` (copy a stub, import your component)
3. Create `components/MyPage.js` with `export async function buildMyPage()`
4. Add to `data/nav.json`: `{ "id": "mypage", "href": "./mypage.html", ... }`
5. Done.

---

## 📦 Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Structure | Vanilla HTML5 | Zero build step, GitHub Pages compatible |
| Styling | CSS Custom Properties | Theme switching from one file |
| Logic | Vanilla JS ES Modules | No framework lock-in, no node_modules |
| Content | JSON files | Edit in any text editor |
| Fonts | Fontshare (Zodiak + Satoshi) | Distinctive, not overused |
| Icons | Lucide (CDN) | Clean, MIT licensed |
| Hosting | GitHub Pages | Free, fast, custom domain |

---

Built with clean architecture · separation of concerns · no build tools required.
