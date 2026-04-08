import type { LocaleMap } from '@/i18n/config';
import type { NavBrand, NavContent } from './types';

export const NAV_BRAND: NavBrand = {
  text: 'GMI',
  accent: '2',
  href: '/forge',
} as const;

export const NAV_CONTENT: LocaleMap<NavContent> = {
  es: {
    links: [
      { label: 'Nosotros', href: '#about' },
      { label: 'Servicios', href: '#build' },
      { label: 'Tecnologias', href: '#tech' },
      { label: 'Casos', href: '#cases' },
      { label: 'Testimonios', href: '#testimonials' },
    ],
    cta: { label: 'Contactar', href: '#contact' },
  },
  en: {
    links: [
      { label: 'About', href: '#about' },
      { label: 'Services', href: '#build' },
      { label: 'Technologies', href: '#tech' },
      { label: 'Cases', href: '#cases' },
      { label: 'Testimonials', href: '#testimonials' },
    ],
    cta: { label: 'Contact', href: '#contact' },
  },
};
