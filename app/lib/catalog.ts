import 'server-only';
import { categoryDetails, products, type Product } from '../data';
import { prisma } from './db';

export async function getLiveProducts(): Promise<Product[]> {
  try {
    const saved = await prisma.product.findMany({ select: { id: true, slug: true, name: true, imageUrls: true, imageUrl: true, category: true, spec: true, description: true, isPublished: true } });
    const bySlug = new Map(saved.map(row => [row.slug, row]));
    const existingSlugs = new Set(products.map(product => product.slug));
    const base = products.filter(product => bySlug.get(product.slug)?.isPublished !== false).map(product => {
      const row = bySlug.get(product.slug);
      if (!row) return product;
      const images = row.imageUrls.length ? row.imageUrls : row.imageUrl ? [row.imageUrl] : [];
      return { ...product, name: row.name, image: images[0] || product.image, images, category: row.category || product.category, categories: row.category ? [row.category] : product.categories, detail: row.spec || product.detail };
    });
    const added = saved.filter(row => row.isPublished && !existingSlugs.has(row.slug)).map(row => {
      const category = row.category || 'Packaging';
      const images = row.imageUrls.length ? row.imageUrls : row.imageUrl ? [row.imageUrl] : [];
      return { id: row.id, name: row.name, sourceUrl: '', sourceImage: images[0] || '', categories: [category], specifications: [], slug: row.slug, category, type: category.toUpperCase(), tag: 'XIECHU PACKAGING', description: row.description || `Explore ${row.name} from our ${category} collection. Contact our team to discuss specifications and decoration options.`, detail: row.spec || category, image: images[0] || 'bamboo-collection.png', images };
    });
    return [...base, ...added] as Product[];
  } catch { return products; }
}

export async function getLiveCategoryNames(): Promise<string[]> {
  try {
    const saved = await prisma.category.findMany({ orderBy: [{ position: 'asc' }, { name: 'asc' }], select: { name: true } });
    return saved.length ? saved.map(category => category.name) : categoryDetails.map(category => category.name);
  } catch { return categoryDetails.map(category => category.name); }
}
