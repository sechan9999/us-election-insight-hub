// Election results tracker: schedule, sources and data contract.
//
// Operating window: the day before Election Day through one week after (ET).
// Results come from a JSON feed (LIVE_RESULTS_URL) produced by the results ingest job, which
// writes electoral_hub.us_results_live (see bigquery/us_schema.sql). Until the feed URL is set,
// the panel shows the schedule only and never displays results.
//
// Source policy (decided 2026-10-06, option c; calls switched NYT → AP by HK direction 2026-11-04):
//   - Vote counts: official state election office results, or Associated Press interim counts
//     (countSource names the office or AP; interim rows are replaced wholesale once certified).
//   - Race calls: the Associated Press, cited by name. AP data is never scraped or re-hosted;
//     only the call itself is cited. The House-majority call remains NYT (operator override).
// "Called" rule: a race is shown as called only when AP has called it (called + calledBy set).
// Vote counts alone never mark a race as decided.

export interface LiveRace {
  id: string; // matches RaceInput.id, e.g. 'NH-SEN'
  pctReporting: number | null; // 0–100, null when the source does not publish it
  reportingBasis?: 'precincts' | 'counties'; // what pctReporting counts
  demVotes: number;
  repVotes: number;
  called: 'D' | 'R' | null; // only set when the cited source has called the race
  calledBy?: string; // source that made the call: 'AP' (House majority: 'NYT')
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
  // House-majority call: set ONLY from an operator override citing NYT
  // (overrides key "HOUSE"), never from automated data. Absent until NYT calls it.
  houseCalled?: 'D' | 'R' | null;
  houseCalledBy?: string;
}

export const ELECTION_DAY = '2026-11-03';

/** Tracker runs from the day before Election Day through one week after (ET, inclusive). */
export const TRACKER_WINDOW = { start: '2026-11-02', end: '2026-11-10' };

/** Results feed written by the Cloud Run job `results-ingest` (ingest/results/job.ts) once per minute in the window. */
export const LIVE_RESULTS_URL: string | null = 'https://storage.googleapis.com/electoral-hub-510410-us-results/live/results.json';

/** Client refresh interval inside the window, and how old the feed may get before the fallback banner. */
export const POLL_MS = 60_000;
export const STALE_FEED_MINUTES = 15;

export const LIVE_SOURCES = [
  { key: 'ap', name: 'Associated Press (race calls, interim counts)', nameKo: 'AP (승자 판정, 잠정 집계)', url: 'https://apnews.com/projects/elections-2026' },
  { key: 'states', name: 'State election offices (vote counts)', nameKo: '각 주 선거관리 당국 (개표 수치)', url: 'https://www.usa.gov/state-election-office' },
  { key: 'nyt', name: 'The New York Times (House-majority call)', nameKo: '뉴욕타임스 (하원 과반 판정)', url: 'https://www.nytimes.com/section/politics' },
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
  if (j.mode && j.mode !== 'general') throw new Error('live feed: test/rehearsal data is never shown');
  return j;
}
