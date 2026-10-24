// Korea section of the Election Insights Hub: Korean presidential elections
// (18th–21st, 2012–2025). The interactive dashboard lives on its own deployment;
// this page is the section home — dashboard entry plus the public archives of
// original source records, so every figure can be verified against the originals.
// Server component: reads ?lang= at request time, no client JS.

import type { Metadata } from 'next';
import CountrySwitch from '../components/CountrySwitch';
import type { Lang } from '../us/lib/i18n';

type SearchParams = { lang?: string };

const DASHBOARD = 'https://k18to21-election2.vercel.app';
const GITHUB = 'https://github.com/sechan9999/K18to21Election2';

const TITLES: Record<Lang, string> = {
  ko: '한국 대통령 선거 데이터 — Election Insights Hub',
  en: 'Korean Presidential Election Data — Election Insights Hub',
};
const DESCRIPTIONS: Record<Lang, string> = {
  ko: '18대(2012)–21대(2025) 한국 대통령 선거 데이터: 투표율·득표율·스윙·마진·재검표 대시보드와 개표상황표 원본 아카이브.',
  en: 'Korean presidential election data, 18th (2012) to 21st (2025): turnout, vote share, swing, margin and recount dashboard, plus archives of the original tally sheets.',
};

const S = {
  heading: { ko: '한국 대통령 선거 데이터', en: 'Korean Presidential Election Data' },
  sub: {
    ko: '18대(2012)부터 21대(2025)까지 · 전국 17개 시·도 · 투표율 · 득표율 · 스윙 · 마진 · 재검표',
    en: '18th (2012) to 21st (2025) · all 17 provinces · turnout · vote share · swing · margin · recount checks',
  },
  langSwitch: { ko: 'English', en: '한국어' },
  dashTitle: { ko: '📊 선거 대시보드 열기', en: '📊 Open the election dashboard' },
  dashBody: {
    ko: '대선별·시도별 투표율과 득표율, 지난 선거와의 스윙과 마진, 재검표 지표를 한 화면에서 비교합니다.',
    en: 'Compare turnout and vote share by election and province, with swing, margin, and recount indicators in one view.',
  },
  dashCta: { ko: '대시보드로 이동 →', en: 'Go to the dashboard →' },
  archiveHeading: { ko: '원본 기록 아카이브', en: 'Original-records archives' },
  archiveIntro: {
    ko: '분석의 바탕이 된 원본 기록을 전부 공개합니다. 원본 문서 36,000쪽 이상, 공식 결과 85,000행 이상 — 누구든 수치를 원본과 대조할 수 있습니다.',
    en: 'The source records behind the analysis are published in full: more than 36,000 pages of primary counting documents and over 85,000 rows of official results, so anyone can verify the figures against the originals.',
  },
  open: { ko: '아카이브 열기 →', en: 'Open archive →' },
  method: {
    ko: '방법론과 소스 코드는 GitHub에 공개되어 있습니다. 비당파적이며, 모든 결과는 원본 기록으로 재현할 수 있습니다.',
    en: 'Methodology and source code are public on GitHub. Non-partisan; every result can be reproduced from the original records.',
  },
  githubCta: { ko: 'GitHub에서 보기 →', en: 'View on GitHub →' },
} as const;

type Key = keyof typeof S;
const tr = (lang: Lang, k: Key) => S[k][lang];

const ELECTIONS: {
  term: { ko: string; en: string };
  year: number;
  desc: { ko: string; en: string };
  url: string;
  highlight?: boolean;
}[] = [
  {
    term: { ko: '21대', en: '21st' },
    year: 2025,
    desc: {
      ko: '개표상황표 원본 18,949장 · 공식 투표구 결과 22,685행 · 전국 252개 구·시·군 전부 수록',
      en: '18,949 original tally sheets · 22,685 rows of official precinct results · all 252 districts',
    },
    url: 'https://storage.googleapis.com/k21-tally-archive/index.html',
    highlight: true,
  },
  {
    term: { ko: '20대', en: '20th' },
    year: 2022,
    desc: {
      ko: '개표상황표 원본 17,377장 · 공식 투표구 결과 22,752행 · 수집된 224개 구·시·군',
      en: '17,377 original tally sheets · 22,752 rows of official precinct results · 224 districts collected',
    },
    url: 'https://storage.googleapis.com/k20-tally-archive/index.html',
  },
  {
    term: { ko: '19대', en: '19th' },
    year: 2017,
    desc: {
      ko: '투표지분류기 기록 · 개표단위 13,949곳 · 공식 투표구 결과 22,214행',
      en: 'Ballot-sorter records · 13,949 counting units · 22,214 rows of official precinct results',
    },
    url: 'https://storage.googleapis.com/k19-archive/index.html',
  },
  {
    term: { ko: '18대', en: '18th' },
    year: 2012,
    desc: {
      ko: '분류 결과와 미분류표 K값 · 251개 구 · 공식 투표구 결과 17,871행',
      en: 'Ballot-sorter results and the unclassified-ballot K value · 251 districts · 17,871 rows of official precinct results',
    },
    url: 'https://storage.googleapis.com/k18-archive/index.html',
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
    title: TITLES[lang],
    description: DESCRIPTIONS[lang],
    openGraph: {
      title: TITLES[lang],
      description: DESCRIPTIONS[lang],
      type: 'website',
      locale: lang === 'ko' ? 'ko_KR' : 'en_US',
    },
    twitter: { card: 'summary', title: TITLES[lang], description: DESCRIPTIONS[lang] },
  };
}

export default async function KoreaPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const lang = langFrom(await searchParams);
  const other: Lang = lang === 'ko' ? 'en' : 'ko';
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100" lang={lang}>
      <div className="mx-auto max-w-6xl px-4 py-8">
        <CountrySwitch lang={lang} active="kr" />

        <header className="mb-6">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="rounded bg-white/5 px-2 py-1 text-neutral-400">
              {lang === 'ko' ? '데이터: 중앙선거관리위원회 공개 자료' : 'Data: National Election Commission public releases'}
            </span>
            <a
              href={`/kr?lang=${other}`}
              className="ml-auto rounded border border-white/15 px-3 py-1 text-neutral-200 hover:bg-white/10"
            >
              {tr(lang, 'langSwitch')}
            </a>
          </div>
          <h1 className="mt-3 text-3xl font-bold">{tr(lang, 'heading')}</h1>
          <p className="mt-1 text-neutral-400">{tr(lang, 'sub')}</p>
        </header>

        <a
          href={`${DASHBOARD}/?lang=${lang}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-xl border border-blue-400/30 bg-blue-400/10 p-5 hover:bg-blue-400/15"
        >
          <div className="text-lg font-semibold text-blue-300">{tr(lang, 'dashTitle')}</div>
          <div className="mt-1 text-sm text-neutral-300">{tr(lang, 'dashBody')}</div>
          <div className="mt-2 text-sm font-medium text-blue-300">{tr(lang, 'dashCta')}</div>
        </a>

        <h2 className="mt-10 text-xl font-bold">{tr(lang, 'archiveHeading')}</h2>
        <p className="mt-1 text-sm text-neutral-400">{tr(lang, 'archiveIntro')}</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {ELECTIONS.map((e) => (
            <a
              key={e.year}
              href={e.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`rounded-xl border p-4 hover:bg-white/10 ${
                e.highlight ? 'border-amber-400/30 bg-amber-400/5' : 'border-white/10 bg-white/5'
              }`}
            >
              <div className="font-semibold text-neutral-100">
                {e.term[lang]} · {e.year}
              </div>
              <div className="mt-1 text-sm text-neutral-400">{e.desc[lang]}</div>
              <div className="mt-2 text-sm font-medium text-blue-300">{tr(lang, 'open')}</div>
            </a>
          ))}
        </div>

        <div className="mt-10 rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-sm text-neutral-300">{tr(lang, 'method')}</p>
          <a
            href={GITHUB}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-sm font-medium text-blue-300 hover:underline"
          >
            {tr(lang, 'githubCta')}
          </a>
          <span className="mx-2 text-neutral-600">·</span>
          <a
            href={`/kr/about?lang=${lang}`}
            className="mt-2 inline-block text-sm font-medium text-blue-300 hover:underline"
          >
            {lang === 'ko' ? '프로젝트 소개 전문 →' : 'Read the full project introduction →'}
          </a>
        </div>
      </div>
    </div>
  );
}
