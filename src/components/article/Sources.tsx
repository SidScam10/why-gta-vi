import type { Source } from '@/lib/types';
import s from './article.module.css';

/** Auto-rendered from frontmatter `sources`. Renders nothing while the list is empty. */
export function Sources({ sources, editor }: { sources?: Source[]; editor?: string }) {
  const list = (sources ?? []).filter((x) => x && x.url);
  if (!list.length && !editor) return null;
  return (
    <aside className={s.endmatter} aria-labelledby={list.length ? 'sources-title' : undefined}>
      {list.length > 0 && (
        <>
          <h2 id="sources-title">Sources</h2>
          <ol className={s.sources}>
            {list.map((src, i) => (
              <li key={i}>
                <a href={src.url} target="_blank" rel="noopener noreferrer">{src.title || src.url}</a>
                {src.publisher && <>, <em>{src.publisher}</em></>}
                {src.date && <> ({src.date})</>}
              </li>
            ))}
          </ol>
        </>
      )}
      {editor && <p>Editor: {editor}</p>}
    </aside>
  );
}
