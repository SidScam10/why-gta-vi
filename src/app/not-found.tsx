import Link from 'next/link';

export default function NotFound() {
  return (
    <main id="main" style={{ minHeight: '100svh', display: 'grid', placeItems: 'center', textAlign: 'center', padding: 'var(--gutter)' }}>
      <div>
        <p style={{ fontFamily: 'var(--font-condensed)', fontSize: 'clamp(6rem,25vw,14rem)', lineHeight: 0.85, color: 'var(--cream)', margin: 0 }}>404</p>
        <p style={{ fontFamily: 'var(--font-sans)', color: 'var(--text-muted)' }}>This page took a wrong turn.</p>
        <Link href="/">Back to the story</Link>
      </div>
    </main>
  );
}
