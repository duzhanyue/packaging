'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

type TimelinePoint = { date: string; pageViews: number; clicks: number; visitors: number; ips: number };
type AnalyticsData = {
  start: string;
  end: string;
  totals: { pageViews: number; clicks: number; visitors: number; uniqueIps: number; inquiries: number };
  timeline: TimelinePoint[];
  pages: { path: string; pageViews: number; clicks: number }[];
  clickTargets: { path: string; target: string; count: number }[];
  sources: { source: string; count: number }[];
};

function shanghaiToday() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
}
function shiftDate(date: string, days: number) {
  const value = new Date(`${date}T00:00:00.000Z`);
  value.setUTCDate(value.getUTCDate() + days);
  return value.toISOString().slice(0, 10);
}
function points(data: TimelinePoint[], field: 'pageViews' | 'visitors' | 'clicks') {
  if (!data.length) return '';
  const max = Math.max(1, ...data.map(item => item[field]));
  return data.map((item, index) => {
    const x = data.length === 1 ? 350 : 35 + index * (630 / (data.length - 1));
    const y = 210 - item[field] / max * 175;
    return `${x},${y}`;
  }).join(' ');
}

export default function AnalyticsPanel() {
  const today = useMemo(shanghaiToday, []);
  const [end, setEnd] = useState(today);
  const [start, setStart] = useState(shiftDate(today, -6));
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/admin/analytics?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`, { cache: 'no-store' });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || '统计数据加载失败。');
      setData(result);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : '统计数据加载失败。');
    } finally {
      setLoading(false);
    }
  }, [start, end]);

  useEffect(() => { void load(); }, [load]);

  function setPreset(days: number) {
    setEnd(shanghaiToday());
    setStart(shiftDate(shanghaiToday(), -(days - 1)));
  }

  const maxSource = Math.max(1, ...(data?.sources.map(item => item.count) || [1]));

  return <section className="analytics-panel">
    <div className="analytics-toolbar">
      <div className="analytics-presets" aria-label="选择统计周期">
        {[7, 30, 90].map(days => <button key={days} type="button" onClick={() => setPreset(days)} className={start === shiftDate(end, -(days - 1)) ? 'active' : ''}>{days} 天</button>)}
      </div>
      <label>开始日期<input type="date" value={start} max={end} onChange={event => setStart(event.target.value)} /></label>
      <label>结束日期<input type="date" value={end} min={start} max={today} onChange={event => setEnd(event.target.value)} /></label>
      <button className="admin-primary analytics-search" onClick={() => void load()} disabled={loading}>查询</button>
      <button className="analytics-refresh" onClick={() => void load()} disabled={loading}>↻ 刷新</button>
    </div>
    <p className="analytics-note">数据从功能启用后开始记录；访客与 IP 使用不可逆摘要统计，不保存原始 IP。访问量以页面加载次数计算，点击量统计站内链接及操作按钮。</p>
    {error && <div className="admin-banner" role="alert">{error}</div>}
    <div className={`analytics-content ${loading ? 'is-loading' : ''}`}>
      <div className="analytics-metrics">
        <Metric label="浏览量（PV）" value={data?.totals.pageViews} tone="blue" icon="↗" />
        <Metric label="独立访客（UV）" value={data?.totals.visitors} tone="purple" icon="◉" />
        <Metric label="独立 IP" value={data?.totals.uniqueIps} tone="teal" icon="⌁" />
        <Metric label="站内点击" value={data?.totals.clicks} tone="orange" icon="⌖" />
        <Metric label="网站询盘" value={data?.totals.inquiries} tone="rose" icon="✉" />
      </div>
      <div className="analytics-grid">
        <section className="analytics-card analytics-trend">
          <div className="analytics-card-title"><div><span className="admin-kicker">访问表现</span><h2>访问趋势</h2></div><small>{data ? `${data.start} — ${data.end}` : ''}</small></div>
          <div className="analytics-legend"><span><i className="line-blue" />浏览量</span><span><i className="line-green" />独立访客</span><span><i className="line-orange" />点击</span></div>
          {data?.timeline.length ? <div className="analytics-chart-wrap"><svg className="analytics-line-chart" viewBox="0 0 700 250" role="img" aria-label="每日浏览量、访客和点击趋势">
            {[35, 93, 151, 210].map(y => <line key={y} x1="35" x2="665" y1={y} y2={y} className="chart-gridline" />)}
            <polyline points={points(data.timeline, 'pageViews')} className="chart-line chart-line-blue" />
            <polyline points={points(data.timeline, 'visitors')} className="chart-line chart-line-green" />
            <polyline points={points(data.timeline, 'clicks')} className="chart-line chart-line-orange" />
            {data.timeline.map((item, index) => data.timeline.length < 16 || index % Math.ceil(data.timeline.length / 10) === 0 || index === data.timeline.length - 1 ? <text key={item.date} x={data.timeline.length === 1 ? 350 : 35 + index * (630 / (data.timeline.length - 1))} y="239" textAnchor="middle" className="chart-date">{item.date.slice(5)}</text> : null)}
          </svg></div> : <div className="analytics-chart-empty">所选日期暂无访问数据</div>}
        </section>
        <section className="analytics-card analytics-sources">
          <div className="analytics-card-title"><div><span className="admin-kicker">访客来源</span><h2>流量来源</h2></div></div>
          {data?.sources.length ? <ul className="analytics-source-list">{data.sources.map(source => <li key={source.source}><div><span>{source.source}</span><b>{source.count}</b></div><span className="analytics-bar-track"><i style={{ width: `${Math.max(3, source.count / maxSource * 100)}%` }} /></span></li>)}</ul> : <div className="analytics-chart-empty">暂无来源数据</div>}
        </section>
        <section className="analytics-card">
          <div className="analytics-card-title"><div><span className="admin-kicker">内容表现</span><h2>热门页面</h2></div></div>
          {data?.pages.length ? <div className="analytics-table"><div className="analytics-table-head"><span>页面</span><span>浏览</span><span>点击</span></div>{data.pages.map(page => <div className="analytics-table-row" key={page.path}><span title={page.path}>{page.path}</span><b>{page.pageViews}</b><b>{page.clicks}</b></div>)}</div> : <div className="analytics-chart-empty">暂无页面数据</div>}
        </section>
        <section className="analytics-card">
          <div className="analytics-card-title"><div><span className="admin-kicker">互动表现</span><h2>热门点击</h2></div></div>
          {data?.clickTargets.length ? <div className="analytics-table analytics-click-table"><div className="analytics-table-head"><span>点击目标</span><span>所在页面</span><span>次数</span></div>{data.clickTargets.map((item, index) => <div className="analytics-table-row" key={`${item.path}-${item.target}-${index}`}><span title={item.target}>{item.target}</span><span title={item.path}>{item.path}</span><b>{item.count}</b></div>)}</div> : <div className="analytics-chart-empty">所选日期暂无点击数据</div>}
        </section>
      </div>
    </div>
  </section>;
}

function Metric({ label, value, tone, icon }: { label: string; value?: number; tone: string; icon: string }) {
  return <article className="analytics-metric"><h3>{label}</h3><div><span className={`analytics-icon ${tone}`}>{icon}</span><strong>{value?.toLocaleString('zh-CN') ?? '—'}</strong></div></article>;
}
