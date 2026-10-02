// Model checks — run with `npm run verify:model`. Exits non-zero on failure.
//
// 1. Per-race Monte Carlo with a shared national error matches the closed form
//    Φ(m / √(σ² + τ²)) within 0.003 across a grid of margins.
// 2. Same seed ⇒ identical chamber results (reproducibility of a run ID).
// 3. Prints the board's headline numbers for the seed data.

import { analyticWinProb, mulberry32, simulateChamber } from '../app/us/lib/forecast';
import {
  SENATE_BATTLEGROUND,
  SENATE_BASELINE,
  HOUSE_BASELINE,
  houseTossupSeed,
  MODEL_NOTES,
} from '../app/us/lib/seed-data';
import { forecastRunId } from '../app/us/lib/run';

let failed = false;
const tau = MODEL_NOTES.tau;

// 1. Monte Carlo vs analytic, single race at a time (200k sims each)
const rand = mulberry32(7);
const randn = () => {
  let u = 0;
  while (u === 0) u = rand();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rand());
};
let maxDiff = 0;
for (const m of [-8, -4, -2, -0.5, 0, 0.5, 2, 4, 8]) {
  const sigma = 4;
  let wins = 0;
  const n = 200_000;
  for (let i = 0; i < n; i++) if (m + tau * randn() + sigma * randn() > 0) wins++;
  const diff = Math.abs(wins / n - analyticWinProb(m, sigma, tau));
  maxDiff = Math.max(maxDiff, diff);
}
console.log(`MC vs analytic: max |diff| = ${maxDiff.toFixed(4)}`);
if (maxDiff > 0.003) {
  console.error('FAIL: Monte Carlo and closed form disagree');
  failed = true;
}

// 2. Reproducibility
const a = simulateChamber(SENATE_BATTLEGROUND, SENATE_BASELINE.safeDemSeats, SENATE_BASELINE.needed, { tau, seed: MODEL_NOTES.seed, sims: MODEL_NOTES.sims });
const b = simulateChamber(SENATE_BATTLEGROUND, SENATE_BASELINE.safeDemSeats, SENATE_BASELINE.needed, { tau, seed: MODEL_NOTES.seed, sims: MODEL_NOTES.sims });
if (JSON.stringify(a) !== JSON.stringify(b)) {
  console.error('FAIL: same seed produced different results');
  failed = true;
}

// 3. Headline numbers
const house = simulateChamber(houseTossupSeed(), HOUSE_BASELINE.safeDemSeats, HOUSE_BASELINE.needed, { tau, seed: MODEL_NOTES.seed, sims: MODEL_NOTES.sims });
console.log(`run ${forecastRunId()}`);
console.log(`Senate: P(D majority) ${(a.demWinProb * 100).toFixed(1)}%  E[D seats] ${a.expectedDemSeats.toFixed(2)}  80% band ${a.seatBand.p10}–${a.seatBand.p90}`);
console.log(`House:  P(D majority) ${(house.demWinProb * 100).toFixed(1)}%  E[D seats] ${house.expectedDemSeats.toFixed(2)}  80% band ${house.seatBand.p10}–${house.seatBand.p90}`);
for (const r of a.perRace) {
  const race = SENATE_BATTLEGROUND.find((x) => x.id === r.id)!;
  const an = analyticWinProb(race.demMargin, race.sigma, tau);
  if (Math.abs(an - r.demWinProb) > 0.01) {
    console.error(`FAIL: ${r.id} simulated ${r.demWinProb.toFixed(3)} vs analytic ${an.toFixed(3)}`);
    failed = true;
  }
}
process.exit(failed ? 1 : 0);
