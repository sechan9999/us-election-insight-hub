// Bilingual content for the "Prediction markets" tab.
// Data: live Polymarket CLOB prices retrieved 2026-10-21 (Yes price = market-implied
// probability). Snapshot, not a live feed — see PM_AS_OF. Every figure below was read
// from an actual Polymarket market; original English question kept for auditability.

import type { Lang } from './i18n';

export type LText = { ko: string; en: string };
const tx = (ko: string, en: string): LText => ({ ko, en });
export const tr = (lang: Lang, t: LText): string => t[lang];

export const PM_AS_OF = '2026-10-21';
export const PM_SOURCE_URL = 'https://polymarket.com';

export const PM_HERO = {
  badges: [
    tx('Polymarket 실시간 가격 스냅샷', 'Polymarket live-price snapshot'),
    tx('기준: 2026년 10월 21일', 'As of October 21, 2026'),
  ],
  title: tx(
    '예측시장이 보는 주식시장',
    'What Prediction Markets Say About the Stock Market',
  ),
  lede: tx(
    'Polymarket은 실제 돈이 걸린 예측 시장입니다. "Yes" 가격 0.865는 시장이 그 사건의 확률을 86.5%로 본다는 뜻입니다. 아래는 금리·지수·경기·빅테크와 중간선거처럼 주식시장과 직접 연결된 시장들을 모은 스냅샷입니다. 여론조사 기반인 이 사이트의 예측 모델과 시장 가격을 나란히 비교할 수 있게 정리했습니다.',
    'Polymarket is a prediction market where real money trades on event outcomes. A Yes price of 0.865 means the market prices that event at 86.5%. Below is a snapshot of the markets most directly tied to equities — rates, the index, the economy, big tech, and the midterms — placed next to this site\'s poll-based model for comparison.',
  ),
  howTo: tx(
    '읽는 법: 확률(%) = Polymarket Yes 가격 × 100. 각 항목의 영어 원문은 실제 시장 질문이며, 링크는 해당 시장 페이지입니다. 가격은 실시간으로 변하므로 이 페이지의 수치는 기준일 스냅샷입니다.',
    'How to read: probability (%) = Polymarket Yes price × 100. The English line under each item is the actual market question, and each card links to its market page. Prices move continuously; figures here are a snapshot as of the date above.',
  ),
};

export type PMItem = {
  label: LText; // short display label
  question: string; // actual Polymarket question (EN)
  yes: number; // Yes price 0..1
  slug: string;
  note?: LText;
};

export type PMSection = {
  heading: LText;
  blurb: LText;
  items: PMItem[];
};

const item = (ko: string, en: string, question: string, yes: number, slug: string, note?: LText): PMItem => ({
  label: tx(ko, en),
  question,
  yes,
  slug,
  note,
});

export const PM_SECTIONS: PMSection[] = [
  {
    heading: tx('1. 금리와 연준 — 주식시장의 최대 변수', '1. Rates & the Fed — the market\'s biggest driver'),
    blurb: tx(
      '시장은 10월 동결을 기정사실로 보되, 12월에는 움직임(인상)을 예상합니다. 2026년 중 금리 인하는 사실상 없다고 봅니다.',
      'The market treats an October hold as near-certain but expects a move in December. A 2026 rate cut is priced as essentially off the table.',
    ),
    items: [
      item('10월 FOMC 동결', 'No change at the October FOMC',
        'Will there be no change in Fed interest rates after the October 2026 meeting?',
        0.865, 'will-there-be-no-change-in-fed-interest-rates-after-the-october-2026-meeting-20260617190324031',
        tx('25bp 인상 확률은 13.5%로, 동결이 압도적입니다.', 'A 25bp hike is priced at just 13.5%; a hold dominates.')),
      item('12월 FOMC 동결', 'No change at the December FOMC',
        'Will there be no change in Fed interest rates after the December 2026 meeting?',
        0.195, 'will-there-be-no-change-in-fed-interest-rates-after-the-december-2026-meeting-20260729232808635',
        tx('동결이 19.5%뿐 — 시장은 12월 인상을 기본 시나리오로 봅니다.', 'Only 19.5% — the market\'s base case is a December hike.')),
      item('2026년 금리 인하 없음', 'No Fed rate cuts in 2026',
        'Will no Fed rate cuts happen in 2026?',
        0.97, 'will-no-fed-rate-cuts-happen-in-2026'),
      item('2026년 인상 2회', 'Two Fed rate hikes in 2026',
        'Will 2 Fed rate hikes happen in 2026?',
        0.695, 'will-2-fed-rate-hikes-happen-in-2026-20260623190852891',
        tx('1회 인상 시장은 20.5%입니다. (각각 독립된 시장이라 합이 100이 되지 않습니다.)', 'The one-hike market sits at 20.5%. (Separate markets — they need not sum to 100.)')),
      item('긴급 금리 인하 (2027년 전)', 'Fed emergency rate cut before 2027',
        'Fed emergency rate cut before 2027?',
        0.034, 'fed-emergency-rate-cut-before-2027'),
      item('10년물 금리 5.5% 도달 (2027년 전)', '10-year Treasury yield hits 5.5% before 2027',
        'Will the 10-year Treasury yield hit 5.5% before 2027?',
        0.253, 'will-the-10-year-treasury-yield-hit-55-before-2027'),
    ],
  },
  {
    heading: tx('2. S&P 500 — 12월 어디까지', '2. S&P 500 — December ranges'),
    blurb: tx(
      '12월 중 해당 지수에 "닿을" 확률입니다. 위쪽 8,200은 34.5%로 열어 두지만 9,300은 1.8%뿐이고, 아래쪽 급락 시나리오(6,200 이하)도 한 자릿수에 머뭅니다.',
      'Probabilities that the index touches each level at any point in December. Upside to 8,200 is a live possibility at 34.5% but 9,300 is a tail at 1.8%; deep downside (6,200 or lower) also stays in single digits.',
    ),
    items: [
      item('12월 중 8,200 터치 (고점)', 'Hits 8,200 high in December',
        'Will S&P 500 (SPX) hit $8,200 (HIGH) in December?',
        0.345, 'spx-hit-8200-high-dec-2026'),
      item('12월 중 9,300 터치 (고점)', 'Hits 9,300 high in December',
        'Will S&P 500 (SPX) hit $9,300 (HIGH) in December?',
        0.018, 'spx-hit-9300-high-dec-2026'),
      item('12월 중 6,200 터치 (저점)', 'Hits 6,200 low in December',
        'Will S&P 500 (SPX) hit $6,200 (LOW) in December?',
        0.078, 'spx-hit-6200-low-dec-2026'),
      item('12월 중 5,800 터치 (저점)', 'Hits 5,800 low in December',
        'Will S&P 500 (SPX) hit $5,800 (LOW) in December?',
        0.031, 'spx-hit-5800-low-dec-2026'),
    ],
  },
  {
    heading: tx('3. 경기와 리스크', '3. Economy & risk'),
    blurb: tx(
      '침체·마이너스 성장·인플레이션 재점화 같은 꼬리 위험은 모두 낮게 가격 매겨져 있습니다. 시장의 기본 그림은 "성장은 이어지고, 물가가 문제"입니다.',
      'Recession, negative growth, and an inflation resurgence are all priced as tail risks. The market\'s base case: growth holds, inflation is the problem.',
    ),
    items: [
      item('2026년 말까지 미국 침체', 'US recession by end of 2026',
        'US recession by end of 2026?',
        0.075, 'us-recession-by-end-of-2026'),
      item('2026년 GDP 마이너스 성장', 'Negative GDP growth in 2026',
        'Negative GDP growth in 2026?',
        0.028, 'negative-gdp-growth-in-2026'),
      item('2026년 인플레이션 5% 초과', 'Inflation above 5% in 2026',
        'Will inflation reach more than 5% in 2026?',
        0.08, 'will-inflation-reach-more-than-5-in-2026-282-763'),
      item('2026년 실업률 5.0% 이상', 'Unemployment at least 5.0% in 2026',
        'Will US unemployment reach at least 5.0% in 2026?',
        0.041, 'will-us-unemployment-reach-at-least-5pt0-in-2026'),
    ],
  },
  {
    heading: tx('4. 빅테크와 AI', '4. Big tech & AI'),
    blurb: tx(
      '연말 시총 1위는 엔비디아가 유력하고, 10월 말 최고 AI 모델은 구글이 우세하지만 연말로 가면 Anthropic이 역전하는 그림입니다. Anthropic의 연내 IPO 확률 80%도 눈에 띕니다.',
      'NVIDIA is favored to end the year as the world\'s largest company. Google leads the best-AI-model race for October, but Anthropic is favored by year-end — and the market prices an Anthropic IPO before 2027 at 80%.',
    ),
    items: [
      item('연말 세계 시총 1위: 엔비디아', 'Largest company Dec 31: NVIDIA',
        'Will NVIDIA be the largest company in the world by market cap on December 31?',
        0.745, 'will-nvidia-be-the-largest-company-in-the-world-by-market-cap-on-december-31-244',
        tx('애플은 22.6%입니다.', 'Apple is at 22.6%.')),
      item('10월 말 최고 AI 모델: 구글', 'Best AI model, end of Oct: Google',
        'Will Google have the best AI model at the end of October 2026?',
        0.807, 'will-google-have-the-best-ai-model-at-the-end-of-october-2026',
        tx('Anthropic은 17.5%입니다.', 'Anthropic is at 17.5%.')),
      item('연말 최고 AI 모델: Anthropic', 'Best AI model, year-end: Anthropic',
        'Will Anthropic have the best AI model at the end of December 2026?',
        0.485, 'will-anthropic-have-the-best-ai-model-at-the-end-of-december-2026',
        tx('구글 41.5%, OpenAI 5.7% — 연말에는 접전입니다.', 'Google 41.5%, OpenAI 5.7% — a close race by year-end.')),
      item('Anthropic, 2027년 전 IPO', 'Anthropic IPO before 2027',
        'Anthropic IPO before 2027?',
        0.80, 'anthropic-ipo-before-2027'),
      item('OpenAI, 2026년 내 IPO', 'OpenAI IPO in 2026',
        'Will OpenAI IPO by December 31 2026?',
        0.046, 'will-openai-ipo-by-december-31-2026'),
    ],
  },
];

export const PM_ELECTION = {
  heading: tx('5. 중간선거 — 시장 vs 이 사이트의 모델', '5. The midterms — the market vs this site\'s model'),
  blurb: tx(
    '같은 질문에 대한 두 개의 답입니다. Polymarket은 돈이 걸린 시장 가격, 우리 모델은 여론조사 기반 40,000회 시뮬레이션입니다. 상원에서는 시장이 우리 모델보다 민주당에 우호적이고, 하원에서는 우리 모델이 더 확신합니다. 어느 쪽이 맞는지는 11월 3일에 갈립니다.',
    'Two answers to the same questions. Polymarket is a money-backed market price; our model is a poll-based simulation run 40,000 times. On the Senate the market is friendlier to Democrats than our model; on the House our model is the more confident one. November 3 settles it.',
  ),
  colMarket: tx('Polymarket', 'Polymarket'),
  colModel: tx('우리 모델 (10/21 기준)', 'Our model (Oct 21)'),
  rows: [
    {
      label: tx('상원 민주당 과반', 'Democratic Senate majority'),
      question: 'Will the Democratic Party control the Senate after the 2026 Midterm elections?',
      slug: 'will-the-democratic-party-control-the-senate-after-the-2026-midterm-elections',
      market: 0.655,
      model: 0.529,
    },
    {
      label: tx('하원 민주당 과반', 'Democratic House majority'),
      question: 'Will the Democratic Party control the House after the 2026 Midterm elections?',
      slug: 'will-the-democratic-party-control-the-house-after-the-2026-midterm-elections',
      market: 0.915,
      model: 0.971,
    },
  ],
  balance: {
    label: tx('권력 균형 조합 (Polymarket)', 'Balance-of-power combinations (Polymarket)'),
    items: [
      { label: tx('민주 상원 + 민주 하원', 'D Senate + D House'), yes: 0.645, slug: '2026-balance-of-power-d-senate-d-house-949' },
      { label: tx('공화 상원 + 민주 하원', 'R Senate + D House'), yes: 0.265, slug: '2026-balance-of-power-r-senate-d-house-444' },
      { label: tx('공화 상원 + 공화 하원', 'R Senate + R House'), yes: 0.075, slug: '2026-balance-of-power-r-senate-r-house-537' },
    ],
  },
};

export const PM_FOOTER = tx(
  '출처: Polymarket (polymarket.com) CLOB 가격, 2026년 10월 21일 조회. 예측 시장 가격은 확률의 추정치일 뿐 보장이 아니며, 거래량이 적은 시장은 크게 출렁일 수 있습니다. 이 페이지는 정보 제공용이며 투자 조언이 아닙니다. OhMyCode LLC는 초당파적 데이터 제공을 지향합니다.',
  'Source: Polymarket (polymarket.com) CLOB prices, retrieved October 21, 2026. Prediction-market prices are probability estimates, not guarantees, and thin markets can swing sharply. For information only — not investment advice. OhMyCode LLC is committed to nonpartisan data.',
);
