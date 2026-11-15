'use client';
import YARL from 'yet-another-react-lightbox';
import Captions from 'yet-another-react-lightbox/plugins/captions';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/captions.css';
import { useMotion } from '@/lib/motion';

type Slide = { src: string; alt?: string; description?: string };

export default function Lightbox({ slides, index, onClose }: { slides: Slide[]; index: number; onClose: () => void }) {
  const { enabled } = useMotion();
  return (
    <YARL
      open
      index={index}
      close={onClose}
      slides={slides}
      plugins={[Captions]}
      animation={enabled ? undefined : { fade: 0, swipe: 0 }}
      styles={{ container: { backgroundColor: 'rgb(8 7 15 / 0.96)' } }}
    />
  );
}
