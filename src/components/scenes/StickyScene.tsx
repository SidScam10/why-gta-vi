'use client';
import { createContext, useContext, useEffect, useId, useRef, useState } from 'react';
import { withBase } from '@/lib/withBase';
import s from '../media/media.module.css';

type Reg = { id: string; src: string; alt: string };
type Ctx = { register: (r: Reg) => () => void; active: string | null; setActive: (id: string) => void };
const SceneCtx = createContext<Ctx | null>(null);

/**
 * Sticky visual on one side, text steps scrolling past on the other; the visual swaps per step.
 * Usage in MDX:
 *   <StickyScene>
 *     <Step src="/img/a.svg" alt="...">Text for step one.</Step>
 *     <Step src="/img/b.svg" alt="...">Text for step two.</Step>
 *   </StickyScene>
 */
export function StickyScene({ children }: { children: React.ReactNode }) {
  const [regs, setRegs] = useState<Reg[]>([]);
  const [active, setActive] = useState<string | null>(null);
  const register = (r: Reg) => {
    setRegs((prev) => [...prev.filter((x) => x.id !== r.id), r]);
    return () => setRegs((prev) => prev.filter((x) => x.id !== r.id));
  };
  const current = active ?? regs[0]?.id;
  return (
    <SceneCtx.Provider value={{ register, active: current ?? null, setActive }}>
      <div className={`${s.scene} wide`}>
        <div className={s.sceneVisual} aria-hidden="true">
          {regs.map((r) => <img key={r.id} src={withBase(r.src)} alt="" className={r.id === current ? s.on : ''} loading="lazy" decoding="async" />)}
        </div>
        <div className={s.steps}>{children}</div>
      </div>
    </SceneCtx.Provider>
  );
}

export function Step({ src, alt = '', children }: { src: string; alt?: string; children: React.ReactNode }) {
  const ctx = useContext(SceneCtx);
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);
  const register = ctx?.register;
  const setActive = ctx?.setActive;

  useEffect(() => register?.({ id, src, alt }), [id, src, alt]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!ref.current || !setActive) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setActive(id); }, { rootMargin: '-45% 0px -45% 0px' });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [id, setActive]);

  return (
    <div ref={ref} className={`${s.step} ${ctx?.active === id ? s.on : ''}`}>
      <div>
        <img className={s.stepImg} src={withBase(src)} alt={alt} loading="lazy" decoding="async" />
        <div className={s.stepBox}>{children}</div>
      </div>
    </div>
  );
}
