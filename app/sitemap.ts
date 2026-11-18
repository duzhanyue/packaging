import type { MetadataRoute } from 'next';
import { products } from './data';
import { guides } from './site-content';
export default function sitemap(): MetadataRoute.Sitemap { return ['', '/products', '/about', '/customization', '/contact', '/why-xiechu', '/guides', ...guides.map(guide => '/guides/' + guide.slug), ...products.map(p => '/products/' + p.slug)].map(path => ({ url: 'https://www.jietingpackage.com' + path, changeFrequency: 'monthly', priority: path === '' ? 1 : .8 })); }
