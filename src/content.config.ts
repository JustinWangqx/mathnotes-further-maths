import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const notes = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/notes' }),
  schema: z.object({
    title: z.string(), description: z.string(), module: z.enum(['fp1', 'fp2', 'statistics']),
    topicId: z.string(), syllabus: z.string(), minutes: z.number(),
    prerequisites: z.array(z.string()), sources: z.array(z.string()),
    updated: z.string(),
  }),
});
export const collections = { notes };
