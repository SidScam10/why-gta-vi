'use client';
import dynamic from 'next/dynamic';
import { useRef, useState } from 'react';
import { gsap, useGSAP, useMotion, isSmallScreen } from '@/lib/motion';
import { withBase } from '@/lib/withBase';
import { Pic, type Img } from './Figure';
import s from './media.module.css';

const Lightbox = dynamic(() => import('./Lightbox'), { ssr: false });

/** Offset multi-column image mosaic; columns drift at different speeds; clicking any image opens the lightbox. */
export function Mosaic({ images, columns = 3 }: { images: Img[]; columns?: 2 | 3 }) {
  const ref = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(-1);
  const { enabled } = useMotion();

  const cols: { im: Img; i: number }[][] = Array.from({ length: columns }, () => []);
  images.forEach((im, i) => cols[i % columns].push({ im, i }));

  useGSAP(() => {
    if (!enabled || isSmallScreen()) return;
    const speeds = [-8, 10, -3];
    gsap.utils.toArray<HTMLElement>('[data-col]', ref.current).forEach((col, i) => {
      gsap.fromTo(col, { yPercent: -speeds[i % 3] / 2 }, {
        yPercent: speeds[i % 3], ease: 'none',
        scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    });
  }, { scope: ref, dependencies: [enabled], revertOnUpdate: true });

  return (
    <div ref={ref} className={`${s.mosaic} wide`} style={{ '--cols': columns } as React.CSSProperties}>
      {cols.map((col, ci) => (
        <div className={s.mcol} data-col key={ci}>
          {col.map(({ im, i }) => (
            <figure className={s.tile} key={i}>
              <button type="button" className={s.tileBtn} onClick={() => setIndex(i)} aria-label={`Open image: ${im.alt}`}>
                <Pic {...im} />
                <span className={s.expand} aria-hidden="true">
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M10 2h4v4M6 14H2v-4M14 2 9 7M2 14l5-5" /></svg>
                </span>
              </button>
              {im.caption && <figcaption className={s.tileCap}>{im.caption}</figcaption>}
            </figure>
          ))}
        </div>
      ))}
      {index >= 0 && (
        <Lightbox
          index={index}
          onClose={() => setIndex(-1)}
          slides={images.map((im) => ({ src: withBase(im.src), alt: im.alt, description: [im.caption, im.credit].filter(Boolean).join(' — ') }))}
        />
      )}
    </div>
  );
}
