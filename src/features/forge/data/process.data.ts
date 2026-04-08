import type { LocaleMap } from '@/i18n/config';
import type { ProcessStep, ProcessHeader } from './types';

export const PROCESS_HEADER: LocaleMap<ProcessHeader> = {
  es: {
    eyebrow: 'Nuestro Proceso',
    title: 'Como lo hacemos',
  },
  en: {
    eyebrow: 'Our Process',
    title: 'How we do it',
  },
};

export const PROCESS_STEPS: LocaleMap<readonly ProcessStep[]> = {
  es: [
    {
      number: '01',
      title: 'Discovery',
      description: 'Entendemos tu negocio, mapeamos procesos e identificamos donde la IA genera mayor impacto.',
    },
    {
      number: '02',
      title: 'Diseño',
      description: 'Definimos la arquitectura de la solucion, los agentes necesarios y los flujos a automatizar.',
    },
    {
      number: '03',
      title: 'Implementacion',
      description: 'Construimos e integramos por fases con entregables incrementales y valor desde el corto plazo.',
    },
    {
      number: '04',
      title: 'Optimizacion',
      description: 'Monitoreamos resultados, ajustamos los agentes y expandimos la automatizacion segun el impacto.',
    },
  ],
  en: [
    {
      number: '01',
      title: 'Discovery',
      description: 'We understand your business, map processes, and identify where AI generates the greatest impact.',
    },
    {
      number: '02',
      title: 'Design',
      description: 'We define the solution architecture, the required agents, and the workflows to automate.',
    },
    {
      number: '03',
      title: 'Implementation',
      description: 'We build and integrate in phases with incremental deliverables and value from the short term.',
    },
    {
      number: '04',
      title: 'Optimization',
      description: 'We monitor results, fine-tune agents, and expand automation based on impact.',
    },
  ],
};
