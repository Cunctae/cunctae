import { createClient } from '@libsql/client/web';

export const prerender = false;

export async function POST({ request, redirect }) {
	const formData = await request.formData();

	const title = formData.get('title');
	const description = formData.get('description');
	const category = formData.get('category');
	const content = formData.get('content') || null;
	const imageUrl = formData.get('imageUrl') || null;
	const locale = formData.get('locale') || 'en';
	const featured = formData.get('featured') === 'on';

	if (!title || !description || !category) {
		return new Response('Missing required fields', { status: 400 });
	}

	const url = process.env.ASTRO_DB_REMOTE_URL || import.meta.env.ASTRO_DB_REMOTE_URL;
	const token = process.env.ASTRO_DB_APP_TOKEN || import.meta.env.ASTRO_DB_APP_TOKEN;

	const db = createClient({ url, authToken: token });

	await db.execute({
		sql: `INSERT INTO CreativeWork (title, description, category, content, imageUrl, locale, publishedAt, featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
		args: [title, description, category, content, imageUrl, locale, new Date().toISOString(), featured ? 1 : 0],
	});

	return redirect('/admin?success=true', 303);
}
