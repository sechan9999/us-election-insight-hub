// Seed data for the US Election Insights Hub board.
//
// Status: SAMPLE DATA for the working demo. Every figure is labeled with its
// source below; the production board replaces this file with the daily
// BigQuery ingest (electoral_hub.us_polls -> electoral_hub.us_race_forecasts).
//
// Senate battleground margins: time-weighted averages (roadmap #6) of dated
// polls — the RCP average as compiled Oct 21, 2026 (uspresidentialelectionnews.com)
// as a consensus pseudo-poll, plus fresh individual polls released after the
// Oct 21 compilation (Fox News/Beacon-Shaw OH, ME, TX; Emerson/The Hill TX;
// TPOR/Slingshot TX; Saint Anselm NH; Carolina Journal/Harper NC; Rasmussen MN;
// Marist MI) added as dated entries so they are not double-counted. Low-quality
// or timing-ambiguous releases (ActiVote TX Oct 21, Pollfinity TX Oct 22) excluded.
// m_i is the Democratic margin in points (D minus R) as of DATA_AS_OF.

import type { RaceInput } from './forecast';
import { aggregatePolls, type DatedPoll } from './poll-aggregation';

export const DATA_AS_OF = '2026-10-26';
export const DATA_SOURCE = 'RealClearPolitics polling averages (via uspresidentialelectionnews.com), Oct 21, 2026 compilation; RCP component polls fielded ~Sept 14–Oct 11; fresh individual polls released Oct 21–23 added as dated entries; Trafalgar Group ME released Oct 25 added as dated entry';

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
 * Poll counts underpinning each RCP average. ESTIMATES (Oct 18, 2026) by race
 * salience tier — the daily ingest will provide exact counts:
 *   Tier A (n=10): NC, GA, TX, OH, MI — most-polled battlegrounds
 *   Tier B (n=7): NH, IA, ME, MN
 *   Tier C (n=5): AK, KS, FL — lightly polled
 */
/**
 * Dated poll lists per race (roadmap #6). Each list starts with the RCP
 * average as compiled 2026-10-21 as a consensus pseudo-poll
 * (n = nRcpPolls × 600).
 *
 * The RCP consensus is dated 2026-10-08 — the estimated MEDIAN field date of
 * its component polls (RCP averages compiled 10-21 draw on polls fielded
 * ~Sept 14 through Oct 11; per-race windows reported Oct 21 for AK, GA, IA,
 * ME, MI, OH, TX all center on Oct 6–9), not the 10-21 compilation date.
 *
 * Individual polls released after the Oct 21 compilation, added as dated
 * entries below (they are NOT inside the RCP window, so no double-counting):
 * Fox News/Beacon-Shaw OH (released Oct 22), Fox News/Beacon-Shaw ME (Oct 22),
 * Fox News/Beacon-Shaw TX (Oct 22), Emerson/The Hill TX (Oct 22), TPOR/Slingshot
 * TX (Oct 22), Saint Anselm NH (Oct 22), Carolina Journal/Harper NC (Oct 22),
 * Rasmussen MN (Oct 23), Marist MI (released Oct 21, after the morning check),
 * Trafalgar Group ME (released Oct 25, field Oct 21–23).
 * The daily ingest will supply exact poll lists.
 */
const RCP_DATE = '2026-10-08';
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
  { id: 'NC-SEN', label: 'North Carolina', stateKo: '노스캐롤라이나', demCandidate: 'Roy Cooper', repCandidate: 'Michael Whatley', rating: 'Leans D', note: 'R-held open', region: 'S', nRcpPolls: 10,
    polls: [rcp(9.9, 10),
      { margin: 10, fieldEnd: '2026-10-20', n: 600, label: 'Carolina Journal/Harper (released Oct 22)' }] },
  { id: 'GA-SEN', label: 'Georgia', stateKo: '조지아', demCandidate: 'Jon Ossoff (inc.)', repCandidate: 'Mike Collins', rating: 'Leans D', note: 'D-held', region: 'S', nRcpPolls: 10,
    polls: [rcp(8.6, 10)] },
  { id: 'NH-SEN', label: 'New Hampshire', stateKo: '뉴햄프셔', demCandidate: 'Chris Pappas', repCandidate: 'John E. Sununu', rating: 'Leans D', note: 'D-held open', region: 'NE', nRcpPolls: 7,
    polls: [rcp(6.5, 7),
      { margin: 7, fieldEnd: '2026-10-20', n: 1672, label: 'Saint Anselm (released Oct 22)' }] },
  { id: 'OH-SEN', label: 'Ohio', stateKo: '오하이오', demCandidate: 'Sherrod Brown', repCandidate: 'Jon Husted (appt.)', rating: 'Toss Up', note: 'R-held special', region: 'MW', nRcpPolls: 10,
    polls: [rcp(2.4, 10),
      { margin: 5, fieldEnd: '2026-10-19', n: 1592, label: 'Fox News/Beacon-Shaw (released Oct 22)' }] },
  { id: 'MI-SEN', label: 'Michigan', stateKo: '미시간', demCandidate: 'Abdul El-Sayed', repCandidate: 'Mike Rogers', rating: 'Toss Up', note: 'D-held open', region: 'MW', nRcpPolls: 10,
    polls: [rcp(2.0, 10),
      { margin: 2, fieldEnd: '2026-10-18', n: 1185, label: 'Marist (released Oct 21)' }] },
  { id: 'TX-SEN', label: 'Texas', stateKo: '텍사스', demCandidate: 'James Talarico', repCandidate: 'Ken Paxton', rating: 'Toss Up', note: 'R-held open', region: 'S', nRcpPolls: 10,
    polls: [rcp(2.2, 10),
      { margin: 0, fieldEnd: '2026-10-19', n: 1398, label: 'Fox News/Beacon-Shaw (released Oct 22)' },
      { margin: 2, fieldEnd: '2026-10-19', n: 1000, label: 'Emerson/The Hill (released Oct 22)' },
      { margin: 4, fieldEnd: '2026-10-18', n: 969, label: 'TPOR/Slingshot (released Oct 22)' }] },
  { id: 'AK-SEN', label: 'Alaska', stateKo: '알래스카', demCandidate: 'Mary Peltola', repCandidate: 'Dan Sullivan (inc.)', rating: 'Toss Up', note: 'R-held · RCV', region: 'W', nRcpPolls: 5, rcv: true,
    polls: [rcp(2.2, 5)] },
  { id: 'MN-SEN', label: 'Minnesota', stateKo: '미네소타', demCandidate: 'Peggy Flanagan', repCandidate: 'Michele Tafoya', rating: 'Toss Up', note: 'D-held open', region: 'MW', nRcpPolls: 7,
    polls: [rcp(3.2, 7),
      { margin: 3, fieldEnd: '2026-10-21', n: 1182, label: 'Rasmussen (released Oct 23)' }] },
  { id: 'IA-SEN', label: 'Iowa', stateKo: '아이오와', demCandidate: 'Josh Turek', repCandidate: 'Ashley Hinson', rating: 'Toss Up', note: 'R-held open', region: 'MW', nRcpPolls: 7,
    polls: [rcp(-0.1, 7)] },
  { id: 'ME-SEN', label: 'Maine', stateKo: '메인', demCandidate: 'Troy Jackson', repCandidate: 'Susan Collins (inc.)', rating: 'Toss Up', note: 'R-held · RCV', region: 'NE', nRcpPolls: 7, rcv: true,
    polls: [rcp(1.6, 7),
      { margin: 0, fieldEnd: '2026-10-20', n: 1514, label: 'Fox News/Beacon-Shaw (released Oct 22)' },
      { margin: 0, fieldEnd: '2026-10-23', n: 1077, label: 'Trafalgar Group (released Oct 25)' }] },
  { id: 'KS-SEN', label: 'Kansas', stateKo: '캔자스', demCandidate: 'Adam Hamilton', repCandidate: 'Roger Marshall (inc.)', rating: 'Toss Up', note: 'R-held', region: 'MW', nRcpPolls: 5,
    polls: [rcp(-0.3, 5)] },
  { id: 'FL-SEN', label: 'Florida', stateKo: '플로리다', demCandidate: 'Angie Nixon', repCandidate: 'Ashley Moody (appt.)', rating: 'Leans R', note: 'R-held special', region: 'S', nRcpPolls: 5,
    polls: [rcp(-6.8, 5)] },
];

/**
 * Build SenateRace entries: m_i from time-weighted poll aggregation as of
 * DATA_AS_OF; σ_i from total poll count (RCP polls + fresh polls).
 */
/** Poll bias adjustment applied to poll-derived Senate margins (see MODEL_NOTES).
 *  Set to 0 on 2026-10-11 per HK's decision: the D+1.34 midterm average bias
 *  (2014 +2.72, 2018 +0.35, 2022 +0.96) was measured, but its cycle-to-cycle
 *  instability and post-2020 pollster methodology changes make any fixed
 *  correction too judgment-heavy. Revisit if 2026 polling error becomes clear. */
const POLL_BIAS_ADJUST = 0;

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
  genericBallotDemMargin: 8.3, // RCP average, Oct 22, 2026 (down 0.3 from Oct 20 baseline of 8.6)
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
   *  Currently 0 (no correction) per HK's 2026-10-11 decision. A D+1.34 average
   *  bias was measured in midterms (2014 +2.72, 2018 +0.35, 2022 +0.96), but
   *  cycle instability makes a fixed correction too judgment-heavy.
   *  Would apply to poll-derived margins only (12 Senate battlegrounds), not
   *  fundamentals-based races. See scripts/backtest.py. */
  pollBiasAdjust: POLL_BIAS_ADJUST,
};

export const SOURCE_URLS = [
  'https://www.uspresidentialelectionnews.com/2026-senate-polls/',
  'https://www.270toWin.com/2026-senate-polls/new-hampshire',
];
