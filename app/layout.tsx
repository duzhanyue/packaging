import type { Metadata } from 'next';
import './globals.css';
import './reference.css';
import './process.css';
import './brand.css';
import './social.css';
import SiteFrame from './SiteFrame';
import { getLiveCategoryNames } from './lib/catalog';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.jietingpackage.com'),
  title: { default: 'XIECHU | Cosmetic Packaging & Custom Solutions', template: '%s | XIECHU Packaging' },
  description: 'Glass bottles, cosmetic jars, airless packaging and tubes for beauty and personal care. Standard formats, OEM/ODM support and custom decoration.',
  openGraph: { title: 'XIECHU Packaging', description: 'Cosmetic packaging, custom decoration and OEM/ODM project support.', images: ['/images/hero-premium-v2.webp'] },
};
export const dynamic = 'force-dynamic';
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const categoryNames = await getLiveCategoryNames();
  return <html lang="en" data-scroll-behavior="smooth"><body><SiteFrame categoryNames={categoryNames}>{children}</SiteFrame></body></html>;
}
