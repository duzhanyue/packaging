import type { Metadata } from 'next';
import './globals.css';
import { Header, Footer } from './ui';
import FloatingContact from './FloatingContact';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.jietingpackage.com'),
  title: { default: 'JIETING | Cosmetic Packaging & Custom Solutions', template: '%s | JIETING Packaging' },
  description: 'Glass bottles, cosmetic jars, airless packaging and tubes for beauty and personal care. Standard formats, OEM/ODM support and custom decoration.',
  openGraph: { title: 'JIETING Packaging', description: 'Cosmetic packaging, custom decoration and OEM/ODM project support.', images: ['/images/original-hero.jpg'] },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en" data-scroll-behavior="smooth"><body><Header />{children}<Footer /><FloatingContact /></body></html>;
}
