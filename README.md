# davlo.io - Software for the Universe

Next-generation interactive space-themed website built by David and Loïs, featuring an immersive 3D experience with interactive planets and smooth animations.

## 🚀 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **3D Graphics**: Three.js + React Three Fiber
- **Animations**: Framer Motion
- **Build Tools**: Turbopack
- **3D Rendering**: WebGL with custom shaders

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
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage with 3D scene
│   └── globals.css        # Global styles & animations
├── components/
│   ├── canvas/            # Three.js/R3F components
│   │   ├── Scene3D.tsx    # Main 3D scene with wheel zoom
│   │   ├── Planet3D.tsx   # Reusable planet component
│   │   ├── Stars.tsx      # Star field
│   │   └── Background.tsx # Gradient background
│   └── ui/                # UI components
│       ├── Hero.tsx       # Hero section with header
│       ├── DetailModal.tsx # About Us modal
│       ├── Footer.tsx     # Footer component
│       └── CustomCursor.tsx # Custom cursor
├── hooks/
│   └── useWheelZoom.ts    # Wheel-based zoom control
├── types/
│   └── planet.ts          # TypeScript interfaces
└── public/                # Static assets
    └── davlo_io_*.svg     # Logos (white & black)
```

## ✨ Features

- **Wheel-Based Zoom**: Scroll to zoom into 3D space using mouse wheel
- **Interactive Planet**: Click to enter detail view with smooth animations
- **Dynamic Theme System**: Seamless white ↔ black transitions on planet interaction
- **About Us Modal**: Immersive modal with staggered animations featuring:
  - Team information (David & Loïs) with social links
  - Mission and philosophy
  - Tech stack constellation visualization
  - Company slogan and branding
- **Custom Cursor**: Interactive cursor with hover effects
- **3D Star Field**: Thousands of animated stars
- **Sprite-Based Glow**: Realistic planet glow effects
- **Smooth Animations**: Framer Motion powered transitions

## 🎨 Design Philosophy

- Minimalistic yet immersive space aesthetic
- Dynamic theme transitions (white ↔ black)
- Desktop-first experience for tech-savvy audience
- 3D interaction as the main wow factor
- Smooth transitions and micro-interactions
- Clean typography with Geist Sans font family
- Staggered animations for engaging content reveals

## 📝 TODO

See [TODO.md](./TODO.md) for the complete list of planned features and open tasks.

## 👥 Team

Built by **David** and **Loïs** - two passionate engineers who believe in building software that pushes boundaries and inspires innovation.

- **David**: [Website](https://www.unterguggenberger.ch/) • [GitHub](https://github.com/JumpiiX)
- **Loïs**: [Website](https://loiskauffungen.com/) • [GitHub](https://github.com/moinloin)

## 🌟 Mission

Creating tools and experiences that challenge the ordinary and push technical boundaries. We build with passion, precision, and a relentless focus on quality.

## 🔧 Tech Stack Used

Rust • Kubernetes • Go • TypeScript • Next.js • React • PostgreSQL • Docker • GraphQL

---

**Software for the Universe**
