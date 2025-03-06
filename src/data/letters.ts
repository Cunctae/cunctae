import c from '@assets/letters/c.svg';
import u from '@assets/letters/u.svg';
import n from '@assets/letters/n.svg';
import c1 from '@assets/letters/c-1.svg';
import t from '@assets/letters/t.svg';
import a from '@assets/letters/a.svg';
import e from '@assets/letters/e.svg';

export interface Letter {
	id: string;
	src: string;
	alt?: string;
}

export const letters: Letter[] = [
	{
		id: 'c',
		src: c.src,
	},
	{
		id: 'u',
		src: u.src,
	},
	{
		id: 'n',
		src: n.src,
	},
	{
		id: 'c1',
		src: c1.src,
	},
	{
		id: 't',
		src: t.src,
	},
	{
		id: 'a',
		src: a.src,
	},
	{
		id: 'e',
		src: e.src,
	},
];
