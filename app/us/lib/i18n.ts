// Korean / English strings for the US board. Korean is the default; ?lang=en switches.

export type Lang = 'ko' | 'en';

const S = {
  sample: { ko: '샘플 데이터', en: 'Sample data' },
  title: { ko: '미국 중간선거 예측 2026', en: 'US Midterm Forecast 2026' },
  subtitle: {
    ko: '선거일 2026년 11월 3일 · 시뮬레이션 {n}회',
    en: 'Election Day November 3, 2026 · {n} simulations',
  },
  runId: { ko: '예측 run ID', en: 'Forecast run ID' },
  dataAsOf: { ko: '여론조사 기준일', en: 'Polls as of' },
  senateKpi: { ko: '상원 민주당 과반 확률', en: 'P(Democratic Senate majority)' },
  houseKpi: { ko: '하원 민주당 과반 확률', en: 'P(Democratic House majority)' },
  expected: { ko: '기대 의석 {e}석 · 과반 기준 {need}석', en: 'Expected {e} seats · majority = {need}' },
  band: { ko: '80% 범위 {lo}–{hi}석', en: '80% range {lo}–{hi} seats' },
  houseAssume: { ko: '22개 경합 지역구 시뮬레이션 (가정: 민주 안전 의석 {safe}석)', en: '22 toss-up districts simulated (assumes {safe} safe Dem seats)' },
  distTitle: { ko: '민주당 의석 분포', en: 'Democratic seat distribution' },
  distNote: {
    ko: '막대 = 시뮬레이션에서 각 의석수가 나온 비율. 음영 = 80% 범위, 점선 = 과반 기준.',
    en: 'Bars = share of simulations ending at each seat count. Shaded = 80% range, dashed = majority line.',
  },
  battleTitle: { ko: '상원 경합주', en: 'Senate battlegrounds' },
  battleNote: { ko: '민주당 여론조사 우위 (D−R, %p) · 세로 점선 = 4%p 기준선', en: 'Democratic polling margin (D−R, pts) · dashed line = 4-pt mark' },
  detailTitle: { ko: '경합주 상세', en: 'Race details' },
  thState: { ko: '주', en: 'State' },
  thDem: { ko: '민주당', en: 'Democrat' },
  thRep: { ko: '공화당', en: 'Republican' },
  thAvg: { ko: 'RCP 평균', en: 'RCP average' },
  thBand: { ko: '90% 오차 범위', en: '90% margin range' },
  thRating: { ko: '레이팅', en: 'Rating' },
  thProb: { ko: 'P(민주 승리)', en: 'P(Dem win)' },
  pollsTitle: { ko: '최신 개별 여론조사: 뉴욕타임스/시에나', en: 'Latest individual polls: New York Times/Siena' },
  pollsMeta: {
    ko: '가능성 높은 유권자 대상 · {released} 공개 · 전화 조사',
    en: 'Likely voters · released {released} · phone survey',
  },
  pollsSummary: {
    ko: '{n}개 주 중 민주당 우위 {d}곳, 공화당 우위 {r}곳, 동률 {t}곳',
    en: 'Of {n} states: Democrat ahead in {d}, Republican ahead in {r}, tied in {t}',
  },
  pollsVsAvg: { ko: '모형 입력 RCP 평균 {avg}', en: 'RCP average in model {avg}' },
  pollsSample: { ko: '{n}명 · 오차 ±{moe}%p · {dates}', en: 'n={n} · ±{moe} pts · {dates}' },
  pollsTie: { ko: '동률', en: 'Tied' },
  pollsOther: { ko: '다른 조사 기관', en: 'Different pollster' },
  pollsNote: {
    ko: '개별 조사는 참고용이며 모형 입력이 아닙니다. 모형은 RCP 평균만 쓰므로, 이 조사는 평균에 반영된 뒤 다음 run에서 확률에 들어갑니다. 대부분의 격차가 오차범위 안이라 한 조사만으로 우세를 판단하면 안 됩니다.',
    en: 'Individual polls are shown for reference and are not model inputs. The model reads RCP averages only, so these polls reach the probabilities once they enter the average. Most gaps sit inside the margin of error, so no single poll settles a race.',
  },
  houseTitle: { ko: '하원', en: 'House' },
  generic: { ko: '전국 여론조사 평균 (generic ballot)', en: 'Generic ballot average' },
  compDist: { ko: '경합 지역구 조사 ({n}곳)', en: 'Competitive-district polls ({n})' },
  houseSim: { ko: '경합 지역구 시뮬레이션', en: 'Toss-up simulation' },
  houseNote: {
    ko: '지역구별 여론조사가 아직 없어 22개 경합 지역구에 평균(D+2.0)을 일괄 적용한 샘플 시뮬레이션입니다. 일일 여론조사 적재가 시작되면 실제 지역구 수치로 교체됩니다.',
    en: 'District-level polls are not ingested yet, so all 22 toss-ups use the competitive-district average (D+2.0). This is a sample simulation until the daily poll ingest replaces it.',
  },
  liveTitle: { ko: '개표일 실시간 트래커', en: 'Election-night tracker' },
  livePre: {
    ko: '개표 전입니다. 결과가 나오기 전에는 확률과 불확실성 범위만 표시합니다. 선거 당일 개표가 시작되면 이 자리에 확정 의석과 개표율이 표시됩니다.',
    en: 'Counting has not started. Until results arrive the board shows only probabilities and uncertainty ranges. On election night this panel shows called seats and percent reporting.',
  },
  liveDays: { ko: '선거일까지 {d}일', en: '{d} days to Election Day' },
  liveCalled: { ko: '확정', en: 'Called' },
  liveReporting: { ko: '개표율', en: 'Reporting' },
  methodTitle: { ko: '방법론', en: 'Methodology' },
  method1: {
    ko: '각 시뮬레이션은 전국 공통 오차 s ~ N(0, τ²) 하나를 뽑고, 각 지역의 결과 = mᵢ + s + σᵢ·εᵢ 로 계산합니다. s가 모든 지역에 공통 적용되므로 지역들이 함께 움직이는 효과가 반영됩니다.',
    en: 'Each simulation draws one national error s ~ N(0, τ²), then scores every race as mᵢ + s + σᵢ·εᵢ. Because s is shared, races move together the way they do in real elections.',
  },
  mTau: { ko: 'τ = {tau}pt (전국 오차 스케일, 과거 선거의 여론조사 오차로 보정 예정)', en: 'τ = {tau} pts (national error; to be calibrated on past cycles)' },
  mSigma: { ko: 'σᵢ = 4.0pt (지역별 오차, 현재 일괄 적용)', en: 'σᵢ = 4.0 pts (race error, same for all races for now)' },
  mSims: { ko: '{n}회 시뮬레이션 · seed {seed} (같은 입력이면 같은 결과)', en: '{n} simulations · seed {seed} (same inputs give the same result)' },
  mGeneric: { ko: '전국 여론조사는 지역구 결과로 1:1 환원되지 않으므로 직접 사용하지 않음', en: 'The generic ballot is not mapped 1:1 to districts and is not used directly' },
  sources: { ko: '출처', en: 'Sources' },
  charterTitle: { ko: '편집 원칙', en: 'Editorial charter' },
  charter: {
    ko: [
      '이 보드는 특정 후보나 정당을 지지하지 않으며, 정보 제공만을 목적으로 합니다.',
      '모든 숫자에는 출처가 붙습니다. 여론조사 평균은 공개 집계 기준이고, 확률은 run ID로 재현할 수 있습니다.',
      '확률은 결과가 아닙니다. 60% 우세 후보도 열 번 중 네 번은 집니다.',
      '결과 발표 전에는 미래 데이터를 쓰지 않고, 확률과 불확실성 범위로만 표시합니다.',
      '첫 선거 사이클의 모델은 베타입니다. 선거가 끝난 뒤 실제 결과로 검증해 공개합니다.',
    ],
    en: [
      'This board supports no candidate or party; its purpose is information only.',
      'Every number carries a source. Polling averages come from public aggregates; probabilities are reproducible from the run ID.',
      'Probabilities are not results. A 60% favorite loses four times in ten.',
      'No future data is used. Before results, the board shows only probabilities and uncertainty ranges.',
      'The model is in beta for its first cycle and will be scored against actual results after the election.',
    ],
  },
  assumptions: { ko: '공개 전 교체해야 할 가정', en: 'Assumptions to replace before launch' },
  // Rendered in place of the English notes in seed-data.ts. Those strings feed the
  // run-ID hash (run.ts), so the data stays unchanged and only the display is localized.
  aSigma: {
    ko: '지역별 오차 σᵢ = {sigma}pt, 모든 지역 일괄 적용 (가정)',
    en: 'Race-level error σᵢ = {sigma} pts for all races (labeled assumption)',
  },
  aTau: {
    ko: '전국 오차 스케일 τ = {tau}pt (가정, 과거 선거의 여론조사 오차로 보정 예정)',
    en: 'National error scale τ = {tau} pts (labeled assumption; calibrate from historical cycle polling error)',
  },
  aHouseSafe: {
    ko: '하원 민주 안전 의석 {safe}석 (가정, Cook 레이팅 기준 안전 의석으로 교체 예정)',
    en: 'House safe Democratic seats = {safe} (assumption; replace with Cook-rated safe-seat baseline)',
  },
  aHouseTossup: {
    ko: '하원 경합 지역구 {n}곳에 D+2.0 임시값 일괄 적용',
    en: 'House toss-ups: D+2.0 placeholder × {n}',
  },
  liveSource: {
    ko: '개표 시작 전 · 투표 마감 전에는 결과를 표시하지 않습니다',
    en: 'Not started — no results are shown before polls close',
  },
  footer: { ko: '비당파 예측', en: 'Non-partisan forecast' },
  ratingLeansD: { ko: '민주 우세', en: 'Leans D' },
  ratingLeansR: { ko: '공화 우세', en: 'Leans R' },
  ratingTossUp: { ko: '경합', en: 'Toss Up' },
  langSwitch: { ko: 'English', en: '한국어' },
} as const;

type Key = keyof typeof S;

export function t(lang: Lang, key: Key, vars: Record<string, string | number> = {}): string {
  const v = S[key][lang];
  if (typeof v !== 'string') throw new Error(`${key} is a list; use tl()`);
  return v.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? `{${k}}`));
}

const RATING_KEY: Record<string, Key> = {
  'Leans D': 'ratingLeansD',
  'Leans R': 'ratingLeansR',
  'Toss Up': 'ratingTossUp',
};

/** Localize a rating label from the seed data; unknown labels pass through. */
export function tRating(lang: Lang, rating: string): string {
  const key = RATING_KEY[rating];
  return key ? t(lang, key) : rating;
}

export function tl(lang: Lang, key: 'charter'): readonly string[] {
  return S[key][lang];
}
