import type { Metadata } from 'next';
import './globals.css';
import './reference.css';
import './process.css';
import './brand.css';
import './social.css';
import { Header, Footer } from './ui';
import FloatingContact from './FloatingContact';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.jietingpackage.com'),
  title: { default: 'XIECHU | Cosmetic Packaging & Custom Solutions', template: '%s | XIECHU Packaging' },
  description: 'Glass bottles, cosmetic jars, airless packaging and tubes for beauty and personal care. Standard formats, OEM/ODM support and custom decoration.',
  openGraph: { title: 'XIECHU Packaging', description: 'Cosmetic packaging, custom decoration and OEM/ODM project support.', images: ['/images/hero-premium-v2.webp'] },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en" data-scroll-behavior="smooth"><body><Header />{children}<Footer /><FloatingContact /></body></html>;
}
