import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

export const collections = {
	portfolio: defineCollection({
		loader: glob({ pattern: '**/*.md', base: './src/content/portfolio' }),
		schema: z.object({
			title: z.string(),
			description: z.string(),
			publishDate: z.coerce.date(),
			tags: z.array(z.string()),
			img: z.string(),
			img_alt: z.string().optional(),
		}),
	}),
};
