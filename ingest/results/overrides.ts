// Operator overrides for the results feed: the manual path for everything the
// automated state adapters cannot provide.
//
// Why this file exists: the ingest core (run.ts) never marks a race called —
// `called` comes only from a race call entered by the operator — and several
// races have no automatable adapter at all (Iowa is blocked from Cloud Run;
// the six non-automated battlegrounds NH/OH/MI/TX/ME/KS have no adapter).
// Those values arrive here, not from scraping: NYT calls are cited by name
// (never scraped or re-hosted, per the 2026-10-06 source policy), and manual
// counts come from the official state office named in countSource.
//
// How it reaches the feed:
//   - Election night: the operator uploads live/overrides.json to the results
//     bucket (gs://electoral-hub-510410-us-results). The Cloud Run job reads
//     it on every pass and merges it into the feed. Removing a race from the
//     file stops re-applying its call on the next pass (fresh ingest rows
//     carry called: null); a call already written to a previous-feed row
//     survives only while that row is carried over after a failed fetch.
//   - Local testing: scripts/ingest-results.ts --overrides path/to.json
//
// Schema (JSON object keyed by race id, e.g. "MI-SEN"):
//   { "called": "D"|"R", "calledBy": "NYT",
//     "demVotes": 123, "repVotes": 456, "pctReporting": 42,
//     "reportingBasis": "precincts"|"counties",
//     "countSource": "Michigan Secretary of State (manual entry)",
//     "firstChoiceOnly": true, "note": "free text, ignored by the merge" }
// Only the fields present are applied. A race with no feed row is created
// only when countSource is given; otherwise it is skipped with a warning.

import type { LiveFeed, LiveRace } from '../../app/us/lib/live';

export interface ManualOverride {
  called?: 'D' | 'R';
  calledBy?: string;
  demVotes?: number;
  repVotes?: number;
  pctReporting?: number | null;
  reportingBasis?: 'precincts' | 'counties';
  countSource?: string;
  firstChoiceOnly?: boolean;
  note?: string;
}

export type Overrides = Record<string, ManualOverride>;

const isGoodVotes = (v: unknown): v is number => typeof v === 'number' && Number.isInteger(v) && v >= 0;

/** Merge operator overrides into a feed. Returns warnings; never throws on bad input. */
export function applyOverrides(feed: LiveFeed, overrides: Overrides | null): { warnings: string[] } {
  const warnings: string[] = [];
  if (!overrides) return { warnings };
  for (const [raceId, o] of Object.entries(overrides)) {
    if (o.called !== undefined && o.called !== 'D' && o.called !== 'R') {
      warnings.push(`${raceId}: bad called value ${JSON.stringify(o.called)}, skipped`);
      continue;
    }
    if (o.called && !o.calledBy) {
      warnings.push(`${raceId}: called without calledBy, skipped`);
      continue;
    }
    let row = feed.races.find((r) => r.id === raceId);
    if (!row) {
      if (o.countSource === undefined) {
        warnings.push(`${raceId}: no feed row and no countSource, skipped`);
        continue;
      }
      row = {
        id: raceId,
        pctReporting: null,
        demVotes: 0,
        repVotes: 0,
        called: null,
        countSource: o.countSource,
        updatedAt: feed.generatedAt,
      };
      feed.races.push(row);
    }
    if (o.called) {
      row.called = o.called;
      row.calledBy = o.calledBy;
    }
    if (isGoodVotes(o.demVotes)) row.demVotes = o.demVotes;
    else if (o.demVotes !== undefined) warnings.push(`${raceId}: bad demVotes, ignored`);
    if (isGoodVotes(o.repVotes)) row.repVotes = o.repVotes;
    else if (o.repVotes !== undefined) warnings.push(`${raceId}: bad repVotes, ignored`);
    if (o.pctReporting !== undefined) row.pctReporting = o.pctReporting;
    if (o.reportingBasis !== undefined) row.reportingBasis = o.reportingBasis;
    if (o.countSource !== undefined) row.countSource = o.countSource;
    if (o.firstChoiceOnly !== undefined) row.firstChoiceOnly = o.firstChoiceOnly;
    row.updatedAt = feed.generatedAt;
  }
  return { warnings };
}

/** Parse and validate the shape of an overrides file (field checks happen at merge). */
export function parseOverrides(json: unknown): Overrides {
  if (!json || typeof json !== 'object' || Array.isArray(json)) throw new Error('overrides: top level must be an object keyed by race id');
  return json as Overrides;
}
