import { isAdmin } from '../lib/auth';
import AdminPanel from './panel';
import './admin.css';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'XIECHU Admin' };

export default async function AdminPage() {
  return <main className="admin-shell"><AdminPanel authenticated={await isAdmin()} /></main>;
}
