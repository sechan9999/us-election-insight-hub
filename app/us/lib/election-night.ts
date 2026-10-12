// Election-night remaining-vote projection model ("benchmark surprise" model).
//
// Idea: as county results arrive, measure how far they deviate from expectation
// ("surprise" vs the 2024 baseline + pre-election swing), then apply that
// surprise — with shrinkage — to the votes not yet counted.
//
//   E_c            = expected Dem margin in county c (2024 baseline + pre-election swing)
//   surprise(t)    = vote-weighted avg of (observed_c - E_c) over counted votes
//   S_hat(t)       = surprise(t) * min(1, f(t)/0.5)   // don't trust early surprises
//   projected(t)   = [counted votes * counted margin
//                     + uncounted votes * (E_c + S_hat)] / total expected votes
//   sigma(t)       = sigma0 * (1 - f(t))^0.7 + 0.3    // uncertainty collapses
//   P(D win | t)   = Phi(projected(t) / sigma(t))
//
// Why shrinkage: the votes counted first are NOT representative (early votes
// skew Democratic in many states, Election Day votes skew Republican — the
// "red mirage" / "blue shift"). Trusting an early surprise at face value
// produces wild swings. The weight ramps to full trust at 50% reporting.
//
// This module is pure math (no data fetching). Feed it county results from
// whatever source the ingest job provides; see scripts/simulate-election-night.ts
// for a fake-data demonstration.

/** Standard normal CDF (Abramowitz-Stegun, |err| < 2e-7). */
export function phi(x: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(x));
  const d = 0.3989423 * Math.exp((-x * x) / 2);
  const p =
    d *
    t *
    (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return x > 0 ? 1 - p : p;
}

export interface NightCounty {
  id: string;
  /** Total expected votes in this county. */
  expectedVotes: number;
  /** Expected Dem margin (pts, D-R): 2024 baseline + pre-election swing. */
  expectedDemMargin: number;
}

export interface CountyReport {
  /** Votes counted so far in this county. */
  votes: number;
  /** Observed Dem margin (pts, D-R) in the counted votes. */
  demMargin: number;
}

export interface NightRace {
  id: string;
  label: string;
  /** Pre-election forecast margin (pts, D-R) — the benchmark center. */
  preElectionDemMargin: number;
  /** Pre-election total uncertainty (pts). */
  sigma0: number;
  counties: NightCounty[];
}

export interface NightSnapshot {
  /** Fraction of expected votes counted (0..1). */
  reportingFrac: number;
  countedVotes: number;
  /** Vote-weighted Dem margin in counted votes. */
  countedDemMargin: number;
  /** Raw vote-weighted surprise vs benchmark (pts). */
  surprise: number;
  /** Shrinkage-adjusted surprise actually applied. */
  surpriseUsed: number;
  /** Projected final Dem margin (pts). */
  projectedMargin: number;
  /** Current uncertainty (pts). */
  sigma: number;
  /** P(Democrat wins). */
  pDemWin: number;
  /** Naive comparison: extrapolate counted margin with no benchmark. */
  naiveProjectedMargin: number;
  naivePDemWin: number;
}

/** Fraction of the surprise to trust at reporting fraction f. */
export function surpriseWeight(f: number): number {
  return Math.min(1, f / 0.5);
}

/** Uncertainty at reporting fraction f. Collapses as votes are counted. */
export function nightSigma(sigma0: number, f: number): number {
  return sigma0 * Math.pow(Math.max(0, 1 - f), 0.7) + 0.3;
}

export function projectRace(
  race: NightRace,
  reports: Map<string, CountyReport>,
): NightSnapshot {
  const totalExpected = race.counties.reduce((s, c) => s + c.expectedVotes, 0);
  let countedVotes = 0;
  let countedMarginNum = 0;
  let surpriseNum = 0;
  let uncountedProjectedNum = 0;

  for (const c of race.counties) {
    const r = reports.get(c.id);
    const v = r ? Math.min(r.votes, c.expectedVotes) : 0;
    countedVotes += v;
    if (v > 0 && r) {
      countedMarginNum += v * r.demMargin;
      surpriseNum += v * (r.demMargin - c.expectedDemMargin);
    }
    const remaining = c.expectedVotes - v;
    // Placeholder; surprise applied after computing S_hat below.
    uncountedProjectedNum += remaining * c.expectedDemMargin;
  }

  const f = totalExpected > 0 ? countedVotes / totalExpected : 0;
  const countedDemMargin = countedVotes > 0 ? countedMarginNum / countedVotes : 0;
  const surprise = countedVotes > 0 ? surpriseNum / countedVotes : 0;
  const w = surpriseWeight(f);
  const surpriseUsed = surprise * w;

  const projectedMargin =
    totalExpected > 0
      ? (countedMarginNum + uncountedProjectedNum + (totalExpected - countedVotes) * surpriseUsed) /
        totalExpected
      : 0;

  const sigma = nightSigma(race.sigma0, f);
  const pDemWin = phi(projectedMargin / sigma);

  // Naive baseline: believe the counted margin, no benchmark, no shrinkage.
  const naiveSigma = nightSigma(race.sigma0, f);
  const naivePDemWin = phi(countedDemMargin / naiveSigma);

  return {
    reportingFrac: f,
    countedVotes,
    countedDemMargin,
    surprise,
    surpriseUsed,
    projectedMargin,
    sigma,
    pDemWin,
    naiveProjectedMargin: countedDemMargin,
    naivePDemWin,
  };
}
