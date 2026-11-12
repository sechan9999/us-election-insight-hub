// Server component: reads ?lang= / ?tab= at request time so crawlers and
// no-JS clients see the correct language in the server-rendered HTML.
import type { Metadata } from 'next';
import USHubClient from './USHubClient';
import type { Lang } from './lib/i18n';

type SearchParams = { lang?: string; tab?: string };

const TITLES: Record<Lang, string> = {
  ko: 'US Election Insights Hub — 2026 미국 중간선거 결과',
  en: 'US Election Insights Hub — 2026 US Midterm Results',
};
const DESCRIPTIONS: Record<Lang, string> = {
  ko: '2026 미국 중간선거 결과: 민주당이 상·하원 과반 확보. 추적한 상원 13개 경주 중 12개 확정, 알래스카만 개표 중. 상원 민주 55 대 공화 44, 하원 민주 254석 확정(AP). 선거 전 예측(40,000회 시뮬레이션)은 기록으로 보관.',
  en: '2026 US midterm results: Democrats won the Senate and House. 12 of 13 tracked Senate races called; only Alaska still counting. Senate 55 D to 44 R, House 254 D called (AP). The pre-election forecast (40,000 simulations) is kept as a record.',
};

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
      images: [{ url: '/us/opengraph-image' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: TITLES[lang],
      description: DESCRIPTIONS[lang],
      images: ['/us/opengraph-image'],
    },
  };
}

export default async function USPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const initialLang = langFrom(params);
  const initialTab =
    params.tab === 'messages' || params.tab === 'truth'
      ? 'messages'
      : params.tab === 'georgia'
        ? 'georgia'
        : params.tab === 'paper'
          ? 'paper'
          : params.tab === 'polymarket'
            ? 'polymarket'
            : 'forecast';
  return <USHubClient initialLang={initialLang} initialTab={initialTab} />;
}
