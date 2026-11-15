import type { Metadata } from 'next';
import { site } from '@/site.config';
import { ArticleShell } from '@/components/chrome/ArticleShell';
import { SiteFooter } from '@/components/related/RelatedStories';

export const metadata: Metadata = { title: 'Credits' };

// Add one entry per third-party image, clip, font or library that needs attribution.
const credits: { item: string; source: string; license: string; url?: string }[] = [
  { item: 'Placeholder images and video loop', source: 'Generated for this site (scripts/make-placeholders.mjs, ffmpeg)', license: 'Original' },
  { item: 'Fraunces, Bebas Neue, Source Serif 4, Inter', source: 'Google Fonts', license: 'SIL Open Font License 1.1', url: 'https://fonts.google.com' },
  { item: 'GSAP', source: 'GreenSock', license: 'GSAP Standard License (free)', url: 'https://gsap.com/licensing/' },
];

export default function Credits() {
  return (
    <ArticleShell siteName={site.name}>
      <main id="main" className="prose" style={{ paddingTop: '7rem', minHeight: '80svh' }}>
        <h1 style={{ fontFamily: 'var(--font-condensed)', fontWeight: 400, fontSize: 'clamp(3rem,8vw,5rem)', color: 'var(--cream)', margin: '0 0 1rem' }}>Credits</h1>
        <p>Media and resources used on this site. Video embeds remain the property of their respective owners.</p>
        <ul>
          {credits.map((c) => (
            <li key={c.item}>
              <strong>{c.item}</strong> — {c.url ? <a href={c.url} target="_blank" rel="noopener noreferrer">{c.source}</a> : c.source} · <em>{c.license}</em>
            </li>
          ))}
        </ul>
      </main>
      <SiteFooter />
    </ArticleShell>
  );
}
