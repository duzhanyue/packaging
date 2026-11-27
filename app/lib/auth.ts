import 'server-only';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';

const COOKIE = 'xiechu_admin_session';
function secret() {
  const value = process.env.ADMIN_SESSION_SECRET;
  if (!value || value.length < 32) throw new Error('ADMIN_SESSION_SECRET must contain at least 32 characters');
  return value;
}
function sign(value: string) { return createHmac('sha256', secret()).update(value).digest('base64url'); }
export function verifyPassword(username: string, password: string) {
  const expectedUser = process.env.ADMIN_USERNAME;
  const expectedPassword = process.env.ADMIN_PASSWORD;
  if (!expectedUser || !expectedPassword) return false;
  const safeEqual = (a: string, b: string) => {
    const left = Buffer.from(a); const right = Buffer.from(b);
    return left.length === right.length && timingSafeEqual(left, right);
  };
  return safeEqual(username, expectedUser) && safeEqual(password, expectedPassword);
}
export function createSession() {
  const payload = Buffer.from(`${process.env.ADMIN_USERNAME}:${Date.now() + 7 * 24 * 60 * 60 * 1000}`).toString('base64url');
  return `${payload}.${sign(payload)}`;
}
export function isValidSession(token?: string) {
  if (!token) return false;
  const [payload, signature, extra] = token.split('.');
  if (!payload || !signature || extra) return false;
  let expected: string;
  try { expected = sign(payload); } catch { return false; }
  const a = Buffer.from(signature); const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
  try {
    const [username, expires] = Buffer.from(payload, 'base64url').toString().split(':');
    return username === process.env.ADMIN_USERNAME && Number(expires) > Date.now();
  } catch { return false; }
}
export async function isAdmin() {
  return isValidSession((await cookies()).get(COOKIE)?.value);
}
export const adminCookie = COOKIE;
