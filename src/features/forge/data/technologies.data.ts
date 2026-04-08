import type { LocaleMap } from '@/i18n/config';
import type { TechItem, TechnologiesHeader, TechBottomStat } from './types';

export const TECHNOLOGIES_HEADER: LocaleMap<TechnologiesHeader> = {
  es: {
    eyebrow: 'Stack Tecnologico',
    title: 'Nuestras Herramientas',
    subtitle:
      'Dominamos las tecnologias y plataformas mas relevantes en automatizacion e inteligencia artificial para construir soluciones robustas.',
  },
  en: {
    eyebrow: 'Technology Stack',
    title: 'Our Tools',
    subtitle:
      'We master the most relevant technologies and platforms in automation and artificial intelligence to build robust solutions.',
  },
};

export const INNER_TECHS: readonly TechItem[] = [
  { name: 'OpenAI', color: '#10a37f', glow: 'rgba(16,163,127,0.4)' },
  { name: 'LangChain', color: '#1c3c3c', glow: 'rgba(28,60,60,0.4)' },
  { name: 'Python', color: '#ffd43b', glow: 'rgba(255,212,59,0.4)' },
  { name: 'TypeScript', color: '#3178c6', glow: 'rgba(49,120,198,0.4)' },
];

export const MIDDLE_TECHS: readonly TechItem[] = [
  { name: 'n8n', color: '#ea4b71', glow: 'rgba(234,75,113,0.4)' },
  { name: 'Make', color: '#6d4aff', glow: 'rgba(109,74,255,0.4)' },
  { name: 'Next.js', color: '#ffffff', glow: 'rgba(255,255,255,0.3)' },
  { name: 'Node.js', color: '#68a063', glow: 'rgba(104,160,99,0.4)' },
  { name: 'Supabase', color: '#3ecf8e', glow: 'rgba(62,207,142,0.4)' },
  { name: 'Tailwind', color: '#38bdf8', glow: 'rgba(56,189,248,0.4)' },
];

export const OUTER_TECHS: readonly TechItem[] = [
  { name: 'WhatsApp API', color: '#25d366', glow: 'rgba(37,211,102,0.4)' },
  { name: 'Google Cloud', color: '#4285f4', glow: 'rgba(66,133,244,0.4)' },
  { name: 'AWS', color: '#ff9900', glow: 'rgba(255,153,0,0.4)' },
  { name: 'PostgreSQL', color: '#4169e1', glow: 'rgba(65,105,225,0.4)' },
  { name: 'Docker', color: '#2496ed', glow: 'rgba(36,150,237,0.4)' },
  { name: 'Pinecone', color: '#000000', glow: 'rgba(100,100,100,0.4)' },
  { name: 'Vercel', color: '#ffffff', glow: 'rgba(255,255,255,0.3)' },
  { name: 'Anthropic', color: '#d4a574', glow: 'rgba(212,165,116,0.4)' },
];

export const TECH_BOTTOM_STATS: LocaleMap<readonly TechBottomStat[]> = {
  es: [
    { value: '15+', label: 'Tecnologias' },
    { value: '4', label: 'Categorias' },
    { value: '100%', label: 'Integrado' },
  ],
  en: [
    { value: '15+', label: 'Technologies' },
    { value: '4', label: 'Categories' },
    { value: '100%', label: 'Integrated' },
  ],
};
