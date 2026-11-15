'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useChapters } from '@/lib/chapters';
import s from './chrome.module.css';

export function Header({ siteName, onMenu, menuOpen }: { siteName: string; onMenu?: () => void; menuOpen?: boolean }) {
  const { chapters, active } = useChapters();
  const [solid, setSolid] = useState(false);
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    const on = () => setSolid(scrollY > innerHeight * 0.7);
    on();
    addEventListener('scroll', on, { passive: true });
    return () => removeEventListener('scroll', on);
  }, []);
  const ch = chapters.find((c) => c.id === active);

  async function share() {
    const data = { title: document.title, url: location.href.split('#')[0] };
    try {
      if (navigator.share) await navigator.share(data);
      else {
        await navigator.clipboard.writeText(data.url);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      }
    } catch {
      /* cancelled */
    }
  }

  return (
    <header className={`${s.header} ${solid ? s.solid : ''}`}>
      <Link href="/" className={s.mark}>{siteName}</Link>
      <div className={s.current} aria-live="polite">
        {ch && (
          <>
            <b>{ch.n}</b>
            {ch.title}
          </>
        )}
      </div>
      <button type="button" className={s.pill} onClick={share}>{copied ? 'Link copied' : 'Share'}</button>
      {onMenu && (
        <button type="button" className={s.burger} onClick={onMenu} aria-label="Open chapter menu" aria-expanded={menuOpen} aria-haspopup="dialog">
          <span />
          <span />
          <span />
        </button>
      )}
    </header>
  );
}
