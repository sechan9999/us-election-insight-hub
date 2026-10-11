// Seed data for the US Election Insights Hub board.
//
// Status: SAMPLE DATA for the working demo. Every figure is labeled with its
// source below; the production board replaces this file with the daily
// BigQuery ingest (electoral_hub.us_polls -> electoral_hub.us_race_forecasts).
//
// Senate battleground margins: time-weighted averages (roadmap #6) of dated
// polls — the RCP average as compiled Oct 1, 2026 (uspresidentialelectionnews.com)
// as a consensus pseudo-poll, plus fresh individual polls released since.
// m_i is the Democratic margin in points (D minus R) as of DATA_AS_OF.

import type { RaceInput } from './forecast';
import { aggregatePolls, type DatedPoll } from './poll-aggregation';

export const DATA_AS_OF = '2026-10-09';
export const DATA_SOURCE = 'RealClearPolitics polling averages (via uspresidentialelectionnews.com) + individual polls';

export interface SenateRace extends RaceInput {
  stateKo: string;
  demCandidate: string;
  repCandidate: string;
  rating: string;
  note?: string;
  nPolls: number; // total polls (RCP polls behind consensus + fresh individual polls)
  trendPerDay: number; // pts/day from weighted linear trend (for display; not extrapolated)
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
/**
 * Dated poll lists per race (roadmap #6). Each list starts with the RCP
 * average as compiled 2026-10-01 as a consensus pseudo-poll
 * (n = nRcpPolls × 600), followed by fresh individual polls released since.
 *
 * The RCP consensus is dated 2026-09-20 — the estimated MEDIAN field date of
 * its component polls (RCP averages compiled 10-01 draw on mid-to-late
 * September polls), not the 10-01 compilation date. Dating it at compilation
 * would make it look newer than the fresh polls and underweight them.
 *
 * Fresh polls may overlap the RCP window slightly; the time-decay weighting
 * limits double-counting. The daily ingest will supply exact poll lists.
 */
const RCP_DATE = '2026-09-20';
const rcp = (margin: number, nRcpPolls: number): DatedPoll => ({
  margin, fieldEnd: RCP_DATE, n: nRcpPolls * 600, label: `RCP average (${nRcpPolls} polls)`,
});

interface RaceDef {
  id: string; label: string; stateKo: string;
  demCandidate: string; repCandidate: string; rating: string; note?: string;
  region: 'NE' | 'MW' | 'S' | 'W';
  nRcpPolls: number; rcv?: boolean;
  polls: DatedPoll[];
}

const RACE_DEFS: RaceDef[] = [
  { id: 'NC-SEN', label: 'North Carolina', stateKo: '노스캐롤라이나', demCandidate: 'Roy Cooper', repCandidate: 'Michael Whatley', rating: 'Leans D', note: 'R-held open', region: 'S', nRcpPolls: 8,
    polls: [rcp(9.0, 8)] },
  { id: 'GA-SEN', label: 'Georgia', stateKo: '조지아', demCandidate: 'Jon Ossoff (inc.)', repCandidate: 'Mike Collins', rating: 'Leans D', note: 'D-held', region: 'S', nRcpPolls: 8,
    polls: [rcp(8.0, 8), { margin: 10, fieldEnd: '2026-10-04', n: 600, label: 'Wedgewood' }] },
  { id: 'NH-SEN', label: 'New Hampshire', stateKo: '뉴햄프셔', demCandidate: 'Chris Pappas', repCandidate: 'John E. Sununu', rating: 'Leans D', note: 'D-held open', region: 'NE', nRcpPolls: 5,
    polls: [rcp(6.4, 5)] },
  { id: 'OH-SEN', label: 'Ohio', stateKo: '오하이오', demCandidate: 'Sherrod Brown', repCandidate: 'Jon Husted (appt.)', rating: 'Toss Up', note: 'R-held special', region: 'MW', nRcpPolls: 8,
    polls: [rcp(3.7, 8), { margin: 3, fieldEnd: '2026-10-01', n: 616, label: 'NYT/Siena' }] },
  { id: 'MI-SEN', label: 'Michigan', stateKo: '미시간', demCandidate: 'Abdul El-Sayed', repCandidate: 'Mike Rogers', rating: 'Toss Up', note: 'D-held open', region: 'MW', nRcpPolls: 8,
    polls: [rcp(3.4, 8)] },
  { id: 'TX-SEN', label: 'Texas', stateKo: '텍사스', demCandidate: 'James Talarico', repCandidate: 'Ken Paxton', rating: 'Toss Up', note: 'R-held open', region: 'S', nRcpPolls: 8,
    polls: [rcp(2.7, 8), { margin: 6, fieldEnd: '2026-09-30', n: 615, label: 'NYT/Siena' }] },
  { id: 'AK-SEN', label: 'Alaska', stateKo: '알래스카', demCandidate: 'Mary Peltola', repCandidate: 'Dan Sullivan (inc.)', rating: 'Toss Up', note: 'R-held · RCV', region: 'W', nRcpPolls: 3, rcv: true,
    polls: [rcp(2.3, 3), { margin: 7, fieldEnd: '2026-10-01', n: 504, label: 'NYT/Siena' }] },
  { id: 'MN-SEN', label: 'Minnesota', stateKo: '미네소타', demCandidate: 'Peggy Flanagan', repCandidate: 'Michele Tafoya', rating: 'Toss Up', note: 'D-held open', region: 'MW', nRcpPolls: 5,
    polls: [rcp(1.6, 5)] },
  { id: 'IA-SEN', label: 'Iowa', stateKo: '아이오와', demCandidate: 'Josh Turek', repCandidate: 'Ashley Hinson', rating: 'Toss Up', note: 'R-held open', region: 'MW', nRcpPolls: 5,
    polls: [rcp(0.3, 5), { margin: -1, fieldEnd: '2026-10-01', n: 606, label: 'NYT/Siena' }] },
  { id: 'ME-SEN', label: 'Maine', stateKo: '메인', demCandidate: 'Troy Jackson', repCandidate: 'Susan Collins (inc.)', rating: 'Toss Up', note: 'R-held · RCV', region: 'NE', nRcpPolls: 5, rcv: true,
    polls: [rcp(-0.2, 5)] },
  { id: 'KS-SEN', label: 'Kansas', stateKo: '캔자스', demCandidate: 'Adam Hamilton', repCandidate: 'Roger Marshall (inc.)', rating: 'Toss Up', note: 'R-held', region: 'MW', nRcpPolls: 3,
    polls: [rcp(-1.5, 3), { margin: 0, fieldEnd: '2026-09-30', n: 605, label: 'NYT/Siena' }] },
  { id: 'FL-SEN', label: 'Florida', stateKo: '플로리다', demCandidate: 'Angie Nixon', repCandidate: 'Ashley Moody (appt.)', rating: 'Leans R', note: 'R-held special', region: 'S', nRcpPolls: 3,
    polls: [rcp(-6.6, 3)] },
];

/**
 * Build SenateRace entries: m_i from time-weighted poll aggregation as of
 * DATA_AS_OF; σ_i from total poll count (RCP polls + fresh polls).
 */
/** Poll bias adjustment applied to poll-derived Senate margins (see MODEL_NOTES). */
const POLL_BIAS_ADJUST = 0.7;

function buildRace(def: RaceDef): SenateRace {
  const agg = aggregatePolls(def.polls, { asOf: DATA_AS_OF });
  const nTotal = def.nRcpPolls + (def.polls.length - 1);
  return {
    id: def.id,
    label: def.label,
    chamber: 'senate',
    demMargin: Math.round((agg.margin - POLL_BIAS_ADJUST) * 10) / 10,
    sigma: senateSigma(nTotal, def.rcv ?? false),
    region: def.region,
    stateKo: def.stateKo,
    demCandidate: def.demCandidate,
    repCandidate: def.repCandidate,
    rating: def.rating,
    note: def.note,
    nPolls: nTotal,
    trendPerDay: Math.round(agg.trendPerDay * 100) / 100,
  };
}

export const SENATE_BATTLEGROUND: SenateRace[] = RACE_DEFS.map(buildRace);

/**
 * Non-battleground Senate seats up in 2026 (roadmap #8): 23 seats modeled
 * with fundamentals-based margins instead of being fixed as "safe".
 *
 *   margin_i = state_2024_pres_margin + incumbency_bump
 *
 * incumbency_bump = +4 (D incumbent) / -4 (R incumbent) / ±2 (appointee) / 0 (open).
 * σ = 6.5 for all (fundamentals-only, no polls; judgment call flagged for #9).
 * Ratings and open-seat status from Cook Political Report, July 1, 2026.
 */
interface FundDef {
  id: string; label: string; stateKo: string; region: 'NE' | 'MW' | 'S' | 'W';
  presMargin2024: number; incumb: 'D' | 'R' | 'D-app' | 'R-app' | 'open';
}

const FUND_DEFS: FundDef[] = [
  // Democratic-held (9)
  { id: 'CO-SEN', label: 'Colorado', stateKo: '콜로라도', region: 'W', presMargin2024: 11.3, incumb: 'D' },
  { id: 'DE-SEN', label: 'Delaware', stateKo: '델라웨어', region: 'S', presMargin2024: 15.0, incumb: 'D' },
  { id: 'IL-SEN', label: 'Illinois', stateKo: '일리노이', region: 'MW', presMargin2024: 11.1, incumb: 'open' },
  { id: 'MA-SEN', label: 'Massachusetts', stateKo: '매사추세츠', region: 'NE', presMargin2024: 25.9, incumb: 'D' },
  { id: 'NJ-SEN', label: 'New Jersey', stateKo: '뉴저지', region: 'NE', presMargin2024: 5.7, incumb: 'D' },
  { id: 'NM-SEN', label: 'New Mexico', stateKo: '뉴멕시코', region: 'W', presMargin2024: 6.1, incumb: 'D' },
  { id: 'OR-SEN', label: 'Oregon', stateKo: '오리건', region: 'W', presMargin2024: 6.5, incumb: 'D' },
  { id: 'RI-SEN', label: 'Rhode Island', stateKo: '로드아일랜드', region: 'NE', presMargin2024: 14.1, incumb: 'D' },
  { id: 'VA-SEN', label: 'Virginia', stateKo: '버지니아', region: 'S', presMargin2024: 5.9, incumb: 'D' },
  // Republican-held (14)
  { id: 'AL-SEN', label: 'Alabama', stateKo: '앨라배마', region: 'S', presMargin2024: -30.9, incumb: 'open' },
  { id: 'AR-SEN', label: 'Arkansas', stateKo: '아칸소', region: 'S', presMargin2024: -31.3, incumb: 'R' },
  { id: 'ID-SEN', label: 'Idaho', stateKo: '아이다호', region: 'W', presMargin2024: -37.5, incumb: 'R' },
  { id: 'KY-SEN', label: 'Kentucky', stateKo: '켄터키', region: 'S', presMargin2024: -31.0, incumb: 'open' },
  { id: 'LA-SEN', label: 'Louisiana', stateKo: '루이지애나', region: 'S', presMargin2024: -21.4, incumb: 'open' },
  { id: 'MS-SEN', label: 'Mississippi', stateKo: '미시시피', region: 'S', presMargin2024: -23.1, incumb: 'R' },
  { id: 'MT-SEN', label: 'Montana', stateKo: '몬태나', region: 'W', presMargin2024: -20.6, incumb: 'open' },
  { id: 'NE-SEN', label: 'Nebraska', stateKo: '네브래스카', region: 'MW', presMargin2024: -20.8, incumb: 'R-app' },
  { id: 'OK-SEN', label: 'Oklahoma', stateKo: '오클라호마', region: 'S', presMargin2024: -34.9, incumb: 'open' },
  { id: 'SC-SEN', label: 'South Carolina', stateKo: '사우스캐롤라이나', region: 'S', presMargin2024: -18.1, incumb: 'R' },
  { id: 'SD-SEN', label: 'South Dakota', stateKo: '사우스다코타', region: 'MW', presMargin2024: -29.9, incumb: 'R' },
  { id: 'TN-SEN', label: 'Tennessee', stateKo: '테네시', region: 'S', presMargin2024: -30.1, incumb: 'R' },
  { id: 'WV-SEN', label: 'West Virginia', stateKo: '웨스트버지니아', region: 'S', presMargin2024: -42.7, incumb: 'R' },
  { id: 'WY-SEN', label: 'Wyoming', stateKo: '와이오밍', region: 'W', presMargin2024: -47.0, incumb: 'open' },
];

const INCUMB_BUMP_SENATE = 4.0;

function incumbBump(incumb: FundDef['incumb']): number {
  switch (incumb) {
    case 'D': return INCUMB_BUMP_SENATE;
    case 'R': return -INCUMB_BUMP_SENATE;
    case 'D-app': return INCUMB_BUMP_SENATE / 2;
    case 'R-app': return -INCUMB_BUMP_SENATE / 2;
    default: return 0;
  }
}

export const SENATE_FUNDAMENTALS: RaceInput[] = FUND_DEFS.map((d) => ({
  id: d.id,
  label: d.label,
  chamber: 'senate' as const,
  demMargin: Math.round((d.presMargin2024 + incumbBump(d.incumb)) * 10) / 10,
  sigma: 6.5,
  region: d.region,
}));

/** All Senate seats contested in 2026: 12 battlegrounds + 23 fundamentals. */
export const SENATE_ALL: RaceInput[] = [...SENATE_BATTLEGROUND, ...SENATE_FUNDAMENTALS];

/** Senate baseline: 47 Dem-aligned seats; 13 up in 2026, so 34 are truly safe (not contested). */
export const SENATE_BASELINE = {
  safeDemSeats: 34,
  needed: 51,
  note: '53R-47D chamber; 35 seats up in 2026 (12 battleground + 23 fundamentals-modeled); Democrats need a net gain of 4',
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
  /** Poll bias adjustment (pts, subtracted from Dem margin). See POLL_BIAS_ADJUST above.
   *  Midterm cycles averaged D+1.34 bias (2014 +2.72, 2018 +0.35, 2022 +0.96);
   *  we apply half (0.7) as shrinkage toward zero given cycle-to-cycle
   *  instability and post-2020 pollster methodology changes.
   *  Applies to poll-derived margins only (12 Senate battlegrounds), not
   *  fundamentals-based races. See scripts/backtest.py. */
  pollBiasAdjust: POLL_BIAS_ADJUST,
};

export const SOURCE_URLS = [
  'https://www.uspresidentialelectionnews.com/2026-senate-polls/',
  'https://www.270toWin.com/2026-senate-polls/new-hampshire',
];
