'use client';
import { useRef } from 'react';
import { useReveal } from '@/lib/motion';
import { withBase } from '@/lib/withBase';
import s from './media.module.css';

export type Img = { src: string; alt: string; width?: number; height?: number; caption?: string; credit?: string };

export function Caption({ caption, credit }: { caption?: React.ReactNode; credit?: string }) {
  if (!caption && !credit) return null;
  return (
    <figcaption className="caption">
      {caption}
      {credit && <span className="credit">{credit}</span>}
    </figcaption>
  );
}

export function Pic({ src, alt, width, height, eager }: Img & { eager?: boolean }) {
  return <img src={withBase(src)} alt={alt ?? ''} width={width} height={height} loading={eager ? 'eager' : 'lazy'} decoding="async" />;
}

/** Inset image at reading-column width (`wide` breaks out; `narrow` caps it at a fixed width for small source images). */
export function Figure({ wide, narrow, ...img }: Img & { wide?: boolean; narrow?: boolean }) {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  return (
    <figure ref={ref} className={`${s.figure} ${wide ? 'wide' : ''} ${narrow ? s.narrow : ''}`}>
      <div className={s.media}><Pic {...img} /></div>
      <Caption caption={img.caption} credit={img.credit} />
    </figure>
  );
}

/** Two equal-height images, slightly wider than the column. */
export function FigurePair({ a, b, caption, credit }: { a: Img; b: Img; caption?: string; credit?: string }) {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  return (
    <figure ref={ref} className={`${s.figure} wide`}>
      <div className={s.pair}>
        <div className={s.media}><Pic {...a} /></div>
        <div className={s.media}><Pic {...b} /></div>
      </div>
      <Caption caption={caption} credit={credit} />
    </figure>
  );
}

/** 2x2 grid (or any count) with one shared caption. */
export function FigureGrid({ images, caption, credit }: { images: Img[]; caption?: string; credit?: string }) {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  return (
    <figure ref={ref} className={`${s.figure} wide`}>
      <div className={s.grid}>
        {images.map((im, i) => <div className={s.media} key={i}><Pic {...im} /></div>)}
      </div>
      <Caption caption={caption} credit={credit} />
    </figure>
  );
}
