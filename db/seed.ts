import { db, CreativeWork, Comment } from 'astro:db';

export default async function seed() {
	await db.insert(CreativeWork).values([
		{
			id: 1,
			title: 'Poetry',
			description: 'Exploring the intersection of words and digital expression.',
			category: 'poetry',
			imageUrl: '/poetry/poetry.jpeg',
			locale: 'en',
			publishedAt: new Date('2019-10-02'),
			featured: true,
		},
		{
			id: 2,
			title: 'Sewing',
			description: 'Textile art as a form of cultural storytelling.',
			category: 'sewing',
			imageUrl: '/sewing/sewing.jpg',
			locale: 'en',
			publishedAt: new Date('2020-03-04'),
			featured: true,
		},
		{
			id: 3,
			title: 'Pottery',
			description: 'Shaping clay, shaping identity.',
			category: 'pottery',
			imageUrl: '/pottery/pottery.jpg',
			locale: 'en',
			publishedAt: new Date('2020-03-04'),
			featured: true,
		},
	]);

	await db.insert(Comment).values([
		{
			id: 1,
			workId: 1,
			author: 'Cunctae',
			body: 'Welcome to our creative space. Let us build together.',
			createdAt: new Date('2024-01-01'),
		},
	]);
}
