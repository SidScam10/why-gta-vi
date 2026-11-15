'use client';
import { useRef } from 'react';
import { useReveal } from '@/lib/motion';
import s from './article.module.css';

export function PullQuote({ children, cite, wide }: { children: React.ReactNode; cite?: string; wide?: boolean }) {
  const ref = useRef<HTMLQuoteElement>(null);
  useReveal(ref, { y: 40 });
  return (
    <blockquote ref={ref} className={`${s.quote} ${wide ? 'wide' : ''}`}>
      {typeof children === 'string' ? <p>{children}</p> : children}
      {cite && <cite>— {cite}</cite>}
    </blockquote>
  );
}
