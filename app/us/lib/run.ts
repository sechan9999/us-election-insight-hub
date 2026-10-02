// Forecast run ID: a deterministic fingerprint of every model input, so the same
// inputs and seed always produce the same ID and the same numbers. Shown in the
// header next to the data date; cite it to reproduce a screenshot.

import {
  SENATE_BATTLEGROUND,
  SENATE_BASELINE,
  HOUSE_SNAPSHOT,
  HOUSE_BASELINE,
  MODEL_NOTES,
  DATA_AS_OF,
} from './seed-data';

/** FNV-1a 32-bit, hex. Not cryptographic — a stable input fingerprint. */
export function fnv1a(input: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16).padStart(8, '0');
}

export function inputHash(): string {
  return fnv1a(
    JSON.stringify({
      races: SENATE_BATTLEGROUND.map((r) => [r.id, r.demMargin, r.sigma]),
      senate: SENATE_BASELINE,
      house: [HOUSE_SNAPSHOT, HOUSE_BASELINE],
      model: [MODEL_NOTES.tau, MODEL_NOTES.sims, MODEL_NOTES.seed],
    }),
  );
}

/** e.g. 'us-fc-2026-10-01-3f9a1c2b' */
export function forecastRunId(): string {
  return `us-fc-${DATA_AS_OF}-${inputHash()}`;
}
