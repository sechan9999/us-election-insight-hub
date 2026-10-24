// Country switcher shown at the top of both country sections (/us, /kr).
// One platform (Election Insights Hub), separate sections per country.
// Plain links (no client JS) so they work in server components and keep ?lang=.

import type { Lang } from '../us/lib/i18n';

export default function CountrySwitch({
  lang,
  active,
}: {
  lang: Lang;
  active: 'us' | 'kr';
}) {
  const pill = (isActive: boolean) =>
    `rounded-full px-3 py-1 text-xs ${
      isActive
        ? 'bg-white/15 font-semibold text-white'
        : 'bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-neutral-200'
    }`;
  return (
    <div className="mb-6 flex flex-wrap items-center gap-2">
      <span className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
        Election Insights Hub
      </span>
      <nav aria-label="Country" className="ml-auto flex items-center gap-1">
        <a href={`/us?lang=${lang}`} className={pill(active === 'us')} aria-current={active === 'us' ? 'page' : undefined}>
          🇺🇸 {lang === 'ko' ? '미국' : 'US'}
        </a>
        <a href={`/kr?lang=${lang}`} className={pill(active === 'kr')} aria-current={active === 'kr' ? 'page' : undefined}>
          🇰🇷 {lang === 'ko' ? '한국' : 'Korea'}
        </a>
      </nav>
    </div>
  );
}
