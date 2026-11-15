'use client';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger, useGSAP);
export { gsap, ScrollTrigger, useGSAP };

const KEY = 'motion-pref'; // 'on' | 'off' | absent (follow OS)
type Ctx = { enabled: boolean; setEnabled: (v: boolean) => void };
const MotionCtx = createContext<Ctx>({ enabled: false, setEnabled: () => {} });

function read(): string | null { try { return localStorage.getItem(KEY); } catch { return null; } }
function write(v: string) { try { localStorage.setItem(KEY, v); } catch { /* storage blocked */ } }

/** Motion is on only if the OS allows it AND the in-site toggle has not turned it off. */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  const [enabled, setState] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => { const p = read(); setState(p ? p === 'on' : !mq.matches); };
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);
  useEffect(() => {
    document.documentElement.dataset.motion = enabled ? 'on' : 'off';
    ScrollTrigger.refresh();
  }, [enabled]);
  const setEnabled = useCallback((v: boolean) => { write(v ? 'on' : 'off'); setState(v); }, []);
  return <MotionCtx.Provider value={{ enabled, setEnabled }}>{children}</MotionCtx.Provider>;
}

export const useMotion = () => useContext(MotionCtx);
export const isSmallScreen = () => typeof window !== 'undefined' && window.matchMedia('(max-width: 760px), (pointer: coarse)').matches;

/** Fade + rise an element when it scrolls into view. No-op when motion is off (content is visible by default). */
export function useReveal<T extends HTMLElement>(ref: React.RefObject<T | null>, opts: { y?: number; delay?: number } = {}) {
  const { enabled } = useMotion();
  useGSAP(() => {
    if (!enabled || !ref.current) return;
    gsap.from(ref.current, {
      autoAlpha: 0, y: opts.y ?? 32, duration: 0.9, delay: opts.delay ?? 0, ease: 'power3.out',
      scrollTrigger: { trigger: ref.current, start: 'top 88%', once: true },
    });
  }, { dependencies: [enabled], revertOnUpdate: true });
}
