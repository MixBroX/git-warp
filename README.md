# 🚀 Git Warp

> **Instant browser-based Git history topology visualization & interactive merge conflict resolver for indie hackers and developers.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React 18](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-Fast-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC.svg)](https://tailwindcss.com/)

**Git Warp** is a lightning-fast, 100% client-side Single Page Application (SPA) designed to save developers from opening heavy desktop clients or wading through messy terminal logs.

---

## ✨ Key Features

1. **🕰️ Time-Machine Graph & Branch Topology**
   * Interactive 2D visualization of commits and branches (`main`, `feature/`, etc.).
   * Clickable commit inspector displaying hashes, authors, messages, and code diff snapshots.
   * Timeline scrubber to simulate repository history progression over time.

2. **📥 Import My Repo**
   * Paste your custom local terminal output (`git log --oneline --all`) to instantly render your personal project's branch topology right in your browser.

3. **⚡ Conflict Sandbox**
   * Simulate and resolve tricky merge conflicts visually (`HEAD` vs incoming branch) without risking your working tree.
   * Instant copy-to-clipboard actions for resolution commands (`git add . && git commit`).

4. **🔒 100% Private & Client-Side**
   * Zero backend storage. Your code, logs, and history never leave your browser memory.

---

## 🛠️ Tech Stack

* **Frontend:** React 18, TypeScript, Vite
* **Styling:** Tailwind CSS (Linear / Vercel minimalist design aesthetic)
* **Icons:** `lucide-react`
* **Hosting:** Vercel-ready static deployment

---

## 🚀 Getting Started Locally

Clone the repository and run it locally in seconds:

```bash
# Clone the repository
git clone https://github.com/MixBroX/git-warp.git

# Navigate into project directory
cd git-warp

# Install dependencies
npm install

# Start development server
npm run dev
```

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
