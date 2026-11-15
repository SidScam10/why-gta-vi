import { listArticles } from '@/lib/articles';
import { site } from '@/site.config';
import { ArticleView } from '@/components/article/ArticleView';
import { ArticleShell } from '@/components/chrome/ArticleShell';
import { StoryCard } from '@/components/related/StoryCard';
import { SiteFooter } from '@/components/related/RelatedStories';
import s from '@/components/related/related.module.css';

/** One article -> show it directly. Two or more -> show an index of cards. */
export default function Home() {
  const articles = listArticles();
  if (articles.length === 1) return <ArticleView slug={articles[0].slug} />;
  return (
    <ArticleShell siteName={site.name}>
      <main id="main" className={s.wrap} style={{ paddingTop: '8rem', minHeight: '80svh' }}>
        <h1 className={s.heading}>{site.name}</h1>
        {articles.length ? (
          <ul className={s.row}>{articles.map((a) => <li key={a.slug}><StoryCard a={a} headingLevel={2} /></li>)}</ul>
        ) : (
          <p style={{ textAlign: 'center' }}>No articles yet. Add one to <code>content/articles/</code>.</p>
        )}
      </main>
      <SiteFooter />
    </ArticleShell>
  );
}
