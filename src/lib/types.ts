export type Source = { title: string; url: string; publisher?: string; date?: string };
export type Theme = { accent?: string; accent2?: string; cream?: string; bgFrom?: string; bgTo?: string };
export type ChapterMeta = { id: string; n: string; title: string; art?: string };
export type ArticleMeta = {
  slug: string;
  title: string;
  kicker?: string;
  deck?: string;
  byline?: string;
  illustration?: string;
  date?: string;
  editor?: string;
  hero?: { poster?: string; posterMobile?: string; video?: string; credit?: string };
  thumb?: string;
  theme?: Theme;
  sources?: Source[];
  draft?: boolean;
};
