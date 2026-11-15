import type { Metadata } from 'next';
import { getArticle, listArticles } from '@/lib/articles';
import { ArticleView } from '@/components/article/ArticleView';

export const dynamicParams = false;

export function generateStaticParams() {
  return listArticles().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { meta } = getArticle(slug);
  return { title: meta.title, description: meta.deck };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ArticleView slug={slug} />;
}
