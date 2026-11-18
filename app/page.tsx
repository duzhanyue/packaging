import Link from 'next/link';
import { Arrow, ProductCard, ProjectCTA } from './ui';
import { products } from './data';
import { SectionHeading, CategoryGrid, CompanyOverview, Workflow, GuideCards, CustomizationOverview } from './sections';
import './home.css';

const featuredSlugs = ['bamboo-collection', 'square-dropper', 'jt-288', 'gold-cream-jars', 'foam-bottle', 'jt-252', 'cosmetic-tubes', 'jt-189'];
const featured = featuredSlugs.map(slug => products.find(p => p.slug === slug)!).filter(Boolean);

export default function Home() { return <main id="top" className="home-editorial">
  <section className="hero"><div className="hero-image" /><div className="shell hero-content"><p className="eyebrow"><span className="tiny-star">✳</span> COSMETIC PACKAGING · OEM / ODM SOLUTIONS</p><h1>Good packaging.<br />Great <em>possibilities.</em></h1><p className="hero-description">Glass, plastic and aluminum packaging<br />for beauty and personal care.<br />Standard collections. Custom solutions.</p><Link href="/products" className="button dark">Explore the collection <Arrow /></Link><div className="hero-footnote"><span className="line" /> SPECIFICATION · SAMPLING · PRODUCTION SUPPORT</div></div><div className="shell hero-bottom"><span>PRIMARY PACKAGING FOR BEAUTY & PERSONAL CARE.</span><a href="#collections" className="scroll-link">Explore packaging solutions <span>↓</span></a></div><span className="hero-edition">THE XIECHU EDIT / 01</span></section>
  <section className="ref-capability-band"><div className="shell ref-capabilities">{[
    ['01', 'Packaging development', 'Standard formats and OEM/ODM project review, shaped around your product requirements.'],
    ['02', 'Production coordination', 'Container forming, component selection and assembly aligned with the agreed specification.'],
    ['03', 'Custom decoration', 'Color, surface treatment, printing and logo application for a coordinated brand collection.'],
    ['04', 'Quality requirements', 'Approved samples, documented specifications and clearly defined inspection criteria.'],
  ].map(([n, title, text]) => <Link href={n === '03' ? '/customization' : '/why-xiechu'} key={n}><span className="ref-capability-icon">{n}</span><h3>{title}</h3><p>{text}</p><span className="ref-capability-arrow" aria-hidden="true">↗</span></Link>)}</div></section>
  <section className="ref-section shell" id="collections"><SectionHeading label="Product types" title="Packaging for every part of your beauty collection." description="Explore bottles, jars, tubes and dispensing formats. Start with your application, then refine the material, capacity and closure." /><CategoryGrid /></section>
  <section className="ref-section ref-tint"><div className="shell"><CompanyOverview /></div></section>
  <section className="ref-section shell"><SectionHeading label="Featured products" title="Discover your next packaging solution." description="A selection from our existing collection. Explore each design for product images, specifications and custom options." center /><div className="product-grid ref-featured-grid">{featured.map((product, index) => <ProductCard key={product.slug} product={product} index={index} />)}</div><div className="ref-section-action"><Link href="/products" className="ref-button outline">View all packaging products <Arrow diagonal={false} /></Link></div></section>
  <section className="ref-section ref-tint"><div className="shell"><CustomizationOverview /></div></section>
  <section className="ref-section shell"><Workflow /><div className="ref-section-action"><Link href="/customization#production-process" className="ref-text-link">Explore the project workflow <Arrow diagonal={false} /></Link></div></section>
  <section className="ref-application-section"><div className="shell"><SectionHeading label="Packaging applications" title="Built around your product. Selected for your application." description="Find the right starting point for your formulation, dispensing needs and brand collection." /><div className="ref-applications">{[
    ['Skincare & creams', 'Glass Jar', 'gold-cream-jars', 'Creams, balms and skincare collections.'],
    ['Serums & essential oils', 'Essential Oil Bottle', 'square-dropper', 'Glass bottles and dropper configurations.'],
    ['Personal care', 'Foam Bottle', 'foam-bottle', 'Foaming and dispensing packaging formats.'],
    ['Fragrance collections', 'Perfume bottles', 'jt-189', 'Glass fragrance bottles and closure options.'],
  ].map(([title, category, slug, text]) => <Link href={'/products?category=' + encodeURIComponent(category)} key={title}><img src={'/images/' + products.find(p => p.slug === slug)!.image} alt={title + ' packaging'} loading="lazy" /><div><h3>{title}</h3><p>{text}</p><span>Explore products →</span></div></Link>)}</div></div></section>
  <section className="ref-section shell"><SectionHeading label="Packaging knowledge" title="Practical guidance for your next project." href="/guides" link="All sourcing guides" /><GuideCards /></section>
  <ProjectCTA />
</main>; }
