import Link from 'next/link';
import { notFound } from 'next/navigation';
import { guides } from '../../site-content';
import { products } from '../../data';
import { Arrow, ProjectCTA } from '../../ui';

export const dynamicParams = false;
export function generateStaticParams() { return guides.map(guide => ({ slug: guide.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const guide = guides.find(item => item.slug === slug); return { title: guide?.title || 'Packaging guide', description: guide?.intro }; }

export default async function Guide({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = guides.find(item => item.slug === slug);
  if (!guide) notFound();
  const product = products.find(p => p.slug === guide.image)!;
  return <main id="top"><div className="shell page-intro"><Link href="/guides" className="ref-text-link">← All packaging guides</Link><p className="ref-kicker" style={{ marginTop: 28 }}>{guide.category}</p><h1>{guide.title}</h1><p>{guide.intro}</p></div><article className="shell guide-article"><img src={'/images/' + product.image} alt={product.name} />{guide.sections.map(([title, text]) => <section key={title}><h2>{title}</h2><p>{text}</p></section>)}<Link href="/contact" className="ref-button">Discuss your packaging requirements <Arrow diagonal={false} /></Link></article><ProjectCTA /></main>;
}
