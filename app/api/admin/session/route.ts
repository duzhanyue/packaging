import { cookies } from 'next/headers';
import { adminCookie, isAdmin } from '../../../lib/auth';

export async function GET() { return Response.json({ authenticated: await isAdmin() }); }
export async function DELETE() { (await cookies()).delete(adminCookie); return Response.json({ ok: true }); }
