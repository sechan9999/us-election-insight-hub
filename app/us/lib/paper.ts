// Bilingual content for the "Research" tab — the MPSA 2027 submitted paper.
// Uses the SUBMITTED abstract/keywords (proposal.md, 2026-10-13), not drafts.
// Status: under review; results expected mid-Nov 2026 – Jan 2027.

import type { Lang } from './i18n';

export type LText = { ko: string; en: string };
const tx = (ko: string, en: string): LText => ({ ko, en });
export const tr = (lang: Lang, t: LText): string => t[lang];

export const PAPER_HERO = {
  badges: [
    tx('MPSA 2027 제출 · 심사 중', 'Submitted to MPSA 2027 · Under review'),
    tx('84회 연례 컨퍼런스 · 시카고 · 2027년 4월 1–4일', '84th Annual Conference · Chicago · April 1–4, 2027'),
  ],
  section: tx('투표 행태 (제11분과) · 선거운동과 선거 (제9분과)', 'Voting Behavior (Sec. 11) · Campaigns and Elections (Sec. 9)'),
  title: tx(
    '카운티 수준의 학력 격차: 교육, 소득, 그리고 2024년 미국 대선 스윙의 지리',
    'The Diploma Divide at the County Level: Education, Income, and the Geography of the 2024 U.S. Presidential Swing',
  ),
  author: tx('Heekyoung "HK" Chun, ScD', 'Heekyoung "HK" Chun, ScD'),
  lede: tx(
    '2024년 대선에서 "학력이 소득을 대신했다"는 주장을 미국 3,100개 이상 카운티의 공개 데이터로 검증한 논문입니다. 모든 수치와 지도는 공개 출처로 거슬러 올라갈 수 있습니다.',
    'A paper testing the claim that education replaced income as the central socioeconomic fault line in the 2024 presidential election — with fully open, reproducible county-level data.',
  ),
};

export const PAPER_ABSTRACT = {
  heading: tx('초록', 'Abstract'),
  body: tx(
    '학력이 미국 대선 투표에서 소득을 대신해 핵심적인 사회경제적 분단선이 되었다 — 이른바 ‘학력 격차(diploma divide)’다. 이 논문은 완전히 공개되고 재현 가능한 데이터를 사용해 카운티 수준에서 이 주장을 검증한다. 하버드 MEDSL의 2020년·2024년 대선 카운티 개표 결과와 미국 센서스 ACS의 카운티 인구통계를 결합해 3,100개 이상 카운티를 분석하고, (1) 2024년 민주당 득표율과 (2) 2020–2024년 카운티 스윙의 인터랙티브 지도를 공개한다.\n\n세 가지 발견. 첫째, 2020년에서 2024년으로의 우향 이동은 거의 모든 카운티에서 일어났다 — 전국적 스윙은 몇몇 지역에 집중된 것이 아니라 지리적으로 광범위했다. 둘째, 카운티 수준에서 학사 학위 이상 성인의 비율은 2024년 민주당 득표율과 r = +0.44의 상관관계를 보이는 반면, 중위 가구소득은 r = +0.29에 그쳤다 — 학력, 인종, 연령, 밀도, 주 고정효과를 통제하면 소득의 효과는 음수로 전환된다. 셋째, 모든 수치가 공개 출처로 거슬러 올라가는 완전히 추적 가능한 파이프라인으로 이 패턴들을 문서화하고, 한영 이중언어 오픈 대시보드로 공개했다.\n\n이 논문은 2024년 대선 직후 학력 격차를 투명하고 재현 가능하게 측정한 카운티 수준의 기여다. 학력 격차는 주별로도 크게 다르다: 뉴욕(졸업생 1pp당 3.9pp)과 애리조나(3.2pp)에서 가장 강하고, 인종 구성이 지배적인 딥사우스에서 가장 약하다. 집계 데이터로부터의 생태학적 추론의 한계를 논의한다.',
    "Education has replaced income as the central socioeconomic fault line in American presidential voting -- the 'diploma divide.' This paper tests that claim at the county level with fully open, reproducible data. I combine Harvard's MEDSL county returns for the 2020 and 2024 presidential elections with U.S. Census American Community Survey county demographics for all 3,100+ U.S. counties, and publish interactive maps of (1) 2024 Democratic vote share and (2) the 2020-2024 county swing.\n\nThree findings. First, the rightward shift from 2020 to 2024 was nearly universal across counties: the national swing was broad-based, not concentrated in a few places. Second, at the county level, the share of adults holding a bachelor's degree correlates with 2024 Democratic vote share at r = +0.44, while median household income correlates at only r = +0.29 -- and turns negative once education, race, age, density, and state fixed effects are held constant. Third, I document these patterns with a fully traceable pipeline in which every figure links back to its public source, released as an open bilingual dashboard.\n\nThe paper contributes a transparent, replicable county-level measurement of the diploma divide in the wake of the 2024 election. The divide also varies sharply across states: strongest in New York (3.9pp per 1pp graduates) and Arizona (3.2pp), weakest in the Deep South where racial composition dominates. I discuss the limits of ecological inference from aggregate data.",
  ),
};

export const PAPER_FINDINGS = {
  heading: tx('세 가지 발견', 'Three findings'),
  items: [
    {
      n: '1',
      title: tx('우향 스윙은 전국적이었다', 'The rightward swing was near-universal'),
      body: tx(
        '2020년→2024년 우향 이동은 소수 지역이 아니라 거의 모든 카운티에서 일어났습니다. 스윙은 지리적으로 광범위했습니다.',
        'The 2020→2024 rightward shift happened in nearly every county — the swing was broad-based and geographic, not concentrated.',
      ),
    },
    {
      n: '2',
      title: tx('학력 r = +0.44, 소득 r = +0.29', 'Education r = +.44, income r = +.29'),
      body: tx(
        '대졸 이상 비율은 민주당 득표율과 +0.44의 상관관계를 보인 반면 중위소득은 +0.29에 그쳤고, 학력·인종·연령·밀도·주 고정효과를 통제하면 소득 효과는 음수로 전환됩니다.',
        'Bachelor’s share correlates with Democratic vote share at +.44 vs. +.29 for median income — and income turns negative once education, race, age, density, and state fixed effects are held constant.',
      ),
    },
    {
      n: '3',
      title: tx('주별 격차: 뉴욕·애리조나가 최대', 'Sharp state variation: NY & AZ strongest'),
      body: tx(
        '학력 격차는 뉴욕(졸업생 1pp당 3.9pp)과 애리조나(3.2pp)에서 가장 강하고, 인종 구성이 지배적인 딥사우스에서 가장 약합니다.',
        'Strongest in New York (3.9pp per 1pp graduates) and Arizona (3.2pp); weakest in the Deep South, where racial composition dominates.',
      ),
    },
  ],
};

export const PAPER_METHODS = {
  heading: tx('데이터와 방법', 'Data & methods'),
  items: [
    tx('하버드 MEDSL 카운티 개표 결과 (2020·2024년 대선)', "Harvard MEDSL county presidential returns (2020 & 2024)"),
    tx('미국 센서스 ACS 카운티 인구통계 (학력·소득·인종·연령)', 'U.S. Census ACS county demographics (education · income · race · age)'),
    tx('3,106개 카운티 · OLS 회귀 (HC1 강건 표준오차)', '3,106 counties · OLS with HC1 robust standard errors'),
    tx('모든 수치·지도는 공개 출처로 추적 가능', 'Every figure traceable to its public source'),
  ],
  note: tx(
    '이 연구는 집계 데이터의 패턴을 기술합니다. 카운티 수준 상관관계를 개인 유권자의 행동으로 직접 해석하는 데에는 한계가 있습니다(생태학적 추론의 문제).',
    'This study describes aggregate patterns. County-level correlations cannot be directly read as individual voter behavior (the ecological inference problem).',
  ),
};

export const PAPER_KEYWORDS = {
  heading: tx('키워드', 'Keywords'),
  body: tx(
    '2024년 대선; 학력 격차; 카운티 수준 분석; 선거 지리; 투표 스윙; 교육; 소득; 공개 데이터; 데이터 시각화',
    '2024 presidential election; diploma divide; county-level analysis; electoral geography; vote swing; education; income; open data; data visualization',
  ),
};

export const PAPER_CTA = {
  heading: tx('인터랙티브 지도로 보기', 'Explore the interactive maps'),
  body: tx(
    '논문의 두 핵심 지도 — 2024년 민주당 득표율과 2020–2024년 카운티 스윙, 그리고 주별 학력 격차 — 를 직접 탐색해 보세요.',
    'Explore the paper’s two core maps — 2024 Democratic vote share, the 2020–2024 county swing, and the state-by-state diploma divide.',
  ),
  button: tx('지도로 보기', 'View the maps'),
};

export const PAPER_FOOTER = tx(
  '이 논문은 MPSA 2027 심사가 진행 중입니다. 게재 확정 시 전문 링크를 공개합니다. 본 연구는 비당파적이며, 특정 정당이나 후보를 지지하지 않습니다.',
  'This paper is under review at MPSA 2027; the full text will be linked upon acceptance. This research is nonpartisan and endorses no party or candidate.',
);
