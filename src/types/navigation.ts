import type { iconPaths } from '@data/iconPaths';

export interface NavLink {
	label: string;
	href: string;
	icon: keyof typeof iconPaths;
}
