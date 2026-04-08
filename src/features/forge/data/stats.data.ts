export interface Stat {
  id: string;
  value: number;
  suffix: string;
  label: string;
}

export const STATS: Stat[] = [
  { id: 'stat-1', value: 50, suffix: '+', label: 'Procesos Automatizados' },
  { id: 'stat-2', value: 30, suffix: '+', label: 'Clientes Satisfechos' },
  { id: 'stat-3', value: 95, suffix: '%', label: 'Tasa de Satisfaccion' },
  { id: 'stat-4', value: 3, suffix: 'x', label: 'Mas Productividad' },
];
