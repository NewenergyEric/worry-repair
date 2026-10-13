import raw from './content.json';
export type Card = typeof raw.cards[number];
export const cards = raw.cards;
export const departments = raw.departments;
export const sources = raw.sources as Record<string, string[]>;
export const colors = ['#deddf4','#f2df8e','#ccdec8','#f4c1af','#c7e1d9','#e6c7d8'];
export const moods = ['脑内太吵','迟迟没动','选不出来','关系费电','有点没电','对自己太狠'];
export const art = (id: number) => `/art/${String(id).padStart(2,'0')}.webp`;
export const cardTitle = (card: Card) => card.title.replace('|',' ');
