'use client';
import { createContext, useContext, useState } from 'react';
import type { ChapterMeta } from './types';

type Ctx = { chapters: ChapterMeta[]; active: string | null; setActive: (id: string | null) => void };
const ChapterCtx = createContext<Ctx>({ chapters: [], active: null, setActive: () => {} });

export function ChapterProvider({ chapters, children }: { chapters: ChapterMeta[]; children: React.ReactNode }) {
  const [active, setActive] = useState<string | null>(null);
  return <ChapterCtx.Provider value={{ chapters, active, setActive }}>{children}</ChapterCtx.Provider>;
}
export const useChapters = () => useContext(ChapterCtx);
