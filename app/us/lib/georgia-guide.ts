// Bilingual content for the Georgia 2026 voting-guide tab.
// Facts verified 2026-10-15 against SOS / Gwinnett County / Ballotpedia / LegiScan.
// Nonpartisan: procedures, dates, offices, and ballot-question explainers only.

import type { Lang } from './i18n';

export type LText = { ko: string; en: string };
const tx = (ko: string, en: string): LText => ({ ko, en });

// ── Hero ────────────────────────────────────────────────────────────────
export const GA_HERO = {
  badges: [
    tx('선거일 · 2026년 11월 3일 (화)', 'Election Day · Tuesday, November 3, 2026'),
    tx('사전투표 진행 중', 'Early voting underway'),
    tx('조지아주 전역', 'Statewide Georgia'),
  ],
  title: tx('2026 조지아 투표, 한글로 쉽게 정리했습니다', '2026 Georgia voting, explained plainly'),
  lede: tx(
    '연방 상·하원부터 주지사, 카운티 선거, 그리고 투표용지 맨 아래 개헌안 3개와 주민투표 1개까지 — 언제, 어디서, 무엇을 뽑는지 투표소에 가기 전에 한 번에 확인하세요.',
    'From U.S. Senate and House to governor, county offices, and the 3 constitutional amendments plus 1 referendum at the bottom of the ballot — when, where, and what you are voting on, all in one place before you head to the polls.',
  ),
  kpis: [
    {
      label: tx('사전투표', 'Early voting'),
      value: tx('10월 13일 – 30일', 'October 13 – 30'),
    },
    {
      label: tx('선거일 투표', 'Election Day voting'),
      value: tx('11월 3일 오전 7시 – 오후 7시', 'Nov 3, 7:00 AM – 7:00 PM'),
    },
    {
      label: tx('우편투표 신청 마감', 'Absentee request deadline'),
      value: tx('10월 23일 (금)', 'October 23 (Fri)'),
    },
  ],
  countdown: (days: number, hours: number, earlyOver: boolean) => {
    const remainKo =
      [days > 0 ? `${days}일` : '', hours > 0 ? `${hours}시간` : ''].filter(Boolean).join(' ') || '1시간 미만';
    const remainEn =
      [days > 0 ? `${days} days` : '', hours > 0 ? `${hours} hours` : ''].filter(Boolean).join(' ') ||
      'under 1 hour';
    return tx(
      earlyOver
        ? `선거일까지 ${remainKo} 남았습니다. 사전투표는 종료되었습니다. 선거일(11월 3일)에 투표하세요.`
        : `선거일까지 ${remainKo} 남았습니다. 사전투표는 10월 30일(금)까지 할 수 있습니다.`,
      earlyOver
        ? `${remainEn} until Election Day. Early voting has ended — vote on Election Day, November 3.`
        : `${remainEn} until Election Day. Early voting runs through Friday, October 30.`,
    );
  },
  badgeEarlyOver: tx('사전투표 종료', 'Early voting ended'),
  countdownToday: tx(
    '오늘은 선거일입니다. 오후 7시까지 줄에 서 있으면 투표할 수 있습니다.',
    'Today is Election Day. If you are in line by 7:00 PM, you can vote.',
  ),
  countdownPast: tx(
    '2026년 본선거가 끝났습니다. 이 안내는 보관용입니다.',
    'The 2026 general election has ended. This guide is kept for reference.',
  ),
};

// ── Section 1: three ways to vote ───────────────────────────────────────
export const GA_WAYS: { tag: LText; title: LText; date: LText; points: LText[] }[] = [
  {
    tag: tx('사전투표 · EARLY VOTING', 'EARLY VOTING'),
    title: tx('미리 가서 투표하기', 'Vote early in person'),
    date: tx('10월 13일(화) – 10월 30일(금)', 'Tuesday, October 13 – Friday, October 30'),
    points: [
      tx('내가 사는 카운티 안의 어느 사전투표소에서든 투표할 수 있습니다.', 'You can vote at any early-voting site in your county.'),
      tx('토요일 투표는 10월 17일과 24일, 두 번 모두 열립니다.', 'Saturday voting is open both October 17 and 24.'),
      tx('일요일 투표는 10월 18일과 25일 — 카운티마다 다르니 확인이 필요합니다.', 'Sunday voting (Oct 18 & 25) varies by county — check yours.'),
      tx('시간과 장소는 카운티마다 다릅니다. 아래 공식 사이트에서 확인하세요.', 'Hours and locations vary by county. Check the official site below.'),
    ],
  },
  {
    tag: tx('선거일 · ELECTION DAY', 'ELECTION DAY'),
    title: tx('선거 당일 투표하기', 'Vote on Election Day'),
    date: tx('11월 3일(화) 오전 7시 – 오후 7시', 'Tuesday, November 3, 7:00 AM – 7:00 PM'),
    points: [
      tx('선거일에는 내 주소지에 지정된 투표소에서만 투표할 수 있습니다. (사전투표와 다릅니다)', 'On Election Day you must vote at your assigned precinct — unlike early voting.'),
      tx('오후 7시까지 줄을 서 있으면 마감 시간이 지나도 투표할 수 있습니다.', 'If you are in line by 7:00 PM, you can still vote after the deadline.'),
      tx('사진이 있는 신분증을 꼭 가져가세요.', 'Bring a photo ID.'),
    ],
  },
  {
    tag: tx('우편투표 · ABSENTEE BY MAIL', 'ABSENTEE BY MAIL'),
    title: tx('우편으로 투표하기', 'Vote by mail'),
    date: tx('신청 마감 10월 23일(금)', 'Request by Friday, October 23'),
    points: [
      tx('조지아 등록 유권자라면 사유 없이 누구나 신청할 수 있습니다.', 'Any registered Georgia voter may request one — no excuse needed.'),
      tx('작성한 투표용지는 11월 3일 오후 7시까지 카운티 선거사무소에 도착해야 합니다.', 'Your completed ballot must ARRIVE at the county elections office by 7:00 PM on November 3.'),
      tx('소인(우체국 도장)만으로는 안 됩니다. 늦을 것 같으면 직접 가져가거나 드롭박스를 이용하세요.', 'A postmark is not enough. If time is tight, deliver it in person or use a drop box.'),
    ],
  },
];

export const GA_MISTAKES = tx(
  '가장 흔한 실수 두 가지 — ① 선거일에 사전투표소로 가는 것 (선거일에는 지정 투표소만 가능), ② 우편투표용지를 마감 직전에 부치는 것 (도착 기준이라 소용없습니다). 우편투표는 여유 있게 보내세요.',
  'Two most common mistakes — ① going to an early-voting site on Election Day (assigned precinct only that day), ② mailing your absentee ballot at the last minute (it is the arrival date that counts, not the postmark). Mail it with time to spare.',
);

// ── Section 2: key dates ────────────────────────────────────────────────
export const GA_DATES: { date: LText; note: LText; hot?: boolean }[] = [
  { date: tx('10월 13일 (화)', 'Tue, Oct 13'), note: tx('사전투표 시작. 카운티 내 어느 사전투표소에서든 투표 가능.', 'Early voting begins. Vote at any early-voting site in your county.') },
  { date: tx('10월 17일 (토) · 24일 (토)', 'Sat, Oct 17 & 24'), note: tx('토요일 사전투표. 평일에 시간이 없는 분들을 위한 날입니다.', 'Saturday early voting — for those who cannot make it on weekdays.') },
  { date: tx('10월 18일 (일) · 25일 (일)', 'Sun, Oct 18 & 25'), note: tx('일요일 사전투표 — 카운티에 따라 열 수도, 안 열 수도 있습니다. 내 카운티부터 확인하세요.', 'Sunday early voting — offered in some counties only. Check yours first.') },
  { date: tx('10월 23일 (금)', 'Fri, Oct 23'), note: tx('우편투표 신청 마감. 우편투표를 할 계획이면 이날까지 신청해야 합니다.', 'Absentee ballot request deadline. Request by this day if you plan to vote by mail.') },
  { date: tx('10월 30일 (금)', 'Fri, Oct 30'), note: tx('사전투표 마지막 날. 이후에는 선거일 당일에만 투표할 수 있습니다.', 'Last day of early voting. After this, only Election Day voting remains.') },
  { date: tx('11월 3일 (화)', 'Tue, Nov 3'), note: tx('본 투표일, 오전 7시 – 오후 7시, 지정 투표소에서 투표. 우편투표용지 도착 마감도 이날 오후 7시입니다.', 'Election Day, 7:00 AM – 7:00 PM at your assigned precinct. Absentee ballots must also arrive by 7:00 PM.'), hot: true },
];

export const GA_SECTION2_NOTE = tx(
  '오늘은 10월 15일 — 사전투표가 이미 시작했습니다.',
  'Today is October 15 — early voting has already begun.',
);

// ── Section 3: what is on the ballot ────────────────────────────────────
export const GA_BALLOT: { icon: string; title: LText; items: LText[] }[] = [
  {
    icon: '🏛️',
    title: tx('연방 선거', 'FEDERAL'),
    items: [
      tx('연방 상원의원 (U.S. Senate)', 'U.S. Senator'),
      tx('연방 하원의원 (U.S. House of Representatives)', 'U.S. Representative'),
    ],
  },
  {
    icon: '📍',
    title: tx('주 전체 선거', 'STATEWIDE'),
    items: [
      tx('주지사 · 부주지사', 'Governor · Lieutenant Governor'),
      tx('주무장관 (선거를 총괄하는 자리) · 법무장관', 'Secretary of State (runs elections) · Attorney General'),
      tx('농업국장 · 보험 및 소방안전국장 · 노동국장', 'Agriculture · Insurance & Fire Safety · Labor Commissioners'),
      tx('주 교육감', 'State School Superintendent'),
      tx('공공서비스위원 3지구 · 5지구 (전기·가스 요금을 정하는 위원)', 'Public Service Commissioners, Districts 3 & 5 (set electric/gas rates)'),
    ],
  },
  {
    icon: '🏠',
    title: tx('주의회 선거', 'STATE LEGISLATURE'),
    items: [
      tx('주 상원의원 (Georgia State Senate)', 'State Senator (Georgia State Senate)'),
      tx('주 하원의원 (Georgia State House)', 'State Representative (Georgia State House)'),
      tx('내가 사는 지구(district)의 후보만 투표용지에 나옵니다.', 'Only the candidates for your district appear on your ballot.'),
    ],
  },
  {
    icon: '🏘️',
    title: tx('카운티 · 지역 선거', 'COUNTY & LOCAL'),
    items: [
      tx('카운티 커미션, 검찰청장(Solicitor General), 세무위원 등', 'County commission, Solicitor General, Tax Commissioner, and more'),
      tx('교육위원 선거 (특별선거 포함)', 'Board of Education races (including specials)'),
      tx('시장 · 시의원 등 시(市) 선거', 'Mayor · city council races'),
      tx('지역 주민투표 — SPLOST(특별목적세), 채권, 재산세 공제 등', 'Local referendums — SPLOST (special-purpose tax), bonds, homestead exemptions'),
    ],
  },
];

// ── Section 4: Gwinnett sample ballot ───────────────────────────────────
export type SampleCandidate = {
  name: string;
  ko: string;
  party: 'R' | 'D' | LText | null;
  incumbent?: boolean;
  note: LText;
};
export type SampleRace = {
  office: LText;
  headline: LText;
  candidates: SampleCandidate[];
  explainer: LText;
};
export const GA_SAMPLE: {
  title: LText;
  note: LText;
  howTo: LText;
  races: SampleRace[];
  orderNote: { title: LText; body: LText };
} = {
  title: tx('샘플 투표용지 미리보기 — 귀넷카운티 예시', 'Sample ballot preview — Gwinnett County example'),
  note: tx(
    '아래는 귀넷카운티(주 상원 7지구 · 주 하원 99지구) 샘플 투표용지에 인쇄된 후보들입니다. 주소가 다르면 후보도 다르게 나옵니다.',
    'Below are the candidates printed on a Gwinnett County sample ballot (State Senate District 7 · State House District 99). Different addresses get different candidates.',
  ),
  howTo: tx(
    '읽는 법 — 각 선거마다 한 명만 고릅니다(Vote for One). Incumbent = 현직, 이름 아래 빈칸(Write-in)은 후보 이름을 직접 적어 넣는 기명투표란입니다. R = 공화당, D = 민주당 표기입니다.',
    'How to read — pick one candidate per race (Vote for One). Incumbent = current officeholder; the blank line (Write-in) lets you write in a name. R = Republican, D = Democrat.',
  ),
  races: [
    {
      office: tx('공공서비스위원 3지구 · PUBLIC SERVICE COMMISSIONER, DISTRICT 3', 'PUBLIC SERVICE COMMISSIONER, DISTRICT 3'),
      headline: tx('전기·가스 요금을 결정하는 위원', 'Sets your electric and gas rates'),
      candidates: [
        { name: 'Fitz Johnson', ko: '피츠 존슨', party: 'R' as const, note: tx('', '') },
        { name: 'Peter Hubbard', ko: '피터 허바드', party: 'D' as const, incumbent: true, note: tx('', '') },
      ],
      explainer: tx(
        '공공서비스위원회(PSC)는 조지아 파워 등 전력·가스 회사의 요금 인상을 승인하는 기관입니다. 전기요금에 직접 영향을 주는, 생활과 가장 가까운 선거 중 하나입니다.',
        'The Public Service Commission approves rate hikes for Georgia Power and other electric/gas utilities — one of the elections closest to your daily life.',
      ),
    },
    {
      office: tx('공공서비스위원 5지구 · PUBLIC SERVICE COMMISSIONER, DISTRICT 5', 'PUBLIC SERVICE COMMISSIONER, DISTRICT 5'),
      headline: tx('같은 위원회, 다른 지구의 위원', 'Same commission, different district seat'),
      candidates: [
        { name: 'Josh Tolbert', ko: '조시 톨버트', party: 'R' as const, note: tx('', '') },
        { name: 'Shelia Edwards', ko: '실리아 에드워즈', party: 'D' as const, note: tx('', '') },
      ],
      explainer: tx(
        '위원은 지구별로 뽑지만 결정은 주 전체에 적용됩니다. 그래서 내 지구가 아닌 위원 선거도 투표용지에 함께 나옵니다.',
        'Commissioners are elected by district but their decisions apply statewide — which is why this race appears on your ballot too.',
      ),
    },
    {
      office: tx('주 상원의원 7지구 · STATE SENATE, DISTRICT 7', 'STATE SENATE, DISTRICT 7'),
      headline: tx('주 법률을 만드는 상원 의원', 'Writes Georgia state law'),
      candidates: [
        { name: 'Aizaz Shahbaz Shaikh', ko: '아이자즈 샤바즈 사이크', party: 'R' as const, note: tx('', '') },
        { name: 'Ruwa Romman', ko: '루와 롬만', party: 'D' as const, note: tx('', '') },
      ],
      explainer: tx(
        '주 상원은 세금, 교육 예산, 선거법 같은 주 차원의 법률을 심의·표결합니다.',
        'The State Senate debates and votes on state-level laws — taxes, school budgets, election rules.',
      ),
    },
    {
      office: tx('주 하원의원 99지구 · STATE HOUSE, DISTRICT 99', 'STATE HOUSE, DISTRICT 99'),
      headline: tx('우리 동네를 대표하는 하원 의원', 'Represents our neighborhood'),
      candidates: [
        { name: 'Matt Reeves', ko: '맷 리브스', party: 'R' as const, incumbent: true, note: tx('', '') },
        { name: 'Michelle Kang', ko: '미셸 강', party: 'D' as const, note: tx('', '') },
      ],
      explainer: tx(
        '주 하원의원은 지역구 단위가 작아, 우리 동네 사정을 가장 가까이서 다루는 대표입니다. 아래 개헌안들도 모두 주의회가 발의한 것입니다.',
        'State representatives serve small districts — the closest voice for neighborhood issues. The amendments below were all placed on the ballot by the legislature.',
      ),
    },
    {
      office: tx('토양·수자원 보전지구 감독관 · GWINNETT SOIL & WATER CONSERVATION DISTRICT SUPERVISOR', 'GWINNETT SOIL & WATER CONSERVATION DISTRICT SUPERVISOR'),
      headline: tx('땅과 물을 지키는 지역 감독관', 'Protects local land and water'),
      candidates: [
        { name: 'David VanLandingham', ko: '데이비드 밴랜딩햄', party: null, incumbent: true, note: tx('', '') },
      ],
      explainer: tx(
        '토양 침식 방지, 수질 보호 같은 지역 환경 보전을 맡는 자리입니다. 후보가 한 명뿐이어서 이름 아래 빈칸(Write-in)에 다른 이름을 적어 넣을 수도 있습니다.',
        'Oversees local soil conservation and water protection. Only one candidate is listed, so you may also write in a different name.',
      ),
    },
  ],
  orderNote: {
    title: tx('그 밖에 투표용지 앞부분에는', 'Earlier on the ballot'),
    body: tx(
      '연방·주 전체 선거가 용지 앞부분에 배치되고, 그 뒤에 위의 지역 선거, 맨 마지막에 개헌안과 주민투표 질문이 나옵니다. 끝까지 넘겨서 질문 항목도 꼭 확인하세요 — 다음 섹션에서 하나씩 풀어드립니다.',
      'Federal and statewide races come first, then the local races above, and finally the amendment and referendum questions. Flip all the way through — the next section explains each question one by one.',
    ),
  },
};

// ── Section 5: ballot questions ─────────────────────────────────────────
export type BallotQ = {
  num: string;
  ref: LText;
  title: LText;
  gist: LText;
  plain: LText;
  yes: LText;
  no: LText;
  yesPoints: LText[];
  noPoints: LText[];
  ballotText?: LText;
};

export const GA_QUESTIONS: BallotQ[] = [
  {
    num: '1',
    ref: tx('개헌안 1 · HOUSE RESOLUTION 32 (HR 32)', 'AMENDMENT 1 · HOUSE RESOLUTION 32 (HR 32)'),
    title: tx('보전용 토지 세금 혜택, 2,000에이커 → 4,000에이커로 확대?', 'Expand the conservation-land tax break from 2,000 to 4,000 acres?'),
    gist: tx('농지·임야를 지키는 대가로 재산세를 깎아주는 땅의 면적 상한을 두 배로 올릴지 묻는 질문입니다.', 'Asks whether to double the acreage cap on land that gets a property-tax break for staying farmland or timberland.'),
    plain: tx(
      '조지아에는 농사나 임업처럼 땅을 ‘보전 용도’로 쓰면 재산세를 낮게 매기는 제도(conservation use)가 있습니다. 지금은 한 소유주당 2,000에이커(약 245만 평)까지만 이 혜택을 받는데, 이를 4,000에이커까지 넓히자는 안입니다. 명분은 “가족 농장이 세금 부담 없이 농지를 유지하게 돕자”는 것입니다.',
      'Georgia lets owners who keep land in farming or timber pay lower property taxes (conservation use). The break currently caps at 2,000 acres per owner; this would raise it to 4,000. The stated goal: help family farms keep their land without a crushing tax bill.',
    ),
    yes: tx('상한이 4,000에이커로 올라갑니다. 2,000에이커를 넘는 큰 농지·임야도 세금 혜택을 받습니다.', 'The cap rises to 4,000 acres. Farms and timber tracts over 2,000 acres become eligible.'),
    no: tx('상한이 지금처럼 2,000에이커로 유지됩니다.', 'The cap stays at 2,000 acres.'),
    yesPoints: [
      tx('개발 압력 속에서 대규모 농지·임야가 농지로 남는 데 도움이 된다', 'Helps large farms and timberland stay undeveloped under development pressure'),
      tx('가족 단위로 이어온 큰 농장의 세 부담을 덜어준다', 'Eases the tax burden on large family farms passed down generations'),
    ],
    noPoints: [
      tx('새로 혜택을 받는 대상은 이미 2,000에이커 넘게 가진 대지주뿐이다', 'Only owners already holding over 2,000 acres gain anything new'),
      tx('줄어든 재산세 수입은 카운티·학교 재정이 메워야 한다', 'Counties and schools must make up the lost property-tax revenue'),
    ],
  },
  {
    num: '2',
    ref: tx('개헌안 2 · HOUSE RESOLUTION 251 (HR 251)', 'AMENDMENT 2 · HOUSE RESOLUTION 251 (HR 251)'),
    title: tx('유언검인법원 판사, 정당 표기 없이 뽑을까요?', 'Elect probate judges without party labels?'),
    gist: tx('상속·유언을 다루는 법원 판사 선거에서 정당 소속을 표시하고 뽑는데, 앞으로는 모든 프로베이트 판사를 비당파(정당 표기 없음) 선거로 뽑도록 주 헌법을 바꾸자는 안입니다. 후보를 뽑는 선거가 아니라 “선거 방식”을 바꾸는 개헌안입니다.', 'Asks whether all probate-court judges should be elected without party labels. This changes how judges are elected, not which judge wins.'),
    plain: tx(
      '프로베이트 법원(Probate Court)은 유언, 상속, 후견, 결혼허가증 등을 다루는 생활 밀착형 법원입니다. 지금은 이 법원의 판사를 정당 소속을 표시하고 뽑는데, 앞으로는 모든 프로베이트 판사를 비당파(정당 표기 없음) 선거로 뽑도록 하자는 것입니다.',
      'Probate courts handle wills, estates, guardianships, and marriage licenses — close to everyday life. Today these judges run with party labels; this would elect all of them on a nonpartisan basis, with no party shown on the ballot.',
    ),
    yes: tx('앞으로 모든 프로베이트 판사 선거에서 정당 표기가 사라집니다.', 'Party labels disappear from all future probate-judge elections.'),
    no: tx('지금처럼 정당 표기를 유지합니다.', 'Party labels stay as they are.'),
    yesPoints: [
      tx('판사는 정치가 아니라 법으로 판단해야 하니 정당과 거리를 두는 게 맞다', 'Judges should rule on law, not politics — distance from parties is proper'),
      tx('당파 대결이 아닌 인물·경력 중심으로 뽑을 수 있다', 'Voters can focus on the person and record, not the party'),
    ],
    noPoints: [
      tx('정당 표기는 유권자에게 가장 빠른 판단 재료인데, 그 단서가 사라진다', 'Party labels are voters’ quickest cue — removing them takes that away'),
      tx('정보가 줄면 이름이 알려진 현직·유명 후보에게 유리해질 수 있다', 'Less information can favor well-known incumbents and celebrities'),
    ],
  },
  {
    num: '3',
    ref: tx('개헌안 3 · HOUSE RESOLUTION 1243 (HR 1243)', 'AMENDMENT 3 · HOUSE RESOLUTION 1243 (HR 1243)'),
    title: tx('911 전용 기금을 만들까요?', 'Create a dedicated 911 fund?'),
    gist: tx('새 세금을 만드는 게 아닙니다. 기존 세금 수입의 일부를 911 시스템에만 쓰도록 ‘전용 주머니’를 만드는 안입니다.', 'Not a new tax. It would set aside part of existing tax revenue in a dedicated pot for 911 systems only.'),
    plain: tx(
      '‘Georgia Next Generation 9-1-1 Fund’라는 전용 기금을 만들어, 주의회가 기존 세수 중 일부를 911 긴급전화 시스템의 확장·유지·운영에만 쓰도록 배정할 수 있게 허용하는 안입니다. 이 기금의 돈은 해가 바뀌어도 사라지지 않고(nonlapsing) 다른 용도로 전용할 수 없습니다. 차세대 911은 문자·사진 신고, 더 정확한 위치 확인 같은 업그레이드를 뜻합니다.',
      'It would create the “Georgia Next Generation 9-1-1 Fund,” letting the legislature dedicate part of existing revenue exclusively to expanding, maintaining, and operating 911 systems. The money would not expire at year’s end (nonlapsing) and could not be diverted elsewhere. Next-generation 911 means upgrades like text/photo reporting and more precise location.',
    ),
    yes: tx('911 전용 기금 조성을 허용합니다.', 'Allows creating the dedicated 911 fund.'),
    no: tx('전용 기금을 만들지 않습니다. 911 예산은 지금처럼 일반 예산에서 해마다 정합니다.', 'No dedicated fund. 911 funding stays in the yearly general-budget fight.'),
    yesPoints: [
      tx('911 같은 생명선 인프라는 예산 경쟁에서 밀리지 않게 안정적으로 재원을 확보해야 한다', 'Lifeline infrastructure like 911 deserves stable funding, not annual budget battles'),
      tx('낙후한 카운티의 시스템 개선, 위치 정확도 향상에 도움이 된다', 'Helps lagging counties upgrade systems and location accuracy'),
    ],
    noPoints: [
      tx('전용 기금이 늘면 주의회가 해마다 예산을 조정할 여지가 그만큼 줄어든다', 'More dedicated funds mean less flexibility for the legislature each year'),
      tx('기금이 쌓여도 실제 집행은 별도 법률과 배정 절차를 거쳐야 한다', 'Money in the fund still needs separate laws and appropriations to be spent'),
    ],
    ballotText: tx(
      '“Shall the Constitution of Georgia be amended so as to authorize the General Assembly to dedicate certain existing revenues, including revenues reallocated by law, to a nonlapsing fund to be used exclusively for the expansion, maintenance, and operation of emergency 9-1-1 systems in this state?” — House Resolution 1243, Ga. L. 2026, p. 1109',
      '“Shall the Constitution of Georgia be amended so as to authorize the General Assembly to dedicate certain existing revenues, including revenues reallocated by law, to a nonlapsing fund to be used exclusively for the expansion, maintenance, and operation of emergency 9-1-1 systems in this state?” — House Resolution 1243, Ga. L. 2026, p. 1109',
    ),
  },
];

export const GA_REFERENDUM = {
  badge: tx('특별선거 · 주민투표 — 귀넷카운티 해당 (HOMESTEAD EXEMPTION)', 'SPECIAL ELECTION · REFERENDUM — GWINNETT COUNTY (HOMESTEAD EXEMPTION)'),
  title: tx('주택 재산세 추가 공제 $2,000, 대상을 넓힐까요?', 'Expand the extra $2,000 homestead exemption?'),
  gist: tx(
    '귀넷카운티 학교세에서 2,000달러를 더 공제해주는 대상에 장애 퇴역군인과 학교 직원 전체를 포함할지 묻는 질문입니다.',
    'Asks whether to extend an extra $2,000 school-tax homestead exemption to disabled veterans and all school-district employees.',
  ),
  plain: tx(
    '지금 귀넷카운티에는 특정 공공서비스 직원에게만 적용되는, 학교 교육 목적세에 대한 추가 $2,000 주택 공제(homestead exemption)가 있습니다. 이를 ① 장애가 있는 퇴역군인과 ② 귀넷카운티 교육구 및 뷰포드시 교육구의 모든 직원에게까지 확대할지를 묻습니다. 내 집이 귀넷카운티에 있고 위 대상에 해당하면 재산세가 조금 줄어드는 안입니다.',
    'Gwinnett currently offers an extra $2,000 homestead exemption on school-district taxes for certain public-service employees only. This would extend it to ① disabled veterans and ② all employees of the Gwinnett County and Buford City school districts. If your home is in Gwinnett and you qualify, your property tax drops a little.',
  ),
  yes: tx('공제 대상이 장애 퇴역군인과 두 교육구 전 직원으로 넓어집니다.', 'The exemption expands to disabled veterans and all employees of both school districts.'),
  no: tx('공제 대상이 지금 범위로 유지됩니다.', 'The exemption stays as it is.'),
  yesPoints: [
    tx('장애 퇴역군인과 학교 직원들의 주거비 부담을 덜어준다', 'Eases housing costs for disabled veterans and school workers'),
    tx('공제액 자체가 작아 학교 재정에 미치는 영향은 제한적이다', 'The amount is small, so the impact on school funding is limited'),
  ],
  noPoints: [
    tx('‘어디서 일하느냐’로 공제가 갈리면, 같은 소득의 이웃끼리 대우가 달라진다', 'Tying tax breaks to employers treats same-income neighbors differently'),
    tx('혜택은 집을 가진 사람에게만 가고, 세입자에게는 돌아가지 않는다', 'Only homeowners benefit — renters get nothing'),
  ],
  historyNote: tx(
    '이 주민투표는 원래 2026년 5월 예비선거에 부쳐질 예정이었으나 선거사무소의 실수로 빠졌고, 이번 11월 본선거에서 다시 묻습니다.',
    'This referendum was originally slated for the May 2026 primary but was left off by an elections-office error; it returns on this November ballot.',
  ),
};

export const GA_HB539_NOTE = tx(
  '참고: 투표용지에는 일반 주택 공제를 $8,000에서 $10,000으로 올리는 별도 질문(HB 539)도 함께 나올 수 있습니다. 내 샘플 투표용지에서 꼭 확인하세요.',
  'Note: your ballot may also carry a separate question (HB 539) raising the general homestead exemption from $8,000 to $10,000. Check your sample ballot.',
);

// ── Section 6: checklist + CTA ──────────────────────────────────────────
export const GA_CHECKLIST: { title: LText; body: LText }[] = [
  { title: tx('내 유권자 등록 상태 확인', 'Check your registration'), body: tx('이사했거나 이름을 바꿨다면 등록 정보가 맞는지 먼저 확인하세요.', 'Moved or changed your name? Verify your registration first.') },
  { title: tx('내 샘플 투표용지 미리 보기', 'Preview your sample ballot'), body: tx('내 주소 기준으로 실제 용지를 미리 보면, 투표소에서 헤매지 않고 질문 항목까지 차분히 읽을 수 있습니다.', 'Preview the actual ballot for your address — no surprises at the polls, including the questions.') },
  { title: tx('사진 신분증 준비', 'Bring a photo ID'), body: tx('조지아 운전면허증 등 인정되는 사진 신분증이 필요합니다.', 'You need an accepted photo ID, such as a Georgia driver’s license.') },
  { title: tx('투표소 위치 재확인', 'Double-check your polling place'), body: tx('사전투표는 카운티 내 아무 곳이나, 선거일은 내 지정 투표소에서만 가능합니다.', 'Early voting: anywhere in your county. Election Day: your assigned precinct only.') },
  { title: tx('용지 맨 아래 질문까지 답하기', 'Answer the questions at the bottom'), body: tx('개헌안 3개와 주민투표는 용지 마지막에 있습니다. 위 섹션 5의 해설을 보고 미리 정해두세요.', 'The 3 amendments and the referendum sit at the very end of the ballot. Decide in advance using section 5 above.') },
];

export const GA_CTA = {
  title: tx('조지아 공식 유권자 정보 — My Voter Page', 'Official Georgia voter info — My Voter Page'),
  body: tx('주무장관실이 운영하는 공식 사이트에서 내 정보 기준으로 정확히 확인할 수 있습니다.', 'Check everything against your own record on the Secretary of State’s official site.'),
  items: [
    tx('내 유권자 등록 상태 확인', 'Check your registration status'),
    tx('사전투표소 위치와 시간 확인', 'Find early-voting sites and hours'),
    tx('내 샘플 투표용지 보기', 'View your sample ballot'),
    tx('선거일 지정 투표소 찾기', 'Find your Election Day precinct'),
  ],
  button: tx('mvp.sos.ga.gov — 조지아 주무장관실 공식 사이트로 이동', 'mvp.sos.ga.gov — go to the official GA Secretary of State site'),
  url: 'https://mvp.sos.ga.gov/',
};

export const GA_FOOTER = {
  org: 'OhMyCode LLC',
  disclaimer: tx(
    '이 안내는 특정 정당이나 후보를 지지하지 않는 비당파 유권자 정보입니다. 후보 선택과 찬반 판단은 유권자 본인의 몫이며, 이 페이지는 투표용지의 내용을 쉽게 이해하도록 돕는 해설입니다.',
    'This guide is nonpartisan voter information and does not endorse any party or candidate. Your vote is yours alone; this page simply explains what is on the ballot.',
  ),
  sources: tx(
    '자료 출처: 2026 조지아 유권자 안내 포스터(Georgia Votes 2026), 귀넷카운티 샘플 투표용지(Sample Ballot), 조지아 주무장관실 My Voter Page — mvp.sos.ga.gov',
    'Sources: 2026 Georgia voter guide (Georgia Votes 2026), Gwinnett County sample ballot, GA Secretary of State My Voter Page — mvp.sos.ga.gov',
  ),
  verify: tx(
    '일정과 마감은 사정에 따라 달라질 수 있으니, 투표 전 공식 사이트에서 한 번 더 확인하세요.',
    'Dates and deadlines can change — verify once more on the official site before you vote.',
  ),
};

export function daysUntilElection(from: Date = new Date()): number {
  const election = new Date('2026-11-03T07:00:00-05:00');
  const ms = election.getTime() - from.getTime();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

// Floor-based days + hours to Election Day (07:00 ET Nov 3), plus whether
// in-person early voting has ended (19:00 ET Oct 30). Used for display;
// daysUntilElection (ceil) still drives the countdown/today/past branch.
export function electionCountdown(from: Date = new Date()): {
  days: number;
  hours: number;
  earlyOver: boolean;
} {
  const election = new Date('2026-11-03T07:00:00-05:00');
  const earlyEnd = new Date('2026-10-30T19:00:00-04:00');
  const ms = Math.max(0, election.getTime() - from.getTime());
  return {
    days: Math.floor(ms / (1000 * 60 * 60 * 24)),
    hours: Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    earlyOver: from.getTime() >= earlyEnd.getTime(),
  };
}

export const tr = (lang: Lang, v: LText): string => (lang === 'ko' ? v.ko : v.en);
