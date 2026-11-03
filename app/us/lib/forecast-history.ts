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
  { date: '2026-10-31', label: 'Poll refresh Oct 31 (13 polls, 8 races: HK catch-ups St. Pete FL, High Point NC, Rasmussen NH + Oct 30 releases DFP x3, Quantus TX, Big Data FL, InsiderAdvantage FL, WaPo/Emerson KS, KSTP MN, ASR AK; House GB 8.3→8.2)', labelKo: '여론조사 업데이트 10-31 (13건, 8개주: HK 보충 St. Pete 플로리다, High Point 노스캐롤라이나, Rasmussen 뉴햄프셔 + 10-30 공개 DFP 3건, Quantus 텍사스, Big Data 플로리다, InsiderAdvantage 플로리다, WaPo/Emerson 캔자스, KSTP 미네소타, ASR 알래스카; 하원 GB 8.3→8.2)', senateP: 60.3, houseP: 96.9 },
  { date: '2026-11-01', label: 'Poll refresh Nov 1 (6 polls, 4 races: HK catch-ups ActiVote TX, A2 Insights TX, UNF FL, Palafox FL, RedBox KS + ActiVote OH Oct 31)', labelKo: '여론조사 업데이트 11-01 (6건, 4개주: HK 보충 ActiVote 텍사스, A2 Insights 텍사스, UNF 플로리다, Palafox 플로리다, RedBox 캔자스 + ActiVote 오하이오 10-31)', senateP: 59.6, houseP: 96.9 },
  { date: '2026-11-02', label: 'Poll refresh Nov 2 (16 polls, 9 races: HK decision Nov 2 Stetson FL, Kreate TX, Rasmussen MI, Upswing MI + NYT/Siena final round x7 + YouGov Nov 1 x4 + Trafalgar TX; House GB unchanged 8.2)', labelKo: '여론조사 업데이트 11-02 (16건, 9개주: HK 결정 11-02 Stetson 플로리다, Kreate 텍사스, Rasmussen 미시간, Upswing 미시간 + NYT/Siena 최종 x7 + YouGov 11-01 x4 + Trafalgar 텍사스; 하원 GB 변동 없음 8.2)', senateP: 62.1, houseP: 96.9 },
  { date: '2026-11-03', label: 'Poll refresh Nov 3 (32 polls, 11 races: Poll Vault/Emerson x4, AtlasIntel x3, Trafalgar x2, Research Co. Nov 1 x3 + Nov 2 x3, Survey 160 x4, UNH x2, Rasmussen x2, InsiderAdvantage x3, YouGov final round x3, RedBox FL, Zogby MI, Concord MI; House GB unchanged 8.2)', labelKo: '여론조사 업데이트 11-03 (32건, 11개주: Poll Vault/Emerson 4건, AtlasIntel 3건, Trafalgar 2건, Research Co. 11-01 3건 + 11-02 3건, Survey 160 4건, UNH 2건, Rasmussen 2건, InsiderAdvantage 3건, YouGov 최종 3건, RedBox 플로리다, Zogby 미시간, Concord 미시간; 하원 GB 변동 없음 8.2)', senateP: 65.1, houseP: 96.9 },
];
