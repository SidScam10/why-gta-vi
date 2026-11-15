import Link from 'next/link';
import { withBase } from '@/lib/withBase';
import type { ArticleMeta } from '@/lib/types';
import s from './related.module.css';

export function StoryCard({ a, headingLevel = 3 }: { a: ArticleMeta; headingLevel?: 2 | 3 }) {
  const H = `h${headingLevel}` as const;
  const thumb = a.thumb || a.hero?.poster;
  return (
    <Link href={`/articles/${a.slug}/`} className={s.card}>
      <div className={s.thumb}>{thumb && <img src={withBase(thumb)} alt="" loading="lazy" decoding="async" />}</div>
      {a.date && <span className={s.date}>{a.date}</span>}
      <H className={s.title}>{a.title}</H>
      {a.deck && <p className={s.deck}>{a.deck}</p>}
    </Link>
  );
}
