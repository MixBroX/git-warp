# GEMINI.md — Project Instructions for Git Warp (`git-warp`)

## 🎯 Overview & Purpose
**Git Warp** (`git-warp`) is a commercial micro-SaaS web application targeted at US indie hackers and frontend developers. It provides a 100% client-side SPA in the browser to:
1. Visually explore git history and branch topology (Time-Machine Graph).
2. Import and parse custom `git log` output instantly (`Import My Repo`).
3. Simulate and resolve interactive merge conflicts without touching the command line (`Conflict Sandbox`).

## 🛠 Tech Stack & Architecture
* **Framework:** React 18 + TypeScript + Vite.
* **Styling:** Tailwind CSS + PostCSS with Premium Utilitarian Minimalism design (Linear / Vercel style: `#F7F6F3` background, `#FFFFFF` cards, `#111111` accents, Geist fonts).
* **Icons:** `lucide-react`.
* **Hosting / Repo:** GitHub (`https://github.com/MixBroX/git-warp`) & Vercel-ready.
* **Privacy:** 100% Client-Side SPA (no server data transmission).

## 📂 Key Files
* `git-warp/src/App.tsx`: Core application component housing the graph, parser, conflict sandbox, and docs.
* `git-warp-spec.md`: Master business and technical specification.
