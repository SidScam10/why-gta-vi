import { Fraunces, Bebas_Neue, Source_Serif_4, Inter } from 'next/font/google';

// Self-hosted at build time. Swap families here to re-skin every article.
export const display = Fraunces({ subsets: ['latin'], style: ['italic', 'normal'], weight: ['700', '900'], variable: '--font-display', display: 'swap' });
export const condensed = Bebas_Neue({ subsets: ['latin'], weight: '400', variable: '--font-condensed', display: 'swap' });
export const serif = Source_Serif_4({ subsets: ['latin'], style: ['normal', 'italic'], variable: '--font-serif', display: 'swap' });
export const sans = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
