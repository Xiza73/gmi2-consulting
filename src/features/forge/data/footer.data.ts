import type { LocaleMap } from '@/i18n/config';
import type { FooterBrand, FooterLinks } from './types';

export const FOOTER_BRAND: LocaleMap<FooterBrand> = {
  es: {
    text: 'GMI',
    accent: '2',
    href: '/forge',
    tagline: 'Automatizacion con IA para PYMEs. Soluciones a medida que generan resultados medibles.',
  },
  en: {
    text: 'GMI',
    accent: '2',
    href: '/forge',
    tagline: 'AI Automation for SMBs. Tailored solutions that deliver measurable results.',
  },
};

export const FOOTER_LINKS: LocaleMap<FooterLinks> = {
  es: {
    Servicios: [
      { label: 'Agentes de IA', href: '#build' },
      { label: 'Automatizacion de Procesos', href: '#build' },
      { label: 'Consultoria en IA', href: '#build' },
      { label: 'Integraciones Inteligentes', href: '#build' },
    ],
    Soluciones: [
      { label: 'Atencion al Cliente', href: '#cases' },
      { label: 'Gestion de Leads', href: '#cases' },
      { label: 'Automatizacion Operativa', href: '#cases' },
      { label: 'Dashboards Inteligentes', href: '#cases' },
    ],
    Empresa: [
      { label: 'Nosotros', href: '#about' },
      { label: 'Casos de Exito', href: '#cases' },
      { label: 'Tecnologias', href: '#tech' },
      { label: 'Contacto', href: '#contact' },
    ],
  },
  en: {
    Services: [
      { label: 'AI Agents', href: '#build' },
      { label: 'Process Automation', href: '#build' },
      { label: 'AI Consulting', href: '#build' },
      { label: 'Smart Integrations', href: '#build' },
    ],
    Solutions: [
      { label: 'Customer Support', href: '#cases' },
      { label: 'Lead Management', href: '#cases' },
      { label: 'Operational Automation', href: '#cases' },
      { label: 'Smart Dashboards', href: '#cases' },
    ],
    Company: [
      { label: 'About Us', href: '#about' },
      { label: 'Success Stories', href: '#cases' },
      { label: 'Technologies', href: '#tech' },
      { label: 'Contact', href: '#contact' },
    ],
  },
};

export const FOOTER_SOCIAL = {
  linkedin: '#',
  github: '#',
  twitter: '#',
} as const;
