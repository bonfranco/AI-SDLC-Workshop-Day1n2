import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { tagDB } from '@/lib/db';

export const runtime = 'nodejs';

const HEX_COLOR_REGEX = /^#[0-9A-Fa-f]{6}$/;
const MAX_TAG_NAME_LENGTH = 40;

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  return NextResponse.json({ data: tagDB.list(session.userId) });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  let body: { name?: unknown; color?: unknown };
  try {
    body = (await request.json()) as { name?: unknown; color?: unknown };
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (typeof body.name !== 'string') {
    return NextResponse.json({ error: 'name is required' }, { status: 400 });
  }

  const name = body.name.trim();
  if (!name) {
    return NextResponse.json({ error: 'name is required' }, { status: 400 });
  }
  if (name.length > MAX_TAG_NAME_LENGTH) {
    return NextResponse.json(
      { error: `name must be ${MAX_TAG_NAME_LENGTH} characters or fewer` },
      { status: 400 }
    );
  }

  const color = typeof body.color === 'string' ? body.color.trim() : '#3B82F6';
  if (!HEX_COLOR_REGEX.test(color)) {
    return NextResponse.json({ error: 'color must be a hex value like #3B82F6' }, { status: 400 });
  }

  try {
    const created = tagDB.create(name, color, session.userId);
    return NextResponse.json({ data: created }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Tag already exists or cannot be created' }, { status: 400 });
  }
}
