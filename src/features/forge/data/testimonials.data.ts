export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  rating: number;
}

export const TESTIMONIALS_HEADER = {
  eyebrow: 'Testimonios',
  title: 'Lo que dicen nuestros ',
  titleAccent: 'clientes',
} as const;

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'testimonial-1',
    quote:
      'El agente de IA que implementaron en nuestro WhatsApp resuelve la mayoria de consultas solo. Nuestro equipo ahora se enfoca en lo que realmente importa.',
    author: 'Carlos Mendoza',
    role: 'Gerente General',
    company: 'Distribuidora Lima Norte',
    rating: 5,
  },
  {
    id: 'testimonial-2',
    quote:
      'Automatizaron nuestro proceso de facturacion y seguimiento de pedidos. Pasamos de perder horas en Excel a tener todo funcionando solo.',
    author: 'Ana Rodriguez',
    role: 'Directora de Operaciones',
    company: 'LogiExpress',
    rating: 5,
  },
  {
    id: 'testimonial-3',
    quote:
      'Nos ayudaron a entender donde la IA podia generar valor real en nuestro negocio. La consultoria fue practica, sin humo, y los resultados se vieron rapido.',
    author: 'Miguel Torres',
    role: 'CEO',
    company: 'Grupo Andino',
    rating: 5,
  },
  {
    id: 'testimonial-4',
    quote:
      'El dashboard que construyeron nos dio visibilidad total de la operacion. Ahora tomamos decisiones con datos, no con intuicion.',
    author: 'Laura Gomez',
    role: 'Gerente Comercial',
    company: 'NovaTech Peru',
    rating: 5,
  },
  {
    id: 'testimonial-5',
    quote:
      'Lo que mas valoro es que entienden de negocio, no solo de tecnologia. La solucion se adapto perfectamente a como trabajamos.',
    author: 'Roberto Diaz',
    role: 'Director de Tecnologia',
    company: 'Clinica San Martin',
    rating: 5,
  },
  {
    id: 'testimonial-6',
    quote:
      'Integraron nuestro CRM con WhatsApp y un agente que califica leads automaticamente. Las ventas mejoraron un 40% en dos meses.',
    author: 'Patricia Herrera',
    role: 'Jefa de Ventas',
    company: 'Inmobiliaria del Sur',
    rating: 5,
  },
];
