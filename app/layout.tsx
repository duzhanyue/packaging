import type { Metadata } from 'next';
import './globals.css';
import { Header, Footer } from './ui';
import FloatingContact from './FloatingContact';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.jietingpackage.com'),
  title: { default: 'JIETING — Considered packaging. Endless possibilities.', template: '%s | JIETING Packaging' },
  description: 'Discover glass bottles, cosmetic jars and thoughtfully considered packaging. Explore the Jieting collection and make it your own.',
  openGraph: { title: 'JIETING Packaging', description: 'Good packaging. Great possibilities.', images: ['/images/original-hero.jpg'] },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en" data-scroll-behavior="smooth"><body><Header />{children}<Footer /><FloatingContact /></body></html>;
}
