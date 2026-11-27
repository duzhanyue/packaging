import { ProductExplorer, ProjectCTA } from '../ui';
import { getLiveCategoryNames, getLiveProducts } from '../lib/catalog';
import Link from 'next/link';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Packaging Products — Bottles, Jars & Tubes', description: 'Explore the complete XIECHU packaging collection. Browse glass jars, essential oil bottles, airless packaging, bamboo bottles, tubes and more.' };
export default async function Products({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams;
  const [liveProducts, categoryNames] = await Promise.all([getLiveProducts(), getLiveCategoryNames()]);
  const initialCategory = category && categoryNames.includes(category) ? category : 'All packaging';
  return <main id="top"><section className="catalog-hero"><div className="shell catalog-hero-inner"><div><div className="catalog-breadcrumb"><Link href="/">Home</Link><span>/</span><span>Products</span></div><p className="eyebrow">THE XIECHU PRODUCT LIBRARY</p><h1>Beauty packaging.<br /><em>To specification.</em></h1><p>Browse bottles, jars, tubes and dispensing formats by category.<br />Review material, capacity and closure details, then request samples or a quotation.</p><div className="catalog-hero-meta"><span>{liveProducts.length}<small>PRODUCT DESIGNS</small></span><i>✳</i><span>{categoryNames.length}<small>PACKAGING CATEGORIES</small></span></div></div><div className="catalog-hero-art"><img src="/images/bamboo-collection.png" alt="XIECHU glass bottles and cosmetic jars with bamboo closures"/><span className="catalog-art-caption">STANDARD FORMATS / CUSTOM DECORATION ↗</span></div></div></section><section className="shell section catalog-section"><ProductExplorer key={initialCategory} initialCategory={initialCategory} items={liveProducts} categoryNames={categoryNames} /></section><ProjectCTA /></main>;
}
