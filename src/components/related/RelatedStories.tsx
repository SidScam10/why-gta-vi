import Link from 'next/link';
import { listArticles } from '@/lib/articles';
import { site } from '@/site.config';
import { StoryCard } from './StoryCard';
import s from './related.module.css';

/** Lists other articles. Renders nothing when there are none (no placeholder cards). */
export function RelatedStories({ current }: { current?: string }) {
  const others = listArticles().filter((a) => a.slug !== current).slice(0, 4);
  if (!others.length) return null;
  return (
    <section className={s.wrap} aria-labelledby="more-stories">
      <h2 id="more-stories" className={s.heading}>More stories</h2>
      <ul className={s.row}>
        {others.map((a) => <li key={a.slug}><StoryCard a={a} /></li>)}
      </ul>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer className={s.footer}>
      <span>© {new Date().getFullYear()} {site.name}</span>
      <Link href="/">Home</Link>
      <Link href="/credits/">Credits</Link>
    </footer>
  );
}
