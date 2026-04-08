export interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

export const PROCESS_HEADER = {
  eyebrow: 'Nuestro Proceso',
  title: 'Como lo hacemos',
} as const;

export const PROCESS_STEPS: ProcessStep[] = [
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
];
