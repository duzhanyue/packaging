import { GuideCards } from '../sections';
import { ProjectCTA } from '../ui';

export const metadata = { title: 'Packaging Guides — Specification, Sampling & Production', description: 'Practical sourcing guides for preparing a cosmetic packaging brief, choosing containers and closures, and approving samples before production.' };

export default function Guides() { return <main id="top"><div className="custom-page-top"><div className="shell page-intro"><p className="eyebrow">XIECHU PACKAGING KNOWLEDGE</p><h1>A clearer brief.<br /><em>A smoother packaging project.</em></h1><p>Practical guidance for beauty and personal care buyers, from product selection and component fit to sampling and production approval.</p></div></div><section className="ref-section shell"><GuideCards /></section><ProjectCTA /></main>; }
