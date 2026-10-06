'use client';

// "Trump message analysis" tab: descriptive context from sechan9999/trump-truth-analysis.
// Fetched at runtime (weekly.json + intervention.json); never feeds the forecast model.

import { useEffect, useState } from 'react';
import {
  fetchTruthIndex,
  fetchTruthWeekly,
  stateCode,
  TRUTH_REPO_URL,
  TRUTH_SITE_URL,
  type TruthWeekly,
} from './lib/truth';
import { t, type Lang } from './lib/i18n';

const WINDOW = 4;
const TREND_WEEKS = 26;
const CAUTION = 0.05;

function useFetch<T>(fn: (s: AbortSignal) => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [err, setErr] = useState(false);
  useEffect(() => {
    const ac = new AbortController();
    fn(ac.signal)
      .then(setData)
      .catch((e: unknown) => {
        if (!(e instanceof DOMException && e.name === 'AbortError')) setErr(true);
      });
    return () => ac.abort();
  }, [fn]);
  return { data, err };
}

const short = (d: string) => d.slice(2).replace(/-/g, '.');

function TopicMix({ lang, w }: { lang: Lang; w: TruthWeekly }) {
  const keys = Object.keys(w.labels.clusters);
  const n = w.weeks.length;
  const sum = (k: string, a: number, b: number) => w.weekly[k].slice(a, b).reduce((x, y) => x + y, 0);
  const recentTotal = keys.reduce((s, k) => s + sum(k, n - WINDOW, n), 0);
  const baseTotal = keys.reduce((s, k) => s + sum(k, 0, n - WINDOW), 0);
  const rows = keys
    .map((k) => {
      const r = recentTotal ? sum(k, n - WINDOW, n) / recentTotal : 0;
      const b = baseTotal ? sum(k, 0, n - WINDOW) / baseTotal : 0;
      return { k, r, d: (r - b) * 100, lab: w.labels.clusters[k], st: w.stats.clusters[k] };
    })
    .sort((a, b) => b.r - a.r);
  const max = Math.max(0.01, ...rows.map((x) => x.r));
  return (
    <section className="mt-6 rounded-xl border border-white/10 bg-white/5 p-5">
      <h2 className="text-xl font-semibold">{t(lang, 'msgMixTitle')}</h2>
      <p className="mt-1 text-sm text-neutral-400">
        {t(lang, 'msgMixNote', { from: short(w.weeks[n - WINDOW]), to: short(w.weeks[n - 1]), n: recentTotal })}
      </p>
      <ul className="mt-4 space-y-3">
        {rows.map(({ k, r, d, lab, st }) => (
          <li key={k}>
            <div className="flex items-baseline justify-between gap-3 text-sm">
              <span className="flex items-center gap-2">
                <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: lab.c }} />
                <span className="font-medium">{lab[lang][0]}</span>
                {st && st.cohesion < CAUTION && (
                  <span className="rounded bg-amber-400/15 px-1.5 text-xs text-amber-300">{t(lang, 'msgCaution')}</span>
                )}
              </span>
              <span className="font-mono">
                {(r * 100).toFixed(1)}%
                <span className={`ml-2 text-xs ${d > 0 ? 'text-neutral-200' : 'text-neutral-500'}`}>
                  {d > 0 ? '+' : ''}
                  {d.toFixed(1)}
                </span>
              </span>
            </div>
            <div className="mt-1 h-2 rounded bg-white/10" role="presentation">
              <div className="h-2 rounded" style={{ width: `${(r / max) * 100}%`, background: lab.c }} />
            </div>
            {st && <div className="mt-1 font-mono text-xs text-neutral-500">{st.keywords.slice(0, 6).join(', ')}</div>}
          </li>
        ))}
      </ul>
    </section>
  );
}

function WeeklyTrend({ lang, w }: { lang: Lang; w: TruthWeekly }) {
  const keys = Object.keys(w.labels.clusters);
  const n = w.weeks.length;
  const from = Math.max(0, n - TREND_WEEKS);
  const max = Math.max(1, ...keys.flatMap((k) => w.weekly[k].slice(from)));
  const top = Math.ceil(max / 5) * 5;
  return (
    <section className="mt-6 rounded-xl border border-white/10 bg-white/5 p-5">
      <h2 className="text-xl font-semibold">{t(lang, 'msgTrendTitle')}</h2>
      <p className="mt-1 text-sm text-neutral-400">{t(lang, 'msgTrendNote', { max: top })}</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {keys.map((k) => {
          const lab = w.labels.clusters[k];
          const v = w.weekly[k].slice(from);
          return (
            <div key={k} className="rounded-lg border border-white/10 bg-black/20 p-4">
              <div className="flex items-baseline justify-between gap-2 text-sm">
                <span className="font-medium">{lab[lang][0]}</span>
                <span className="font-mono text-xs text-neutral-400">{v.reduce((a, b) => a + b, 0)}</span>
              </div>
              <div className="mt-2 flex h-14 items-end gap-px border-b border-white/15">
                {v.map((x, i) => (
                  <div
                    key={w.weeks[from + i]}
                    title={`${short(w.weeks[from + i])} · ${x}`}
                    className="flex-1 rounded-t-sm"
                    style={{ height: `${(x / top) * 100}%`, minHeight: x ? 2 : 0, background: lab.c, opacity: i === v.length - 1 ? 0.55 : 1 }}
                  />
                ))}
              </div>
              <div className="mt-1 flex justify-between text-[11px] text-neutral-500">
                <span>{short(w.weeks[from])}</span>
                <span>{short(w.weeks[n - 1])}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function InterventionPanel({ lang, races }: { lang: Lang; races: RaceLite[] }) {
  const { data: idx, err } = useFetch(fetchTruthIndex);
  return (
    <section className="mt-6 rounded-xl border border-white/10 bg-white/5 p-5">
      <h2 className="text-xl font-semibold">{t(lang, 'truthTitle')}</h2>
      {err && <p className="mt-3 text-sm text-neutral-400">{t(lang, 'truthError')}</p>}
      {!err && !idx && <p className="mt-3 text-sm text-neutral-500">{t(lang, 'truthLoading')}</p>}
      {idx && (
        <>
          <p className="mt-1 text-sm text-neutral-400">
            {t(lang, 'truthMeta', {
              week: idx.week,
              w: idx.window_weeks,
              n: idx.coverage.n_endorse_window,
              mapped: Math.round(idx.coverage.n_mapped_battleground),
            })}
          </p>
          {idx.small_n && <p className="mt-3 rounded bg-amber-400/10 px-3 py-2 text-sm text-amber-300">{t(lang, 'truthSmall')}</p>}
          <div className={`mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 ${idx.small_n ? 'opacity-70' : ''}`}>
            {races.map((r) => {
              const s = idx.states[stateCode(r.id)];
              if (!s) return null;
              const max = Math.max(0.01, ...Object.values(idx.states).map((x) => x.endorse_share));
              return (
                <div key={r.id} className="rounded-lg border border-white/10 bg-black/20 p-4">
                  <div className="flex items-baseline justify-between gap-2">
                    <div className="font-semibold">
                      {r.name}
                      <span className="ml-1 text-xs text-neutral-500">{lang === 'ko' ? r.label : r.stateKo}</span>
                    </div>
                    <span className="font-mono text-sm">{(s.endorse_share * 100).toFixed(0)}%</span>
                  </div>
                  <div className="mt-2 text-xs text-neutral-400">{t(lang, 'truthShare')}</div>
                  <div className="mt-1 h-2 rounded bg-white/10" role="presentation">
                    <div className="h-2 rounded bg-amber-300/70" style={{ width: `${(s.endorse_share / max) * 100}%` }} />
                  </div>
                  <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-neutral-400">
                    <span>{t(lang, 'truthPosts', { n: +s.n_endorse.toFixed(1) })}</span>
                    <span>{t(lang, 'truthDem', { n: +s.n_dem_mention.toFixed(1) })}</span>
                    {s.z_vs_baseline !== null && <span>{t(lang, 'truthZ', { z: s.z_vs_baseline.toFixed(1) })}</span>}
                    {s.surge && <span className="rounded bg-amber-400/15 px-1.5 text-amber-300">{t(lang, 'truthSurge')}</span>}
                  </div>
                </div>
              );
            })}
          </div>
          <p className="mt-3 text-xs text-amber-300/80">{t(lang, 'truthNote')}</p>
          <p className="mt-1 text-xs text-neutral-500">
            {t(lang, 'truthMethod', { m: idx.method_version, g: idx.gazetteer_version })}{' '}
            <a className="underline" href={TRUTH_REPO_URL} target="_blank" rel="noreferrer">
              github.com/sechan9999/trump-truth-analysis
            </a>
          </p>
        </>
      )}
    </section>
  );
}

export interface RaceLite {
  id: string;
  name: string;
  label: string;
  stateKo: string;
}

export default function MessageTab({ lang, races }: { lang: Lang; races: RaceLite[] }) {
  const { data: w, err } = useFetch(fetchTruthWeekly);
  return (
    <div>
      <div className="mt-6 flex flex-wrap items-baseline justify-between gap-2 text-sm text-neutral-400">
        <span>
          {w
            ? t(lang, 'msgHeader', { last: w.meta.last, n: w.meta.analyzed.toLocaleString(), v: w.labels.version })
            : err
              ? t(lang, 'truthError')
              : t(lang, 'truthLoading')}
        </span>
        <a className="text-blue-300 underline" href={`${TRUTH_SITE_URL}?lang=${lang}`} target="_blank" rel="noreferrer">
          {t(lang, 'msgFull')}
        </a>
      </div>
      {w && <TopicMix lang={lang} w={w} />}
      <InterventionPanel lang={lang} races={races} />
      {w && <WeeklyTrend lang={lang} w={w} />}
      <p className="mt-4 text-xs text-neutral-500">
        {w && t(lang, 'msgCautionNote', { sil: w.stats.overall_silhouette.toFixed(2) })} {t(lang, 'msgLimits')}
      </p>
    </div>
  );
}
