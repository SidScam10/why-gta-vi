const BASE = process.env.NEXT_PUBLIC_BASE_PATH || '';

/** Prefix a local asset path with the basePath. Full URLs (http, //, data:) pass through untouched. */
export function withBase(src?: string): string {
  if (!src) return '';
  if (/^(https?:)?\/\//.test(src) || src.startsWith('data:') || src.startsWith('blob:')) return src;
  return `${BASE}${src.startsWith('/') ? '' : '/'}${src}`;
}
