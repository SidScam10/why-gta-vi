import type { Metadata, Viewport } from 'next';
import { display, condensed, serif, sans } from './fonts';
import { MotionProvider } from '@/lib/motion';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'Why GTA VI', template: '%s · Why GTA VI' },
  description: 'Long-form stories, told cinematically.',
};
export const viewport: Viewport = { themeColor: '#0f0e1a', width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-motion="off" className={`${display.variable} ${condensed.variable} ${serif.variable} ${sans.variable}`}>
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
