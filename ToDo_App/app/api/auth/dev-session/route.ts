import { randomInt } from 'node:crypto';
import { NextResponse } from 'next/server';
import { createSessionToken, getSessionCookieName } from '@/lib/auth';

export const runtime = 'nodejs';

export async function POST() {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not available' }, { status: 403 });
  }

  const userId = randomInt(1, 2147483647);
  const token = createSessionToken(userId);

  const response = NextResponse.json({ success: true });
  response.cookies.set(getSessionCookieName(), token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
