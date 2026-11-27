import { prisma } from '../../../lib/db';
import { isAdmin } from '../../../lib/auth';

function shanghaiDateString(date: Date) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);
}

function parseDate(value: string | null) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value ? null : date;
}

function addDays(date: Date, days: number) {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + days);
  return result;
}

export async function GET(request: Request) {
  if (!await isAdmin()) return Response.json({ error: '请先登录管理后台。' }, { status: 401 });
  const url = new URL(request.url);
  const today = shanghaiDateString(new Date());
  const end = parseDate(url.searchParams.get('end')) || parseDate(today)!;
  const start = parseDate(url.searchParams.get('start')) || addDays(end, -6);
  const endExclusive = addDays(end, 1);
  const duration = (endExclusive.getTime() - start.getTime()) / 86400000;
  if (duration < 1 || duration > 180) return Response.json({ error: '统计时间范围请控制在 1 至 180 天内。' }, { status: 400 });

  try {
    const inquiryStart = new Date(`${start.toISOString().slice(0, 10)}T00:00:00+08:00`);
    const inquiryEnd = new Date(`${endExclusive.toISOString().slice(0, 10)}T00:00:00+08:00`);
    const [dailyRows, visitorRows, trafficRows, clickRows, inquiryCount] = await Promise.all([
      prisma.siteDailyStat.findMany({ where: { day: { gte: start, lt: endExclusive } }, select: { day: true, path: true, pageViews: true, clicks: true } }),
      prisma.siteVisitorDay.findMany({ where: { day: { gte: start, lt: endExclusive } }, select: { day: true, visitorHash: true, ipHash: true } }),
      prisma.siteTrafficDay.findMany({ where: { day: { gte: start, lt: endExclusive } }, select: { source: true, visits: true } }),
      prisma.siteClickStat.findMany({ where: { day: { gte: start, lt: endExclusive } }, select: { path: true, target: true, clicks: true } }),
      prisma.inquiry.count({ where: { createdAt: { gte: inquiryStart, lt: inquiryEnd } } }),
    ]);

    const daily = new Map<string, { pageViews: number; clicks: number; visitors: Set<string>; ips: Set<string> }>();
    for (let date = new Date(start); date < endExclusive; date = addDays(date, 1)) daily.set(date.toISOString().slice(0, 10), { pageViews: 0, clicks: 0, visitors: new Set(), ips: new Set() });
    const pages = new Map<string, { pageViews: number; clicks: number }>();
    for (const row of dailyRows) {
      const dateKey = row.day.toISOString().slice(0, 10);
      const day = daily.get(dateKey);
      if (day) { day.pageViews += row.pageViews; day.clicks += row.clicks; }
      const page = pages.get(row.path) || { pageViews: 0, clicks: 0 };
      page.pageViews += row.pageViews; page.clicks += row.clicks; pages.set(row.path, page);
    }
    const allIps = new Set<string>();
    for (const row of visitorRows) {
      const day = daily.get(row.day.toISOString().slice(0, 10));
      if (day) { day.visitors.add(row.visitorHash); if (row.ipHash) day.ips.add(row.ipHash); }
      if (row.ipHash) allIps.add(row.ipHash);
    }
    const sources = new Map<string, number>();
    for (const row of trafficRows) sources.set(row.source, (sources.get(row.source) || 0) + row.visits);
    const clicks = new Map<string, { path: string; target: string; count: number }>();
    for (const row of clickRows) {
      const key = `${row.path}\u0000${row.target}`;
      const entry = clicks.get(key) || { path: row.path, target: row.target, count: 0 };
      entry.count += row.clicks; clicks.set(key, entry);
    }
    const timeline = [...daily.entries()].map(([date, values]) => ({ date, pageViews: values.pageViews, clicks: values.clicks, visitors: values.visitors.size, ips: values.ips.size }));
    return Response.json({
      start: start.toISOString().slice(0, 10), end: end.toISOString().slice(0, 10),
      totals: {
        pageViews: dailyRows.reduce<number>((sum, row) => sum + row.pageViews, 0),
        clicks: dailyRows.reduce<number>((sum, row) => sum + row.clicks, 0),
        visitors: new Set(visitorRows.map(row => row.visitorHash)).size,
        uniqueIps: allIps.size,
        inquiries: inquiryCount,
      },
      timeline,
      pages: [...pages.entries()].map(([path, values]) => ({ path, ...values })).sort((a, b) => b.pageViews - a.pageViews).slice(0, 8),
      clickTargets: [...clicks.values()].sort((a, b) => b.count - a.count).slice(0, 8),
      sources: [...sources.entries()].map(([source, count]) => ({ source, count })).sort((a, b) => b.count - a.count).slice(0, 8),
    }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('Admin analytics query failed:', error instanceof Error ? error.name : 'UnknownError');
    return Response.json({ error: '访问统计暂时无法加载，请确认数据库迁移已执行。' }, { status: 503 });
  }
}
