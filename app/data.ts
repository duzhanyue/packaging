import catalog from './catalog.json';
export const categoryDetails = catalog.categories;
export const categories = ['All packaging', ...categoryDetails.map(category => category.name)];
export const products = catalog.products;
export type Product = typeof products[number];
export const featuredProducts = ['bamboo-collection', 'gold-cream-jars', 'square-dropper', 'bamboo-jar'].map(slug => products.find(product => product.slug === slug)).filter((product): product is Product => Boolean(product));
