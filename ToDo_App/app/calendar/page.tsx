'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

type Priority = 'high' | 'medium' | 'low';

type Todo = {
  id: number;
  title: string;
  due_date: string | null;
  priority: Priority;
  completed: boolean;
};

type SingaporeDateParts = {
  year: string;
  month: string;
  day: string;
};

const priorityDotClass: Record<Priority, string> = {
  high: 'bg-red-500',
  medium: 'bg-amber-500',
  low: 'bg-blue-500',
};

function buildDayKey(year: number, monthOneBased: number, day: number): string {
  return `${year}-${String(monthOneBased).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function getSingaporeDateParts(date: Date): SingaporeDateParts {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Singapore',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);
  const map = Object.fromEntries(
    parts.filter((part) => part.type !== 'literal').map((part) => [part.type, part.value])
  ) as Record<string, string>;
  return {
    year: map.year,
    month: map.month,
    day: map.day,
  };
}

function toSingaporeDayKey(dueDate: string): string {
  const parsed = new Date(dueDate);
  const parts = getSingaporeDateParts(parsed);
  return `${parts.year}-${parts.month}-${parts.day}`;
}

export default function CalendarPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [monthCursor, setMonthCursor] = useState(() => {
    const nowSg = getSingaporeDateParts(new Date());
    return new Date(Number(nowSg.year), Number(nowSg.month) - 1, 1);
  });

  useEffect(() => {
    void fetch('/api/todos', { cache: 'no-store' })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error('Unable to load todos');
        }
        const payload = (await response.json()) as { data: Todo[] };
        setTodos(payload.data ?? []);
      })
      .catch(() => {
        setErrorMessage('Failed to load calendar todos.');
      });
  }, []);

  const todosByDay = useMemo(() => {
    const map = new Map<string, Todo[]>();
    for (const todo of todos) {
      if (!todo.due_date) {
        continue;
      }
      const key = toSingaporeDayKey(todo.due_date);
      const existing = map.get(key) ?? [];
      map.set(key, [...existing, todo]);
    }
    return map;
  }, [todos]);

  const monthName = useMemo(
    () =>
      new Intl.DateTimeFormat('en-SG', {
        month: 'long',
        year: 'numeric',
        timeZone: 'Asia/Singapore',
      }).format(monthCursor),
    [monthCursor]
  );

  const dayCells = useMemo(() => {
    const start = new Date(monthCursor.getFullYear(), monthCursor.getMonth(), 1);
    const end = new Date(monthCursor.getFullYear(), monthCursor.getMonth() + 1, 0);

    const leadingBlankCount = start.getDay();
    const cells: Array<{ type: 'blank' } | { type: 'day'; date: Date; key: string }> = [];

    for (let i = 0; i < leadingBlankCount; i += 1) {
      cells.push({ type: 'blank' });
    }

    const year = monthCursor.getFullYear();
    const monthOneBased = monthCursor.getMonth() + 1;
    for (let day = 1; day <= end.getDate(); day += 1) {
      const date = new Date(year, monthCursor.getMonth(), day);
      cells.push({ type: 'day', date, key: buildDayKey(year, monthOneBased, day) });
    }

    while (cells.length % 7 !== 0) {
      cells.push({ type: 'blank' });
    }

    return cells;
  }, [monthCursor]);

  function moveMonth(offset: number) {
    setMonthCursor((current) => new Date(current.getFullYear(), current.getMonth() + offset, 1));
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 text-slate-900">
      <section className="mx-auto max-w-5xl space-y-4 rounded-2xl bg-white p-6 shadow-sm">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold">Calendar</h1>
            <p className="text-sm text-slate-500">Todos by due date in Asia/Singapore timezone.</p>
          </div>
          <Link className="rounded-md border border-slate-300 bg-white px-3 py-1 text-sm" href="/">
            Back To List
          </Link>
        </header>

        <div className="flex items-center justify-between">
          <button
            className="rounded-md border border-slate-300 bg-white px-3 py-1 text-sm"
            onClick={() => moveMonth(-1)}
            type="button"
          >
            Previous
          </button>
          <h2 className="text-lg font-semibold">{monthName}</h2>
          <button
            className="rounded-md border border-slate-300 bg-white px-3 py-1 text-sm"
            onClick={() => moveMonth(1)}
            type="button"
          >
            Next
          </button>
        </div>

        {errorMessage ? <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{errorMessage}</p> : null}

        <div className="grid grid-cols-7 gap-2 text-center text-xs font-medium uppercase text-slate-500">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {dayCells.map((cell, index) => {
            if (cell.type === 'blank') {
              return <div className="min-h-28 rounded-lg border border-transparent" key={`blank-${index}`} />;
            }

            const dayTodos = todosByDay.get(cell.key) ?? [];
            return (
              <article className="min-h-28 rounded-lg border border-slate-200 p-2" key={cell.key}>
                <div className="mb-1 text-xs font-semibold text-slate-700">{cell.date.getDate()}</div>
                <div className="space-y-1">
                  {dayTodos.slice(0, 3).map((todo) => (
                    <div className="rounded bg-slate-50 px-1 py-0.5 text-xs" key={todo.id}>
                      <span
                        className={`mr-1 inline-block h-2 w-2 rounded-full ${priorityDotClass[todo.priority]}`}
                      />
                      <span className={todo.completed ? 'line-through text-slate-500' : ''}>{todo.title}</span>
                    </div>
                  ))}
                  {dayTodos.length > 3 ? <div className="text-xs text-slate-500">+{dayTodos.length - 3} more</div> : null}
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
