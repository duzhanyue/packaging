import { del } from '@vercel/blob';
import { prisma } from '../../../../lib/db';
import { isAdmin } from '../../../../lib/auth';
import { prisma as db } from '../../../../lib/db';

export async function PATCH(request: Request, context: RouteContext<'/api/admin/products/[slug]'>) {
  if (!await isAdmin()) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  const { slug } = await context.params;
  const body = await request.json();
  const name = typeof body.name === 'string' ? body.name.trim().slice(0, 180) : '';
  const category = typeof body.category === 'string' ? body.category.trim() : '';
  const imageUrls = Array.isArray(body.imageUrls) ? body.imageUrls.filter((url: unknown) => typeof url === 'string' && (url.startsWith('/images/') || url.startsWith('https://'))) : null;
  if (!name || !category || !imageUrls || imageUrls.length < 1 || imageUrls.length > 20) return Response.json({ error: '请填写产品名称、选择分类并至少保留一张图片（最多 20 张）。' }, { status: 400 });
  const existing = await db.product.findUnique({ where: { slug } });
  if (!existing || !existing.isPublished) return Response.json({ error: 'Product not found.' }, { status: 404 });
  if (!await db.category.findUnique({ where: { name: category } })) return Response.json({ error: '请选择一个已存在的产品分类。' }, { status: 400 });
  await db.product.update({ where: { slug }, data: { name, category, imageUrls, imageUrl: imageUrls[0] || null } });
  const removed = existing.imageUrls.filter((url: string) => url.startsWith('https://') && !imageUrls.includes(url));
  if (removed.length) await del(removed).catch(error => console.error('Blob cleanup failed', error));
  return Response.json({ ok: true });
}

export async function DELETE(_request: Request, context: RouteContext<'/api/admin/products/[slug]'>) {
  if (!await isAdmin()) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  const { slug } = await context.params;
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product || !product.isPublished) return Response.json({ error: '未找到该产品。' }, { status: 404 });
  await prisma.product.update({ where: { slug }, data: { isPublished: false } });
  const blobUrls = product.imageUrls.filter((url: string) => url.startsWith('https://'));
  if (blobUrls.length) await del(blobUrls).catch(error => console.error('Blob cleanup failed', error));
  return Response.json({ ok: true });
}
