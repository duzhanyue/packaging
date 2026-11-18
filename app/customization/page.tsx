import Link from 'next/link';
import { Arrow, ProjectCTA } from '../ui';
import { products } from '../data';
import { customOptions } from '../site-content';
import { SectionHeading, Workflow } from '../sections';

export const metadata = { title: 'OEM & ODM — Custom Cosmetic Packaging', description: 'Explore custom colors, branding, capacities, finishes, closures, structural development and materials with XIECHU. From specification and samples to production coordination.' };

const questions = [
  ['Can an existing packaging design be customized?', 'Yes. Depending on the selected format, customization can include color, surface treatment, screen printing, hot stamping, labeling and closure configuration. The quotation confirms the available process, artwork requirements and minimum quantity.'],
  ['How are OEM/ODM or new tooling projects reviewed?', 'Provide a drawing, reference sample or dimensional brief, together with the intended application and order quantity. Tooling scope, development samples, costs and timing are reviewed separately from standard-format customization.'],
  ['What should be confirmed before bulk production?', 'Confirm the product specification, material and capacity, component fit, artwork revision, color and finish reference, approved samples, inspection requirements, quantity and packing details. Formula compatibility and filling evaluations should be completed with the intended product.'],
  ['How do sample requests work?', 'Specify whether you need an existing component sample or a decorated sample for approval. Availability, sample preparation, charges and freight are confirmed for the selected packaging and project.'],
  ['What are the minimum order quantity and lead time?', 'Both depend on the product, material, stock status, decoration process and any tooling requirements. Request a product-specific quotation and schedule; quantities or timings listed for one design do not apply to the entire catalog.'],
  ['How is product compatibility assessed?', 'Evaluate representative packaging samples with your actual formulation, filling process and storage conditions. Review closure sealing and dispensing performance with your filling or formulation team, and agree any additional evaluation requirements before production approval.'],
];

export default function Customization() { return <main id="top">
  <div className="custom-page-top"><div className="shell page-intro"><p className="eyebrow">OEM & ODM · CUSTOM PACKAGING SOLUTIONS</p><h1>Your product. Your identity.<br /><em>Your packaging specification.</em></h1><p>From a standard container with your decoration to a custom structural brief, XIECHU helps connect product requirements, sample approval and a practical production plan.</p></div><ul className="shell ref-custom-tabs">{customOptions.map((option, i) => <li key={option.short}><a href={'#option-' + (i + 1)}>{option.short}</a></li>)}</ul></div>
  <section className="ref-section shell">{customOptions.map((option, i) => {
    const product = products.find(p => p.slug === option.slug)!;
    return <article className="ref-service" id={'option-' + (i + 1)} key={option.title}><div className="ref-service-photo"><img src={'/images/' + product.image} alt={product.name} loading="lazy" /></div><div><p className="ref-kicker">0{i + 1} / CUSTOM {option.short}</p><h2>{option.title}</h2><p>{option.text}</p><ul className="ref-check-list">{option.checks.map(check => <li key={check}>{check}</li>)}</ul><Link className="ref-text-link" href="/contact">Discuss this customization <Arrow diagonal={false} /></Link></div></article>;
  })}</section>
  <section className="ref-section ref-tint" id="production-process"><div className="shell"><Workflow /></div></section>
  <section className="ref-section shell"><SectionHeading label="Quality planning" title="Clear references at every stage." description="Define the checks appropriate to your packaging, formulation and filling requirements." /><div className="ref-value-grid">{[
    ['01', 'Controlled specifications', 'Use agreed drawings, material specifications, artwork revisions and approved physical samples as production references. Confirm changes before the order proceeds.'],
    ['02', 'Application-based checks', 'Agree appearance, dimensions, closure fit and decoration requirements. Define the sealing, dispensing, compatibility or transport evaluations appropriate to your application.'],
    ['03', 'Packing & delivery planning', 'Confirm product protection, inner packing, carton configuration, shipping marks and destination requirements, together with the inspection scope and dispatch arrangements.'],
  ].map(([n, title, text]) => <article className="ref-value-card" key={n}><span>{n}</span><h3>{title}</h3><p>{text}</p></article>)}</div></section>
  <section className="ref-section ref-tint" id="project-questions"><div className="shell ref-requirements"><div className="ref-body-copy"><p className="ref-kicker">CUSTOM PACKAGING FAQ</p><h2>Plan the project.<br />Confirm the essentials.</h2><p>Available processes, minimum quantities and timing depend on the selected format and specification. Share your brief for a project-specific review.</p><Link href="/contact" className="ref-button">Ask our packaging team <Arrow diagonal={false} /></Link></div><div className="packaging-faq">{questions.map(([question, answer]) => <details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div></div></section>
  <ProjectCTA />
</main>; }
