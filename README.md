# davlo.io - Software for the Universe

Next-generation interactive space-themed website for davlo.io, featuring blockchain explorers and software.

## 🚀 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **3D Graphics**: Three.js + React Three Fiber
- **Animations**: GSAP, Framer Motion
- **Smooth Scroll**: Lenis
- **Shaders**: Custom GLSL shaders

## 🛠️ Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to see the result.

## 📁 Project Structure

```
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout with smooth scroll
│   ├── page.tsx           # Homepage
│   └── globals.css        # Global styles
├── components/
│   ├── canvas/            # Three.js/R3F components
│   │   ├── Scene.tsx      # Canvas wrapper
│   │   ├── Stars.tsx      # Star field
│   │   └── Background.tsx # Gradient background
│   └── ui/                # UI components
│       ├── Hero.tsx       # Hero section
│       ├── PlanetSection.tsx # Planet sections
│       ├── SmoothScroll.tsx  # Lenis wrapper
│       └── CustomCursor.tsx  # Custom cursor
├── lib/
│   └── shaders/           # GLSL shader files
└── public/                # Static assets
```

## ✨ Features

- **Smooth Scrolling**: Buttery smooth scroll experience with Lenis
- **Custom Cursor**: Interactive cursor with hover effects
- **3D Star Field**: Thousands of animated stars
- **Parallax Scrolling**: Multi-layer depth effects (coming soon)
- **Planet Exploration**: Interactive zoom into planets (coming soon)
- **Shader Effects**: Custom WebGL shaders for cosmic visuals

## 🎨 Design Philosophy

- Minimalistic yet immersive
- Space theme with deep blacks, purples, and blues
- Desktop-first for tech-savvy audience
- Parallax scrolling as the main wow factor
- Smooth transitions and micro-interactions

## 📝 TODO

See [TODO.md](./TODO.md) for the complete list of planned features and open tasks.

## 🌟 Slogan

**Software for the Universe**

---

Built with 🚀 by the davlo.io team
