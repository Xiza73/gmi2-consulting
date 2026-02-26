# ASTRO LANDING ARCHITECTURE GUIDELINES v1.0

**Role:** Senior Astro Architect & Landing Page Engineer
**Stack:** Astro 5.x + TypeScript + Tailwind CSS v4 + React (Islands) + Three.js / R3F + GSAP + ScrollTrigger
**Pattern:** Static-First + Islands Architecture + Vertical Sections + SEO-Driven

---

## 1. CORE PHILOSOPHY

We prioritize **Performance**, **SEO**, and **Visual Impact**.

- **Zero JS by default:** Astro ships static HTML. JavaScript only loads for interactive "islands".
- **Islands Architecture:** Interactive components hydrate selectively via client directives.
- **SEO-First:** Every page is server-rendered, crawlable, and optimized for Core Web Vitals.
- **Visual Excellence:** Professional animations with GSAP + Three.js that enhance, not hinder, performance.
- **Content-Driven:** Landing page content is structured, type-safe, and easy to update.

---

## 2. DIRECTORY STRUCTURE

```text
src/
 ├── assets/                  # Processed images, fonts (Astro optimizes at build)
 │    ├── images/
 │    └── fonts/
 │
 ├── components/              # COMPONENT LAYER
 │    ├── ui/                 # Design system primitives (Button, Badge, Card)
 │    ├── layout/             # Layout primitives (Section, Container, Stack, Grid)
 │    ├── seo/                # SEO components (SEOHead, StructuredData, Breadcrumbs)
 │    ├── animations/         # GSAP animation wrappers (ScrollReveal, FadeIn, ParallaxLayer)
 │    ├── three/              # Three.js / R3F components (HeroScene, ParticleBackground)
 │    └── sections/           # Landing page section components
 │         ├── hero/          # Hero section variants
 │         ├── features/      # Features/services grid sections
 │         ├── testimonials/  # Testimonial/social proof sections
 │         ├── pricing/       # Pricing table sections
 │         ├── cta/           # Call-to-action sections
 │         ├── faq/           # FAQ accordion sections
 │         ├── stats/         # Stats/counters sections
 │         ├── team/          # Team member sections
 │         └── contact/       # Contact form sections
 │
 ├── layouts/                 # PAGE SHELLS
 │    ├── BaseLayout.astro    # HTML shell (head, body, global styles)
 │    ├── LandingLayout.astro # Landing page layout (header, footer, transitions)
 │    └── BlogLayout.astro    # Blog/article layout
 │
 ├── pages/                   # ROUTING LAYER (file-based)
 │    ├── index.astro         # Homepage landing
 │    ├── about.astro
 │    ├── services/
 │    ├── blog/
 │    └── contact.astro
 │
 ├── content/                 # CONTENT COLLECTIONS
 │    ├── blog/
 │    ├── services/
 │    ├── testimonials/
 │    └── team/
 │
 ├── data/                    # Static data files (JSON, YAML)
 │
 ├── lib/                     # UTILITY LAYER
 │    ├── animations.ts       # GSAP initialization helpers
 │    ├── constants.ts        # Site-wide constants (site name, social links)
 │    └── utils.ts            # Pure utility functions (formatDate, cn)
 │
 ├── styles/                  # GLOBAL STYLES
 │    └── global.css          # Tailwind v4 entry + @theme + global resets
 │
 ├── content.config.ts        # Content collection schemas
 ├── middleware.ts             # Request/response middleware
 └── env.d.ts                 # TypeScript ambient declarations

public/                       # STATIC ASSETS (copied verbatim)
 ├── favicon.svg
 ├── robots.txt
 ├── og-default.png
 └── models/                  # 3D model files (.glb, .gltf)
```

### Folder Responsibilities

| Folder | Purpose | Key Rule |
|--------|---------|----------|
| `components/ui/` | Design system atoms | `.astro` components, zero JS |
| `components/layout/` | Structural primitives | Section, Container, Stack, Grid |
| `components/seo/` | Meta, Open Graph, JSON-LD | Reusable across all pages |
| `components/animations/` | GSAP wrappers | Lifecycle-aware (View Transitions) |
| `components/three/` | 3D scenes | Always `client:only="react"` |
| `components/sections/` | Landing page blocks | Each section is self-contained |
| `layouts/` | Page shells | Head, body, global providers |
| `pages/` | Routes | Composition Root — no logic |
| `content/` | Markdown/MDX/YAML | Type-safe via Zod schemas |
| `lib/` | Utilities | Pure functions, constants |

> **Rule:** Only create folders that the project needs. Don't scaffold empty folders.

---

## 3. ISLANDS ARCHITECTURE — HYDRATION STRATEGY

Astro renders everything as static HTML by default. JavaScript only ships for components that need interactivity, using **client directives**.

### Client Directive Decision Table

| Directive | When it Hydrates | Use Case |
|-----------|-----------------|----------|
| _(none)_ | Never — static HTML | Headers, footers, text sections, cards |
| `client:load` | Immediately on page load | Critical above-fold interactivity (mobile nav toggle) |
| `client:idle` | After `requestIdleCallback` | Forms, newsletter signup, chat widgets |
| `client:visible` | When element enters viewport | Below-fold carousels, charts, counters |
| `client:media="(query)"` | When CSS media query matches | Mobile-only components (hamburger menu) |
| `client:only="react"` | Client-only — NO SSR | Three.js/WebGL scenes, canvas-based components |

### Rules

1. **Default is static.** Most landing page sections (hero text, features grid, testimonials, footer) need ZERO JavaScript. Use `.astro` components.
2. **`client:load` is expensive.** Only use for critical interactive elements that must work immediately (mobile menu toggle, critical CTA forms).
3. **Prefer `client:idle` or `client:visible`** for non-critical interactivity (contact forms, FAQ accordions).
4. **Three.js always uses `client:only="react"`** — WebGL requires browser APIs, SSR will fail.
5. **Never wrap an entire page layout in a React/framework component.** Keep layouts in `.astro`, island-ify only interactive pieces.

### Example

```astro
---
// Static sections — zero JavaScript
import HeroContent from '../components/sections/hero/HeroContent.astro';
import FeaturesGrid from '../components/sections/features/FeaturesGrid.astro';
import TestimonialsCarousel from '../components/sections/testimonials/TestimonialsCarousel.astro';
import Footer from '../components/layout/Footer.astro';

// Interactive islands — JavaScript loaded per directive
import MobileNav from '../components/ui/MobileNav.tsx';
import ContactForm from '../components/sections/contact/ContactForm.tsx';
import HeroScene from '../components/three/HeroScene';
---

<MobileNav client:media="(max-width: 768px)" />
<HeroScene client:only="react" />
<HeroContent />
<FeaturesGrid />
<TestimonialsCarousel />
<ContactForm client:idle />
<Footer />
```

---

## 4. SEO OPTIMIZATION

### 4.1 SEOHead Component

Every page MUST include an `SEOHead` component with unique `title`, `description`, and `image`.

```astro
---
// src/components/seo/SEOHead.astro
interface Props {
  title: string;
  description: string;
  image?: string;
  type?: 'website' | 'article';
  noindex?: boolean;
  publishedDate?: Date;
  modifiedDate?: Date;
}

const {
  title,
  description,
  image = '/og-default.png',
  type = 'website',
  noindex = false,
  publishedDate,
  modifiedDate,
} = Astro.props;

const canonicalURL = new URL(Astro.url.pathname, Astro.site);
const ogImageURL = new URL(image, Astro.site);
---

<!-- Primary Meta -->
<title>{title}</title>
<meta name="description" content={description} />
<link rel="canonical" href={canonicalURL} />
{noindex && <meta name="robots" content="noindex, nofollow" />}

<!-- Open Graph -->
<meta property="og:type" content={type} />
<meta property="og:url" content={canonicalURL} />
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:image" content={ogImageURL} />
<meta property="og:site_name" content="GMI2 Consulting" />
<meta property="og:locale" content="es_ES" />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content={title} />
<meta name="twitter:description" content={description} />
<meta name="twitter:image" content={ogImageURL} />

<!-- Article dates (for blog posts) -->
{publishedDate && <meta property="article:published_time" content={publishedDate.toISOString()} />}
{modifiedDate && <meta property="article:modified_time" content={modifiedDate.toISOString()} />}
```

### 4.2 JSON-LD Structured Data

Every landing page MUST include Organization structured data. Blog posts MUST include Article structured data.

```astro
---
// src/components/seo/StructuredData.astro
interface Props {
  data: Record<string, unknown>;
}
const { data } = Astro.props;
---

<script
  type="application/ld+json"
  set:html={JSON.stringify({ "@context": "https://schema.org", ...data })}
/>
```

**Usage patterns:**

```astro
<!-- Organization (every landing page) -->
<StructuredData data={{
  "@type": "Organization",
  name: "GMI2 Consulting",
  url: "https://gmi2consulting.com",
  logo: "https://gmi2consulting.com/logo.png",
  sameAs: ["https://linkedin.com/company/gmi2consulting"],
}} />

<!-- Service page -->
<StructuredData data={{
  "@type": "Service",
  name: "IT Consulting",
  provider: { "@type": "Organization", name: "GMI2 Consulting" },
  description: "Professional IT consulting services.",
}} />

<!-- FAQ section (enhances SERP with accordion) -->
<StructuredData data={{
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
}} />

<!-- Blog article -->
<StructuredData data={{
  "@type": "Article",
  headline: post.data.title,
  datePublished: post.data.pubDate.toISOString(),
  author: { "@type": "Person", name: author.data.name },
}} />
```

### 4.3 Sitemap & Robots

```javascript
// astro.config.mjs
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://gmi2consulting.com',
  trailingSlash: 'never',
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/admin/'),
      changefreq: 'weekly',
      priority: 0.7,
    }),
  ],
});
```

```text
# public/robots.txt
User-agent: *
Allow: /
Sitemap: https://gmi2consulting.com/sitemap-index.xml
```

### 4.4 SEO Rules

1. **Every page needs unique `title` and `description`** — No duplicate meta across pages.
2. **`title` format:** `{Page Title} | GMI2 Consulting` (max 60 chars).
3. **`description`:** Action-oriented, 120–160 chars, includes primary keyword.
4. **Canonical URL on every page** — Prevents duplicate content.
5. **OG image on every page** — At least 1200x630px, descriptive.
6. **JSON-LD on every page** — At minimum Organization schema.
7. **Semantic HTML in Astro components** — `<section>`, `<article>`, `<nav>`, `<header>`, `<footer>`, `<main>`. Never use `<div>` where a semantic tag applies.
8. **`alt` text on every image** — Descriptive, not decorative ("keyword stuffing").
9. **Heading hierarchy** — One `<h1>` per page, sequential `h2`→`h3`→`h4`. Never skip levels.
10. **`lang` attribute on `<html>`** — Always `lang="es"` for Spanish content.

---

## 5. VIEW TRANSITIONS

Astro's View Transitions provide SPA-like navigation while maintaining full SEO (every page is independently server-rendered).

### 5.1 Setup

```astro
---
// src/layouts/BaseLayout.astro
import { ClientRouter } from 'astro:transitions';
import SEOHead from '../components/seo/SEOHead.astro';
import '../styles/global.css';
---

<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <SEOHead title={title} description={description} />
    <ClientRouter />
  </head>
  <body class="bg-white text-gray-900 antialiased">
    <header transition:persist>
      <slot name="header" />
    </header>

    <main transition:animate="fade">
      <slot />
    </main>

    <footer>
      <slot name="footer" />
    </footer>
  </body>
</html>
```

### 5.2 Transition Directives

| Directive | Purpose |
|-----------|---------|
| `transition:animate="fade\|slide\|initial\|none"` | Per-element animation type |
| `transition:name="hero"` | Named element for cross-page morph |
| `transition:persist` | Preserve DOM & state across navigation |

### 5.3 Lifecycle Events (Critical for GSAP & Three.js)

```typescript
// Runs AFTER every navigation — re-initialize animations
document.addEventListener('astro:page-load', () => {
  initGSAPAnimations();
});

// Runs BEFORE DOM swap — clean up animations
document.addEventListener('astro:before-swap', () => {
  gsap.killTweensOf('*');
  ScrollTrigger.getAll().forEach((t) => t.kill());
});

// Runs AFTER DOM swap but before rendering — modify new DOM
document.addEventListener('astro:after-swap', () => {
  ScrollTrigger.refresh();
});
```

### 5.4 Rules

1. **Always use `astro:page-load`** to initialize GSAP/Three.js — NOT `DOMContentLoaded` or `window.onload`.
2. **Always clean up on `astro:before-swap`** — Kill all GSAP tweens and ScrollTrigger instances.
3. **Use `transition:persist`** on persistent elements (header, nav, audio players).
4. **Use `transition:name`** for cross-page element morphing (e.g., blog card → article hero).

---

## 6. GSAP ANIMATIONS

### 6.1 Animation Initialization Pattern

All GSAP animations MUST use the Astro lifecycle events and clean up properly.

```typescript
// src/lib/animations.ts
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initAnimations() {
  initScrollReveal();
  initParallax();
  initCounters();
}

export function cleanupAnimations() {
  gsap.killTweensOf('*');
  ScrollTrigger.getAll().forEach((t) => t.kill());
}
```

### 6.2 Scroll Reveal (Entrance Animations)

```astro
---
// src/components/animations/ScrollReveal.astro
interface Props {
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
  duration?: number;
  class?: string;
}

const {
  direction = 'up',
  delay = 0,
  duration = 1,
  class: className = '',
} = Astro.props;

const directionMap = {
  up: 'data-reveal-y="60"',
  down: 'data-reveal-y="-60"',
  left: 'data-reveal-x="60"',
  right: 'data-reveal-x="-60"',
};
---

<div
  class:list={['scroll-reveal opacity-0', className]}
  data-reveal-delay={delay}
  data-reveal-duration={duration}
  {...{ [direction === 'up' || direction === 'down' ? 'data-reveal-y' : 'data-reveal-x']:
    direction === 'up' || direction === 'left' ? '60' : '-60' }}
>
  <slot />
</div>

<script>
  import gsap from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';

  gsap.registerPlugin(ScrollTrigger);

  function initScrollReveal() {
    ScrollTrigger.getAll()
      .filter((t) => t.vars.trigger?.classList?.contains('scroll-reveal'))
      .forEach((t) => t.kill());

    gsap.utils.toArray<HTMLElement>('.scroll-reveal').forEach((el) => {
      const y = el.dataset.revealY ? Number(el.dataset.revealY) : 0;
      const x = el.dataset.revealX ? Number(el.dataset.revealX) : 0;
      const delay = Number(el.dataset.revealDelay) || 0;
      const duration = Number(el.dataset.revealDuration) || 1;

      gsap.fromTo(el,
        { y, x, opacity: 0 },
        {
          y: 0,
          x: 0,
          opacity: 1,
          duration,
          delay,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        },
      );
    });
  }

  document.addEventListener('astro:page-load', initScrollReveal);
</script>
```

### 6.3 Hero Timeline Animation

```astro
---
// src/components/sections/hero/HeroContent.astro
---

<section class="hero relative min-h-screen flex items-center">
  <div class="container mx-auto px-6">
    <p class="hero-eyebrow text-sm uppercase tracking-widest text-indigo-400 opacity-0">
      Consulting & Strategy
    </p>
    <h1 class="hero-title text-5xl md:text-7xl font-bold mt-4 opacity-0">
      Transform Your <span class="text-indigo-500">Business</span>
    </h1>
    <p class="hero-description text-xl text-gray-400 mt-6 max-w-2xl opacity-0">
      We deliver data-driven insights that accelerate growth.
    </p>
    <div class="hero-cta mt-8 flex gap-4 opacity-0">
      <a href="/contact" class="px-8 py-4 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">
        Get Started
      </a>
      <a href="/services" class="px-8 py-4 border border-gray-300 rounded-lg font-medium hover:border-indigo-500 transition-colors">
        Learn More
      </a>
    </div>
  </div>
</section>

<script>
  import gsap from 'gsap';

  function initHeroTimeline() {
    const heroElements = document.querySelector('.hero');
    if (!heroElements) return;

    const tl = gsap.timeline({
      defaults: { ease: 'power4.out', duration: 1 },
    });

    tl.to('.hero-eyebrow', { opacity: 1, y: 0, duration: 0.6 })
      .to('.hero-title', { opacity: 1, y: 0 }, '-=0.4')
      .to('.hero-description', { opacity: 1, y: 0 }, '-=0.6')
      .to('.hero-cta', { opacity: 1, y: 0 }, '-=0.5');
  }

  document.addEventListener('astro:page-load', initHeroTimeline);
</script>
```

### 6.4 Scroll-Scrubbed Pinned Section

```astro
<script>
  import gsap from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';

  gsap.registerPlugin(ScrollTrigger);

  function initPinnedProcess() {
    const section = document.getElementById('process-section');
    if (!section) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
        pin: true,
      },
    });

    tl.fromTo('.step-1', { opacity: 0, x: -100 }, { opacity: 1, x: 0 })
      .fromTo('.step-2', { opacity: 0, x: 100 }, { opacity: 1, x: 0 })
      .fromTo('.step-3', { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1 });
  }

  document.addEventListener('astro:page-load', initPinnedProcess);
</script>
```

### 6.5 Stagger Animations (Cards, Lists, Grids)

```astro
<script>
  import gsap from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';

  gsap.registerPlugin(ScrollTrigger);

  function initStaggerCards() {
    const grids = document.querySelectorAll('[data-stagger-grid]');
    grids.forEach((grid) => {
      const cards = grid.querySelectorAll('[data-stagger-item]');
      if (!cards.length) return;

      gsap.fromTo(cards,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: grid,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        },
      );
    });
  }

  document.addEventListener('astro:page-load', initStaggerCards);
</script>
```

### 6.6 Text Split / Character Animation

```astro
<script>
  import gsap from 'gsap';
  import { SplitText } from 'gsap/SplitText';

  gsap.registerPlugin(SplitText);

  function initTextReveal() {
    const elements = document.querySelectorAll('[data-split-text]');
    elements.forEach((el) => {
      const split = new SplitText(el, { type: 'chars,words' });

      gsap.fromTo(split.chars,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.03,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        },
      );
    });
  }

  document.addEventListener('astro:page-load', initTextReveal);
</script>
```

### 6.7 Parallax Layers

```astro
<script>
  import gsap from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';

  gsap.registerPlugin(ScrollTrigger);

  function initParallax() {
    document.querySelectorAll('[data-parallax]').forEach((el) => {
      const speed = Number((el as HTMLElement).dataset.parallax) || 0.5;

      gsap.to(el, {
        yPercent: -50 * speed,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    });
  }

  document.addEventListener('astro:page-load', initParallax);
</script>
```

### 6.8 Reduced Motion Support

**Every animation MUST respect `prefers-reduced-motion`.**

```typescript
// src/lib/animations.ts
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function initAnimations() {
  if (prefersReducedMotion()) {
    // Make elements visible without animation
    gsap.set('.scroll-reveal, .hero-eyebrow, .hero-title, .hero-description, .hero-cta', {
      opacity: 1,
      y: 0,
      x: 0,
    });
    return;
  }

  initScrollReveal();
  initHeroTimeline();
  initParallax();
}
```

### 6.9 GSAP Rules

1. **Always initialize in `astro:page-load`** — Never `DOMContentLoaded`.
2. **Always clean up in `astro:before-swap`** — Kill tweens + ScrollTrigger instances.
3. **Always check element existence** before animating (`if (!el) return`).
4. **Always respect `prefers-reduced-motion`** — Skip animations, show final state.
5. **Use data attributes** for animation config (`data-reveal-y`, `data-parallax`, `data-stagger-item`).
6. **Avoid animating layout properties** (`width`, `height`, `top`, `left`). Prefer `transform` and `opacity`.
7. **Use `will-change: transform`** sparingly and only on actively animating elements.
8. **GSAP Club plugins** (SplitText, DrawSVG, MorphSVG) require a GSAP license for production.

---

## 7. THREE.JS / REACT THREE FIBER

### 7.1 React Three Fiber Setup

```bash
npx astro add react
npm install three @react-three/fiber @react-three/drei
```

### 7.2 Scene Component Pattern

```tsx
// src/components/three/HeroScene.tsx
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float, Environment, MeshDistortMaterial } from '@react-three/drei';
import { Suspense } from 'react';

function AnimatedSphere() {
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh scale={1.5}>
        <sphereGeometry args={[1, 64, 64]} />
        <MeshDistortMaterial
          color="#4f46e5"
          roughness={0.2}
          metalness={0.8}
          distort={0.3}
          speed={2}
        />
      </mesh>
    </Float>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      style={{ width: '100%', height: '100%' }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <AnimatedSphere />
        <Environment preset="city" />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
      </Suspense>
    </Canvas>
  );
}
```

### 7.3 Astro Integration

```astro
---
import HeroScene from '../components/three/HeroScene';
---

<section class="relative h-screen">
  <!-- 3D Background — client:only because WebGL needs browser APIs -->
  <div class="absolute inset-0">
    <HeroScene client:only="react" />
  </div>

  <!-- Content overlay -->
  <div class="relative z-10 flex items-center justify-center h-full">
    <h1 class="text-6xl font-bold text-white drop-shadow-lg">
      Welcome
    </h1>
  </div>
</section>
```

### 7.4 Vanilla Three.js (Lighter Option)

For simple effects (particles, background), use vanilla Three.js in `.astro` components to avoid shipping React:

```astro
---
// src/components/three/ParticleBackground.astro
---

<canvas id="particle-canvas" class="fixed inset-0 -z-10"></canvas>

<script>
  import * as THREE from 'three';

  function initParticles() {
    const canvas = document.getElementById('particle-canvas') as HTMLCanvasElement;
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Particles
    const count = 2000;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 10;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      size: 0.02,
      color: '#6366f1',
      transparent: true,
      opacity: 0.8,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
    camera.position.z = 3;

    let animationId: number;

    function animate() {
      animationId = requestAnimationFrame(animate);
      particles.rotation.y += 0.0005;
      particles.rotation.x += 0.0002;
      renderer.render(scene, camera);
    }
    animate();

    // Resize handler
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    // Cleanup on navigation
    document.addEventListener('astro:before-swap', () => {
      cancelAnimationFrame(animationId);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      window.removeEventListener('resize', onResize);
    }, { once: true });
  }

  document.addEventListener('astro:page-load', initParticles);
</script>
```

### 7.5 GSAP + Three.js Integration

Use GSAP to control Three.js camera or object properties:

```tsx
// src/components/three/ScrollDrivenScene.tsx
import { useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function ScrollCamera() {
  const { camera } = useThree();

  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#three-scroll-container',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
      },
    });

    tl.to(camera.position, { z: 2, y: 1, duration: 1 })
      .to(camera.rotation, { x: -0.3, duration: 1 }, 0);

    return () => {
      tl.kill();
    };
  }, [camera]);

  return null;
}
```

### 7.6 Three.js Performance Rules

1. **Always use `client:only="react"`** — Never `client:load` (SSR crashes on WebGL APIs).
2. **Limit pixel ratio:** `dpr={[1, 2]}` or `Math.min(window.devicePixelRatio, 2)`.
3. **Dispose everything on navigation** — Geometries, materials, textures, renderers.
4. **Use `<Suspense fallback={null}>`** for loading states.
5. **Compress 3D models** — Use `.glb` (binary glTF), compress with `gltf-transform` or Draco.
6. **Use `client:visible`** for below-fold Three.js scenes (wrap in a container with fixed height).
7. **Prefer `@react-three/drei` helpers** — `Float`, `OrbitControls`, `Environment`, `useGLTF`.
8. **Keep triangle count low** for landing pages — Under 100k triangles total.

---

## 8. PERFORMANCE OPTIMIZATION

### 8.1 Image Optimization

```astro
---
import { Image } from 'astro:assets';
import heroImage from '../assets/images/hero.jpg';
---

<!-- Above-fold: eager load, responsive sizes -->
<Image
  src={heroImage}
  widths={[400, 800, 1200, 1600]}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
  alt="Professional consulting services"
  format="webp"
  quality={80}
  loading="eager"
/>

<!-- Below-fold: lazy load -->
<Image
  src={featureImage}
  alt="Feature description"
  loading="lazy"
  decoding="async"
/>
```

### 8.2 Font Loading

```javascript
// astro.config.mjs
import { defineConfig, fontProviders } from 'astro/config';

export default defineConfig({
  experimental: {
    fonts: [
      {
        provider: fontProviders.google(),
        name: 'Inter',
        cssVariable: '--font-inter',
        weights: [400, 500, 600, 700],
        subsets: ['latin'],
        display: 'swap',
        fallbacks: ['system-ui', 'sans-serif'],
      },
    ],
  },
});
```

### 8.3 Prefetch Strategy

```javascript
// astro.config.mjs
export default defineConfig({
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'hover',
  },
});
```

```astro
<a href="/services" data-astro-prefetch="viewport">Services</a>
<a href="/contact" data-astro-prefetch="hover">Contact</a>
```

### 8.4 Third-Party Scripts

```astro
<!-- Analytics in web worker via Partytown -->
<script type="text/partytown" src="https://www.googletagmanager.com/gtag/js?id=G-XXXXX"></script>
```

### 8.5 Core Web Vitals Targets

| Metric | Target | Strategy |
|--------|--------|----------|
| **LCP** | < 2.5s | `loading="eager"` on hero image, preload fonts, minimize above-fold islands |
| **INP** | < 200ms | Defer islands with `client:idle`/`client:visible`, minimize JS bundle |
| **CLS** | < 0.1 | Explicit `width`/`height` on images, `font-display: swap`, reserve space for 3D canvases |

### 8.6 Performance Rules

1. **Images in `src/assets/`** — Astro optimizes them. `public/` images are served as-is.
2. **Always set `width` and `height`** on images to prevent CLS.
3. **`loading="eager"`** ONLY for the LCP image (hero). Everything else is `lazy`.
4. **Self-host fonts** — Use Astro's Font API or manual `@font-face`. No external font CDNs.
5. **Minimize above-fold islands** — The hero should be mostly static HTML + CSS.
6. **Reserve space for 3D canvases** — Use `min-h-screen` or fixed height to prevent CLS.
7. **Use Partytown** for analytics scripts — Offloads to web worker.

---

## 9. CONTENT COLLECTIONS

### 9.1 Schema Definition

```typescript
// src/content.config.ts
import { defineCollection, reference } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/data/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string().max(160),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    author: reference('authors'),
  }),
});

const authors = defineCollection({
  loader: file('./src/data/authors.json'),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    avatar: z.string(),
    bio: z.string(),
  }),
});

const services = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/data/services' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    icon: z.string(),
    features: z.array(z.string()),
    order: z.number(),
  }),
});

const testimonials = defineCollection({
  loader: file('./src/data/testimonials.json'),
  schema: z.object({
    quote: z.string(),
    author: z.string(),
    company: z.string(),
    avatar: z.string().optional(),
    rating: z.number().min(1).max(5).default(5),
  }),
});

export const collections = { blog, authors, services, testimonials };
```

### 9.2 Querying Collections

```astro
---
import { getCollection } from 'astro:content';

// Type-safe, filtered, sorted
const posts = (await getCollection('blog', ({ data }) => !data.draft))
  .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

const services = (await getCollection('services'))
  .sort((a, b) => a.data.order - b.data.order);
---
```

### 9.3 Rules

1. **All content has Zod schemas** — No untyped content.
2. **Blog `description` max 160 chars** — Enforced by schema for SEO.
3. **Use `reference()`** for cross-collection relations (author → blog).
4. **Filter drafts** in queries: `({ data }) => !data.draft`.

---

## 10. TAILWIND CSS v4 SETUP

### 10.1 Configuration

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
});
```

```css
/* src/styles/global.css */
@import "tailwindcss";

@theme {
  /* Brand Colors */
  --color-primary-50: #eef2ff;
  --color-primary-100: #e0e7ff;
  --color-primary-200: #c7d2fe;
  --color-primary-300: #a5b4fc;
  --color-primary-400: #818cf8;
  --color-primary-500: #6366f1;
  --color-primary-600: #4f46e5;
  --color-primary-700: #4338ca;
  --color-primary-800: #3730a3;
  --color-primary-900: #312e81;

  /* Typography */
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-heading: 'CalSans', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  /* Custom Breakpoints */
  --breakpoint-xs: 475px;
}
```

### 10.2 Scoped Styles + Tailwind

```astro
<div class="relative overflow-hidden rounded-2xl p-8">
  <div class="gradient-bg absolute inset-0 -z-10"></div>
  <h2 class="text-3xl font-bold text-white">Premium Feature</h2>
</div>

<style>
  /* Complex effects in scoped styles, layout in Tailwind */
  .gradient-bg {
    background: linear-gradient(135deg, var(--color-primary-900), var(--color-primary-700));
    animation: shimmer 8s ease-in-out infinite;
  }

  @keyframes shimmer {
    0%, 100% { opacity: 0.8; }
    50% { opacity: 1; }
  }
</style>
```

### 10.3 Rules

1. **Use Tailwind v4 Vite plugin** — NOT `@astrojs/tailwind` (deprecated for v4).
2. **CSS-first config** — Use `@theme` in CSS, not `tailwind.config.ts`.
3. **Complex animations in `<style>`** — Tailwind for layout/spacing, scoped styles for keyframes.
4. **Global styles imported once** in `BaseLayout.astro`.
5. **Use CSS variables** from `@theme` for brand consistency.

---

## 11. MIDDLEWARE

```typescript
// src/middleware.ts
import { defineMiddleware, sequence } from 'astro:middleware';

const securityHeaders = defineMiddleware(async (_context, next) => {
  const response = await next();
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  return response;
});

const timing = defineMiddleware(async (_context, next) => {
  const start = performance.now();
  const response = await next();
  response.headers.set('Server-Timing', `total;dur=${(performance.now() - start).toFixed(2)}`);
  return response;
});

export const onRequest = sequence(securityHeaders, timing);
```

---

## 12. ASTRO CONFIG REFERENCE

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://gmi2consulting.com',
  trailingSlash: 'never',

  integrations: [
    react(),
    sitemap({
      filter: (page) => !page.includes('/admin/'),
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
  },

  prefetch: {
    defaultStrategy: 'hover',
  },

  image: {
    domains: [],
    remotePatterns: [],
  },
});
```

---

## 13. NAMING CONVENTIONS

| Element | Convention | Example |
|---------|-----------|---------|
| Page file | `kebab-case.astro` | `about.astro`, `contact.astro` |
| Layout file | `PascalCase.astro` | `BaseLayout.astro` |
| Astro component | `PascalCase.astro` | `HeroContent.astro`, `SEOHead.astro` |
| React component | `PascalCase.tsx` | `HeroScene.tsx`, `ContactForm.tsx` |
| Section folder | `kebab-case/` | `sections/hero/`, `sections/pricing/` |
| Content collection | `kebab-case/` | `content/blog/`, `content/services/` |
| Utility file | `kebab-case.ts` | `animations.ts`, `constants.ts` |
| CSS file | `kebab-case.css` | `global.css` |
| Data attribute | `kebab-case` | `data-reveal-y`, `data-parallax` |
| CSS variable | `kebab-case` | `--color-primary-500`, `--font-heading` |

---

## 14. LANDING PAGE SECTION CHECKLIST

When building a professional landing page, consider these sections:

| Section | Priority | Animation Type | Island? |
|---------|----------|---------------|---------|
| **Hero** | Required | GSAP timeline + Three.js background | Three.js: `client:only` |
| **Social Proof / Logos** | Required | Stagger fade-in | No |
| **Services / Features** | Required | ScrollReveal stagger | No |
| **Stats / Counters** | Recommended | Counter animation on scroll | No (GSAP in `<script>`) |
| **Testimonials** | Recommended | Carousel or stagger | Optional: `client:visible` |
| **Process / How It Works** | Recommended | Pinned scroll-scrub | No (GSAP in `<script>`) |
| **Team** | Optional | ScrollReveal stagger | No |
| **Pricing** | Optional | ScrollReveal | No |
| **FAQ** | Recommended | Accordion | `client:idle` |
| **CTA** | Required | Parallax background | No |
| **Contact Form** | Required | None / simple fade | `client:idle` |
| **Footer** | Required | None | No |

---

## 15. RULES & ANTI-PATTERNS

### DO

- Use `.astro` components for static sections — ZERO JavaScript.
- Use `client:only="react"` for Three.js / WebGL.
- Use `client:idle` or `client:visible` for non-critical interactive islands.
- Initialize GSAP in `astro:page-load`, clean up in `astro:before-swap`.
- Respect `prefers-reduced-motion` in all animations.
- Use `<Image>` from `astro:assets` for all images.
- Include `SEOHead` with unique meta on every page.
- Include JSON-LD structured data on every page.
- Use semantic HTML (`<section>`, `<article>`, `<nav>`, `<header>`, `<footer>`).
- Use Content Collections with Zod schemas for all structured content.
- Self-host fonts for performance and privacy.
- Reserve space for 3D canvases to prevent CLS.
- Dispose Three.js resources on navigation.
- Use data attributes for GSAP animation configuration.

### DON'T

- **NEVER** use `client:load` unless the element is critical and above-fold.
- **NEVER** wrap entire layouts in React/Vue/Svelte components.
- **NEVER** use `DOMContentLoaded` or `window.onload` — Use `astro:page-load`.
- **NEVER** forget to clean up GSAP/ScrollTrigger on `astro:before-swap`.
- **NEVER** use `client:load` for Three.js — Use `client:only="react"`.
- **NEVER** load images from `public/` when they could be in `src/assets/` (loses optimization).
- **NEVER** skip `alt` text on images.
- **NEVER** have duplicate `<title>` or `<meta name="description">` across pages.
- **NEVER** use `@astrojs/tailwind` for Tailwind v4 — Use `@tailwindcss/vite`.
- **NEVER** animate layout properties (`width`, `height`, `top`, `left`) — Use `transform` and `opacity`.
- **NEVER** ship unused JavaScript — If a section is static, it's an `.astro` component with no client directive.
- **NEVER** use TypeScript `enum` — Use `as const` + type extraction pattern.
- **NEVER** skip heading levels (`h1` → `h3`) — Maintain hierarchy.
- **NEVER** use inline styles for animations — Use GSAP or scoped `<style>`.
