// Forecast input freshness and run schedule. Display-only: not hashed into the run ID.

import { ELECTION_DAY } from './live';

/** Inputs older than this many days get an amber "stale" badge in the header. */
export const STALE_AFTER_DAYS = 3;

/** Poll inputs are refreshed 3x/week — Monday, Wednesday, Friday (ET) — through Election Day. */
export const RUN_WEEKDAYS = [1, 3, 5]; // Mon, Wed, Fri
export const RUN_SCHEDULE_START = '2026-10-05';

const ymd = (d: Date) => d.toISOString().slice(0, 10);

/** Today's date in US Eastern time (YYYY-MM-DD). */
export function todayET(now: number = Date.now()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York' }).format(new Date(now));
}

/**
 * Next scheduled input refresh (YYYY-MM-DD), or null after the last pre-election run.
 * If today is a run day and the inputs are not yet from today, today's run is still due.
 */
export function nextRun(dataAsOf: string, now: number = Date.now()): string | null {
  const today = todayET(now);
  const d = new Date(`${today}T12:00:00Z`);
  const dow = d.getUTCDay();
  const isRunDay = RUN_WEEKDAYS.includes(dow);
  if (!(isRunDay && dataAsOf < today)) {
    let add = 1;
    while (!RUN_WEEKDAYS.includes((dow + add) % 7)) add++;
    d.setUTCDate(d.getUTCDate() + add);
  }
  const next = ymd(d) < RUN_SCHEDULE_START ? RUN_SCHEDULE_START : ymd(d);
  return next <= ELECTION_DAY ? next : null;
}

/** Whole days between an as-of date (YYYY-MM-DD, ET) and now. */
export function daysSince(asOf: string, now: number = Date.now()): number {
  return Math.max(0, Math.floor((now - new Date(`${asOf}T00:00:00-04:00`).getTime()) / 86_400_000));
}
