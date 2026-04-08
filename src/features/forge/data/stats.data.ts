import type { LocaleMap } from '@/i18n/config';
import type { Stat } from './types';

export const STATS: LocaleMap<readonly Stat[]> = {
  es: [
    { id: 'stat-1', value: 50, suffix: '+', label: 'Procesos Automatizados' },
    { id: 'stat-2', value: 30, suffix: '+', label: 'Clientes Satisfechos' },
    { id: 'stat-3', value: 95, suffix: '%', label: 'Tasa de Satisfaccion' },
    { id: 'stat-4', value: 3, suffix: 'x', label: 'Mas Productividad' },
  ],
  en: [
    { id: 'stat-1', value: 50, suffix: '+', label: 'Automated Processes' },
    { id: 'stat-2', value: 30, suffix: '+', label: 'Satisfied Clients' },
    { id: 'stat-3', value: 95, suffix: '%', label: 'Satisfaction Rate' },
    { id: 'stat-4', value: 3, suffix: 'x', label: 'More Productivity' },
  ],
};
