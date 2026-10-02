// Correlated-error election forecast model (US midterm workstream).
//
// Per-race:  P(D wins race i | s) = Φ((m_i + s) / σ_i),  s ~ N(0, τ²)
// The single shared national error s makes races move together.
// Published per-race probabilities marginalize s:
//   P(D wins i) = Φ(m_i / √(σ_i² + τ²))
// Chamber control is simulated (correlation has no closed form).
//
// Framework-free (like app/lib/analytics.ts) so it can be unit-tested.

export interface RaceInput {
  id: string; // e.g. 'NH-SEN'
  label: string; // e.g. 'New Hampshire'
  chamber: 'senate' | 'house';
  demMargin: number; // m_i: Democratic polling margin in points (D minus R)
  sigma: number; // σ_i: race-level polling error scale (points)
}

export interface ChamberResult {
  demWinProb: number; // P(Democrats reach `needed` seats)
  expectedDemSeats: number;
  thresholdCurve: { seats: number; prob: number }[]; // P(seats >= k) near `needed`
  perRace: { id: string; demWinProb: number }[]; // simulated (matches analytic)
  seatBand: { p10: number; p50: number; p90: number }; // Dem seat percentiles (80% band)
  histogram: { seats: number; prob: number }[]; // full Dem seat distribution
}

/** Standard normal CDF via Abramowitz–Stegun erf approximation (|err| < 1.5e-7). */
export function normalCdf(x: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(x));
  const d = 0.3989423 * Math.exp((-x * x) / 2);
  let p =
    d *
    t *
    (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  if (x > 0) p = 1 - p;
  return p;
}

/** Seeded PRNG (mulberry32) — reproducible simulations. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeRandn(rand: () => number): () => number {
  let spare: number | null = null;
  return () => {
    if (spare !== null) {
      const v = spare;
      spare = null;
      return v;
    }
    let u = 0;
    let v = 0;
    while (u === 0) u = rand();
    while (v === 0) v = rand();
    const mag = Math.sqrt(-2 * Math.log(u));
    spare = mag * Math.sin(2 * Math.PI * v);
    return mag * Math.cos(2 * Math.PI * v);
  };
}

/** Closed-form per-race Dem win probability (national error marginalized out). */
export function analyticWinProb(demMargin: number, sigma: number, tau: number): number {
  return normalCdf(demMargin / Math.sqrt(sigma * sigma + tau * tau));
}

export interface SimulateOptions {
  tau?: number; // national error scale in points (default 3.5)
  sims?: number; // simulations (default 40000)
  seed?: number; // default 20261103
}

/**
 * Simulate chamber control. Each simulation draws ONE national error s shared
 * across races, then each race outcome = m_i + s + σ_i·ε_i. Democrats win the
 * race if the outcome is positive.
 */
export function simulateChamber(
  races: RaceInput[],
  safeDemSeats: number,
  needed: number,
  opts: SimulateOptions = {},
): ChamberResult {
  const tau = opts.tau ?? 3.5;
  const sims = opts.sims ?? 40000;
  const randn = makeRandn(mulberry32(opts.seed ?? 20261103));

  const wins = new Array<number>(races.length).fill(0);
  const hist = new Map<number, number>();
  let chamberWins = 0;
  let seatTotal = 0;

  for (let s = 0; s < sims; s++) {
    const national = tau * randn();
    let demSeats = safeDemSeats;
    for (let i = 0; i < races.length; i++) {
      const r = races[i];
      if (r.demMargin + national + r.sigma * randn() > 0) {
        demSeats++;
        wins[i]++;
      }
    }
    seatTotal += demSeats;
    hist.set(demSeats, (hist.get(demSeats) ?? 0) + 1);
    if (demSeats >= needed) chamberWins++;
  }

  const thresholdCurve: { seats: number; prob: number }[] = [];
  for (let k = needed - 3; k <= needed + 3; k++) {
    let ge = 0;
    for (const [seats, c] of hist) if (seats >= k) ge += c;
    thresholdCurve.push({ seats: k, prob: ge / sims });
  }

  const histogram = [...hist.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([seats, c]) => ({ seats, prob: c / sims }));
  const quantile = (q: number) => {
    let cum = 0;
    for (const h of histogram) {
      cum += h.prob;
      if (cum >= q) return h.seats;
    }
    return histogram[histogram.length - 1].seats;
  };

  return {
    demWinProb: chamberWins / sims,
    expectedDemSeats: seatTotal / sims,
    thresholdCurve,
    perRace: races.map((r, i) => ({ id: r.id, demWinProb: wins[i] / sims })),
    seatBand: { p10: quantile(0.1), p50: quantile(0.5), p90: quantile(0.9) },
    histogram,
  };
}
