import 'server-only';
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import type { ArticleMeta, ChapterMeta } from './types';

const DIR = path.join(process.cwd(), 'content', 'articles');

export function listSlugs(): string[] {
  if (!fs.existsSync(DIR)) return [];
  return fs.readdirSync(DIR).filter((f) => f.endsWith('.mdx') && !f.startsWith('_')).map((f) => f.replace(/\.mdx$/, ''));
}

function attr(attrs: string, name: string): string | undefined {
  const m = attrs.match(new RegExp(`\\b${name}=(?:"([^"]*)"|'([^']*)')`));
  return m ? (m[1] ?? m[2]) : undefined;
}

/**
 * Finds every <Chapter ...> tag, numbers it, and injects n/id props so authors never
 * maintain a chapter list by hand. An explicit id="..." on the tag is kept (stable links).
 */
export function processChapters(body: string): { body: string; chapters: ChapterMeta[] } {
  const chapters: ChapterMeta[] = [];
  const out = body.replace(/<Chapter\b([^>]*?)(\/?)>/g, (_m, attrs: string, selfClose: string) => {
    const i = chapters.length + 1;
    const n = String(i).padStart(2, '0');
    const id = attr(attrs, 'id') || `ch-${i}`;
    const title = attr(attrs, 'title') || `Chapter ${i}`;
    chapters.push({ id, n, title, art: attr(attrs, 'art') });
    const extra = `${attr(attrs, 'id') ? '' : ` id="${id}"`} n="${n}"`;
    return `<Chapter${attrs.replace(/\s+$/, '')}${extra} ${selfClose}>`;
  });
  return { body: out, chapters };
}

export function getArticle(slug: string) {
  const file = path.join(DIR, `${slug}.mdx`);
  const raw = fs.readFileSync(file, 'utf8');
  const { data, content } = matter(raw);
  const { body, chapters } = processChapters(content);
  const meta = { ...(data as Omit<ArticleMeta, 'slug'>), slug } as ArticleMeta;
  const d: unknown = (data as { date?: unknown }).date;
  if (d instanceof Date) meta.date = d.toISOString().slice(0, 10);
  return { meta, body, chapters };
}

export function listArticles(): ArticleMeta[] {
  return listSlugs()
    .map((s) => getArticle(s).meta)
    .filter((m) => !m.draft || process.env.NODE_ENV !== 'production')
    .sort((a, b) => String(b.date ?? '').localeCompare(String(a.date ?? '')));
}
