import { NextResponse } from 'next/server';
import { type Priority, todoDB } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { normalizeSingaporeDueDate } from '@/lib/timezone';

export const runtime = 'nodejs';

const PRIORITY_SET = new Set<Priority>(['high', 'medium', 'low']);
const MAX_TITLE_LENGTH = 200;

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const todos = todoDB.list(session.userId);
  return NextResponse.json({ data: todos });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  let body: {
    title?: string;
    priority?: unknown;
    due_date?: unknown;
    tag_ids?: unknown;
  };

  try {
    body = (await request.json()) as {
      title?: string;
      priority?: unknown;
      due_date?: unknown;
      tag_ids?: unknown;
    };
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (typeof body.title !== 'string') {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 });
  }

  const title = body.title?.trim();
  if (!title) {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 });
  }

  if (title.length > MAX_TITLE_LENGTH) {
    return NextResponse.json(
      { error: `Title must be ${MAX_TITLE_LENGTH} characters or fewer` },
      { status: 400 }
    );
  }

  if (body.priority !== undefined && typeof body.priority !== 'string') {
    return NextResponse.json({ error: 'Priority must be a string' }, { status: 400 });
  }

  const priority = (body.priority ?? 'medium').toLowerCase() as Priority;
  if (!PRIORITY_SET.has(priority)) {
    return NextResponse.json({ error: 'Invalid priority' }, { status: 400 });
  }

  let normalizedDueDate: string | null = null;
  if (body.due_date !== undefined) {
    if (body.due_date !== null && typeof body.due_date !== 'string') {
      return NextResponse.json({ error: 'due_date must be a string or null' }, { status: 400 });
    }

    if (typeof body.due_date === 'string') {
      normalizedDueDate = normalizeSingaporeDueDate(body.due_date);
      if (!normalizedDueDate) {
        return NextResponse.json({ error: 'Invalid due_date value' }, { status: 400 });
      }
    }
  }

  let tagIds: number[] = [];
  if (body.tag_ids !== undefined) {
    if (!Array.isArray(body.tag_ids)) {
      return NextResponse.json({ error: 'tag_ids must be an array of numbers' }, { status: 400 });
    }

    const hasInvalid = body.tag_ids.some(
      (item) => typeof item !== 'number' || !Number.isInteger(item) || item <= 0
    );
    if (hasInvalid) {
      return NextResponse.json({ error: 'tag_ids must contain positive integers only' }, { status: 400 });
    }

    tagIds = body.tag_ids;
  }

  const created = todoDB.create({
    title,
    priority,
    due_date: normalizedDueDate,
    tag_ids: tagIds,
  }, session.userId);

  return NextResponse.json({ data: created }, { status: 201 });
}
