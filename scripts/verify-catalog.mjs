import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
const catalog=JSON.parse(await readFile('app/catalog.json','utf8'));
const report=JSON.parse(await readFile('.reference/catalog/report.json','utf8'));
assert.equal(catalog.categories.length, report.categories);
assert.equal(catalog.products.length, report.checks.find(c=>c.category==='All packaging').total);
assert.equal(new Set(catalog.products.map(p=>p.id)).size,catalog.products.length);
assert.equal(new Set(catalog.products.map(p=>p.slug)).size,catalog.products.length);
for(const category of catalog.categories){const check=report.checks.find(c=>c.category===category.name);assert.equal(catalog.products.filter(p=>p.categories.includes(category.name)).length,check.total,category.name);}
const files=new Set();
for(const product of catalog.products){assert.ok(product.image,`Missing main image: ${product.id}`);assert.ok(product.categories.length,`Missing category: ${product.id}`);assert.ok(product.images.length,`Missing gallery: ${product.id}`);for(const image of [product.image,...product.images]){assert.ok(image.startsWith('catalog/'));files.add(image);}}
for(const image of files){const file='public/images/'+image;assert.ok((await stat(file)).size>0);const bytes=await readFile(file);assert.equal(bytes.toString('ascii',0,4),'RIFF');assert.equal(bytes.toString('ascii',8,12),'WEBP');}
assert.equal(report.failures.length,0,'Source files failed to import');
assert.equal(report.downloaded,report.sourceImages,'Not all source images were downloaded');
console.log(`Verified ${catalog.products.length} products, ${catalog.categories.length} categories, ${files.size} local WebP images.`);
if(report.failures.length)console.log('Unavailable source images:',report.failures.length);
