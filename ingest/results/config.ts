// Per-state ingest configuration. `general` is the 2026-11-03 run; `test` points the same adapters
// at each state's 2026 primary so parsers can be checked against known published numbers.
//
// Candidate matchers decide which rows count as the Democratic / Republican nominee. They are
// explicit full-name patterns, never surname-only, and a matcher hitting 0 or >1 candidates is an
// error (e.g. Alaska lists both "Sullivan, Dan S." and "Sullivan, Daniel J. Jr.").

import * as A from './adapters';

export interface StateJob {
  raceId: string; // matches SENATE_BATTLEGROUND id
  countSource: string;
  firstChoiceOnly?: boolean; // ranked-choice states: election-night counts are first choices only
  // Ignore anything published before the state's first polls close (UTC). States post TEST data with
  // fake numbers before Election Day (seen 2026-10-06: Minnesota's 20261103 file had 7.6% "reporting").
  notBefore?: string;
  fetch: () => Promise<A.RawContest>;
  dem: RegExp | null; // null in test mode when the tested contest has no such candidate
  rep: RegExp | null;
  expect?: { dem?: number; rep?: number }; // test mode: published values to match exactly
}

export const GENERAL: StateJob[] = [
  {
    raceId: 'NC-SEN',
    countSource: 'NC State Board of Elections',
    notBefore: '2026-11-04T00:30:00Z', // 7:30 PM ET
    fetch: () => A.nc({ date: '20261103', contest: /^US SENATE(?! - )/ }),
    dem: /^Roy Cooper$/i,
    rep: /^Michael Whatley$/i,
  },
  {
    raceId: 'GA-SEN',
    countSource: 'Georgia Secretary of State',
    notBefore: '2026-11-04T00:00:00Z', // 7 PM ET
    // TODO: set the slug once the SOS publishes the 2026 general election (not live as of 2026-10-06)
    fetch: () => A.ga({ slug: null, contest: /^US Senate$/i }),
    dem: /^Jon Ossoff\b/i,
    rep: /^Mike Collins\b/i,
  },
  {
    raceId: 'MN-SEN',
    countSource: 'Minnesota Secretary of State',
    notBefore: '2026-11-04T02:00:00Z', // 8 PM CT
    fetch: () => A.mn({ date: '20261103', file: 'ussenate.txt', contest: /^U\.S\. Senator$/ }),
    dem: /^Peggy Flanagan$/i,
    rep: /^Michele Tafoya$/i,
  },
  {
    raceId: 'IA-SEN',
    countSource: 'Iowa Secretary of State',
    // Blocked from Cloud Run (HTTP 202, empty body; 2026-10-06). Kept so the status shows it; counts come from manual entry.
    notBefore: '2026-11-04T02:00:00Z', // 8 PM CT
    fetch: () => A.ia({ electionName: /^2026 General Election$/i, contest: /^United States Senator$/i }),
    dem: /^Josh Turek$/i,
    rep: /^Ashley Hinson$/i,
  },
  {
    raceId: 'FL-SEN',
    countSource: 'Florida Division of Elections',
    notBefore: '2026-11-04T00:00:00Z', // 7 PM ET (Panhandle closes an hour later)
    fetch: () => A.fl({ date: '11/3/2026', raceCode: 'USS' }),
    dem: /^Angie\b.*\bNixon$/i,
    rep: /^Ashley\b.*\bMoody$/i,
  },
  {
    raceId: 'AK-SEN',
    countSource: 'Alaska Division of Elections',
    notBefore: '2026-11-04T05:00:00Z', // 8 PM AKST
    firstChoiceOnly: true,
    fetch: () => A.ak({ electionPageId: '26genr', contest: 'U.S. Senator' }),
    dem: /^Peltola, Mary\b/,
    rep: /^Sullivan, Dan S\./,
  },
];

/** Same adapters on the 2026 primaries. Expected values were read from the official sources on 2026-10-06. */
export const TEST: StateJob[] = [
  {
    raceId: 'NC-SEN',
    countSource: 'NC State Board of Elections',
    fetch: () => A.nc({ date: '20260303', contest: /^US SENATE - DEM/ }),
    dem: /^Roy Cooper$/i,
    rep: null,
    expect: { dem: 761345 },
  },
  {
    raceId: 'GA-SEN',
    countSource: 'Georgia Secretary of State',
    fetch: () => A.ga({ slug: 'GeneralPrimary51926', contest: /^US Senate - Rep$/i }),
    dem: null,
    rep: /^Mike Collins\b/i,
    expect: { rep: 369642 },
  },
  {
    raceId: 'MN-SEN',
    countSource: 'Minnesota Secretary of State',
    fetch: () => A.mn({ date: '20260811', file: 'ussenate.txt', contest: /^U\.S\. Senator$/ }),
    dem: /^Peggy Flanagan$/i,
    rep: /^Michele Tafoya$/i,
    expect: { rep: 211813 },
  },
  {
    raceId: 'IA-SEN',
    countSource: 'Iowa Secretary of State',
    fetch: () => A.ia({ electionName: /^2026 Primary Election$/i, contest: /^United States Senator - Rep\.$/i }),
    dem: null,
    rep: /^Ashley Hinson$/i,
    expect: { rep: 153059 },
  },
  {
    raceId: 'FL-SEN',
    countSource: 'Florida Division of Elections',
    fetch: () => A.fl({ date: '8/18/2026', raceCode: 'USS', official: true }),
    dem: /^Angie\b.*\bNixon$/i,
    rep: /^Ashley\b.*\bMoody$/i,
    expect: { dem: 705835, rep: 1320780 },
  },
  {
    raceId: 'AK-SEN',
    countSource: 'Alaska Division of Elections',
    firstChoiceOnly: true,
    fetch: () => A.ak({ electionPageId: '26prim', contest: 'U.S. Senator' }),
    dem: /^Peltola, Mary\b/,
    rep: /^Sullivan, Dan S\./,
    expect: { dem: 82244 },
  },
];
