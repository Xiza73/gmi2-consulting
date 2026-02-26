import { defineCollection } from 'astro:content';
import { file } from 'astro/loaders';
import { z } from 'astro:schema';

const services = defineCollection({
  loader: file('./src/data/services.json'),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    icon: z.string(),
    features: z.array(z.string()),
  }),
});

const testimonials = defineCollection({
  loader: file('./src/data/testimonials.json'),
  schema: z.object({
    id: z.string(),
    quote: z.string(),
    author: z.string(),
    role: z.string(),
    company: z.string(),
    rating: z.number().min(1).max(5).default(5),
  }),
});

const clients = defineCollection({
  loader: file('./src/data/clients.json'),
  schema: z.object({
    id: z.string(),
    name: z.string(),
  }),
});

const team = defineCollection({
  loader: file('./src/data/team.json'),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    role: z.string(),
    bio: z.string(),
    social: z.object({
      linkedin: z.string().optional(),
      github: z.string().optional(),
    }),
  }),
});

const stats = defineCollection({
  loader: file('./src/data/stats.json'),
  schema: z.object({
    id: z.string(),
    value: z.number(),
    suffix: z.string().default(''),
    label: z.string(),
  }),
});

const techStack = defineCollection({
  loader: file('./src/data/tech-stack.json'),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    category: z.string(),
  }),
});

export const collections = { services, testimonials, clients, team, stats, techStack };
