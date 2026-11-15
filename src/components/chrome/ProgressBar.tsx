'use client';
import { useEffect, useRef } from 'react';
import s from './chrome.module.css';

export function ProgressBar() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (CSS.supports('animation-timeline: scroll()')) return; // pure CSS path
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - innerHeight;
      ref.current?.style.setProperty('--p', String(max > 0 ? scrollY / max : 0));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll);
    return () => { removeEventListener('scroll', onScroll); removeEventListener('resize', onScroll); cancelAnimationFrame(raf); };
  }, []);
  return <div ref={ref} className={s.progress} aria-hidden="true" />;
}
