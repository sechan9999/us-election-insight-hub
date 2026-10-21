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
  { date: '2026-10-18', label: 'Poll refresh Oct 18 (RCP compilation)', labelKo: '여론조사 업데이트 10-18 (RCP 집계)', senateP: 55.1, houseP: 97.1 },
  { date: '2026-10-19', label: 'Poll refresh Oct 19 (CBS/YouGov + UH TX, ActiVote OH)', labelKo: '여론조사 업데이트 10-19 (CBS/YouGov·UH 텍사스, ActiVote 오하이오)', senateP: 54.8, houseP: 97.1 },
  { date: '2026-10-21', label: 'Poll refresh Oct 21 (RCP compilation; Marist OH, ActiVote+Quantus GA, co/efficient IA, NPA NH)', labelKo: '여론조사 업데이트 10-21 (RCP 집계; Marist 오하이오, ActiVote·Quantus 조지아, co/efficient 아이오와, NPA 뉴햄프셔)', senateP: 52.9, houseP: 97.1 },
];
