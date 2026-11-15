'use client';
import { useCallback, useRef, useState } from 'react';
import { ChapterProvider } from '@/lib/chapters';
import { ScrollTrigger, useGSAP } from '@/lib/motion';
import type { ChapterMeta, Theme } from '@/lib/types';
import { Header } from './Header';
import { MenuOverlay } from './MenuOverlay';
import { ProgressBar } from './ProgressBar';
import s from './chrome.module.css';

/** Client wrapper for every page: theme vars, background wash, header, progress, chapter menu. */
export function ArticleShell({ chapters = [], theme, siteName, children }: { chapters?: ChapterMeta[]; theme?: Theme; siteName: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const bg = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);

  // Background wash: colour cross-fade tied to scroll progress (colour only, so it runs even with motion off).
  useGSAP(() => {
    ScrollTrigger.create({
      trigger: root.current,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (st) => bg.current?.style.setProperty('--wash', st.progress.toFixed(3)),
    });
  }, { scope: root });

  const vars: Record<string, string> = {};
  if (theme?.accent) vars['--accent'] = theme.accent;
  if (theme?.accent2) vars['--accent-2'] = theme.accent2;
  if (theme?.cream) vars['--cream'] = theme.cream;
  if (theme?.bgFrom) vars['--bg-from'] = theme.bgFrom;
  if (theme?.bgTo) vars['--bg-to'] = theme.bgTo;

  return (
    <ChapterProvider chapters={chapters}>
      <div ref={root} style={vars as React.CSSProperties}>
        <div ref={bg} className={s.bg} aria-hidden="true" />
        <ProgressBar />
        <Header siteName={siteName} onMenu={chapters.length ? () => setOpen(true) : undefined} menuOpen={open} />
        <MenuOverlay open={open} onClose={close} />
        {children}
      </div>
    </ChapterProvider>
  );
}
