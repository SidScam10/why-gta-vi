import { compileMDX } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import { getArticle } from '@/lib/articles';
import { mdxComponents } from '@/mdx-components';
import { site } from '@/site.config';
import { ArticleShell } from '@/components/chrome/ArticleShell';
import { RelatedStories, SiteFooter } from '@/components/related/RelatedStories';
import { Hero } from './Hero';
import { Sources } from './Sources';

export async function ArticleView({ slug }: { slug: string }) {
  const { meta, body, chapters } = getArticle(slug);
  const { content } = await compileMDX({
    source: body,
    components: mdxComponents,
    // Articles are first-party content, so allow JS expressions in props (e.g. images={[...]}).
    options: { blockJS: false, mdxOptions: { remarkPlugins: [remarkGfm] } },
  });
  return (
    <ArticleShell chapters={chapters} theme={meta.theme} siteName={site.name}>
      <main id="main">
        <article>
          <Hero
            title={meta.title}
            kicker={meta.kicker}
            deck={meta.deck}
            byline={meta.byline}
            illustration={meta.illustration}
            date={meta.date}
            poster={meta.hero?.poster}
            posterMobile={meta.hero?.posterMobile}
            video={meta.hero?.video}
          />
          <div className="prose">
            {content}
            <Sources sources={meta.sources} editor={meta.editor} />
          </div>
        </article>
        <RelatedStories current={slug} />
      </main>
      <SiteFooter />
    </ArticleShell>
  );
}
