export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
}

export const SERVICES_HEADER = {
  eyebrow: 'Que Hacemos',
  title: 'Servicios',
} as const;

export const SERVICES: Service[] = [
  {
    id: 'ai-agents',
    title: 'Agentes de IA',
    description:
      'Diseñamos e implementamos agentes inteligentes que ejecutan tareas, responden consultas y automatizan flujos completos conectados a tus herramientas actuales.',
    icon: 'cpu',
    features: ['Atencion al cliente', 'Gestion de leads', 'Soporte interno', 'Asistentes especializados'],
  },
  {
    id: 'process-automation',
    title: 'Automatizacion de Procesos',
    description:
      'Identificamos procesos manuales y repetitivos en tu operacion y los automatizamos con IA para liberar tiempo y reducir errores.',
    icon: 'workflow',
    features: ['Flujos automatizados', 'Integraciones', 'Reportes inteligentes', 'Alertas y notificaciones'],
  },
  {
    id: 'ai-consulting',
    title: 'Consultoria en IA',
    description:
      'Te ayudamos a entender donde la inteligencia artificial puede generar valor real en tu negocio y diseñamos la hoja de ruta para implementarla.',
    icon: 'lightbulb',
    features: ['Diagnostico operativo', 'Roadmap de IA', 'Capacitacion', 'Estrategia de adopcion'],
  },
  {
    id: 'integrations',
    title: 'Integraciones Inteligentes',
    description:
      'Conectamos tus herramientas existentes — WhatsApp, Google Workspace, CRMs, ERPs — con agentes de IA para crear flujos unificados y eficientes.',
    icon: 'plug',
    features: ['WhatsApp Business', 'Google Workspace', 'CRMs / ERPs', 'APIs personalizadas'],
  },
  {
    id: 'data-analytics',
    title: 'Datos e Insights',
    description:
      'Transformamos tus datos operativos en insights accionables con dashboards inteligentes y reportes automatizados.',
    icon: 'chart',
    features: ['Dashboards en tiempo real', 'KPIs automatizados', 'Analisis predictivo', 'Reportes periodicos'],
  },
  {
    id: 'custom-solutions',
    title: 'Soluciones a Medida',
    description:
      'Desarrollamos soluciones personalizadas cuando tu negocio necesita algo que no existe en el mercado. Desde MVPs hasta plataformas completas.',
    icon: 'code',
    features: ['MVPs rapidos', 'Plataformas web', 'Apps internas', 'Herramientas de gestion'],
  },
];

export const SERVICE_ICON_PATHS: Record<string, string> = {
  cpu: 'M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5M4.5 15.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h9a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 15.75 4.5h-9A2.25 2.25 0 0 0 4.5 6.75v10.5A2.25 2.25 0 0 0 6.75 19.5Zm4.5-9.75a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm4.5 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z',
  workflow: 'M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5',
  lightbulb: 'M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18',
  plug: 'M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244',
  chart: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z',
  code: 'M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5',
};
