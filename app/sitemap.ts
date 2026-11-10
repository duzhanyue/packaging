import type { MetadataRoute } from 'next';
import { products } from './data';
export default function sitemap(): MetadataRoute.Sitemap { return ['', '/products', '/about', '/customization', '/contact', ...products.map(p => '/products/' + p.slug)].map(path => ({ url: 'https://www.jietingpackage.com' + path, changeFrequency: 'monthly', priority: path === '' ? 1 : .8 })); }
