import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const notes = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/notes' }),
  schema: z.object({
    title: z.string(), description: z.string(), module: z.enum(['fp1', 'fp2', 'mechanics', 'statistics']),
    topicId: z.string(), syllabus: z.string(), minutes: z.number(),
    prerequisites: z.array(z.string()), sources: z.array(z.string()),
    updated: z.string(),
  }),
});
const learn = defineCollection({
  loader: glob({ pattern: '*.mdx', base: './src/content/learn' }),
  schema: z.object({
    topicId: z.string(),
    description: z.string(),
    sources: z.array(z.string()).min(1),
  }),
});
export const collections = { notes, learn };
