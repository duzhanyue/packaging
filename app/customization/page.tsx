import Link from 'next/link';
import { Arrow, ProjectCTA } from '../ui';

export const metadata = {
  title: 'Custom Packaging, Decoration & Production Support',
  description: 'OEM/ODM cosmetic packaging support, custom colors, screen printing, hot stamping and closure selection. Review specifications, samples, production and dispatch requirements with Jieting.',
};

const services = [
  ['01', 'Color & surface treatment', 'Define the color reference, transparency, gloss level and coverage. Review frosting, coating or electroplating options for the selected glass, plastic or metal component.'],
  ['02', 'Artwork & decoration', 'Review screen printing, hot stamping and labeling against the print area and container geometry. Confirm artwork files, placement, colors and finish through sample approval.'],
  ['03', 'Closures & component fit', 'Coordinate the bottle or jar with the specified cap, dropper or pump. Check neck finish, seal, dip-tube or pipette length and component fit for the intended application.'],
];
const workflow = [
  ['01', 'Specification review', 'Define the application, material, capacity, neck finish, closure, decoration, quantity and destination. Review standard formats or an OEM/ODM development brief.'],
  ['02', 'Sampling & approval', 'Review physical components, artwork and decorated samples. Confirm critical dimensions, color references and required formula or filling evaluations before approving the production specification.'],
  ['03', 'Production & decoration', 'Coordinate container and component production with the selected forming or molding route. Surface treatment, printing and assembly requirements follow the agreed product specification.'],
  ['04', 'Inspection & dispatch', 'Agree appearance, dimensional, closure-fit and decoration checks against the approved references. Confirm protective packing, carton requirements and shipping arrangements for the order.'],
];
const questions = [
  ['Can an existing packaging design be customized?', 'Yes. Depending on the selected format, customization can include color, surface treatment, screen printing, hot stamping, labeling and closure configuration. The quotation confirms the available process, artwork requirements and minimum quantity.'],
  ['How are OEM/ODM or new tooling projects reviewed?', 'Provide a drawing, reference sample or dimensional brief, together with the intended application and order quantity. Tooling scope, development samples, costs and timing are reviewed separately from standard-format customization.'],
  ['What should be confirmed before bulk production?', 'Confirm the product specification, material and capacity, component fit, artwork revision, color and finish reference, approved samples, inspection requirements, quantity and packing details. Formula compatibility and filling evaluations should be completed with the intended product.'],
  ['How do sample requests work?', 'Specify whether you need an existing component sample or a decorated sample for approval. Availability, sample preparation, charges and freight are confirmed for the selected packaging and project.'],
  ['What are the minimum order quantity and lead time?', 'Both depend on the product, material, stock status, decoration process and any tooling requirements. Request a product-specific quotation and schedule; quantities or timings listed for one design do not apply to the entire catalog.'],
  ['How is product compatibility assessed?', 'Evaluate representative packaging samples with your actual formulation, filling process and storage conditions. Review closure sealing and dispensing performance with your filling or formulation team, and agree any additional evaluation requirements before production approval.'],
];

export default function Customization() { return <main id="top">
  <div className="shell page-intro"><p className="eyebrow">OEM / ODM · DECORATION · PRODUCTION COORDINATION</p><h1>Custom solutions.<br /><em>For your brand.</em></h1><p>From a standard container with your decoration to an OEM/ODM project, Jieting helps translate packaging requirements into a clear specification, sample approval and supply plan.</p></div>
  <section className="shell section"><div className="editorial-grid"><div className="editorial-copy"><p className="eyebrow">MATERIAL, COMPONENTS & BRAND REQUIREMENTS</p><h2>Develop the pack.<br />Confirm the details.</h2><p>A successful packaging brief connects appearance with application: the formulation, nominal capacity, container material, neck finish, closure system and filling process all inform the final specification.</p><p>We review product selection, decoration requirements and production arrangements with our manufacturing partners. For custom shapes or components, tooling scope and development feasibility are assessed before a production commitment.</p><Link href="/contact" className="button dark">Request a project review <Arrow /></Link></div><img src="/images/cream-jars.png" alt="Reflective gold finish cosmetic packaging" /></div><div className="values">{services.map(([n,t,d]) => <div key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p></div>)}</div></section>
  <section className="section process-section" id="production-process"><div className="shell"><p className="eyebrow">PACKAGING PRODUCTION & ORDER WORKFLOW</p><h2>From specification<br />to shipment.</h2><div className="process-grid">{workflow.map(([n,t,d]) => <div key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p></div>)}</div></div></section>
  <section className="shell section"><div className="section-heading"><div><p className="eyebrow">PRODUCTION REFERENCES & ACCEPTANCE CRITERIA</p><h2>Quality starts with<br />clear requirements.</h2></div></div><div className="values">{[
    ['01', 'Controlled specifications', 'Use the agreed product drawing, material specification, artwork revision and approved physical sample as the reference for production discussions. Confirm any changes before the order proceeds.'],
    ['02', 'Application-based checks', 'Review appearance, critical dimensions, closure fit and decoration requirements. Define any sealing, dispensing, compatibility or transport evaluations appropriate to your product and filling conditions.'],
    ['03', 'Packing & delivery planning', 'Confirm product protection, inner packing, carton configuration, shipping marks and destination requirements. Agree the inspection scope and dispatch arrangements as part of the order specification.'],
  ].map(([n,t,d]) => <div key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p></div>)}</div></section>
  <section className="shell section"><div className="section-heading"><div><p className="eyebrow">PROJECT PLANNING</p><h2>Common technical<br />& ordering questions.</h2></div></div><div className="packaging-faq">{questions.map(([question,answer]) => <details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div></section>
  <ProjectCTA />
</main>; }
