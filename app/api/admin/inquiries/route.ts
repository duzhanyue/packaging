import { prisma } from '../../../lib/db';
import { isAdmin } from '../../../lib/auth';

export async function GET() {
  if (!await isAdmin()) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  try { return Response.json(await prisma.inquiry.findMany({ orderBy: { createdAt: 'desc' }, take: 500 })); }
  catch (error) { console.error('Load inquiries failed', error); return Response.json({ error: 'Database unavailable' }, { status: 503 }); }
}
export async function PATCH(request: Request) {
  if (!await isAdmin()) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  const { id, isRead } = await request.json();
  if (typeof id !== 'string' || typeof isRead !== 'boolean') return Response.json({ error: '请求参数无效。' }, { status: 400 });
  await prisma.inquiry.update({ where: { id }, data: { isRead } });
  return Response.json({ ok: true });
}
export async function DELETE(request: Request) {
  if (!await isAdmin()) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await request.json();
  if (typeof id !== 'string') return Response.json({ error: '请求参数无效。' }, { status: 400 });
  await prisma.inquiry.delete({ where: { id } });
  return Response.json({ ok: true });
}
