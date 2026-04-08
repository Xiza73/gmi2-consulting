export interface AboutStat {
  value: number;
  suffix: string;
  label: string;
}

export const ABOUT_CONTENT = {
  eyebrow: 'Sobre Nosotros',
  title: 'Tecnologia con proposito, resultados medibles',
  paragraphs: [
    'Somos una consultora especializada en automatizacion con inteligencia artificial para pequeñas y medianas empresas. Ayudamos a negocios con procesos repetitivos a ahorrar tiempo, reducir carga operativa y mejorar su capacidad de respuesta mediante agentes de IA conectados a sus herramientas actuales.',
    'Combinamos vision tecnica con vision de negocio. No vendemos software generico — diseñamos e implementamos soluciones a medida que se adaptan a la realidad de cada empresa. Nuestro objetivo no es reemplazar personas, sino potenciar equipos para que logren mas con menos friccion.',
  ],
} as const;

export const ABOUT_STATS: AboutStat[] = [
  { value: 50, suffix: '+', label: 'Procesos Automatizados' },
  { value: 30, suffix: '+', label: 'Clientes' },
  { value: 95, suffix: '%', label: 'Satisfaccion' },
  { value: 3, suffix: 'x', label: 'Productividad' },
];
