'use client';
import { useRef } from 'react';
import { useChapters } from '@/lib/chapters';
import { gsap, ScrollTrigger, useGSAP, useMotion, isSmallScreen } from '@/lib/motion';
import { withBase } from '@/lib/withBase';
import s from './article.module.css';

/**
 * Full-screen chapter opener. Authors write <Chapter title="..." art="..." />;
 * `id` and `n` are injected at build time by lib/articles.ts (an explicit id is kept).
 */
export function Chapter({ id, n, title, subtitle, art }: { id?: string; n?: string; title: string; subtitle?: string; art?: string }) {
  const root = useRef<HTMLElement>(null);
  const { setActive } = useChapters();
  const { enabled } = useMotion();

  // Active-chapter tracking for the header (always on, independent of motion).
  useGSAP(() => {
    ScrollTrigger.create({
      trigger: root.current,
      start: 'top 50%',
      onEnter: () => setActive(id ?? null),
      onEnterBack: () => setActive(id ?? null),
      onLeaveBack: (st) => {
        // Hand the label back to the previous chapter (or clear it above the first one).
        const prev = ScrollTrigger.getAll().filter((t) => t.vars.id === 'chapter' && t.start < st.start).pop();
        setActive(prev ? (prev.trigger as HTMLElement).id : null);
      },
      id: 'chapter',
    });
  }, { scope: root });

  useGSAP(() => {
    if (!enabled) return;
    const q = gsap.utils.selector(root);
    gsap.from(q('[data-title]'), {
      clipPath: 'inset(0 0 100% 0)', yPercent: 30, duration: 1.1, ease: 'power4.out',
      scrollTrigger: { trigger: root.current, start: 'top 60%', once: true },
    });
    gsap.from(q('[data-fade]'), { autoAlpha: 0, y: 16, duration: 0.8, delay: 0.3, scrollTrigger: { trigger: root.current, start: 'top 60%', once: true } });
    if (art && !isSmallScreen()) {
      gsap.fromTo(q('[data-art]'), { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true } });
    }
  }, { scope: root, dependencies: [enabled], revertOnUpdate: true });

  return (
    <section id={id} className={`${s.chapter} full`} ref={root} data-chapter aria-labelledby={id ? `${id}-title` : undefined}>
      {art && (
        <div className={s.chapterArt} data-art aria-hidden="true">
          <img src={withBase(art)} alt="" loading="lazy" decoding="async" />
        </div>
      )}
      <div className={s.chapterInner}>
        {n && <span className={s.chapterNum} data-fade>CHAPTER {n}</span>}
        <h2 className={s.chapterTitle} id={id ? `${id}-title` : undefined} data-title>{title}</h2>
        {subtitle && <p className={s.chapterSub} data-fade>{subtitle}</p>}
      </div>
    </section>
  );
}
