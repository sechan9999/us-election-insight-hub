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
  { date: '2026-10-23', label: 'Poll refresh Oct 23 (Fox News OH/ME/TX, Emerson TX, TPOR TX, St Anselm NH, CJ/Harper NC, Rasmussen MN, Marist MI)', labelKo: '여론조사 업데이트 10-23 (Fox News 오하이오·메인·텍사스, Emerson 텍사스, TPOR 텍사스, St Anselm 뉴햄프셔, CJ/Harper 노스캐롤라이나, Rasmussen 미네소타, Marist 미시간)', senateP: 52.9, houseP: 97.1 },
  { date: '2026-10-26', label: 'Poll refresh Oct 26 (Trafalgar ME)', labelKo: '여론조사 업데이트 10-26 (Trafalgar 메인)', senateP: 52.7, houseP: 97.1 },
  { date: '2026-10-28', label: 'Poll refresh Oct 28 (12 polls, 8 races: Echelon x5, NYT/Siena MN/FL, Suffolk OH, Glengariff MI, Univision TX, Marist ME, ActiVote FL)', labelKo: '여론조사 업데이트 10-28 (12건, 8개주: Echelon 5건, NYT/Siena 미네소타·플로리다, Suffolk 오하이오, Glengariff 미시간, Univision 텍사스, Marist 메인, ActiVote 플로리다)', senateP: 56.3, houseP: 97.1 },
  { date: '2026-10-28', label: 'Six Oct 22–23 polls added (HK inclusion principle)', labelKo: '10-22–23일 6건 추가 (HK 포함 원칙)', senateP: 55.9, houseP: 97.1 },
  { date: '2026-10-30', label: 'Poll refresh Oct 30 (9 polls, 6 races: CNN/SSRS x4, MSU MI catch-up, CBS/Mitchell MI, TSU TX, UMass Lowell NH, co/efficient IA)', labelKo: '여론조사 업데이트 10-30 (9건, 6개주: CNN/SSRS 4건, MSU 미시간 보충, CBS/Mitchell 미시간, TSU 텍사스, UMass Lowell 뉴햄프셔, co/efficient 아이오와)', senateP: 58.1, houseP: 97.1 },
];
