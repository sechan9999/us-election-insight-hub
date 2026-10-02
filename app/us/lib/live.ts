// Election-night results feed. Empty until counting starts on November 3, 2026;
// the board then switches the tracker panel from "pre-results" to live mode.
// Production: populated from electoral_hub.us_results_live (see bigquery/us_schema.sql).

export interface LiveRace {
  id: string; // matches RaceInput.id, e.g. 'NH-SEN'
  pctReporting: number; // 0–100
  demVotes: number;
  repVotes: number;
  called: 'D' | 'R' | null; // only set when the race is called by the cited desk
  calledBy?: string; // e.g. 'AP'
  updatedAt: string; // ISO timestamp
}

export const ELECTION_DAY = '2026-11-03';
export const LIVE_SOURCE = 'Not started — no results are shown before polls close';
export const LIVE_RESULTS: LiveRace[] = [];
