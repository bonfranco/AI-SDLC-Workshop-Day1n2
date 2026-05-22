import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { tagDB } from '@/lib/db';

export const runtime = 'nodejs';

function parseTagId(rawId: string): number | null {
  const parsed = Number(rawId);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    return null;
  }
  return parsed;
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { id: idParam } = await params;
  const id = parseTagId(idParam);
  if (!id) {
    return NextResponse.json({ error: 'Invalid tag id' }, { status: 400 });
  }

  const deleted = tagDB.delete(id, session.userId);
  if (!deleted) {
    return NextResponse.json({ error: 'Tag not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
