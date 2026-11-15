'use client';
import { useEffect, useRef, useState } from 'react';
import { useMotion } from '@/lib/motion';
import { withBase } from '@/lib/withBase';
import { Caption } from './Figure';
import s from './media.module.css';

/**
 * Muted looping clip that only plays while on screen.
 * `src` may be a full file ("/video/x.mp4", "https://...") or an extensionless base ("/video/x") -> .webm + .mp4.
 */
export function VideoLoop({ src, poster, alt, caption, credit, wide, full }: { src: string; poster?: string; alt?: string; caption?: string; credit?: string; wide?: boolean; full?: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  const { enabled } = useMotion();
  const [userPaused, setUserPaused] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (!enabled || userPaused) { v.pause(); return; }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) v.play().catch(() => {});
      else v.pause();
    }, { threshold: 0.25 });
    io.observe(v);
    return () => io.disconnect();
  }, [enabled, userPaused]);

  const hasExt = /\.\w{3,4}(\?.*)?$/.test(src);
  return (
    <figure className={`${s.figure} ${full ? 'full' : wide ? 'wide' : ''}`}>
      <div className={`${s.media} ${s.videoWrap}`}>
        <video
          ref={ref} muted loop playsInline preload="none" poster={withBase(poster)}
          aria-hidden={alt ? undefined : true} aria-label={alt}
          onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}
        >
          {hasExt ? <source src={withBase(src)} /> : (
            <>
              <source src={withBase(src + '.webm')} type="video/webm" />
              <source src={withBase(src + '.mp4')} type="video/mp4" />
            </>
          )}
        </video>
        <button type="button" className={s.ctrl} aria-label={playing ? 'Pause video' : 'Play video'}
          onClick={() => { const v = ref.current!; if (playing) { setUserPaused(true); v.pause(); } else { setUserPaused(false); v.play().catch(() => {}); } }}>
          {playing
            ? <svg viewBox="0 0 14 14" fill="currentColor" aria-hidden="true"><rect x="2" y="1" width="3.5" height="12" /><rect x="8.5" y="1" width="3.5" height="12" /></svg>
            : <svg viewBox="0 0 14 14" fill="currentColor" aria-hidden="true"><path d="M3 1v12l10-6z" /></svg>}
        </button>
      </div>
      <Caption caption={caption} credit={credit} />
    </figure>
  );
}
