// Forecast input freshness and run schedule. Display-only: not hashed into the run ID.

/** Inputs older than this many days get an amber "stale" badge in the header. */
export const STALE_AFTER_DAYS = 3;

/**
 * Next scheduled forecast run (YYYY-MM-DD). null = not yet scheduled, so no date is shown.
 * Set this when the run calendar is fixed; never guess a date.
 */
export const NEXT_RUN: string | null = null;

/** Whole days between an as-of date (YYYY-MM-DD, ET) and now. */
export function daysSince(asOf: string, now: number = Date.now()): number {
  return Math.max(0, Math.floor((now - new Date(`${asOf}T00:00:00-04:00`).getTime()) / 86_400_000));
}
