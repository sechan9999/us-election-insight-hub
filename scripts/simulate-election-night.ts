#!/usr/bin/env npx tsx
/**
 * Election-night simulator with FAKE data.
 *
 * Demonstrates the benchmark-surprise model in app/us/lib/election-night.ts:
 * three Senate races, ~25 fake counties each, results arriving in 12 batches.
 * D-leaning (urban, early-vote-heavy) counties report first, creating the
 * classic election-night mirage: an early Democratic surge that fades.
 *
 * Run: npx tsx scripts/simulate-election-night.ts
 *
 * NOT connected to any real data source. On Nov 3 the ingest job feeds real
 * county results into projectRace(); this script only validates the math.
 */

import {
  NightRace,
  NightCounty,
  CountyReport,
  projectRace,
} from '../app/us/lib/election-night';

/** Deterministic RNG so the demo is reproducible. */
function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface FakeCounty extends NightCounty {
  trueDemMargin: number;
  reportRank: number; // lower = reports earlier
}

interface Scenario {
  id: string;
  label: string;
  preElectionDemMargin: number; // what polls said
  trueFinalDemMargin: number; // what "actually" happens
  sigma0: number;
  nCounties: number;
  stateLean2024: number; // avg 2024 Dem margin across counties
}

const SCENARIOS: Scenario[] = [
  // NC: polls said D+8.3, truth is D+10 — comfortable Dem win.
  { id: 'NC-SEN', label: 'North Carolina', preElectionDemMargin: 8.3, trueFinalDemMargin: 10.0, sigma0: 5.5, nCounties: 25, stateLean2024: 2.0 },
  // IA: polls said R+0.7, truth is R+2.5 — Republican win; early D mirage then collapse.
  { id: 'IA-SEN', label: 'Iowa', preElectionDemMargin: -0.7, trueFinalDemMargin: -2.5, sigma0: 5.5, nCounties: 25, stateLean2024: -6.0 },
  // OH: polls said D+2.9, truth is D+1.0 — close Dem win, long uncertain night.
  { id: 'OH-SEN', label: 'Ohio', preElectionDemMargin: 2.9, trueFinalDemMargin: 1.0, sigma0: 5.5, nCounties: 25, stateLean2024: -3.0 },
];

const STEPS = 12;

function buildRace(s: Scenario, rng: () => number): { race: NightRace; fake: FakeCounty[] } {
  // Pre-election swing implied by polls vs 2024 baseline.
  const preSwing = s.preElectionDemMargin - s.stateLean2024;
  const trueSwing = s.trueFinalDemMargin - s.stateLean2024;
  // Polls missed by this much (positive = polls overestimated Dems).
  const pollMiss = preSwing - trueSwing;

  const fake: FakeCounty[] = [];
  for (let i = 0; i < s.nCounties; i++) {
    const votes = Math.round(20_000 * Math.exp(rng() * 2.2)); // lognormal-ish
    const m2024 = s.stateLean2024 + (rng() - 0.5) * 44; // county 2024 margin, wide spread
    const noise = (rng() - 0.5) * 6; // county-specific 2026 deviation
    const trueMargin = m2024 + trueSwing + noise;
    // Urban D-leaning counties (high early vote) report first -> mirage.
    const reportRank = -m2024 * 0.6 + rng() * 30;
    fake.push({
      id: `${s.id}-C${String(i + 1).padStart(2, '0')}`,
      expectedVotes: votes,
      expectedDemMargin: Math.round((m2024 + preSwing) * 10) / 10,
      trueDemMargin: Math.round(trueMargin * 10) / 10,
      reportRank,
    });
  }
  // Calibrate: shift county true margins so the vote-weighted total
  // exactly equals the designed truth (noise would otherwise drift it).
  const totalV = fake.reduce((sum, c) => sum + c.expectedVotes, 0);
  const realized = fake.reduce((sum, c) => sum + c.expectedVotes * c.trueDemMargin, 0) / totalV;
  const shift = s.trueFinalDemMargin - realized;
  for (const c of fake) c.trueDemMargin = Math.round((c.trueDemMargin + shift) * 10) / 10;
  fake.sort((a, b) => a.reportRank - b.reportRank);

  const race: NightRace = {
    id: s.id,
    label: s.label,
    preElectionDemMargin: s.preElectionDemMargin,
    sigma0: s.sigma0,
    counties: fake.map(({ id, expectedVotes, expectedDemMargin }) => ({
      id,
      expectedVotes,
      expectedDemMargin,
    })),
  };
  console.log(
    `  poll miss: ${pollMiss >= 0 ? '+' : ''}${pollMiss.toFixed(1)}pts (polls ${pollMiss > 0 ? 'overestimated' : 'underestimated'} Dems)`,
  );
  return { race, fake };
}

function main(): void {
  console.log('Election-night simulator (FAKE DATA) — benchmark-surprise model\n');
  const rng = mulberry32(20261103);

  for (const s of SCENARIOS) {
    console.log(`=== ${s.label} (${s.id}): polls D${s.preElectionDemMargin >= 0 ? '+' : ''}${s.preElectionDemMargin} | truth D${s.trueFinalDemMargin >= 0 ? '+' : ''}${s.trueFinalDemMargin} ===`);
    const { race, fake } = buildRace(s, rng);
    const perStep = Math.ceil(fake.length / STEPS);

    console.log(
      ' step | report | counted | surprise | proj margin |  P(D win)  | naive P(D)',
    );
    for (let step = 1; step <= STEPS; step++) {
      const reported = new Map<string, CountyReport>();
      const nReported = Math.min(fake.length, step * perStep);
      for (let i = 0; i < nReported; i++) {
        const c = fake[i];
        // Small counting noise around the true margin.
        const obs = c.trueDemMargin + (rng() - 0.5) * 1.5;
        reported.set(c.id, { votes: c.expectedVotes, demMargin: Math.round(obs * 10) / 10 });
      }
      const snap = projectRace(race, reported);
      const pct = (snap.reportingFrac * 100).toFixed(0).padStart(3);
      console.log(
        `  ${String(step).padStart(2)}  |  ${pct}%  | ${snap.countedDemMargin >= 0 ? '+' : ''}${snap.countedDemMargin.toFixed(1).padStart(5)} | ${snap.surprise >= 0 ? '+' : ''}${snap.surprise.toFixed(1).padStart(5)} |  ${snap.projectedMargin >= 0 ? '+' : ''}${snap.projectedMargin.toFixed(1).padStart(5)}   |  ${(snap.pDemWin * 100).toFixed(1).padStart(5)}%  |  ${(snap.naivePDemWin * 100).toFixed(1).padStart(5)}%`,
      );
    }
    console.log('');
  }

  console.log('Notes:');
  console.log('- "surprise" = how far counted counties deviate from their 2024-based expectation.');
  console.log('- The model trusts surprise only gradually (full weight at 50% reporting).');
  console.log('- "naive" extrapolates the counted margin with no benchmark — watch it get');
  console.log('  fooled by the early-vote mirage (esp. Iowa).');
}

main();
