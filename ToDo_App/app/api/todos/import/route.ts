import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { type ImportTodoInput, type Priority, todoDB } from '@/lib/db';
import { normalizeSingaporeDueDate } from '@/lib/timezone';

export const runtime = 'nodejs';

const PRIORITY_SET = new Set<Priority>(['high', 'medium', 'low']);
const MAX_IMPORT_ITEMS = 2000;
const MAX_TITLE_LENGTH = 200;

function parseImportedTodo(item: unknown): ImportTodoInput | null {
  if (!item || typeof item !== 'object') {
    return null;
  }

  const candidate = item as {
    title?: unknown;
    completed?: unknown;
    priority?: unknown;
    due_date?: unknown;
    created_at?: unknown;
    updated_at?: unknown;
  };

  if (typeof candidate.title !== 'string') {
    return null;
  }
  const title = candidate.title.trim();
  if (!title || title.length > MAX_TITLE_LENGTH) {
    return null;
  }

  if (typeof candidate.completed !== 'boolean') {
    return null;
  }

  if (typeof candidate.priority !== 'string') {
    return null;
  }
  const priority = candidate.priority.toLowerCase() as Priority;
  if (!PRIORITY_SET.has(priority)) {
    return null;
  }

  let dueDate: string | null = null;
  if (candidate.due_date !== undefined && candidate.due_date !== null) {
    if (typeof candidate.due_date !== 'string') {
      return null;
    }
    const normalized = normalizeSingaporeDueDate(candidate.due_date);
    if (!normalized) {
      return null;
    }
    dueDate = normalized;
  }

  const createdAt =
    typeof candidate.created_at === 'string' && !Number.isNaN(new Date(candidate.created_at).getTime())
      ? new Date(candidate.created_at).toISOString()
      : undefined;
  const updatedAt =
    typeof candidate.updated_at === 'string' && !Number.isNaN(new Date(candidate.updated_at).getTime())
      ? new Date(candidate.updated_at).toISOString()
      : undefined;

  return {
    title,
    completed: candidate.completed,
    priority,
    due_date: dueDate,
    created_at: createdAt,
    updated_at: updatedAt,
  };
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  let payload: unknown;
  try {
    payload = (await request.json()) as unknown;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  let sourceItems: unknown[];
  if (Array.isArray(payload)) {
    sourceItems = payload;
  } else if (
    payload &&
    typeof payload === 'object' &&
    Array.isArray((payload as { data?: unknown[] }).data)
  ) {
    sourceItems = (payload as { data: unknown[] }).data;
  } else {
    return NextResponse.json({ error: 'Expected an array of todos or { data: [] }' }, { status: 400 });
  }

  if (sourceItems.length === 0) {
    return NextResponse.json({ error: 'No todos provided' }, { status: 400 });
  }

  if (sourceItems.length > MAX_IMPORT_ITEMS) {
    return NextResponse.json(
      { error: `Too many items. Maximum is ${MAX_IMPORT_ITEMS}.` },
      { status: 400 }
    );
  }

  const imported: ImportTodoInput[] = [];
  for (const item of sourceItems) {
    const parsed = parseImportedTodo(item);
    if (!parsed) {
      return NextResponse.json({ error: 'One or more todos have invalid fields' }, { status: 400 });
    }
    imported.push(parsed);
  }

  const inserted = todoDB.importMany(imported, session.userId);
  return NextResponse.json({ success: true, inserted });
}
