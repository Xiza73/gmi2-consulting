import type { LocaleMap } from '@/i18n/config';
import type { Testimonial, TestimonialsHeader } from './types';

export const TESTIMONIALS_HEADER: LocaleMap<TestimonialsHeader> = {
  es: {
    eyebrow: 'Testimonios',
    title: 'Lo que dicen nuestros ',
    titleAccent: 'clientes',
  },
  en: {
    eyebrow: 'Testimonials',
    title: 'What our ',
    titleAccent: 'clients say',
  },
};

export const TESTIMONIALS: LocaleMap<readonly Testimonial[]> = {
  es: [
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
  ],
  en: [
    {
      id: 'testimonial-1',
      quote:
        'The AI agent they implemented on our WhatsApp resolves most inquiries on its own. Our team can now focus on what really matters.',
      author: 'Carlos Mendoza',
      role: 'General Manager',
      company: 'Distribuidora Lima Norte',
      rating: 5,
    },
    {
      id: 'testimonial-2',
      quote:
        'They automated our billing and order tracking process. We went from wasting hours in Excel to having everything run on its own.',
      author: 'Ana Rodriguez',
      role: 'Operations Director',
      company: 'LogiExpress',
      rating: 5,
    },
    {
      id: 'testimonial-3',
      quote:
        'They helped us understand where AI could generate real value in our business. The consulting was practical, no fluff, and results came quickly.',
      author: 'Miguel Torres',
      role: 'CEO',
      company: 'Grupo Andino',
      rating: 5,
    },
    {
      id: 'testimonial-4',
      quote:
        'The dashboard they built gave us full visibility into our operations. We now make decisions based on data, not intuition.',
      author: 'Laura Gomez',
      role: 'Commercial Manager',
      company: 'NovaTech Peru',
      rating: 5,
    },
    {
      id: 'testimonial-5',
      quote:
        'What I value most is that they understand business, not just technology. The solution fit perfectly with how we work.',
      author: 'Roberto Diaz',
      role: 'Technology Director',
      company: 'Clinica San Martin',
      rating: 5,
    },
    {
      id: 'testimonial-6',
      quote:
        'They integrated our CRM with WhatsApp and an agent that automatically qualifies leads. Sales improved 40% in two months.',
      author: 'Patricia Herrera',
      role: 'Sales Lead',
      company: 'Inmobiliaria del Sur',
      rating: 5,
    },
  ],
};
