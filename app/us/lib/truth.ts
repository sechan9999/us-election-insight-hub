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

/** 'NC-SEN' -> 'NC' */
export const stateCode = (raceId: string) => raceId.split('-')[0];

export async function fetchTruthIndex(signal?: AbortSignal): Promise<TruthIndex> {
  const res = await fetch(TRUTH_INDEX_URL, { signal, cache: 'no-store' });
  if (!res.ok) throw new Error(`truth index ${res.status}`);
  const j = (await res.json()) as TruthIndex;
  if (!j || typeof j.states !== 'object') throw new Error('truth index: bad shape');
  return j;
}
