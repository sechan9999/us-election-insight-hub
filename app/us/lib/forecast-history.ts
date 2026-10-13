// Forecast history: model-iteration snapshots (same data vintage, 2026-10-09).
// Each entry records the headline probabilities after a modeling-roadmap step.
// Honest framing: these are methodology changes, not new polls.

export type HistoryEntry = {
  date: string;
  label: string;
  labelKo: string;
  senateP: number;
  houseP: number;
};

export const FORECAST_HISTORY: HistoryEntry[] = [
  { date: '2026-10-09', label: 'Correlated error + τ calibration (#3–#5)', labelKo: '상관 오차 + τ 보정 (#3–#5)', senateP: 56.3, houseP: 97.3 },
  { date: '2026-10-09', label: 'Time-weighted poll aggregation (#6)', labelKo: '시간가중 여론조사 집계 (#6)', senateP: 58.4, houseP: 97.3 },
  { date: '2026-10-09', label: 'House incumbency adjustment (#7)', labelKo: '하원 현직 조정 (#7)', senateP: 58.4, houseP: 96.6 },
  { date: '2026-10-09', label: 'All 35 Senate seats modeled (#8)', labelKo: '상원 35석 전수 모델링 (#8)', senateP: 53.4, houseP: 96.6 },
];
