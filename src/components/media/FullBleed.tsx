'use client';
import { useRef } from 'react';
import { gsap, useGSAP, useMotion, isSmallScreen } from '@/lib/motion';
import { Caption, Pic, type Img } from './Figure';
import s from './media.module.css';

/** Edge-to-edge image with optional slow parallax. */
export function FullBleed({ parallax, ...img }: Img & { parallax?: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const { enabled } = useMotion();
  useGSAP(() => {
    if (!enabled || !parallax || isSmallScreen()) return;
    gsap.fromTo(ref.current!.querySelector('img'), { yPercent: -6 }, {
      yPercent: 6, ease: 'none',
      scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  }, { scope: ref, dependencies: [enabled], revertOnUpdate: true });
  return (
    <figure ref={ref} className={`${s.bleed} full`}>
      <div className={s.bleedMedia}><Pic {...img} /></div>
      <Caption caption={img.caption} credit={img.credit} />
    </figure>
  );
}
