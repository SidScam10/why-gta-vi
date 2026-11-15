// Every component an article can use in MDX. Add new ones here to make them available to all articles.
import { Chapter } from '@/components/article/Chapter';
import { PullQuote } from '@/components/article/PullQuote';
import { Figure, FigurePair, FigureGrid } from '@/components/media/Figure';
import { FullBleed } from '@/components/media/FullBleed';
import { Mosaic } from '@/components/media/Mosaic';
import { VideoLoop } from '@/components/media/VideoLoop';
import { YouTube } from '@/components/media/YouTube';
import { StickyScene, Step } from '@/components/scenes/StickyScene';

export const mdxComponents = {
  Chapter, PullQuote, Figure, FigurePair, FigureGrid, FullBleed, Mosaic, VideoLoop, YouTube, StickyScene, Step,
  a: (p: React.AnchorHTMLAttributes<HTMLAnchorElement>) =>
    /^https?:/.test(p.href ?? '') ? <a {...p} target="_blank" rel="noopener noreferrer" /> : <a {...p} />,
};
