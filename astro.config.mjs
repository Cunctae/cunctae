import cloudflare from '@astrojs/cloudflare';
import db from '@astrojs/db';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

const SERVER_PORT = 8888;
const PROD_URL = 'https://cunctae.com';

/**
 * This are the current configurations for the project
 * More info: https://astro.build/config
 */
export default defineConfig({
	site: PROD_URL,
	adapter: cloudflare(),
	server: {
		port: SERVER_PORT,
		host: true,
	},
	prefetch: {
		prefetchAll: true,
	},
	integrations: [db(), mdx(), sitemap()],
	i18n: {
		defaultLocale: 'en',
		locales: ['en', 'es', 'pt-br'],
		routing: {
			prefixDefaultLocale: true,
			redirectToDefaultLocale: false,
		},
	},
	markdown: {
		shikiConfig: {
			theme: 'red',
		},
	},
});
