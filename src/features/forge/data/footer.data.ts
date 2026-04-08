export interface FooterLink {
  label: string;
  href: string;
}

export const FOOTER_BRAND = {
  text: 'GMI',
  accent: '2',
  href: '/forge',
  tagline: 'Automatizacion con IA para PYMEs. Soluciones a medida que generan resultados medibles.',
} as const;

export const FOOTER_LINKS: Record<string, FooterLink[]> = {
  Servicios: [
    { label: 'Agentes de IA', href: '#build' },
    { label: 'Automatizacion de Procesos', href: '#build' },
    { label: 'Consultoria en IA', href: '#build' },
    { label: 'Integraciones Inteligentes', href: '#build' },
  ],
  Soluciones: [
    { label: 'Atencion al Cliente', href: '#cases' },
    { label: 'Gestion de Leads', href: '#cases' },
    { label: 'Automatizacion Operativa', href: '#cases' },
    { label: 'Dashboards Inteligentes', href: '#cases' },
  ],
  Empresa: [
    { label: 'Nosotros', href: '#about' },
    { label: 'Casos de Exito', href: '#cases' },
    { label: 'Tecnologias', href: '#tech' },
    { label: 'Contacto', href: '#contact' },
  ],
};

export const FOOTER_SOCIAL = {
  linkedin: '#',
  github: '#',
  twitter: '#',
} as const;
