import type { LocaleMap } from '@/i18n/config';
import type { CtaContent } from './types';

export const CTA_CONTENT: LocaleMap<CtaContent> = {
  es: {
    title: {
      line1: '¿Listo para',
      accent: 'automatizar tu negocio?',
    },
    description:
      'Contanos sobre tus procesos y te mostramos como la IA puede optimizarlos. Sin compromiso, sin letra chica.',
    cta: {
      primary: { label: 'Agendar Reunion', href: 'mailto:hello@gmi2consulting.com' },
      secondary: { label: 'hello@gmi2consulting.com', href: 'mailto:hello@gmi2consulting.com' },
    },
    form: {
      heading: 'Escribinos',
      fallback: 'O escribinos directamente',
      successMessage: '¡Gracias! Te respondemos a la brevedad.',
      errorMessage: 'Algo salio mal. Intentalo de nuevo o escribinos por email.',
      subject: 'Nuevo contacto desde GMI2 Landing',
    },
  },
  en: {
    title: {
      line1: 'Ready to',
      accent: 'automate your business?',
    },
    description:
      'Tell us about your processes and we will show you how AI can optimize them. No commitment, no fine print.',
    cta: {
      primary: { label: 'Schedule a Meeting', href: 'mailto:hello@gmi2consulting.com' },
      secondary: { label: 'hello@gmi2consulting.com', href: 'mailto:hello@gmi2consulting.com' },
    },
    form: {
      heading: 'Get in touch',
      fallback: 'Or email us directly',
      successMessage: 'Thank you! We will get back to you shortly.',
      errorMessage: 'Something went wrong. Please try again or email us directly.',
      subject: 'New contact from GMI2 Landing',
    },
  },
};
