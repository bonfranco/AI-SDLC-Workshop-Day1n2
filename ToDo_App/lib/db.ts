import Database from 'better-sqlite3';
import path from 'node:path';
import { getSingaporeNow } from '@/lib/timezone';

export type Priority = 'high' | 'medium' | 'low';
export type RecurrencePattern = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  priority: Priority;
  due_date: string | null;
  is_recurring: boolean;
  recurrence_pattern: RecurrencePattern | null;
  reminder_minutes: number | null;
  created_at: string;
  updated_at: string;
  tags: Tag[];
}

export interface Tag {
  id: number;
  name: string;
  color: string;
  created_at: string;
  updated_at: string;
}

export interface CreateTodoInput {
  title: string;
  priority: Priority;
  due_date?: string | null;
  tag_ids?: number[];
}

export interface UpdateTodoInput {
  title?: string;
  priority?: Priority;
  due_date?: string | null;
  completed?: boolean;
  tag_ids?: number[];
}

export interface ImportTodoInput {
  title: string;
  completed: boolean;
  priority: Priority;
  due_date: string | null;
  created_at?: string;
  updated_at?: string;
}

type TodoRow = {
  id: number;
  user_id: number;
  title: string;
  completed: number;
  priority: Priority;
  due_date: string | null;
  is_recurring: number;
  recurrence_pattern: RecurrencePattern | null;
  reminder_minutes: number | null;
  created_at: string;
  updated_at: string;
};

type TagRow = {
  id: number;
  user_id: number;
  name: string;
  color: string;
  created_at: string;
  updated_at: string;
};

declare global {
  var __todoDb: Database.Database | undefined;
}

function getDb(): Database.Database {
  if (!global.__todoDb) {
    const dbPath = path.join(process.cwd(), 'todos.db');
    global.__todoDb = new Database(dbPath);
    global.__todoDb.pragma('journal_mode = WAL');
    global.__todoDb.pragma('foreign_keys = ON');
    global.__todoDb.exec(`
      CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL DEFAULT 1,
        title TEXT NOT NULL,
        completed INTEGER NOT NULL DEFAULT 0,
        priority TEXT NOT NULL DEFAULT 'medium',
        due_date TEXT,
        is_recurring INTEGER NOT NULL DEFAULT 0,
        recurrence_pattern TEXT,
        reminder_minutes INTEGER,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
    `);

    const columns = global.__todoDb
      .prepare('PRAGMA table_info(todos)')
      .all() as Array<{ name: string }>;
    const hasUserId = columns.some((column) => column.name === 'user_id');

    if (!hasUserId) {
      global.__todoDb.exec('ALTER TABLE todos ADD COLUMN user_id INTEGER NOT NULL DEFAULT 1;');
    }

    global.__todoDb.exec(`
      CREATE INDEX IF NOT EXISTS idx_todos_completed ON todos(completed);
      CREATE INDEX IF NOT EXISTS idx_todos_due_date ON todos(due_date);
      CREATE INDEX IF NOT EXISTS idx_todos_priority ON todos(priority);
      CREATE INDEX IF NOT EXISTS idx_todos_user_id ON todos(user_id);

      CREATE TABLE IF NOT EXISTS tags (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        color TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        UNIQUE(user_id, name)
      );

      CREATE TABLE IF NOT EXISTS todo_tags (
        todo_id INTEGER NOT NULL,
        tag_id INTEGER NOT NULL,
        PRIMARY KEY(todo_id, tag_id),
        FOREIGN KEY(todo_id) REFERENCES todos(id) ON DELETE CASCADE,
        FOREIGN KEY(tag_id) REFERENCES tags(id) ON DELETE CASCADE
      );

      CREATE INDEX IF NOT EXISTS idx_tags_user_id ON tags(user_id);
      CREATE INDEX IF NOT EXISTS idx_todo_tags_tag_id ON todo_tags(tag_id);
      CREATE INDEX IF NOT EXISTS idx_todo_tags_todo_id ON todo_tags(todo_id);
    `);
  }

  return global.__todoDb;
}

function toTodo(row: TodoRow): Todo {
  return {
    id: row.id,
    title: row.title,
    completed: Boolean(row.completed),
    priority: row.priority,
    due_date: row.due_date,
    is_recurring: Boolean(row.is_recurring),
    recurrence_pattern: row.recurrence_pattern,
    reminder_minutes: row.reminder_minutes,
    created_at: row.created_at,
    updated_at: row.updated_at,
    tags: [],
  };
}

function toTag(row: TagRow): Tag {
  return {
    id: row.id,
    name: row.name,
    color: row.color,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

function getValidTagIdsForUser(userId: number, ids: number[]): number[] {
  if (ids.length === 0) {
    return [];
  }

  const deduped = [...new Set(ids.filter((id) => Number.isInteger(id) && id > 0))];
  if (deduped.length === 0) {
    return [];
  }

  const placeholders = deduped.map(() => '?').join(',');
  const rows = db
    .prepare(`SELECT id FROM tags WHERE user_id = ? AND id IN (${placeholders})`)
    .all(userId, ...deduped) as Array<{ id: number }>;

  return rows.map((row) => row.id);
}

function attachTagsToTodos(todos: Todo[], userId: number): Todo[] {
  if (todos.length === 0) {
    return [];
  }

  const todoIds = todos.map((todo) => todo.id);
  const placeholders = todoIds.map(() => '?').join(',');
  const rows = db
    .prepare(
      `SELECT tt.todo_id, t.id, t.name, t.color, t.created_at, t.updated_at
       FROM todo_tags tt
       JOIN tags t ON t.id = tt.tag_id
       WHERE t.user_id = ? AND tt.todo_id IN (${placeholders})
       ORDER BY t.name ASC`
    )
    .all(userId, ...todoIds) as Array<
    TagRow & {
      todo_id: number;
    }
  >;

  const grouped = new Map<number, Tag[]>();
  for (const row of rows) {
    const existing = grouped.get(row.todo_id) ?? [];
    grouped.set(row.todo_id, [...existing, toTag(row)]);
  }

  return todos.map((todo) => ({
    ...todo,
    tags: grouped.get(todo.id) ?? [],
  }));
}

const db = getDb();

export const todoDB = {
  list(userId: number): Todo[] {
    const rows = db
      .prepare(
        `SELECT * FROM todos
         WHERE user_id = ?
         ORDER BY completed ASC, CASE priority WHEN 'high' THEN 1 WHEN 'medium' THEN 2 ELSE 3 END ASC, due_date ASC, id DESC`
      )
      .all(userId) as TodoRow[];

    return attachTagsToTodos(rows.map(toTodo), userId);
  },

  getById(id: number, userId: number): Todo | null {
    const row = db
      .prepare('SELECT * FROM todos WHERE id = ? AND user_id = ?')
      .get(id, userId) as TodoRow | undefined;
    if (!row) {
      return null;
    }

    return attachTagsToTodos([toTodo(row)], userId)[0] ?? null;
  },

  create(input: CreateTodoInput, userId: number): Todo {
    const nowIso = getSingaporeNow().toISOString();
    const result = db
      .prepare(
        `INSERT INTO todos (user_id, title, completed, priority, due_date, is_recurring, recurrence_pattern, reminder_minutes, created_at, updated_at)
         VALUES (?, ?, 0, ?, ?, 0, NULL, NULL, ?, ?)`
      )
      .run(userId, input.title, input.priority, input.due_date ?? null, nowIso, nowIso);

    const todoId = Number(result.lastInsertRowid);
    const validTagIds = getValidTagIdsForUser(userId, input.tag_ids ?? []);
    if (validTagIds.length > 0) {
      const insertTodoTag = db.prepare('INSERT OR IGNORE INTO todo_tags (todo_id, tag_id) VALUES (?, ?)');
      for (const tagId of validTagIds) {
        insertTodoTag.run(todoId, tagId);
      }
    }

    return this.getById(todoId, userId) as Todo;
  },

  update(id: number, input: UpdateTodoInput, userId: number): Todo | null {
    const existing = this.getById(id, userId);
    if (!existing) {
      return null;
    }

    const updated: Todo = {
      ...existing,
      title: input.title ?? existing.title,
      priority: input.priority ?? existing.priority,
      due_date: input.due_date !== undefined ? input.due_date : existing.due_date,
      completed: input.completed ?? existing.completed,
      updated_at: getSingaporeNow().toISOString(),
    };

    const runUpdate = db.transaction(() => {
      db.prepare(
        `UPDATE todos
         SET title = ?, completed = ?, priority = ?, due_date = ?, updated_at = ?
         WHERE id = ? AND user_id = ?`
      ).run(
        updated.title,
        Number(updated.completed),
        updated.priority,
        updated.due_date,
        updated.updated_at,
        id,
        userId
      );

      if (input.tag_ids !== undefined) {
        db.prepare('DELETE FROM todo_tags WHERE todo_id = ?').run(id);
        const validTagIds = getValidTagIdsForUser(userId, input.tag_ids);
        const insertTodoTag = db.prepare('INSERT OR IGNORE INTO todo_tags (todo_id, tag_id) VALUES (?, ?)');
        for (const tagId of validTagIds) {
          insertTodoTag.run(id, tagId);
        }
      }
    });

    runUpdate();

    return this.getById(id, userId);
  },

  delete(id: number, userId: number): boolean {
    const result = db.prepare('DELETE FROM todos WHERE id = ? AND user_id = ?').run(id, userId);
    return result.changes > 0;
  },

  importMany(inputs: ImportTodoInput[], userId: number): number {
    const insertStmt = db.prepare(
      `INSERT INTO todos (user_id, title, completed, priority, due_date, is_recurring, recurrence_pattern, reminder_minutes, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, 0, NULL, NULL, ?, ?)`
    );

    const runImport = db.transaction((rows: ImportTodoInput[]) => {
      let inserted = 0;
      for (const row of rows) {
        const nowIso = getSingaporeNow().toISOString();
        const createdAt = row.created_at ?? nowIso;
        const updatedAt = row.updated_at ?? createdAt;
        insertStmt.run(
          userId,
          row.title,
          Number(row.completed),
          row.priority,
          row.due_date,
          createdAt,
          updatedAt
        );
        inserted += 1;
      }
      return inserted;
    });

    return runImport(inputs);
  },
};

export const tagDB = {
  list(userId: number): Tag[] {
    const rows = db
      .prepare('SELECT * FROM tags WHERE user_id = ? ORDER BY name ASC')
      .all(userId) as TagRow[];
    return rows.map(toTag);
  },

  create(name: string, color: string, userId: number): Tag {
    const nowIso = getSingaporeNow().toISOString();
    const result = db
      .prepare(
        `INSERT INTO tags (user_id, name, color, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?)`
      )
      .run(userId, name, color, nowIso, nowIso);

    const row = db
      .prepare('SELECT * FROM tags WHERE id = ? AND user_id = ?')
      .get(Number(result.lastInsertRowid), userId) as TagRow | undefined;

    return toTag(row as TagRow);
  },

  delete(id: number, userId: number): boolean {
    const result = db.prepare('DELETE FROM tags WHERE id = ? AND user_id = ?').run(id, userId);
    return result.changes > 0;
  },
};
