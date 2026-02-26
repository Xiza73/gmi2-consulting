import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function cleanupAnimations(): void {
  try {
    ScrollTrigger.getAll().forEach((t) => t.kill());
    gsap.killTweensOf('*');
  } catch {
    // Prevent cleanup errors from blocking View Transitions navigation
  }
}

export function showElementsWithoutAnimation(selectors: string): void {
  gsap.set(selectors, { opacity: 1, y: 0, x: 0, scale: 1, rotateX: 0, rotateY: 0 });
}

export function initScrollReveal(): void {
  gsap.utils.toArray<HTMLElement>('.scroll-reveal').forEach((el) => {
    const y = Number(el.dataset.revealY) || 0;
    const x = Number(el.dataset.revealX) || 0;
    const delay = Number(el.dataset.revealDelay) || 0;
    const duration = Number(el.dataset.revealDuration) || 1;

    gsap.fromTo(
      el,
      { y, x, opacity: 0 },
      {
        y: 0,
        x: 0,
        opacity: 1,
        duration: duration * 1.2,
        delay,
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

export function initStaggerGrids(): void {
  document.querySelectorAll<HTMLElement>('[data-stagger-grid]').forEach((grid) => {
    const items = grid.querySelectorAll('[data-stagger-item]');
    if (!items.length) return;

    gsap.fromTo(
      items,
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.12,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: grid,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      },
    );
  });
}

export function initParallax(): void {
  document.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
    const speed = Number(el.dataset.parallax) || 0.5;

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

export function initCounters(): void {
  document.querySelectorAll<HTMLElement>('[data-counter]').forEach((el) => {
    const target = Number(el.dataset.counter) || 0;
    const suffix = el.dataset.counterSuffix || '';
    const obj = { value: 0 };

    gsap.to(obj, {
      value: target,
      duration: 2,
      ease: 'power2.out',
      snap: { value: 1 },
      scrollTrigger: {
        trigger: el,
        start: 'top 75%',
        toggleActions: 'play none none none',
      },
      onUpdate: () => {
        el.textContent = `${Math.round(obj.value)}${suffix}`;
      },
    });
  });
}

export function initAllAnimations(): void {
  if (prefersReducedMotion()) {
    showElementsWithoutAnimation(
      '.scroll-reveal, [data-stagger-item], .hero-eyebrow, .hero-title, .hero-description, .hero-cta',
    );
    // Still run counters (they're not motion-based)
    initCounters();
    return;
  }

  initScrollReveal();
  initStaggerGrids();
  initParallax();
  initCounters();
}

export { gsap, ScrollTrigger };
