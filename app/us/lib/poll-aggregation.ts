// Time-weighted poll aggregation (roadmap #6).
//
// Combines dated polls into a single margin estimate:
//   - exponential time decay (half-life 21 days): a 3-week-old poll counts half
//   - sample-size weighting (larger polls count more)
//   - optional pollster quality multiplier (default 1; neutral until ratings exist)
// Also estimates a linear trend (pts/day) via weighted least squares, reported
// for display. The trend is NOT extrapolated to Election Day in v1 — m_i is a
// nowcast (time-weighted average as of `asOf`). Extrapolation is future work.
//
// Framework-free so it can be unit-tested.

export interface DatedPoll {
  margin: number; // Democratic margin (D minus R) in points
  fieldEnd: string; // YYYY-MM-DD, end of field period
  n: number; // sample size
  quality?: number; // pollster quality multiplier (default 1)
  label?: string; // e.g. 'RCP average' or 'NYT/Siena'
}

export interface AggregateResult {
  margin: number; // time-weighted average margin (nowcast)
  trendPerDay: number; // pts/day from weighted linear trend (for display)
  effectiveN: number; // sum of weights
  nPolls: number; // number of polls combined
  asOf: string;
}

export interface AggregateOptions {
  asOf: string; // YYYY-MM-DD reference date
  halflifeDays?: number; // default 21
}

const DAY = 86400000;

function daysBetween(a: string, b: string): number {
  return (Date.parse(a) - Date.parse(b)) / DAY;
}

/** Time-weighted average margin + trend from dated polls. */
export function aggregatePolls(
  polls: DatedPoll[],
  opts: AggregateOptions,
): AggregateResult {
  const halflife = opts.halflifeDays ?? 21;
  const asOf = opts.asOf;

  const ws = polls.map((p) => {
    const age = Math.max(0, daysBetween(asOf, p.fieldEnd));
    const decay = Math.pow(0.5, age / halflife);
    return p.n * (p.quality ?? 1) * decay;
  });

  const wSum = ws.reduce((a, b) => a + b, 0);
  const margin =
    wSum > 0 ? polls.reduce((a, p, i) => a + p.margin * ws[i], 0) / wSum : 0;

  // Weighted linear trend of margin on field date (pts/day).
  let trendPerDay = 0;
  if (polls.length >= 2 && wSum > 0) {
    const t = polls.map((p) => daysBetween(p.fieldEnd, polls[0].fieldEnd));
    const tBar = t.reduce((a, ti, i) => a + ti * ws[i], 0) / wSum;
    const denom = t.reduce((a, ti, i) => a + ws[i] * (ti - tBar) ** 2, 0);
    if (denom > 0) {
      const numer = polls.reduce(
        (a, p, i) => a + ws[i] * (t[i] - tBar) * (p.margin - margin),
        0,
      );
      trendPerDay = numer / denom;
    }
  }

  return {
    margin,
    trendPerDay,
    effectiveN: wSum,
    nPolls: polls.length,
    asOf,
  };
}
