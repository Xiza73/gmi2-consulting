import type { LocaleMap } from '@/i18n/config';
import type { HeroContent } from './types';

export const HERO_CONTENT: LocaleMap<HeroContent> = {
  es: {
    eyebrow: 'Automatizacion con Inteligencia Artificial',
    title: {
      line1: 'WE',
      line2: 'AUTOMATE',
    },
    description:
      'Soluciones de automatizacion con IA diseñadas a medida para PYMEs. Agentes inteligentes que optimizan procesos, aumentan la productividad y generan resultados medibles.',
    cta: {
      primary: { label: 'Empezar Ahora', href: '#contact' },
      secondary: { label: 'Explorar', href: '#about' },
    },
  },
  en: {
    eyebrow: 'Automation with Artificial Intelligence',
    title: {
      line1: 'WE',
      line2: 'AUTOMATE',
    },
    description:
      'Custom AI automation solutions designed for SMBs. Intelligent agents that optimize processes, increase productivity, and deliver measurable results.',
    cta: {
      primary: { label: 'Get Started', href: '#contact' },
      secondary: { label: 'Explore', href: '#about' },
    },
  },
};
