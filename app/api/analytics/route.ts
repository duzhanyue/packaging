import { createHmac } from 'node:crypto';
import { prisma } from '../../lib/db';
import { isAdmin } from '../../lib/auth';

export const runtime = 'nodejs';

function shanghaiDay(date = new Date()) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);
}

function sourceFrom(referrer: unknown) {
  if (typeof referrer !== 'string' || !referrer) return '直接访问';
  try {
    const url = new URL(referrer);
    if (url.hostname === 'jietingpackage.com' || url.hostname.endsWith('.jietingpackage.com')) return '站内访问';
    const host = url.hostname.toLowerCase().replace(/^www\./, '');
    if (/google\.|bing\.com|yahoo\.|baidu\.com/.test(host)) return '搜索引擎';
    if (/facebook\.com|instagram\.com|linkedin\.com|tiktok\.com|youtube\.com|pinterest\.|x\.com|twitter\.com/.test(host)) return '社交媒体';
    return host.slice(0, 80) || '其他来源';
  } catch { return '其他来源'; }
}

export async function POST(request: Request) {
  if (await isAdmin()) return new Response(null, { status: 204 });
  const length = Number(request.headers.get('content-length') || 0);
  if (length > 4096) return Response.json({ ok: false }, { status: 413 });

  const body = await request.json().catch(() => null);
  if (!body || (body.kind !== 'page_view' && body.kind !== 'click')) return Response.json({ ok: false }, { status: 400 });
  const path = typeof body.path === 'string' ? body.path.split(/[?#]/, 1)[0] : '';
  const visitorId = typeof body.visitorId === 'string' ? body.visitorId : '';
  if (!path.startsWith('/') || path.length > 200 || path.startsWith('/admin') || !/^[\w-]{16,80}$/.test(visitorId)) return Response.json({ ok: false }, { status: 400 });

  const day = shanghaiDay();
  const dayDate = new Date(`${day}T00:00:00.000Z`);
  const key = process.env.ADMIN_SESSION_SECRET;
  if (!key) return Response.json({ ok: false }, { status: 503 });
  const visitorHash = createHmac('sha256', key).update(`visitor:${visitorId}`).digest('hex');
  const forwardedIp = request.headers.get('x-vercel-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-forwarded-for')?.split(',').at(-1)?.trim()
    || '';
  const ipHash = forwardedIp ? createHmac('sha256', key).update(`ip:${forwardedIp}`).digest('hex') : null;

  try {
    await prisma.siteVisitorDay.upsert({
      where: { day_visitorHash: { day: dayDate, visitorHash } },
      create: { day: dayDate, visitorHash, ipHash },
      update: {},
    });

    if (body.kind === 'page_view') {
      await prisma.siteDailyStat.upsert({
        where: { day_path: { day: dayDate, path } },
        create: { day: dayDate, path, pageViews: 1 },
        update: { pageViews: { increment: 1 } },
      });
      const source = sourceFrom(body.referrer);
      await prisma.siteTrafficDay.upsert({
        where: { day_source: { day: dayDate, source } },
        create: { day: dayDate, source, visits: 1 },
        update: { visits: { increment: 1 } },
      });
    } else {
      await prisma.siteDailyStat.upsert({
        where: { day_path: { day: dayDate, path } },
        create: { day: dayDate, path, clicks: 1 },
        update: { clicks: { increment: 1 } },
      });
      const target = typeof body.target === 'string' ? body.target.replace(/[\r\n\t]/g, ' ').trim().slice(0, 100) : '';
      if (target) {
        await prisma.siteClickStat.upsert({
          where: { day_path_target: { day: dayDate, path, target } },
          create: { day: dayDate, path, target, clicks: 1 },
          update: { clicks: { increment: 1 } },
        });
      }
    }
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error('Analytics event could not be stored:', error instanceof Error ? error.name : 'UnknownError');
    return Response.json({ ok: false }, { status: 503 });
  }
}
