/** Extract a YouTube video id and start time from any common URL form (watch, youtu.be, shorts, embed, live) or a bare id. */
export function parseYouTube(input?: string): { id: string; start?: number } | null {
  if (!input) return null;
  const s = input.trim();
  if (/^[\w-]{11}$/.test(s)) return { id: s };
  let u: URL;
  try { u = new URL(s.startsWith('http') ? s : `https://${s}`); } catch { return null; }
  let id: string | null = null;
  if (u.hostname.endsWith('youtu.be')) id = u.pathname.slice(1).split('/')[0];
  else if (u.hostname.includes('youtube')) {
    id = u.searchParams.get('v');
    const m = u.pathname.match(/^\/(shorts|embed|live|v)\/([\w-]{11})/);
    if (!id && m) id = m[2];
  }
  if (!id || !/^[\w-]{11}$/.test(id)) return null;
  const t = u.searchParams.get('t') || u.searchParams.get('start');
  let start: number | undefined;
  if (t) {
    const hms = t.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s?)?$/);
    if (hms) start = (+(hms[1] || 0)) * 3600 + (+(hms[2] || 0)) * 60 + (+(hms[3] || 0));
  }
  return { id, start: start || undefined };
}
