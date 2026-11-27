'use client';
import { usePathname } from 'next/navigation';
import { Header, Footer } from './ui';
import FloatingContact from './FloatingContact';
import AnalyticsTracker from './AnalyticsTracker';

export default function SiteFrame({ children, categoryNames }: { children: React.ReactNode; categoryNames: string[] }) {
  const admin = usePathname().startsWith('/admin');
  if (admin) return children;
  return <><AnalyticsTracker /><Header categoryNames={categoryNames} />{children}<Footer categoryNames={categoryNames} /><FloatingContact /></>;
}
