const SINGAPORE_TIMEZONE = 'Asia/Singapore';

export function getSingaporeNow(): Date {
  return new Date();
}

export function formatSingaporeDate(input: Date | string): string {
  const date = typeof input === 'string' ? new Date(input) : input;
  return new Intl.DateTimeFormat('en-SG', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: SINGAPORE_TIMEZONE,
  }).format(date);
}

export function normalizeSingaporeDueDate(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) {
    return null;
  }

  // datetime-local input has no timezone. Treat it as Singapore local time.
  const localMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/);
  if (localMatch) {
    const [, year, month, day, hour, minute] = localMatch;
    const candidate = `${year}-${month}-${day}T${hour}:${minute}:00+08:00`;
    const parsed = new Date(candidate);
    if (Number.isNaN(parsed.getTime())) {
      return null;
    }

    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Singapore',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).formatToParts(parsed);

    const map = Object.fromEntries(
      parts
        .filter((part) => part.type !== 'literal')
        .map((part) => [part.type, part.value])
    ) as Record<string, string>;

    if (
      map.year !== year ||
      map.month !== month ||
      map.day !== day ||
      map.hour !== hour ||
      map.minute !== minute
    ) {
      return null;
    }

    return candidate;
  }

  // ISO date-time with explicit timezone.
  if (
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?(?:Z|[+-]\d{2}:\d{2})$/.test(trimmed)
  ) {
    const parsed = new Date(trimmed);
    if (Number.isNaN(parsed.getTime())) {
      return null;
    }

    return parsed.toISOString();
  }

  return null;
}

export const APP_TIMEZONE = SINGAPORE_TIMEZONE;
