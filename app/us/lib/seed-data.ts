// Seed data for the US Election Insights Hub board.
//
// Status: SAMPLE DATA for the working demo. Every figure is labeled with its
// source below; the production board replaces this file with the daily
// BigQuery ingest (electoral_hub.us_polls -> electoral_hub.us_race_forecasts).
//
// Senate battleground margins: RealClearPolitics polling averages as compiled
// Oct 1, 2026 (uspresidentialelectionnews.com). m_i is the Democratic margin
// in points (D minus R). σ_i = 4.0 pts for all races (labeled assumption;
// replace with poll-count-based errors in production).

import type { RaceInput } from './forecast';

export const DATA_AS_OF = '2026-10-09';
export const DATA_SOURCE = 'RealClearPolitics polling averages (via uspresidentialelectionnews.com)';

export interface SenateRace extends RaceInput {
  stateKo: string;
  demCandidate: string;
  repCandidate: string;
  rating: string;
  note?: string;
  nPolls: number; // polls underpinning the RCP average (estimate; ingest provides exact)
}

/**
 * Race-level error model (roadmap #4), calibrated from historical Senate polls.
 *
 *   σ_i = √(σ_sys² + σ_poll² / n_i)
 *
 * σ_sys = 4.1 (systematic race error net of regional correlation),
 * σ_poll = 5.45 (idiosyncratic per-poll error). Estimated by regressing
 * squared demeaned race-average errors on 1/n_polls over 223 Senate races,
 * 2010–2022, final-21-day polls (see scripts/calibrate-sigma.py), then
 * removing the regional variance component (τ_reg² = 1.35; see
 * scripts/calibrate-regions.py).
 * Binned validation: n=1–2 → rms 6.85; n=8+ → rms 4.42.
 */
export const SIGMA_SYS = 4.1;
export const SIGMA_POLL = 5.45;
const raceSigma = (nPolls: number) =>
  Math.sqrt(SIGMA_SYS * SIGMA_SYS + (SIGMA_POLL * SIGMA_POLL) / nPolls);

/**
 * Extra race-level error for ranked-choice voting races (AK-SEN, ME-SEN).
 * Polls report first-choice margins, but the winner is decided in the final
 * RCV round; transfer flows are unpolled, so σ is widened:
 * σ_eff = √(σ_base² + RCV_EXTRA_SIGMA²). Directional transfer adjustments
 * need round-by-round polling that the seed does not have (roadmap: revisit
 * when RCV-tabulated polls arrive).
 */
export const RCV_EXTRA_SIGMA = 2.0;
const senateSigma = (nPolls: number, rcv = false) => {
  const s = raceSigma(nPolls);
  return rcv ? Math.sqrt(s * s + RCV_EXTRA_SIGMA * RCV_EXTRA_SIGMA) : s;
};

/**
 * Poll counts underpinning each RCP average. ESTIMATES (Oct 2026) by race
 * salience tier — the daily ingest will provide exact counts:
 *   Tier A (n=8): NC, GA, TX, OH, MI — most-polled battlegrounds
 *   Tier B (n=5): NH, IA, ME, MN
 *   Tier C (n=3): AK, KS, FL — lightly polled
 */
export const SENATE_BATTLEGROUND: SenateRace[] = [
  { id: 'NC-SEN', label: 'North Carolina', stateKo: '노스캐롤라이나', chamber: 'senate', demMargin: 9.0, sigma: senateSigma(8), nPolls: 8, demCandidate: 'Roy Cooper', repCandidate: 'Michael Whatley', rating: 'Leans D', note: 'R-held open', region: 'S' },
  { id: 'GA-SEN', label: 'Georgia', stateKo: '조지아', chamber: 'senate', demMargin: 8.0, sigma: senateSigma(8), nPolls: 8, demCandidate: 'Jon Ossoff (inc.)', repCandidate: 'Mike Collins', rating: 'Leans D', note: 'D-held', region: 'S' },
  { id: 'NH-SEN', label: 'New Hampshire', stateKo: '뉴햄프셔', chamber: 'senate', demMargin: 6.4, sigma: senateSigma(5), nPolls: 5, demCandidate: 'Chris Pappas', repCandidate: 'John E. Sununu', rating: 'Leans D', note: 'D-held open', region: 'NE' },
  { id: 'OH-SEN', label: 'Ohio', stateKo: '오하이오', chamber: 'senate', demMargin: 3.7, sigma: senateSigma(8), nPolls: 8, demCandidate: 'Sherrod Brown', repCandidate: 'Jon Husted (appt.)', rating: 'Toss Up', note: 'R-held special', region: 'MW' },
  { id: 'MI-SEN', label: 'Michigan', stateKo: '미시간', chamber: 'senate', demMargin: 3.4, sigma: senateSigma(8), nPolls: 8, demCandidate: 'Abdul El-Sayed', repCandidate: 'Mike Rogers', rating: 'Toss Up', note: 'D-held open', region: 'MW' },
  { id: 'TX-SEN', label: 'Texas', stateKo: '텍사스', chamber: 'senate', demMargin: 2.7, sigma: senateSigma(8), nPolls: 8, demCandidate: 'James Talarico', repCandidate: 'Ken Paxton', rating: 'Toss Up', note: 'R-held open', region: 'S' },
  { id: 'AK-SEN', label: 'Alaska', stateKo: '알래스카', chamber: 'senate', demMargin: 2.3, sigma: senateSigma(3, true), nPolls: 3, demCandidate: 'Mary Peltola', repCandidate: 'Dan Sullivan (inc.)', rating: 'Toss Up', note: 'R-held · RCV', region: 'W' },
  { id: 'MN-SEN', label: 'Minnesota', stateKo: '미네소타', chamber: 'senate', demMargin: 1.6, sigma: senateSigma(5), nPolls: 5, demCandidate: 'Peggy Flanagan', repCandidate: 'Michele Tafoya', rating: 'Toss Up', note: 'D-held open', region: 'MW' },
  { id: 'IA-SEN', label: 'Iowa', stateKo: '아이오와', chamber: 'senate', demMargin: 0.3, sigma: senateSigma(5), nPolls: 5, demCandidate: 'Josh Turek', repCandidate: 'Ashley Hinson', rating: 'Toss Up', note: 'R-held open', region: 'MW' },
  { id: 'ME-SEN', label: 'Maine', stateKo: '메인', chamber: 'senate', demMargin: -0.2, sigma: senateSigma(5, true), nPolls: 5, demCandidate: 'Troy Jackson', repCandidate: 'Susan Collins (inc.)', rating: 'Toss Up', note: 'R-held · RCV', region: 'NE' },
  { id: 'KS-SEN', label: 'Kansas', stateKo: '캔자스', chamber: 'senate', demMargin: -1.5, sigma: senateSigma(3), nPolls: 3, demCandidate: 'Adam Hamilton', repCandidate: 'Roger Marshall (inc.)', rating: 'Toss Up', note: 'R-held', region: 'MW' },
  { id: 'FL-SEN', label: 'Florida', stateKo: '플로리다', chamber: 'senate', demMargin: -6.6, sigma: senateSigma(3), nPolls: 3, demCandidate: 'Angie Nixon', repCandidate: 'Ashley Moody (appt.)', rating: 'Leans R', note: 'R-held special', region: 'S' },
];

/** Senate baseline: 47 Dem-held seats, 4 of them in the battleground set above. */
export const SENATE_BASELINE = {
  safeDemSeats: 43,
  needed: 51,
  note: '53R-47D chamber; Democrats need a net gain of 4',
};

/** House snapshot (team-compiled + RCP). */
export const HOUSE_SNAPSHOT = {
  genericBallotDemMargin: 8.1, // RCP average, Sept 22, 2026
  genericBallotSource: 'RealClearPolitics generic ballot average',
  competitiveDistricts: { dem: 49, rep: 47, n: 37, dates: 'Sept 8–11', source: 'team-compiled district polls' },
};

/**
 * House baseline. All 435 districts are modeled individually (see
 * house-districts.ts), so there are no "safe" seats outside the model;
 * 218 needed for a majority. No cap, no truncation.
 */
export const HOUSE_BASELINE = {
  safeDemSeats: 0,
  needed: 218,
  note: '435 districts modeled individually; 218 needed for a majority',
};

export const MODEL_NOTES = {
  tau: 3.1,
  tauReg: 1.2,
  tauNote: 'National error τ_nat = 3.1 and regional error τ_reg = 1.2 pts, from decomposing cycle polling error into national + Census-region components (2010–2022 Senate polls; see scripts/calibrate-regions.py)',
  sigmaNote: 'Race-level error σ_i = √(σ_sys² + σ_poll²/n_i), σ_sys=4.1, σ_poll=5.45 (calibrated; see scripts/calibrate-sigma.py)',
  sims: 40000,
  seed: 20261103,
};

export const SOURCE_URLS = [
  'https://www.uspresidentialelectionnews.com/2026-senate-polls/',
  'https://www.270toWin.com/2026-senate-polls/new-hampshire',
];
