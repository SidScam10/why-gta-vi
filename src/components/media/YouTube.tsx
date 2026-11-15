'use client';
import { useState } from 'react';
import { parseYouTube } from '@/lib/youtube';
import { withBase } from '@/lib/withBase';
import { Caption } from './Figure';
import s from './media.module.css';

/**
 * Click-to-load YouTube embed (privacy-enhanced youtube-nocookie.com).
 * Paste any YouTube link into `url`. Leave it empty to show an "add a link" placeholder.
 */
export function YouTube({ url, title, caption, credit, poster, wide }: { url?: string; title?: string; caption?: string; credit?: string; poster?: string; wide?: boolean }) {
  const [on, setOn] = useState(false);
  const yt = parseYouTube(url);
  const label = title || caption || 'video';

  return (
    <figure className={`${s.figure} ${wide ? 'wide' : ''}`}>
      <div className={s.facade}>
        {!yt ? (
          <div className={s.empty}>
            <span>Video slot — paste a YouTube link into <code>url=&quot;…&quot;</code></span>
          </div>
        ) : on ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${yt.id}?autoplay=1&rel=0${yt.start ? `&start=${yt.start}` : ''}`}
            title={label}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          <>
            <img src={poster ? withBase(poster) : `https://i.ytimg.com/vi/${yt.id}/hqdefault.jpg`} alt="" loading="lazy" decoding="async" />
            <button type="button" className={s.play} onClick={() => setOn(true)} aria-label={`Play: ${label}`}>
              {title && <span className={s.vtitle}>{title}</span>}
              <span className={s.playBtn}>
                <svg viewBox="0 0 18 18" fill="currentColor" aria-hidden="true"><path d="M4 2v14l12-7z" /></svg>
                Watch
              </span>
            </button>
          </>
        )}
      </div>
      <Caption caption={caption} credit={credit} />
    </figure>
  );
}
