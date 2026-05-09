import { createClient } from '@libsql/client/web';

export async function onRequestPost(context) {
	const { request, env } = context;
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

	const db = createClient({
		url: env.ASTRO_DB_REMOTE_URL,
		authToken: env.ASTRO_DB_APP_TOKEN,
	});

	await db.execute({
		sql: `INSERT INTO CreativeWork (title, description, category, content, imageUrl, locale, publishedAt, featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
		args: [title, description, category, content, imageUrl, locale, new Date().toISOString(), featured ? 1 : 0],
	});

	return Response.redirect(new URL('/admin?success=true', request.url), 303);
}
