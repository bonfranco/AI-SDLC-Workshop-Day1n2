import assert from 'node:assert/strict';
import test from 'node:test';
import { normalizeSingaporeDueDate } from '@/lib/timezone';

test('normalizeSingaporeDueDate converts datetime-local to +08:00 offset', () => {
  const actual = normalizeSingaporeDueDate('2026-05-22T09:30');
  assert.equal(actual, '2026-05-22T09:30:00+08:00');
});

test('normalizeSingaporeDueDate returns null for empty values', () => {
  const actual = normalizeSingaporeDueDate('   ');
  assert.equal(actual, null);
});

test('normalizeSingaporeDueDate returns null for invalid input', () => {
  const actual = normalizeSingaporeDueDate('not-a-date');
  assert.equal(actual, null);
});

test('normalizeSingaporeDueDate rejects ambiguous non-ISO date formats', () => {
  const actual = normalizeSingaporeDueDate('2026/05/22 09:30');
  assert.equal(actual, null);
});

test('normalizeSingaporeDueDate rejects impossible datetime-local values', () => {
  const invalidDay = normalizeSingaporeDueDate('2026-02-30T09:30');
  const invalidHour = normalizeSingaporeDueDate('2026-05-22T24:01');

  assert.equal(invalidDay, null);
  assert.equal(invalidHour, null);
});
