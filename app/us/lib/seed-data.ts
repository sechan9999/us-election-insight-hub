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
}

export const SENATE_BATTLEGROUND: SenateRace[] = [
  { id: 'NC-SEN', label: 'North Carolina', stateKo: '노스캐롤라이나', chamber: 'senate', demMargin: 9.0, sigma: 4.0, demCandidate: 'Roy Cooper', repCandidate: 'Michael Whatley', rating: 'Leans D', note: 'R-held open' },
  { id: 'GA-SEN', label: 'Georgia', stateKo: '조지아', chamber: 'senate', demMargin: 8.0, sigma: 4.0, demCandidate: 'Jon Ossoff (inc.)', repCandidate: 'Mike Collins', rating: 'Leans D', note: 'D-held' },
  { id: 'NH-SEN', label: 'New Hampshire', stateKo: '뉴햄프셔', chamber: 'senate', demMargin: 6.4, sigma: 4.0, demCandidate: 'Chris Pappas', repCandidate: 'John E. Sununu', rating: 'Leans D', note: 'D-held open' },
  { id: 'OH-SEN', label: 'Ohio', stateKo: '오하이오', chamber: 'senate', demMargin: 3.7, sigma: 4.0, demCandidate: 'Sherrod Brown', repCandidate: 'Jon Husted (appt.)', rating: 'Toss Up', note: 'R-held special' },
  { id: 'MI-SEN', label: 'Michigan', stateKo: '미시간', chamber: 'senate', demMargin: 3.4, sigma: 4.0, demCandidate: 'Abdul El-Sayed', repCandidate: 'Mike Rogers', rating: 'Toss Up', note: 'D-held open' },
  { id: 'TX-SEN', label: 'Texas', stateKo: '텍사스', chamber: 'senate', demMargin: 2.7, sigma: 4.0, demCandidate: 'James Talarico', repCandidate: 'Ken Paxton', rating: 'Toss Up', note: 'R-held open' },
  { id: 'AK-SEN', label: 'Alaska', stateKo: '알래스카', chamber: 'senate', demMargin: 2.3, sigma: 4.0, demCandidate: 'Mary Peltola', repCandidate: 'Dan Sullivan (inc.)', rating: 'Toss Up', note: 'R-held' },
  { id: 'MN-SEN', label: 'Minnesota', stateKo: '미네소타', chamber: 'senate', demMargin: 1.6, sigma: 4.0, demCandidate: 'Peggy Flanagan', repCandidate: 'Michele Tafoya', rating: 'Toss Up', note: 'D-held open' },
  { id: 'IA-SEN', label: 'Iowa', stateKo: '아이오와', chamber: 'senate', demMargin: 0.3, sigma: 4.0, demCandidate: 'Josh Turek', repCandidate: 'Ashley Hinson', rating: 'Toss Up', note: 'R-held open' },
  { id: 'ME-SEN', label: 'Maine', stateKo: '메인', chamber: 'senate', demMargin: -0.2, sigma: 4.0, demCandidate: 'Troy Jackson', repCandidate: 'Susan Collins (inc.)', rating: 'Toss Up', note: 'R-held' },
  { id: 'KS-SEN', label: 'Kansas', stateKo: '캔자스', chamber: 'senate', demMargin: -1.5, sigma: 4.0, demCandidate: 'Adam Hamilton', repCandidate: 'Roger Marshall (inc.)', rating: 'Toss Up', note: 'R-held' },
  { id: 'FL-SEN', label: 'Florida', stateKo: '플로리다', chamber: 'senate', demMargin: -6.6, sigma: 4.0, demCandidate: 'Angie Nixon', repCandidate: 'Ashley Moody (appt.)', rating: 'Leans R', note: 'R-held special' },
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
  tossUps: 22,
};

/**
 * House toss-up placeholder races. District-level polls are not in the seed;
 * every toss-up uses the competitive-district average margin (D+2.0) until the
 * daily ingest replaces them. Labeled SAMPLE wherever shown.
 */
export function houseTossupSeed(): RaceInput[] {
  return Array.from({ length: HOUSE_SNAPSHOT.tossUps }, (_, i) => ({
    id: `TOSSUP-${String(i + 1).padStart(2, '0')}`,
    label: `Toss-up ${i + 1}`,
    chamber: 'house' as const,
    demMargin: HOUSE_SNAPSHOT.competitiveDistricts.dem - HOUSE_SNAPSHOT.competitiveDistricts.rep,
    sigma: 4.0,
  }));
}

/**
 * House baseline. ASSUMPTION: of the 22 toss-ups, 11 are currently D-held, so
 * 214 - 11 = 203 safe Dem seats; 218 needed for a majority. Replace with the
 * Cook-rated baseline before any public release.
 */
export const HOUSE_BASELINE = {
  safeDemSeats: 203,
  needed: 218,
  note: 'ASSUMPTION — replace with Cook-rated safe-seat baseline',
};

export const MODEL_NOTES = {
  tau: 3.5,
  tauNote: 'National error scale τ = 3.5 pts (labeled assumption; calibrate from historical cycle polling error)',
  sigmaNote: 'Race-level error σ_i = 4.0 pts for all races (labeled assumption)',
  sims: 40000,
  seed: 20261103,
};

export const SOURCE_URLS = [
  'https://www.uspresidentialelectionnews.com/2026-senate-polls/',
  'https://www.270toWin.com/2026-senate-polls/new-hampshire',
];
