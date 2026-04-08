export interface CaseStudy {
  title: string;
  category: string;
  description: string;
  metrics: string[];
  color: string;
}

export const CASE_STUDIES_HEADER = {
  eyebrow: 'Casos de Exito',
  title: 'Proyectos destacados',
} as const;

export const CASE_STUDIES: CaseStudy[] = [
  {
    title: 'Agente de Atencion al Cliente',
    category: 'Agente de IA',
    description:
      'Implementamos un agente de IA conectado a WhatsApp que resuelve el 70% de las consultas sin intervencion humana, reduciendo tiempos de respuesta de horas a segundos.',
    metrics: ['70% resolucion autonoma', '< 30s tiempo de respuesta', '24/7 disponibilidad'],
    color: 'from-pink-500 to-orange-500',
  },
  {
    title: 'Automatizacion de Operaciones',
    category: 'Automatizacion',
    description:
      'Automatizamos el flujo completo de facturacion, seguimiento de pedidos y reportes para una distribuidora, liberando 40 horas semanales de trabajo manual.',
    metrics: ['40 hrs/semana ahorradas', '0 errores de facturacion', '3 semanas de implementacion'],
    color: 'from-orange-500 to-yellow-500',
  },
  {
    title: 'Sistema de Gestion de Leads',
    category: 'Integracion + IA',
    description:
      'Conectamos CRM, WhatsApp y email con un agente que califica leads automaticamente y los asigna al vendedor correcto segun disponibilidad y expertise.',
    metrics: ['2x conversion de leads', 'Asignacion automatica', 'Seguimiento inteligente'],
    color: 'from-violet-500 to-pink-500',
  },
  {
    title: 'Dashboard de Productividad',
    category: 'Datos e Insights',
    description:
      'Construimos un dashboard que consolida datos de ventas, operaciones y atencion al cliente con alertas inteligentes y reportes automatizados.',
    metrics: ['Datos en tiempo real', 'Reportes automaticos', 'Alertas predictivas'],
    color: 'from-yellow-500 to-orange-500',
  },
];
