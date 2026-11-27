'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

type AnalyticsEvent = { kind: 'page_view' | 'click'; path: string; visitorId: string; referrer?: string; target?: string };

function getVisitorId() {
  try {
    const key = 'xiechu_analytics_visitor';
    let id = localStorage.getItem(key);
    if (!id) {
      id = globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;
      localStorage.setItem(key, id);
    }
    return id;
  } catch {
    return `${Date.now()}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;
  }
}

function send(event: AnalyticsEvent) {
  const payload = JSON.stringify(event);
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/analytics', new Blob([payload], { type: 'application/json' }));
    return;
  }
  void fetch('/api/analytics', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: payload, keepalive: true }).catch(() => undefined);
}

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const currentPath = useRef(pathname);
  const lastPageView = useRef('');
  const hasTrackedInitialReferrer = useRef(false);

  currentPath.current = pathname;

  useEffect(() => {
    if (!pathname || pathname.startsWith('/admin') || lastPageView.current === pathname) return;
    lastPageView.current = pathname;
    const referrer = !hasTrackedInitialReferrer.current && typeof document !== 'undefined' ? document.referrer : '';
    hasTrackedInitialReferrer.current = true;
    send({ kind: 'page_view', path: pathname, visitorId: getVisitorId(), referrer });
  }, [pathname]);

  useEffect(() => {
    function trackClick(event: MouseEvent) {
      const clicked = event.target instanceof Element ? event.target.closest<HTMLElement>('a,button,[role="button"],[data-analytics]') : null;
      if (!clicked || clicked.closest('[data-no-analytics]')) return;
      const anchor = clicked instanceof HTMLAnchorElement ? clicked : clicked.closest('a');
      let target = clicked.dataset.analytics || clicked.getAttribute('aria-label') || '';
      if (anchor?.href) {
        try {
          const url = new URL(anchor.href, window.location.href);
          target = url.origin === window.location.origin ? url.pathname : url.hostname;
        } catch { /* Fall back to the visible label. */ }
      }
      target = (target || clicked.textContent || clicked.tagName).replace(/\s+/g, ' ').trim().slice(0, 100);
      if (target) send({ kind: 'click', path: currentPath.current || '/', visitorId: getVisitorId(), target });
    }
    document.addEventListener('click', trackClick, true);
    return () => document.removeEventListener('click', trackClick, true);
  }, []);

  return null;
}
