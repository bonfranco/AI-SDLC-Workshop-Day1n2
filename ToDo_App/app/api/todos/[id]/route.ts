import { NextResponse } from 'next/server';
import { type Priority, todoDB } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { normalizeSingaporeDueDate } from '@/lib/timezone';

export const runtime = 'nodejs';

const PRIORITY_SET = new Set<Priority>(['high', 'medium', 'low']);
const MAX_TITLE_LENGTH = 200;

function parseTodoId(rawId: string): number | null {
  const parsed = Number(rawId);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    return null;
  }

  return parsed;
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { id: idParam } = await params;
  const id = parseTodoId(idParam);

  if (!id) {
    return NextResponse.json({ error: 'Invalid todo id' }, { status: 400 });
  }

  let body: {
    title?: unknown;
    priority?: unknown;
    due_date?: unknown;
    completed?: unknown;
    tag_ids?: unknown;
  };

  try {
    body = (await request.json()) as {
      title?: unknown;
      priority?: unknown;
      due_date?: unknown;
      completed?: unknown;
      tag_ids?: unknown;
    };
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const updates: {
    title?: string;
    priority?: Priority;
    due_date?: string | null;
    completed?: boolean;
    tag_ids?: number[];
  } = {};

  if (body.title !== undefined) {
    if (typeof body.title !== 'string') {
      return NextResponse.json({ error: 'Title must be a string' }, { status: 400 });
    }

    const title = body.title.trim();
    if (!title) {
      return NextResponse.json({ error: 'Title cannot be empty' }, { status: 400 });
    }
    if (title.length > MAX_TITLE_LENGTH) {
      return NextResponse.json(
        { error: `Title must be ${MAX_TITLE_LENGTH} characters or fewer` },
        { status: 400 }
      );
    }
    updates.title = title;
  }

  if (body.priority !== undefined) {
    if (typeof body.priority !== 'string') {
      return NextResponse.json({ error: 'Priority must be a string' }, { status: 400 });
    }

    const priority = body.priority.toLowerCase() as Priority;
    if (!PRIORITY_SET.has(priority)) {
      return NextResponse.json({ error: 'Invalid priority' }, { status: 400 });
    }
    updates.priority = priority;
  }

  if (body.due_date !== undefined) {
    if (body.due_date !== null && typeof body.due_date !== 'string') {
      return NextResponse.json({ error: 'due_date must be a string or null' }, { status: 400 });
    }

    if (body.due_date === null) {
      updates.due_date = null;
    } else {
      const normalizedDueDate = normalizeSingaporeDueDate(body.due_date);
      if (!normalizedDueDate) {
        return NextResponse.json({ error: 'Invalid due_date value' }, { status: 400 });
      }

      updates.due_date = normalizedDueDate;
    }
  }

  if (body.completed !== undefined) {
    if (typeof body.completed !== 'boolean') {
      return NextResponse.json({ error: 'completed must be a boolean' }, { status: 400 });
    }

    updates.completed = body.completed;
  }

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

    updates.tag_ids = body.tag_ids;
  }

  const updated = todoDB.update(id, updates, session.userId);
  if (!updated) {
    return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
  }

  return NextResponse.json({ data: updated });
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
  const id = parseTodoId(idParam);

  if (!id) {
    return NextResponse.json({ error: 'Invalid todo id' }, { status: 400 });
  }

  const deleted = todoDB.delete(id, session.userId);
  if (!deleted) {
    return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
