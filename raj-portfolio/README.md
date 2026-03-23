# Raj Singh — 3D Portfolio (React)

A production-grade, fully animated React portfolio with 3D effects, particle canvas, custom cursor, and scroll animations.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ installed ([nodejs.org](https://nodejs.org))

### Setup

```bash
# 1. Unzip the folder and open it
cd raj-portfolio

# 2. Install dependencies
npm install

# 3. Start the dev server
npm start
```

Opens at **http://localhost:3000** 🎉

---

## 📦 Build for Production

```bash
npm run build
```

Output goes to the `build/` folder — ready to deploy on **Netlify**, **Vercel**, or **GitHub Pages**.

### Deploy to Netlify (free)
1. Run `npm run build`
2. Go to [netlify.com](https://netlify.com) → drag & drop the `build/` folder
3. Your site is live in seconds!

---

## 🗂️ Project Structure

```
src/
├── components/
│   ├── Cursor.jsx            ← Custom animated cursor
│   ├── ParticleCanvas.jsx    ← Interactive particle background
│   ├── Navbar.jsx            ← Fixed navigation bar
│   ├── Hero.jsx              ← Hero section with photo upload
│   ├── About.jsx             ← About + Education + Stats
│   ├── Skills.jsx            ← Tech stack cards
│   ├── Experience.jsx        ← Competitive programming
│   ├── Projects.jsx          ← Project showcase cards
│   ├── Contact.jsx           ← Contact links
│   ├── Divider.jsx           ← Section separator
│   ├── Footer.jsx            ← Footer
│   └── SectionLabel.jsx      ← Shared label component
│
├── data/
│   └── portfolioData.js      ← ✏️ ALL YOUR INFO IS HERE
│
├── hooks/
│   └── useReveal.js          ← Scroll reveal hook
│
├── App.js                    ← Root component
├── index.js                  ← Entry point
└── index.css                 ← Global styles & animations
```

---

## ✏️ How to Customize

All your personal info lives in **one file**: `src/data/portfolioData.js`

- Update `personalInfo` → your name, email, links, location
- Update `education` → your degrees and scores
- Update `skills` → your tech stack
- Update `projects` → your projects with bullet points and stack tags
- Update `experience` → your work / competitive programming history

### Adding Your Photo
Click the **"+ Add Photo"** button in the hero section to upload your photo directly in the browser.

---

## 🎨 Features

| Feature | Details |
|---|---|
| 🎆 Particle Canvas | 130 interactive particles with mouse repulsion & connection lines |
| 🖱️ Custom Cursor | Magnetic animated cursor with hover effects |
| 📦 3D Cube | Rotating wireframe cube decoration |
| 🎬 Scroll Reveals | Intersection Observer-based staggered animations |
| 📱 Responsive | Mobile, tablet, and desktop fully handled |
| 🖼️ Photo Upload | Click to upload your photo directly in the browser |
| 🎨 CSS Modules | Scoped styles, no class conflicts |
| ⚡ React 18 | Hooks, functional components throughout |

---

## 🌐 Tech Stack

- **React 18** — UI framework
- **CSS Modules** — scoped styling
- **Canvas API** — particle animation
- **Intersection Observer API** — scroll reveals
- **Google Fonts** — Syne (display) + DM Mono (body)

---

Made with ❤️ by Raj Singh
