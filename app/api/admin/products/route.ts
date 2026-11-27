import catalog from '../../../catalog.json';
import { randomUUID } from 'node:crypto';
import { prisma } from '../../../lib/db';
import { isAdmin } from '../../../lib/auth';

async function ensureCatalog() {
  await prisma.product.createMany({ data: catalog.products.map(item => {
    const images = item.images.map(image => `/images/${image}`);
    return {
      name: item.name, slug: item.slug, description: item.description, spec: item.detail,
      imageUrl: images[0] || null, imageUrls: images, category: item.category,
    };
  }), skipDuplicates: true });
}
export async function GET() {
  if (!await isAdmin()) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  try { await ensureCatalog(); return Response.json(await prisma.product.findMany({ where: { isPublished: true }, orderBy: [{ category: 'asc' }, { name: 'asc' }] })); }
  catch (error) { console.error('Load products failed', error); return Response.json({ error: '数据库暂不可用，请检查 Postgres 连接及 Prisma 数据库迁移。' }, { status: 503 }); }
}

export async function POST(request: Request) {
  if (!await isAdmin()) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await request.json();
  const name = typeof body.name === 'string' ? body.name.trim().slice(0, 180) : '';
  const category = typeof body.category === 'string' ? body.category.trim() : '';
  const imageUrls = Array.isArray(body.imageUrls) ? body.imageUrls.filter((url: unknown) => typeof url === 'string' && (url.startsWith('/images/') || url.startsWith('https://'))) : [];
  if (!name || !category || imageUrls.length < 1 || imageUrls.length > 20) return Response.json({ error: '请填写产品名称、选择分类并至少上传一张图片（最多 20 张）。' }, { status: 400 });
  const existingCategory = await prisma.category.findUnique({ where: { name: category } });
  if (!existingCategory) return Response.json({ error: '请选择一个已存在的产品分类。' }, { status: 400 });
  const slugBase = name.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 70) || 'packaging';
  const slug = `${slugBase}-${randomUUID().slice(0, 8)}`;
  const product = await prisma.product.create({ data: { name, slug, category, description: `Explore ${name} from our ${category} collection. Contact our team to discuss specifications and decoration options.`, imageUrls, imageUrl: imageUrls[0] } });
  return Response.json(product, { status: 201 });
}
