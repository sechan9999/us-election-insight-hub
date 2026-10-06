// Election results tracker: schedule, sources and data contract.
//
// Operating window: the day before Election Day through one week after (ET).
// Results come from a JSON feed (LIVE_RESULTS_URL) produced by the results ingest job, which
// writes electoral_hub.us_results_live (see bigquery/us_schema.sql). Until the feed URL is set,
// the panel shows the schedule only and never displays results.
//
// Source policy (decided 2026-10-06, option c):
//   - Vote counts: official state election office results only (countSource names the office).
//   - Race calls: The New York Times, cited by name and linked (calledBy = 'NYT'). NYT has no public
//     results API, so NYT data is never scraped or re-hosted; only the call itself is cited.
// "Called" rule: a race is shown as called only when NYT has called it (called + calledBy set).
// Vote counts alone never mark a race as decided.

export interface LiveRace {
  id: string; // matches RaceInput.id, e.g. 'NH-SEN'
  pctReporting: number | null; // 0–100, null when the source does not publish it
  reportingBasis?: 'precincts' | 'counties'; // what pctReporting counts
  demVotes: number;
  repVotes: number;
  called: 'D' | 'R' | null; // only set when the cited source has called the race
  calledBy?: string; // source that made the call: 'NYT'
  countSource: string; // official state office the counts come from, e.g. 'NC State Board of Elections'
  firstChoiceOnly?: boolean; // ranked-choice state: first-choice counts only, not final
  updatedAt: string; // ISO timestamp from the source
}

/** Per-state fetch status written by the ingest job. */
export interface SourceStatus {
  raceId: string;
  ok: boolean;
  notAvailable?: boolean; // source reachable but this election/contest is not published yet
  fetchedAt: string;
  contest?: string;
  url?: string;
  message?: string;
}

export interface LiveFeed {
  generatedAt: string; // ISO timestamp when the feed file was written
  mode?: 'general' | 'test';
  races: LiveRace[];
  sources?: SourceStatus[];
}

export const ELECTION_DAY = '2026-11-03';

/** Tracker runs from the day before Election Day through one week after (ET, inclusive). */
export const TRACKER_WINDOW = { start: '2026-11-02', end: '2026-11-10' };

/** Results feed written by the ingest job. null = not configured yet: no results are fetched or shown. */
export const LIVE_RESULTS_URL: string | null = null;

/** Client refresh interval inside the window, and how old the feed may get before the fallback banner. */
export const POLL_MS = 60_000;
export const STALE_FEED_MINUTES = 15;

export const LIVE_SOURCES = [
  // Replace with the NYT 2026 results page once it is published (URL not known in advance).
  { key: 'nyt', name: 'The New York Times (race calls)', nameKo: '뉴욕타임스 (승자 판정)', url: 'https://www.nytimes.com/section/politics' },
  { key: 'states', name: 'State election offices (vote counts)', nameKo: '각 주 선거관리 당국 (개표 수치)', url: 'https://www.usa.gov/state-election-office' },
];

export type TrackerPhase = 'before' | 'window' | 'after';

export function trackerPhase(todayET: string): TrackerPhase {
  if (todayET < TRACKER_WINDOW.start) return 'before';
  if (todayET > TRACKER_WINDOW.end) return 'after';
  return 'window';
}

export async function fetchLiveFeed(signal?: AbortSignal): Promise<LiveFeed> {
  if (!LIVE_RESULTS_URL) throw new Error('live feed not configured');
  const res = await fetch(LIVE_RESULTS_URL, { signal, cache: 'no-store' });
  if (!res.ok) throw new Error(`live feed ${res.status}`);
  const j = (await res.json()) as LiveFeed;
  if (!j || !Array.isArray(j.races)) throw new Error('live feed: bad shape');
  return j;
}
