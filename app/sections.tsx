import Link from 'next/link';
import { products, categoryDetails } from './data';
import { Arrow } from './ui';
import { guides, workflow } from './site-content';

export function SectionHeading({ label, title, description, href, link = 'Explore more', center = false }: { label: string; title: string; description?: string; href?: string; link?: string; center?: boolean }) {
  return <div className={'ref-heading' + (center ? ' centered' : '')}><div><p className="ref-kicker">{label}</p><h2>{title}</h2></div>{description && <p>{description}</p>}{href && <Link href={href} className="ref-text-link">{link} <Arrow diagonal={false} /></Link>}</div>;
}

const categoryImages: Record<string, string> = { 'Glass Jar': 'gold-cream-jars', 'Essential Oil Bottle': 'square-dropper', 'Airless Bottle & Jar': 'jt-288', 'Foam Bottle': 'foam-bottle', 'Bamboo Bottle & Jar': 'bamboo-collection', 'Aluminum Jar': 'jt-252', 'Plastic Tube': 'cosmetic-tubes', 'Perfume bottles': 'jt-189' };
export function CategoryGrid() {
  return <div className="ref-category-grid">{categoryDetails.map(category => {
    const imageProduct = products.find(p => p.slug === categoryImages[category.name]) || products.find(p => p.categories.includes(category.name));
    const count = products.filter(p => p.categories.includes(category.name)).length;
    return <Link href={'/products?category=' + encodeURIComponent(category.name)} className="ref-category" key={category.id}><div className="ref-category-photo">{imageProduct && <img src={'/images/' + imageProduct.image} alt={category.name + ' packaging'} loading="lazy" />}</div><div><span>{String(count).padStart(2, '0')} designs</span><h3>{category.name}</h3><span className="category-go" aria-hidden="true">↗</span></div></Link>;
  })}<Link className="ref-category ref-category-all" href="/products"><span className="ref-kicker">THE COMPLETE COLLECTION</span><strong>Find your<br />next packaging.</strong><span>{products.length} designs. {categoryDetails.length} categories.</span><span className="ref-text-link">View all products <Arrow diagonal={false} /></span></Link></div>;
}

export function CompanyVideo() {
  return <figure className="ref-video" id="company-video"><video controls playsInline preload="metadata" aria-label="XIECHU packaging company video"><source src="/videos/xiechu-packaging.mp4" type="video/mp4" />Your browser does not support this video. <a href="/videos/xiechu-packaging.mp4">Open the company video</a>.</video><figcaption><span className="video-dot" /> XIECHU PACKAGING <span>COMPANY VIDEO</span></figcaption></figure>;
}

export function CompanyOverview() {
  return <div className="ref-about-grid"><CompanyVideo /><div className="ref-about-copy"><p className="ref-kicker">ABOUT XIECHU</p><h2>Packaging expertise.<br />From selection to supply.</h2><p>Glass bottles, cosmetic jars, airless formats, plastic containers, aluminum jars and tubes — brought together for beauty and personal care brands.</p><p>We connect application-led product selection with custom decoration, sample review and production coordination. Your formulation, filling requirements and brand identity guide the specification.</p><Link className="ref-text-link" href="/about">Meet your packaging partner <Arrow diagonal={false} /></Link><div className="ref-stats"><div><strong>{products.length}</strong><span>Product designs</span></div><div><strong>{categoryDetails.length}</strong><span>Packaging categories</span></div><div><strong>OEM/ODM</strong><span>Project support</span></div></div></div></div>;
}

export function Workflow() {
  return <div className="ref-workflow">{workflow.map(([n, title, description]) => <div className="ref-step" key={n}><span className="ref-step-number">{n}</span><h3>{title}</h3><p>{description}</p></div>)}</div>;
}

export function GuideCards() {
  return <div className="ref-guide-grid">{guides.map(guide => {
    const product = products.find(p => p.slug === guide.image)!;
    return <Link href={'/guides/' + guide.slug} className="ref-guide" key={guide.slug}><div className="ref-guide-image"><img src={'/images/' + product.image} alt={product.name} loading="lazy" /></div><div className="ref-guide-copy"><p className="ref-kicker">{guide.category}</p><h3>{guide.title}</h3><p>{guide.intro}</p><span className="ref-text-link">Read the guide <Arrow diagonal={false} /></span></div></Link>;
  })}</div>;
}

export function CustomizationOverview() {
  return <div className="ref-custom-grid"><div><p className="ref-kicker">CUSTOM PACKAGING · OEM & ODM</p><h2>Made for your product.<br />Recognized as your brand.</h2><p className="ref-lead">Develop a complete packaging specification, from the container and closure to the color, artwork and finish.</p><div className="ref-option-list">{[
    ['Container & component development', 'Standard formats or a custom structural brief, reviewed against the application and tooling requirements.'],
    ['Custom color & surface finish', 'Defined color references, frosting, coating and material-specific finishing options.'],
    ['Branding & dispensing components', 'Screen printing, hot stamping and labeling, with closure and dispenser fit reviewed together.'],
  ].map(([title, text], i) => <div key={title}><span>0{i + 1}</span><div><h3>{title}</h3><p>{text}</p></div></div>)}</div><Link href="/customization" className="ref-button">Explore OEM & ODM <Arrow diagonal={false} /></Link></div><div className="ref-custom-visual"><img src="/images/editorial/finish.webp" alt="Gold finish glass cosmetic packaging" loading="lazy" /><div><span>YOUR BRAND. YOUR SPECIFICATION.</span><strong>Color. Form. Finish.</strong><p>Review every detail through sample approval.</p></div></div></div>;
}
