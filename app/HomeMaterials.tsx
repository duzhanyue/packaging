'use client';
import Link from 'next/link';
import { useState } from 'react';

type Material = { name: string; heading: string; description: string; image: string; alt: string; category: string; count: number; note: string };
export default function MaterialStudio({ materials }: { materials: Material[] }) {
  const [selected, setSelected] = useState(0);
  const material = materials[selected];
  return <section className="home-materials shell" aria-labelledby="materials-title">
    <div className="material-photograph" key={material.image}><img src={'/images/' + material.image} alt={material.alt} loading="lazy" /><span className="material-image-index">MATERIAL STUDY / 0{selected + 1}</span><span className="material-image-note">{material.note}</span></div>
    <div className="material-editorial"><p className="eyebrow">03 / MATERIAL & COMPONENT SELECTION</p><h2 id="materials-title">Materials for<br /><em>your application.</em></h2><div className="material-switches" role="group" aria-label="Explore packaging materials">{materials.map((item, index) => <button key={item.name} aria-pressed={selected === index} aria-controls="material-description" onClick={() => setSelected(index)} className={selected === index ? 'selected' : ''}><span>0{index + 1}</span>{item.name}</button>)}</div><div id="material-description" className="material-description" aria-live="polite"><h3>{material.heading}</h3><p>{material.description}</p><Link href={'/products?category=' + encodeURIComponent(material.category)} className="home-editorial-link">Explore {material.name.toLowerCase()} packaging <span aria-hidden="true">↗</span></Link><small>{material.count} products in this category</small></div></div>
  </section>;
}
