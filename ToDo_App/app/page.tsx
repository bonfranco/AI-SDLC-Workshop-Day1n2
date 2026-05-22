'use client';

import Link from 'next/link';
import { ChangeEvent, FormEvent, useCallback, useEffect, useMemo, useState } from 'react';

type Priority = 'high' | 'medium' | 'low';

type Todo = {
  id: number;
  title: string;
  completed: boolean;
  priority: Priority;
  due_date: string | null;
  created_at: string;
  tags: Tag[];
};

type Tag = {
  id: number;
  name: string;
  color: string;
};

const priorityClass: Record<Priority, string> = {
  high: 'bg-red-100 text-red-800',
  medium: 'bg-amber-100 text-amber-800',
  low: 'bg-blue-100 text-blue-800',
};

function formatDueDate(value: string | null): string {
  if (!value) {
    return 'No due date';
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return 'Invalid due date';
  }

  return new Intl.DateTimeFormat('en-SG', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Singapore',
  }).format(parsed);
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [tagFilter, setTagFilter] = useState<string>('all');
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('#3B82F6');
  const [isSaving, setIsSaving] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const filteredTodos = useMemo(() => {
    if (tagFilter === 'all') {
      return todos;
    }
    const selectedId = Number(tagFilter);
    return todos.filter((todo) => todo.tags.some((tag) => tag.id === selectedId));
  }, [tagFilter, todos]);

  const pendingTodos = useMemo(() => filteredTodos.filter((todo) => !todo.completed), [filteredTodos]);
  const completedTodos = useMemo(() => filteredTodos.filter((todo) => todo.completed), [filteredTodos]);

  const ensureSession = useCallback(async () => {
    const response = await fetch('/api/auth/dev-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
      throw new Error('Unable to establish session.');
    }
  }, []);

  const loadTodos = useCallback(async (): Promise<Todo[]> => {
    const response = await fetch('/api/todos', { cache: 'no-store' });
    if (!response.ok) {
      throw new Error('Unable to load todos.');
    }
    const payload = (await response.json()) as { data: Todo[] };
    return payload.data ?? [];
  }, []);

  const loadTags = useCallback(async (): Promise<Tag[]> => {
    const response = await fetch('/api/tags', { cache: 'no-store' });
    if (!response.ok) {
      throw new Error('Unable to load tags.');
    }
    const payload = (await response.json()) as { data: Tag[] };
    return payload.data ?? [];
  }, []);

  const refreshTodos = useCallback(async () => {
    const data = await loadTodos();
    setTodos(data);
  }, [loadTodos]);

  const refreshAll = useCallback(async () => {
    const [todoData, tagData] = await Promise.all([loadTodos(), loadTags()]);
    setTodos(todoData);
    setTags(tagData);
  }, [loadTags, loadTodos]);

  useEffect(() => {
    let isMounted = true;
    void Promise.all([loadTodos(), loadTags()])
      .then(([todoData, tagData]) => {
        if (isMounted) {
          setTodos(todoData);
          setTags(tagData);
        }
      })
      .catch(async () => {
        if (process.env.NODE_ENV !== 'development') {
          if (isMounted) {
            setErrorMessage('Failed to load todos.');
          }
          return;
        }

        try {
          await ensureSession();
          const [todoData, tagData] = await Promise.all([loadTodos(), loadTags()]);
          if (isMounted) {
            setTodos(todoData);
            setTags(tagData);
          }
          return;
        } catch {
          // Fallback to generic error below.
        }

        if (isMounted) {
          setErrorMessage('Failed to load todos.');
        }
      });

    return () => {
      isMounted = false;
    };
  }, [ensureSession, loadTags, loadTodos]);

  async function handleCreateTodo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage('');

    if (!title.trim()) {
      setErrorMessage('Title is required.');
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          priority,
          due_date: dueDate || null,
          tag_ids: selectedTagIds,
        }),
      });

      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };
        throw new Error(payload.error ?? 'Unable to create todo');
      }

      setTitle('');
      setPriority('medium');
      setDueDate('');
      setSelectedTagIds([]);
      await refreshTodos();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to create todo';
      setErrorMessage(message);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleToggle(todo: Todo) {
    setErrorMessage('');
    const response = await fetch(`/api/todos/${todo.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !todo.completed }),
    });

    if (!response.ok) {
      const payload = (await response.json()) as { error?: string };
      setErrorMessage(payload.error ?? 'Unable to update todo.');
      return;
    }

    await refreshTodos();
  }

  async function handleDelete(id: number) {
    setErrorMessage('');
    const response = await fetch(`/api/todos/${id}`, { method: 'DELETE' });
    if (!response.ok) {
      const payload = (await response.json()) as { error?: string };
      setErrorMessage(payload.error ?? 'Unable to delete todo.');
      return;
    }

    await refreshTodos();
  }

  async function handleCreateTag() {
    setErrorMessage('');
    const name = newTagName.trim();
    if (!name) {
      setErrorMessage('Tag name is required.');
      return;
    }

    const response = await fetch('/api/tags', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, color: newTagColor }),
    });

    if (!response.ok) {
      const payload = (await response.json()) as { error?: string };
      setErrorMessage(payload.error ?? 'Unable to create tag.');
      return;
    }

    setNewTagName('');
    setNewTagColor('#3B82F6');
    await refreshAll();
  }

  async function handleDeleteTag(id: number) {
    setErrorMessage('');
    const response = await fetch(`/api/tags/${id}`, { method: 'DELETE' });
    if (!response.ok) {
      const payload = (await response.json()) as { error?: string };
      setErrorMessage(payload.error ?? 'Unable to delete tag.');
      return;
    }

    setSelectedTagIds((prev) => prev.filter((tagId) => tagId !== id));
    if (tagFilter === String(id)) {
      setTagFilter('all');
    }
    await refreshAll();
  }

  function toggleCreateTagSelection(tagId: number) {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((existing) => existing !== tagId) : [...prev, tagId]
    );
  }

  async function handleExport(format: 'json' | 'csv') {
    setErrorMessage('');
    const response = await fetch(`/api/todos/export?format=${format}`);
    if (!response.ok) {
      const payload = (await response.json()) as { error?: string };
      setErrorMessage(payload.error ?? 'Unable to export todos.');
      return;
    }

    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = objectUrl;
    anchor.download = `todos.${format}`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(objectUrl);
  }

  async function handleImport(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setErrorMessage('');
    setIsImporting(true);
    try {
      const text = await file.text();
      let parsed: unknown;
      try {
        parsed = JSON.parse(text) as unknown;
      } catch {
        throw new Error('Invalid JSON file.');
      }

      const response = await fetch('/api/todos/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed),
      });

      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };
        throw new Error(payload.error ?? 'Unable to import todos.');
      }

      await refreshTodos();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to import todos.';
      setErrorMessage(message);
    } finally {
      event.target.value = '';
      setIsImporting(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 text-slate-900">
      <section className="mx-auto max-w-3xl space-y-6 rounded-2xl bg-white p-6 shadow-sm">
        <header className="space-y-3">
          <h1 className="text-3xl font-bold">Todo App</h1>
          <p className="text-sm text-slate-500">SQLite-backed scaffold with Singapore-time due dates.</p>
          <div className="flex flex-wrap gap-2">
            <button
              className="rounded-md border border-slate-300 bg-white px-3 py-1 text-sm"
              onClick={() => handleExport('json')}
              type="button"
            >
              Export JSON
            </button>
            <button
              className="rounded-md border border-slate-300 bg-white px-3 py-1 text-sm"
              onClick={() => handleExport('csv')}
              type="button"
            >
              Export CSV
            </button>
            <label className="rounded-md border border-slate-300 bg-white px-3 py-1 text-sm cursor-pointer">
              {isImporting ? 'Importing...' : 'Import JSON'}
              <input
                accept="application/json"
                className="hidden"
                disabled={isImporting}
                onChange={handleImport}
                type="file"
              />
            </label>
            <Link className="rounded-md border border-slate-300 bg-white px-3 py-1 text-sm" href="/calendar">
              Calendar
            </Link>
            <select
              className="rounded-md border border-slate-300 bg-white px-3 py-1 text-sm"
              onChange={(event) => setTagFilter(event.target.value)}
              value={tagFilter}
            >
              <option value="all">All Tags</option>
              {tags.map((tag) => (
                <option key={tag.id} value={String(tag.id)}>
                  {tag.name}
                </option>
              ))}
            </select>
          </div>
        </header>

        <section className="space-y-2 rounded-lg border border-slate-200 p-3">
          <h2 className="text-sm font-semibold text-slate-700">Tag Manager</h2>
          <div className="flex flex-wrap items-center gap-2">
            <input
              className="rounded-md border border-slate-300 px-3 py-1.5 text-sm"
              onChange={(event) => setNewTagName(event.target.value)}
              placeholder="Tag name"
              value={newTagName}
            />
            <input
              className="h-9 w-12 rounded border border-slate-300"
              onChange={(event) => setNewTagColor(event.target.value)}
              type="color"
              value={newTagColor}
            />
            <button
              className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm"
              onClick={handleCreateTag}
              type="button"
            >
              Add Tag
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <div className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-2 py-0.5" key={tag.id}>
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: tag.color }} />
                <span className="text-xs">{tag.name}</span>
                <button
                  className="text-xs text-red-600"
                  onClick={() => handleDeleteTag(tag.id)}
                  type="button"
                >
                  x
                </button>
              </div>
            ))}
          </div>
        </section>

        <form className="grid gap-3 md:grid-cols-[1fr_120px_220px_auto]" onSubmit={handleCreateTodo}>
          <input
            className="rounded-lg border border-slate-300 px-3 py-2"
            placeholder="What needs to be done?"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />

          <select
            className="rounded-lg border border-slate-300 px-3 py-2"
            value={priority}
            onChange={(event) => setPriority(event.target.value as Priority)}
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <input
            className="rounded-lg border border-slate-300 px-3 py-2"
            type="datetime-local"
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
          />

          <button
            className="rounded-lg bg-slate-900 px-4 py-2 font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-400"
            disabled={isSaving}
            type="submit"
          >
            {isSaving ? 'Adding...' : 'Add'}
          </button>
        </form>

        {tags.length > 0 ? (
          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-slate-700">Assign Tags To New Todo</h2>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => {
                const selected = selectedTagIds.includes(tag.id);
                return (
                  <button
                    className={`rounded-full border px-2 py-1 text-xs ${selected ? 'border-slate-800 bg-slate-800 text-white' : 'border-slate-300 bg-white text-slate-700'}`}
                    key={tag.id}
                    onClick={() => toggleCreateTagSelection(tag.id)}
                    type="button"
                  >
                    <span className="mr-1 inline-block h-2 w-2 rounded-full" style={{ backgroundColor: tag.color }} />
                    {tag.name}
                  </button>
                );
              })}
            </div>
          </section>
        ) : null}

        {errorMessage ? <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{errorMessage}</p> : null}

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Pending ({pendingTodos.length})</h2>
          {pendingTodos.length === 0 ? (
            <p className="text-sm text-slate-500">No pending todos yet.</p>
          ) : (
            pendingTodos.map((todo) => (
              <article key={todo.id} className="flex items-start justify-between rounded-lg border border-slate-200 p-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <input
                      aria-label={`mark ${todo.title} completed`}
                      checked={todo.completed}
                      onChange={() => handleToggle(todo)}
                      type="checkbox"
                    />
                    <span>{todo.title}</span>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${priorityClass[todo.priority]}`}>
                      {todo.priority}
                    </span>
                    {todo.tags.map((tag) => (
                      <span
                        className="rounded-full px-2 py-0.5 text-xs font-medium text-white"
                        key={tag.id}
                        style={{ backgroundColor: tag.color }}
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-slate-500">Due: {formatDueDate(todo.due_date)}</p>
                </div>
                <button
                  className="rounded-md bg-red-50 px-3 py-1 text-sm font-medium text-red-700"
                  onClick={() => handleDelete(todo.id)}
                  type="button"
                >
                  Delete
                </button>
              </article>
            ))
          )}
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Completed ({completedTodos.length})</h2>
          {completedTodos.length === 0 ? (
            <p className="text-sm text-slate-500">No completed todos yet.</p>
          ) : (
            completedTodos.map((todo) => (
              <article key={todo.id} className="flex items-start justify-between rounded-lg border border-slate-200 p-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <input
                      aria-label={`mark ${todo.title} incomplete`}
                      checked={todo.completed}
                      onChange={() => handleToggle(todo)}
                      type="checkbox"
                    />
                    <span className="text-slate-500 line-through">{todo.title}</span>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${priorityClass[todo.priority]}`}>
                      {todo.priority}
                    </span>
                    {todo.tags.map((tag) => (
                      <span
                        className="rounded-full px-2 py-0.5 text-xs font-medium text-white"
                        key={tag.id}
                        style={{ backgroundColor: tag.color }}
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-slate-500">Due: {formatDueDate(todo.due_date)}</p>
                </div>
                <button
                  className="rounded-md bg-red-50 px-3 py-1 text-sm font-medium text-red-700"
                  onClick={() => handleDelete(todo.id)}
                  type="button"
                >
                  Delete
                </button>
              </article>
            ))
          )}
        </section>
      </section>
    </main>
  );
}
