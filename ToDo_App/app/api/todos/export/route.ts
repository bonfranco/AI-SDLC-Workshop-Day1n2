import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { todoDB } from '@/lib/db';
import { getSingaporeNow } from '@/lib/timezone';

export const runtime = 'nodejs';

function escapeCsv(value: string | number | boolean | null): string {
  if (value === null) {
    return '';
  }
  let asString = String(value);
  if (/^[=+\-@]/.test(asString)) {
    asString = `'${asString}`;
  }
  const escaped = asString.replaceAll('"', '""');
  return `"${escaped}"`;
}

function getSingaporeDatePart(): string {
  const now = getSingaporeNow();
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Singapore',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now);
  const map = Object.fromEntries(
    parts.filter((part) => part.type !== 'literal').map((part) => [part.type, part.value])
  ) as Record<string, string>;
  return `${map.year}-${map.month}-${map.day}`;
}

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const url = new URL(request.url);
  const format = url.searchParams.get('format')?.toLowerCase() ?? 'json';
  const todos = todoDB.list(session.userId);
  const datePart = getSingaporeDatePart();

  if (format === 'csv') {
    const headers = [
      'id',
      'title',
      'completed',
      'priority',
      'due_date',
      'created_at',
      'updated_at',
    ];
    const rows = todos.map((todo) =>
      [
        escapeCsv(todo.id),
        escapeCsv(todo.title),
        escapeCsv(todo.completed),
        escapeCsv(todo.priority),
        escapeCsv(todo.due_date),
        escapeCsv(todo.created_at),
        escapeCsv(todo.updated_at),
      ].join(',')
    );
    const csvBody = `${headers.join(',')}\n${rows.join('\n')}`;

    return new NextResponse(csvBody, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="todos-${datePart}.csv"`,
      },
    });
  }

  if (format !== 'json') {
    return NextResponse.json({ error: 'Unsupported format' }, { status: 400 });
  }

  return new NextResponse(JSON.stringify(todos, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Disposition': `attachment; filename="todos-${datePart}.json"`,
    },
  });
}
