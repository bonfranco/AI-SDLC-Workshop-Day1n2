import { cookies } from 'next/headers';
import crypto from 'node:crypto';

export interface SessionUser {
  userId: number;
  username: string;
}

const SESSION_COOKIE_NAME = 'todo_session';
const sessionSecret = process.env.SESSION_SECRET;

if (!sessionSecret) {
  throw new Error('SESSION_SECRET is required. Add it to your environment configuration.');
}

const SESSION_SECRET: string = sessionSecret;

function createSignature(payload: string): string {
  return crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('hex');
}

export function createSessionToken(userId: number): string {
  const payload = String(userId);
  const signature = createSignature(payload);
  return `${payload}.${signature}`;
}

function verifySessionToken(token: string): number | null {
  const [payload, signature] = token.split('.');
  if (!payload || !signature) {
    return null;
  }

  const expected = createSignature(payload);
  const expectedBuffer = Buffer.from(expected);
  const providedBuffer = Buffer.from(signature);
  if (expectedBuffer.length !== providedBuffer.length) {
    return null;
  }

  const valid = crypto.timingSafeEqual(expectedBuffer, providedBuffer);
  if (!valid) {
    return null;
  }

  const userId = Number(payload);
  if (!Number.isInteger(userId) || userId <= 0) {
    return null;
  }

  return userId;
}

export function getSessionCookieName(): string {
  return SESSION_COOKIE_NAME;
}

// Minimal signed session helper. Replace with full auth when WebAuthn is implemented.
export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!sessionToken) {
    return null;
  }

  const userId = verifySessionToken(sessionToken);
  if (!userId) {
    return null;
  }

  return {
    userId,
    username: `user-${userId}`,
  };
}
