import type { APIContext } from 'astro';
import { createClient } from '@libsql/client/web';

export const prerender = false;

export async function POST(context: APIContext) {
	const { request, redirect } = context;
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

	let url: string;
	let token: string;

	try {
		const { env } = await import('cloudflare:workers');
		url = (env as any).ASTRO_DB_REMOTE_URL;
		token = (env as any).ASTRO_DB_APP_TOKEN;
	} catch {
		url = process.env.ASTRO_DB_REMOTE_URL!;
		token = process.env.ASTRO_DB_APP_TOKEN!;
	}

	const db = createClient({ url, authToken: token });

	await db.execute({
		sql: `INSERT INTO CreativeWork (title, description, category, content, imageUrl, locale, publishedAt, featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
		args: [title as string, description as string, category as string, content as string ?? null, imageUrl as string ?? null, locale as string, new Date().toISOString(), featured ? 1 : 0],
	});

	return redirect('/admin?success=true', 303);
}
