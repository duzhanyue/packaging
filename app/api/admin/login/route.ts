import { createSession, verifyPassword, adminCookie } from '../../../lib/auth';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const data = await request.json().catch(() => ({}));
  if (!verifyPassword(String(data.username || ''), String(data.password || ''))) {
    return Response.json({ error: '用户名或密码错误。' }, { status: 401 });
  }
  const response = NextResponse.json({ ok: true });
  response.cookies.set(adminCookie, createSession(), { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/', maxAge: 7 * 24 * 60 * 60 });
  return response;
}
