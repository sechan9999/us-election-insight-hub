// Server component: reads ?lang= / ?tab= at request time so crawlers and
// no-JS clients see the correct language in the server-rendered HTML.
import type { Metadata } from 'next';
import USHubClient from './USHubClient';
import type { Lang } from './lib/i18n';

type SearchParams = { lang?: string; tab?: string };

const TITLES: Record<Lang, string> = {
  ko: 'US Election Insights Hub — 2026 미국 중간선거 예측',
  en: 'US Election Insights Hub — 2026 US Midterm Forecast',
};
const DESCRIPTIONS: Record<Lang, string> = {
  ko: '2026 미국 중간선거 예측 보드: 상원 53.4%·하원 96.6% 민주당 과반 확률, 경합주 여론조사 평균, 불확실성 범위. 40,000회 몬테카를로 시뮬레이션.',
  en: '2026 US midterm forecast board: Senate 53.4% · House 96.6% Democratic majority probability, battleground polling averages, uncertainty ranges. 40,000 Monte Carlo simulations.',
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
        : 'forecast';
  return <USHubClient initialLang={initialLang} initialTab={initialTab} />;
}
