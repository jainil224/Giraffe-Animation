# SynapseX — Neural-AI Interface Landing Site

> *Built at the intersection of neuroscience and artificial intelligence.*

A high-fidelity, single-page landing site for **SynapseX** — a futuristic neural-AI interface product that maps neural pathways, cognitive load, and physiological states into a single adaptive intelligence layer.

---

## ✨ Features

- **Mouse-Scrubbed Hero Video** — Move your mouse left/right to scrub through the background video in real-time
- **Text Scramble Animation** — Custom character-scrambling entrance animation for headings
- **Cinematic 3D Parallax** — Scroll-linked 3D transform and opacity transitions on the intro section
- **Glassmorphism Cards** — Subtle `backdrop-blur` metric cards with hover transitions
- **Responsive Layout** — Fully responsive across mobile, tablet, and desktop breakpoints
- **Dark Mode Aesthetics** — Premium deep black background with high-contrast white typography
- **Smooth Scrollbar** — Custom styled scrollbar matching the dark theme

---

## 🛠 Tech Stack

| Tool | Purpose |
|---|---|
| [React 18](https://react.dev/) | UI framework |
| [TypeScript](https://www.typescriptlang.org/) | Type safety |
| [Vite](https://vitejs.dev/) | Build tool & dev server |
| [Tailwind CSS v3](https://tailwindcss.com/) | Utility-first styling |
| [Framer Motion](https://www.framer.com/motion/) | Animations & transitions |
| [Space Mono](https://fonts.google.com/specimen/Space+Mono) | Primary typeface |
| [Anton SC](https://fonts.google.com/specimen/Anton+SC) | Display / watermark typeface |
| [Bootstrap Icons](https://icons.getbootstrap.com/) | Icon set |

---

## 📁 Project Structure

```
synapsex-landing/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── components/
│   │   ├── Navbar.tsx          # Fixed top navbar with expanding menu capsule
│   │   ├── ScrambleIn.tsx      # Entrance text scramble animation
│   │   ├── ScrambleText.tsx    # Hover text scramble animation
│   │   ├── SquashHamburger.tsx # Animated hamburger icon
│   │   └── SynapseXLogo.tsx    # SVG logo component
│   ├── App.tsx                 # Main layout & all page sections
│   ├── App.css                 # Component-level styles
│   ├── index.css               # Global styles & font imports
│   └── main.tsx                # React entry point
├── index.html                  # HTML template & SEO meta tags
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm v9 or higher

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd synapsex-landing

# Install dependencies
npm install
```

### Development

```bash
# Start the local dev server
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
# Build for production
npm run build

# Preview the production build locally
npm run preview
```

---

## 🎨 Sections

| # | Section | Description |
|---|---|---|
| 1 | **Hero** | Full-viewport mouse-scrubbed video with "Brain And Body" (top-left), description (bottom-left), and "One Network" (bottom-right) layout |
| 2 | **Cinematic Text** | Scroll-linked 3D parallax narrative block over a looping background video |
| 3 | **Metrics** | "2.4ms" and "140B" performance stats in glassmorphic cards, aligned to opposite edges |
| 4 | **Adaptive Intelligence** | Four-feature technology grid over a rotating galaxy video |
| 5 | **Architecture** | Three-layer system architecture cards (Capture → Process → Interface) |
| 6 | **Footer** | Split layout with video background (left) and brand information (right) |

---

## 🎬 Video Sources

All background videos are hosted on [Cloudinary](https://cloudinary.com/) and loaded as direct `.mp4` sources via a URL conversion helper in `App.tsx`.

---

## 📄 License

© 2026 SynapseX Labs. All rights reserved.
