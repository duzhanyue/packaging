import catalog from '../../../catalog.json';
import { prisma } from '../../../lib/db';
import { isAdmin } from '../../../lib/auth';

async function ensureCategories() {
  await prisma.category.createMany({ data: catalog.categories.map((category, position) => ({ name: category.name, position })), skipDuplicates: true });
}

export async function GET() {
  if (!await isAdmin()) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    await ensureCategories();
    const [categories, productCounts] = await Promise.all([
      prisma.category.findMany({ orderBy: [{ position: 'asc' }, { name: 'asc' }] }),
      prisma.product.groupBy({ by: ['category'], where: { isPublished: true }, _count: { _all: true } }),
    ]);
    const counts = new Map(productCounts.map(item => [item.category, item._count._all]));
    return Response.json(categories.map(category => ({ ...category, productCount: counts.get(category.name) || 0 })));
  } catch (error) { console.error('Load categories failed', error); return Response.json({ error: '分类加载失败，请检查数据库连接。' }, { status: 503 }); }
}

export async function POST(request: Request) {
  if (!await isAdmin()) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await request.json();
  const name = typeof body.name === 'string' ? body.name.trim().slice(0, 80) : '';
  if (!name) return Response.json({ error: 'Category name is required.' }, { status: 400 });
  try {
    const last = await prisma.category.aggregate({ _max: { position: true } });
    const category = await prisma.category.create({ data: { name, position: (last._max.position ?? -1) + 1 } });
    return Response.json({ ...category, productCount: 0 }, { status: 201 });
  }
  catch (error) { if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') return Response.json({ error: '该分类名称已存在。' }, { status: 409 }); throw error; }
}
