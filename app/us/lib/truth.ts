// Trump Truth Social "intervention" index for the Senate battlegrounds.
//
// DISPLAY-ONLY context layer: not a model input, not part of the run ID (run.ts
// hashes seed-data only). Built weekly by sechan9999/trump-truth-analysis
// (intervention.py) and fetched at runtime, so the board picks up new weeks
// without a redeploy.

export const TRUTH_INDEX_URL = 'https://sechan9999.github.io/trump-truth-analysis/intervention.json';
export const TRUTH_REPO_URL = 'https://github.com/sechan9999/trump-truth-analysis';

export interface TruthState {
  endorse_share: number; // share of battleground-mapped endorsement posts, last 4 weeks (12 states sum to 1)
  dem_mention_share: number | null;
  n_endorse: number; // split-weighted post count in the window
  n_dem_mention: number;
  z_vs_baseline: number | null; // vs 2025-01-20..2026-06-30 4-week shares
  surge: boolean; // z > 2 and window not small
  rank: number;
}

export interface TruthIndex {
  week: string;
  window_weeks: number;
  method_version: string;
  gazetteer_version: string;
  matching_rules_version?: string;
  coverage: {
    n_endorse_window: number;
    mapped_share: number | null;
    any_state_share?: number | null;
    n_mapped_battleground: number;
  };
  small_n: boolean;
  states: Record<string, TruthState>;
  notes: { ko: string; en: string };
}

export const TRUTH_WEEKLY_URL = 'https://sechan9999.github.io/trump-truth-analysis/weekly.json';
export const TRUTH_SITE_URL = 'https://sechan9999.github.io/trump-truth-analysis/';

export interface TruthCluster {
  ko: [string, string];
  en: [string, string];
  c: string;
}

export interface TruthClusterStats {
  n: number;
  cohesion: number; // mean silhouette (cosine)
  boundary_share: number;
  keywords: string[];
}

/** A topic spike episode. Deliberately unnamed: keywords + example posts are the evidence. */
export interface TruthEvent {
  cluster: number;
  start: string; // Monday of first week (ET)
  end: string; // Sunday of last week
  weeks: number;
  peak_week: string;
  count: number;
  peak: number;
  baseline_weekly: number;
  ratio: number; // mean weekly count / baseline
  keywords: string[];
  examples: [id: string, date: string, text: string][];
}

/** weekly.json (schema truth-weekly/v1): topic labels, cluster stats, monthly and weekly topic counts. */
export interface TruthWeekly {
  schema: string;
  site: string;
  meta: { collected: string; total: number; analyzed: number; last: string };
  labels: { version: string; date: string; clusters: Record<string, TruthCluster> };
  stats: { overall_silhouette: number; boundary_threshold: number; clusters: Record<string, TruthClusterStats> };
  months: string[];
  monthly: Record<string, number[]>;
  weeks: string[]; // Monday of each ET week
  weekly: Record<string, number[]>;
  events?: { method_version: string; rule: { ko: string; en: string }; events: TruthEvent[] };
}

export const truthPostUrl = (id: string) => `https://truthsocial.com/@realDonaldTrump/${id}`;

async function getJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(url, { signal, cache: 'no-store' });
  if (!res.ok) throw new Error(`${url} ${res.status}`);
  return (await res.json()) as T;
}

export async function fetchTruthWeekly(signal?: AbortSignal): Promise<TruthWeekly> {
  const j = await getJson<TruthWeekly>(TRUTH_WEEKLY_URL, signal);
  if (!j || !j.labels || !j.weekly) throw new Error('truth weekly: bad shape');
  return j;
}

/** 'NC-SEN' -> 'NC' */
export const stateCode = (raceId: string) => raceId.split('-')[0];

export async function fetchTruthIndex(signal?: AbortSignal): Promise<TruthIndex> {
  const j = await getJson<TruthIndex>(TRUTH_INDEX_URL, signal);
  if (!j || typeof j.states !== 'object') throw new Error('truth index: bad shape');
  return j;
}
