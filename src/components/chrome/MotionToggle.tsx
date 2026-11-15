'use client';
import { useMotion } from '@/lib/motion';
import s from './chrome.module.css';

export function MotionToggle() {
  const { enabled, setEnabled } = useMotion();
  return (
    <button type="button" role="switch" aria-checked={enabled} className={s.toggle} onClick={() => setEnabled(!enabled)}>
      Motion <span className={s.switch} aria-hidden="true" />
    </button>
  );
}
