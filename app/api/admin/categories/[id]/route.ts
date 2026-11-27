import { prisma } from '../../../../lib/db';
import { isAdmin } from '../../../../lib/auth';

export async function PATCH(request: Request, context: RouteContext<'/api/admin/categories/[id]'>) {
  if (!await isAdmin()) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await context.params;
  const body = await request.json();
  const name = typeof body.name === 'string' ? body.name.trim().slice(0, 80) : '';
  if (!name) return Response.json({ error: 'Category name is required.' }, { status: 400 });
  const existing = await prisma.category.findUnique({ where: { id } });
  if (!existing) return Response.json({ error: 'Category not found.' }, { status: 404 });
  try {
    await prisma.$transaction([
      prisma.category.update({ where: { id }, data: { name } }),
      prisma.product.updateMany({ where: { category: existing.name }, data: { category: name } }),
    ]);
    return Response.json({ ok: true });
  } catch (error) { if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') return Response.json({ error: '该分类名称已存在。' }, { status: 409 }); throw error; }
}

export async function DELETE(_request: Request, context: RouteContext<'/api/admin/categories/[id]'>) {
  if (!await isAdmin()) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await context.params;
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) return Response.json({ error: '未找到该分类。' }, { status: 404 });
  const count = await prisma.product.count({ where: { category: category.name, isPublished: true } });
  if (count) return Response.json({ error: `该分类下还有 ${count} 个产品，请先移动或删除这些产品。` }, { status: 409 });
  await prisma.category.delete({ where: { id } });
  return Response.json({ ok: true });
}
