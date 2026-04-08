import type { LocaleMap } from '@/i18n/config';
import type { CaseStudy, CaseStudiesHeader } from './types';

export const CASE_STUDIES_HEADER: LocaleMap<CaseStudiesHeader> = {
  es: {
    eyebrow: 'Casos de Exito',
    title: 'Proyectos destacados',
  },
  en: {
    eyebrow: 'Success Stories',
    title: 'Featured Projects',
  },
};

export const CASE_STUDIES: LocaleMap<readonly CaseStudy[]> = {
  es: [
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
  ],
  en: [
    {
      title: 'Customer Support Agent',
      category: 'AI Agent',
      description:
        'We deployed an AI agent connected to WhatsApp that resolves 70% of inquiries without human intervention, reducing response times from hours to seconds.',
      metrics: ['70% autonomous resolution', '< 30s response time', '24/7 availability'],
      color: 'from-pink-500 to-orange-500',
    },
    {
      title: 'Operations Automation',
      category: 'Automation',
      description:
        'We automated the complete billing, order tracking, and reporting workflow for a distributor, freeing up 40 hours of manual work per week.',
      metrics: ['40 hrs/week saved', '0 billing errors', '3-week implementation'],
      color: 'from-orange-500 to-yellow-500',
    },
    {
      title: 'Lead Management System',
      category: 'Integration + AI',
      description:
        'We connected CRM, WhatsApp, and email with an agent that automatically qualifies leads and assigns them to the right salesperson based on availability and expertise.',
      metrics: ['2x lead conversion', 'Automatic assignment', 'Smart follow-up'],
      color: 'from-violet-500 to-pink-500',
    },
    {
      title: 'Productivity Dashboard',
      category: 'Data & Insights',
      description:
        'We built a dashboard that consolidates sales, operations, and customer support data with smart alerts and automated reports.',
      metrics: ['Real-time data', 'Automated reports', 'Predictive alerts'],
      color: 'from-yellow-500 to-orange-500',
    },
  ],
};
