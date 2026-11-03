// Data analysis competition announcement (in preparation): analyzing the
// 18th–21st Korean presidential election data from the same public materials
// and verifying every figure against the originals. Draft page — schedule,
// eligibility, submission method, judging criteria, and the in-kind prize
// details are TBD and marked as such; nothing here presents the competition
// as open. Project Boo is NOT named as a co-host: the co-host proposal was
// drafted but never sent, so the organizer is OhMyCode LLC only.

import type { Metadata } from 'next';
import CountrySwitch from '../../components/CountrySwitch';
import type { Lang } from '../../us/lib/i18n';

type SearchParams = { lang?: string };

const TITLE: Record<Lang, string> = {
  ko: '18–21대 대선 데이터 분석 컴피티션 — Electoral Insights Hub',
  en: '18th–21st Presidential Election Data Analysis Competition — Electoral Insights Hub',
};
const DESCRIPTION: Record<Lang, string> = {
  ko: '18대(2012)–21대(2025) 대통령선거 데이터를 같은 공개 자료로 분석하고 원본으로 검증하는 데이터 분석 컴피티션. 상금 $1,000 + in-kind contribution. 준비 중.',
  en: 'A data analysis competition over the 18th (2012)–21st (2025) Korean presidential election data: analyze from the same public materials and verify every figure against the originals. Prizes: $1,000 + in-kind contribution. In preparation.',
};

const S = {
  back: { ko: '한국 선거 섹션으로', en: 'Back to the Korea section' },
  status: { ko: '준비 중', en: 'In preparation' },
  heading: {
    ko: '18–21대 대선 데이터 분석 컴피티션',
    en: '18th–21st Presidential Election Data Analysis Competition',
  },
  theme: {
    ko: '주장이 아니라 원본으로 확인하는 선거 데이터 분석',
    en: 'Verify with the originals, not with claims',
  },
  intro: {
    ko: '선거 데이터를 전면 공개하고, 누구나 같은 자료로 분석하고 검증하게 하는 일. 그 첫 사업으로 18대부터 21대까지의 대통령선거 데이터를 대상으로 한 데이터 분석 컴피티션을 준비하고 있습니다.',
    en: 'Publish election data in full, so that anyone can analyze and verify from the same materials. As a first project, we are preparing a data analysis competition over the presidential election data from the 18th through the 21st elections.',
  },
  backgroundHeading: { ko: '배경', en: 'Background' },
  backgroundBody: {
    ko: '이 구상의 출발점은 2017년 프로젝트부 아카이브에 실린 K값 설명 글입니다. K는 투표지분류기가 가려낸 분류표와 미분류표에서 두 후보의 득표 비율을 비교하는 척도입니다. K = (미분류표에서 당선자 / 경쟁자) ÷ (분류표에서 당선자 / 경쟁자)로 정의되며, K = 1이면 두 후보의 미분류율이 같다는 뜻입니다. 2017년 글은 18대 대선의 K값이 1.5로 나타났다고 설명합니다. 이 글의 해석이 아니라, 원본 자료로 직접 계산하고 검증하는 것이 이번 컴피티션의 주제입니다.',
    en: 'The starting point is the 2017 K-value explainer published in the Project Boo archive. K compares the two leading candidates’ vote ratios between ballots the sorter classified and ballots it set aside: K = (winner / runner-up among unclassified ballots) ÷ (winner / runner-up among classified ballots). K = 1 means the two candidates’ unclassified rates are equal. The 2017 post reports the 18th-election K value as 1.5. The competition is not about that post’s interpretation — it is about computing and verifying from the original records yourself.',
  },
  backgroundLink: {
    ko: '프로젝트부 아카이브 — 18대와 19대 대선 데이터에서 나온 K값에 대한 설명 (전희경·현화신, 2017)',
    en: 'Project Boo archive — K-value explainer from the 18th and 19th election data (HeeKyoung Chun, Hwashin Hyun Shin, 2017)',
  },
  dataHeading: { ko: '대상 데이터', en: 'The data' },
  dataIntro: {
    ko: '네 번의 대선 기록이 전부 공개되어 있습니다. 개표상황표 원본과 공식 투표구 결과를 누구나 내려받아 대조할 수 있습니다.',
    en: 'The records of all four elections are published in full. Anyone can download the original tally sheets and the official precinct results and check one against the other.',
  },
  topicsHeading: { ko: '주제 (예정)', en: 'Topics (proposed)' },
  prizesHeading: { ko: '상금', en: 'Prizes' },
  resourcesHeading: { ko: '자료', en: 'Resources' },
  resourcesIntro: {
    ko: '출발점으로 삼을 수 있는 자료입니다. 뉴스타파가 18·19대 대선 투표지분류기 운영 결과 데이터를 공개해 두었습니다.',
    en: 'Materials to start from. Newstapa has published the 18th/19th ballot-sorter operation-result data.',
  },
  scheduleHeading: { ko: '일정 · 참가 · 심사', en: 'Schedule · eligibility · judging' },
  scheduleBody: {
    ko: '일정, 참가 자격, 제출 방식, 심사 기준은 추후 공지합니다. 이 페이지는 준비 단계의 안내이며, 아직 접수를 받지 않습니다.',
    en: 'Schedule, eligibility, submission method, and judging criteria will be announced later. This page is a preparation-stage announcement; entries are not yet open.',
  },
  organizerHeading: { ko: '주최', en: 'Organizer' },
  organizerBody: {
    ko: 'Electoral Insights Hub (OhMyCode LLC). 협력 기관은 추후 공지합니다.',
    en: 'Electoral Insights Hub (OhMyCode LLC). Partner organizations will be announced later.',
  },
  neutrality: {
    ko: '비당파적 원칙: 이 컴피티션은 공식 발표 수치만을 다룹니다. 후보·정당·정책에 대한 추천이나 평가는 심사 대상이 아닙니다.',
    en: 'Non-partisan rule: this competition deals only with officially published figures. Recommendations or evaluations of candidates, parties, or policies are not part of the judging.',
  },
} as const;

type Key = keyof typeof S;
const tr = (lang: Lang, k: Key) => S[k][lang];

// Kept outside S: the S/tr pattern only types plain strings, and these two
// are string arrays.
const TOPICS: Record<Lang, string[]> = {
  ko: [
    '투표지분류기 운영과 K값 분석 — 18·19대 분류기 운영 결과와 미분류표 패턴',
    '선거 간 개표 패턴 비교 — 18대에서 21대까지, 무엇이 달라졌는가',
    '시각화와 대시보드 — 누구나 원본으로 확인할 수 있는 분석 결과물',
  ],
  en: [
    'Ballot-sorter operation and K-value analysis — 18th/19th sorter results and unclassified-ballot patterns',
    'Cross-election counting patterns — what changed from the 18th to the 21st election',
    'Visualization and dashboards — results anyone can check against the originals',
  ],
};
const PRIZES: Record<Lang, string[]> = {
  ko: ['현금 상금: $1,000', 'In-kind contribution: 내역 추후 공지'],
  en: ['Cash prize: $1,000', 'In-kind contribution: details to be announced'],
};

const ARCHIVES: { term: { ko: string; en: string }; desc: { ko: string; en: string }; url: string }[] = [
  {
    term: { ko: '18대 (2012)', en: '18th (2012)' },
    desc: {
      ko: '분류 결과와 미분류표 K값 · 251개 구 · 공식 투표구 결과 17,871행 · 개표 원본 스캔 73,363장',
      en: 'Sorter results and the unclassified-ballot K value · 251 districts · 17,871 official precinct rows · 73,363 original scans',
    },
    url: 'https://storage.googleapis.com/k18-archive/index.html',
  },
  {
    term: { ko: '19대 (2017)', en: '19th (2017)' },
    desc: {
      ko: '투표지분류기 기록 · 개표단위 13,949곳 · 공식 투표구 결과 22,214행',
      en: 'Ballot-sorter records · 13,949 counting units · 22,214 official precinct rows',
    },
    url: 'https://storage.googleapis.com/k19-archive/index.html',
  },
  {
    term: { ko: '20대 (2022)', en: '20th (2022)' },
    desc: {
      ko: '개표상황표 원본 17,377장 · 공식 투표구 결과 22,752행',
      en: '17,377 original tally sheets · 22,752 official precinct rows',
    },
    url: 'https://storage.googleapis.com/k20-tally-archive/index.html',
  },
  {
    term: { ko: '21대 (2025)', en: '21st (2025)' },
    desc: {
      ko: '개표상황표 원본 18,949장 · 공식 투표구 결과 22,685행',
      en: '18,949 original tally sheets · 22,685 official precinct rows',
    },
    url: 'https://storage.googleapis.com/k21-tally-archive/index.html',
  },
];

const RESOURCES: { label: { ko: string; en: string }; url: string }[] = [
  {
    label: { ko: '대시보드 — 21대 대선 비교 뷰', en: 'Dashboard — 21st election compare view' },
    url: 'https://k18to21-election2.vercel.app/?view=compare&election=21st',
  },
  {
    label: { ko: '전체 코드 (GitHub 공개)', en: 'Full code (public on GitHub)' },
    url: 'https://github.com/sechan9999/K18to21Election2',
  },
  {
    label: {
      ko: '뉴스타파 데이터 포털 — 18·19대 대선 투표지분류기 운영 결과',
      en: 'Newstapa data portal — 18th/19th ballot-sorter operation results',
    },
    url: 'https://data.newstapa.org/datasets/18-19대-대선-투표지-분류기-운영결과',
  },
  {
    label: { ko: '18대, 19대 대선 데이터 & 분석 자료 공개', en: '18대, 19대 대선 데이터 & 분석 자료 공개' },
    url: 'https://www.newstapa.org/article/CSoI4',
  },
  {
    label: { ko: '더플랜인가 노플랜인가...개표부정 의혹 집중 해부', en: '더플랜인가 노플랜인가...개표부정 의혹 집중 해부' },
    url: 'https://www.newstapa.org/article/6DFfH',
  },
  {
    label: { ko: '19대 대선 문-홍 K값은 1.6...정규분포', en: '19대 대선 문-홍 K값은 1.6...정규분포' },
    url: 'https://www.newstapa.org/article/waaaZ',
  },
];

function langFrom(params: SearchParams): Lang {
  return params.lang === 'en' ? 'en' : 'ko';
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}): Promise<Metadata> {
  const lang = langFrom(await searchParams);
  return {
    metadataBase: new URL('https://app.ohmycodellc.com'),
    title: TITLE[lang],
    description: DESCRIPTION[lang],
    openGraph: {
      title: TITLE[lang],
      description: DESCRIPTION[lang],
      type: 'website',
      locale: lang === 'ko' ? 'ko_KR' : 'en_US',
    },
    twitter: { card: 'summary', title: TITLE[lang], description: DESCRIPTION[lang] },
  };
}

export default async function CompetitionPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const lang = langFrom(await searchParams);
  const other: Lang = lang === 'ko' ? 'en' : 'ko';
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100" lang={lang}>
      <div className="mx-auto max-w-3xl px-4 py-8">
        <CountrySwitch lang={lang} active="kr" />

        <a href={`/kr?lang=${lang}`} className="text-sm text-blue-300 hover:underline">
          ← {tr(lang, 'back')}
        </a>

        <div className="mt-4 flex items-center gap-2">
          <span className="rounded bg-amber-400/15 px-2 py-1 text-xs font-medium text-amber-300">
            {tr(lang, 'status')}
          </span>
          <a
            href={`/kr/competition?lang=${other}`}
            className="ml-auto rounded border border-white/15 px-3 py-1 text-xs text-neutral-200 hover:bg-white/10"
          >
            {lang === 'ko' ? 'English' : '한국어'}
          </a>
        </div>

        <h1 className="mt-3 text-3xl font-bold leading-snug">{tr(lang, 'heading')}</h1>
        <p className="mt-2 text-lg font-medium text-amber-300">{tr(lang, 'theme')}</p>
        <p className="mt-3 leading-relaxed text-neutral-300">{tr(lang, 'intro')}</p>

        <h2 className="mt-10 text-xl font-bold">{tr(lang, 'backgroundHeading')}</h2>
        <p className="mt-2 leading-relaxed text-neutral-300">{tr(lang, 'backgroundBody')}</p>
        <a
          href="http://www.projectboo.com/archive/153768"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block text-sm font-medium text-blue-300 hover:underline"
        >
          {tr(lang, 'backgroundLink')} →
        </a>

        <h2 className="mt-10 text-xl font-bold">{tr(lang, 'dataHeading')}</h2>
        <p className="mt-2 text-sm text-neutral-400">{tr(lang, 'dataIntro')}</p>
        <div className="mt-4 space-y-3">
          {ARCHIVES.map((a) => (
            <a
              key={a.url}
              href={a.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10"
            >
              <div className="font-semibold">{a.term[lang]}</div>
              <div className="mt-1 text-sm text-neutral-400">{a.desc[lang]}</div>
            </a>
          ))}
        </div>

        <h2 className="mt-10 text-xl font-bold">{tr(lang, 'topicsHeading')}</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-neutral-300">
          {TOPICS[lang].map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>

        <h2 className="mt-10 text-xl font-bold">{tr(lang, 'prizesHeading')}</h2>
        <div className="mt-3 rounded-xl border border-amber-400/30 bg-amber-400/5 p-4">
          <ul className="list-disc space-y-1 pl-5 text-neutral-200">
            {PRIZES[lang].map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>

        <h2 className="mt-10 text-xl font-bold">{tr(lang, 'resourcesHeading')}</h2>
        <p className="mt-2 text-sm text-neutral-400">{tr(lang, 'resourcesIntro')}</p>
        <ul className="mt-3 space-y-2">
          {RESOURCES.map((r) => (
            <li key={r.url}>
              <a
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-blue-300 hover:underline"
              >
                {r.label[lang]} →
              </a>
            </li>
          ))}
        </ul>

        <h2 className="mt-10 text-xl font-bold">{tr(lang, 'scheduleHeading')}</h2>
        <p className="mt-2 leading-relaxed text-neutral-300">{tr(lang, 'scheduleBody')}</p>

        <h2 className="mt-10 text-xl font-bold">{tr(lang, 'organizerHeading')}</h2>
        <p className="mt-2 leading-relaxed text-neutral-300">{tr(lang, 'organizerBody')}</p>

        <p className="mt-10 border-t border-white/10 pt-4 text-xs leading-relaxed text-neutral-500">
          {tr(lang, 'neutrality')}
        </p>
      </div>
    </div>
  );
}
