'use client';
import { useRef } from 'react';
import { SplitText } from 'gsap/SplitText';
import { gsap, useGSAP, useMotion, isSmallScreen } from '@/lib/motion';
import { withBase } from '@/lib/withBase';
import s from './article.module.css';

if (typeof window !== 'undefined') gsap.registerPlugin(SplitText);

type Props = {
  title: string;
  kicker?: string;
  deck?: string;
  byline?: string;
  illustration?: string;
  date?: string;
  poster?: string;
  posterMobile?: string;
  video?: string;
};

export function Hero({ title, kicker, deck, byline, illustration, date, poster, posterMobile, video }: Props) {
  const root = useRef<HTMLElement>(null);
  const { enabled } = useMotion();

  useGSAP(() => {
    if (!enabled) return;
    const titleEl = root.current!.querySelector('h1')!;
    const split = SplitText.create(titleEl, { type: 'lines', linesClass: 'line', mask: 'lines' });
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
    tl.from(split.lines, { yPercent: 110, duration: 1.2, stagger: 0.12 })
      .from(root.current!.querySelectorAll('[data-fade]'), { autoAlpha: 0, y: 20, duration: 0.8, stagger: 0.1 }, '-=0.7');
    if (!isSmallScreen()) {
      gsap.to(root.current!.querySelector('[data-media]'), {
        yPercent: 18, ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
      });
    }
    return () => split.revert();
  }, { scope: root, dependencies: [enabled], revertOnUpdate: true });

  const dateLabel = date ? new Date(date + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : null;

  return (
    <header className={`${s.hero} full`} ref={root}>
      <div className={s.heroMedia} data-media>
        {video ? (
          <video autoPlay muted loop playsInline poster={withBase(poster)} aria-hidden="true">
            {/\.\w+$/.test(video) ? <source src={withBase(video)} /> : (
              <>
                <source src={withBase(video + '.webm')} type="video/webm" />
                <source src={withBase(video + '.mp4')} type="video/mp4" />
              </>
            )}
          </video>
        ) : poster ? (
          <picture>
            {posterMobile && <source media="(max-width: 760px)" srcSet={withBase(posterMobile)} />}
            <img src={withBase(poster)} alt="" fetchPriority="high" />
          </picture>
        ) : null}
      </div>
      <div className={s.heroText}>
        {kicker && <p className={s.kicker} data-fade>{kicker}</p>}
        <h1 className={s.title}>{title}</h1>
        {deck && <p className={s.deck} data-fade>{deck}</p>}
        <div className={s.byline} data-fade>
          {byline && <span>By <strong>{byline}</strong></span>}
          {illustration && <span>Illustrations by <strong>{illustration}</strong></span>}
          {dateLabel && <time dateTime={date}>{dateLabel}</time>}
        </div>
        <div className={s.cue} aria-hidden="true" />
      </div>
    </header>
  );
}
