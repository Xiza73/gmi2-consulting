import type { LocaleMap } from '@/i18n/config';
import type { AboutContent, AboutStat } from './types';

export const ABOUT_CONTENT: LocaleMap<AboutContent> = {
  es: {
    eyebrow: 'Sobre Nosotros',
    title: 'Tecnologia con proposito, resultados medibles',
    paragraphs: [
      'Somos una consultora especializada en automatizacion con inteligencia artificial para pequeñas y medianas empresas. Ayudamos a negocios con procesos repetitivos a ahorrar tiempo, reducir carga operativa y mejorar su capacidad de respuesta mediante agentes de IA conectados a sus herramientas actuales.',
      'Combinamos vision tecnica con vision de negocio. No vendemos software generico — diseñamos e implementamos soluciones a medida que se adaptan a la realidad de cada empresa. Nuestro objetivo no es reemplazar personas, sino potenciar equipos para que logren mas con menos friccion.',
    ],
  },
  en: {
    eyebrow: 'About Us',
    title: 'Purpose-driven technology, measurable results',
    paragraphs: [
      'We are a consulting firm specializing in AI automation for small and medium businesses. We help companies with repetitive processes save time, reduce operational overhead, and improve responsiveness through AI agents connected to their existing tools.',
      'We combine technical expertise with business insight. We do not sell generic software — we design and implement tailored solutions adapted to each company\'s reality. Our goal is not to replace people, but to empower teams to achieve more with less friction.',
    ],
  },
};

export const ABOUT_STATS: LocaleMap<readonly AboutStat[]> = {
  es: [
    { value: 50, suffix: '+', label: 'Procesos Automatizados' },
    { value: 30, suffix: '+', label: 'Clientes' },
    { value: 95, suffix: '%', label: 'Satisfaccion' },
    { value: 3, suffix: 'x', label: 'Productividad' },
  ],
  en: [
    { value: 50, suffix: '+', label: 'Automated Processes' },
    { value: 30, suffix: '+', label: 'Clients' },
    { value: 95, suffix: '%', label: 'Satisfaction' },
    { value: 3, suffix: 'x', label: 'Productivity' },
  ],
};
