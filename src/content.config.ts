import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const work = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/work' }),
  schema: z.object({
    lang: z.enum(['es', 'en']),
    translationKey: z.string(),
    kind: z.enum(['case-study', 'project']),
    title: z.string(),
    seoTitle: z.string().max(62),
    description: z.string().min(80).max(155),
    summary: z.string().max(200),
    stack: z.array(z.string()).min(1),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    links: z
      .object({ repo: z.string().url().optional(), demo: z.string().url().optional() })
      .optional(),
    diagram: z.enum(['orchestrator']).optional(),
    draft: z.boolean().default(false),
    order: z.number().default(100),
  }),
});

export const collections = { work };
