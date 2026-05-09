import { column, defineDb, defineTable } from 'astro:db';

const CreativeWork = defineTable({
	columns: {
		id: column.number({ primaryKey: true }),
		title: column.text(),
		description: column.text(),
		category: column.text(), // poetry, sewing, pottery, etc.
		content: column.text({ optional: true }),
		imageUrl: column.text({ optional: true }),
		locale: column.text({ default: 'en' }),
		publishedAt: column.date(),
		featured: column.boolean({ default: false }),
	},
});

const Comment = defineTable({
	columns: {
		id: column.number({ primaryKey: true }),
		workId: column.number({ references: () => CreativeWork.columns.id }),
		author: column.text(),
		body: column.text(),
		createdAt: column.date(),
	},
});

export default defineDb({
	tables: { CreativeWork, Comment },
});
