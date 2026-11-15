'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useChapters } from '@/lib/chapters';
import { gsap, useMotion } from '@/lib/motion';
import { withBase } from '@/lib/withBase';
import { MotionToggle } from './MotionToggle';
import s from './chrome.module.css';

export function MenuOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { chapters, active } = useChapters();
  const { enabled } = useMotion();
  const [hover, setHover] = useState<string | null>(null);
  const panel = useRef<HTMLDivElement>(null);
  const opener = useRef<Element | null>(null);

  useEffect(() => {
    if (!open || !panel.current) return;
    opener.current = document.activeElement;
    const el = panel.current;
    el.querySelector<HTMLElement>('a, button')?.focus();
    if (enabled) gsap.from(el, { xPercent: 100, duration: 0.5, ease: 'power3.out' });
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;
      const f = Array.from(el.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'));
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      (opener.current as HTMLElement | null)?.focus?.();
    };
  }, [open, enabled, onClose]);

  if (!open) return null;

  function go(e: React.MouseEvent, id: string) {
    e.preventDefault();
    onClose();
    requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: enabled ? 'smooth' : 'auto' });
      history.replaceState(null, '', `#${id}`);
    });
  }

  const shown = hover ?? active;
  return (
    <div className={s.overlay} role="dialog" aria-modal="true" aria-label="Chapters">
      <div className={s.preview} aria-hidden="true" onClick={onClose}>
        {chapters.filter((c) => c.art).map((c) => (
          <img key={c.id} src={withBase(c.art)} alt="" className={shown === c.id ? s.shown : ''} />
        ))}
      </div>
      <div className={s.panel} ref={panel}>
        <div className={s.panelTop}>
          <span>Chapters</span>
          <button type="button" className={s.close} onClick={onClose} aria-label="Close menu">✕</button>
        </div>
        <ul className={s.list}>
          {chapters.map((c) => (
            <li key={c.id}>
              <a
                href={`#${c.id}`}
                aria-current={active === c.id}
                onClick={(e) => go(e, c.id)}
                onMouseEnter={() => setHover(c.id)}
                onFocus={() => setHover(c.id)}
                onMouseLeave={() => setHover(null)}
              >
                <small>{c.n}</small>
                {c.title}
              </a>
            </li>
          ))}
        </ul>
        <div className={s.panelFoot}>
          <span>
            <Link href="/">Home</Link> · <Link href="/credits/">Credits</Link>
          </span>
          <MotionToggle />
        </div>
      </div>
    </div>
  );
}
