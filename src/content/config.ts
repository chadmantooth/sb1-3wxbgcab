import { defineCollection, z } from 'astro:content';

// Define the schema for MDX/Markdown content
const docsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.coerce.date(),
    author: z.string().optional(),
    featured: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false)
  })
});

export const collections = {
  'docs': docsCollection
};