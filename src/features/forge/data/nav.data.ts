export interface NavLink {
  label: string;
  href: string;
}

export const NAV_BRAND = {
  text: 'GMI',
  accent: '2',
  href: '/forge',
} as const;

export const NAV_LINKS: NavLink[] = [
  { label: 'Nosotros', href: '#about' },
  { label: 'Servicios', href: '#build' },
  { label: 'Tecnologias', href: '#tech' },
  { label: 'Casos', href: '#cases' },
  { label: 'Testimonios', href: '#testimonials' },
];

export const NAV_CTA = {
  label: 'Contactar',
  href: '#contact',
} as const;
