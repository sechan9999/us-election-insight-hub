'use client';

// Topic spike episodes over the weekly posting volume. Episodes are unnamed on purpose:
// the evidence is the distinctive terms and the linked original posts.

import { useMemo, useState } from 'react';
import { truthPostUrl, type TruthEvent, type TruthWeekly } from './lib/truth';
import { t, type Lang } from './lib/i18n';

const LIST_N = 8;
const short = (d: string) => d.slice(2).replace(/-/g, '.');

interface Placed extends TruthEvent {
  key: string;
  a: number;
  b: number;
  lane: number;
}

function place(events: TruthEvent[], weeks: string[]): { items: Placed[]; lanes: number } {
  const ends: number[] = [];
  const items = [...events]
    .sort((x, y) => x.start.localeCompare(y.start))
    .map((e) => {
      const a = Math.max(0, weeks.indexOf(e.start));
      const b = Math.min(weeks.length - 1, a + e.weeks - 1);
      let lane = ends.findIndex((end) => end < a);
      if (lane < 0) lane = ends.push(b) - 1;
      else ends[lane] = b;
      return { ...e, key: `${e.cluster}-${e.start}`, a, b, lane };
    });
  return { items, lanes: Math.max(1, ends.length) };
}

export default function EventTimeline({ lang, w }: { lang: Lang; w: TruthWeekly }) {
  const [topic, setTopic] = useState<number | 'all'>('all');
  const [sel, setSel] = useState<string | null>(null);
  const [all, setAll] = useState(false);

  const keys = Object.keys(w.labels.clusters);
  const n = w.weeks.length;
  const totals = useMemo(() => w.weeks.map((_, i) => keys.reduce((s, k) => s + (w.weekly[k][i] ?? 0), 0)), [w, keys]);
  const evs = useMemo(() => (w.events?.events ?? []).filter((e) => topic === 'all' || e.cluster === topic), [w, topic]);
  const { items, lanes } = useMemo(() => place(evs, w.weeks), [evs, w.weeks]);
  if (!w.events) return null;

  const max = Math.max(1, ...totals);
  const recent = [...items].sort((x, y) => y.start.localeCompare(x.start));
  const current = items.find((e) => e.key === sel) ?? recent[0];
  const lab = (c: number) => w.labels.clusters[String(c)];
  const pctLeft = (i: number) => `${(i / n) * 100}%`;
  const pctWidth = (a: number, b: number) => `${((b - a + 1) / n) * 100}%`;

  return (
    <section className="mt-6 rounded-xl border border-white/10 bg-white/5 p-5">
      <h2 className="text-xl font-semibold">{t(lang, 'evTitle')}</h2>
      <p className="mt-1 text-sm text-neutral-400">{t(lang, 'evNote', { n: items.length })}</p>

      <div className="mt-3 flex flex-wrap gap-2">
        {(['all', ...keys.map(Number)] as const).map((k) => (
          <button
            key={String(k)}
            type="button"
            aria-pressed={topic === k}
            onClick={() => {
              setTopic(k);
              setSel(null);
            }}
            className={`flex min-h-[36px] items-center gap-1.5 rounded-full border px-3 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              topic === k ? 'border-neutral-100 bg-neutral-100 text-neutral-900' : 'border-white/15 text-neutral-300 hover:bg-white/10'
            }`}
          >
            {k !== 'all' && <span className="inline-block h-2 w-2 rounded-full" style={{ background: lab(k).c }} />}
            {k === 'all' ? t(lang, 'evAll') : lab(k)[lang][0]}
          </button>
        ))}
      </div>

      <div className="mt-4">
        <div className="flex h-28 items-end gap-px border-b border-white/15" role="presentation">
          {totals.map((v, i) => {
            const on = current && i >= current.a && i <= current.b;
            return (
              <div
                key={w.weeks[i]}
                title={`${short(w.weeks[i])} · ${v}`}
                className="flex-1 rounded-t-sm"
                style={{ height: `${(v / max) * 100}%`, background: on ? lab(current.cluster).c : 'rgba(255,255,255,0.25)' }}
              />
            );
          })}
        </div>
        <div className="relative mt-1" style={{ height: lanes * 12 }}>
          {items.map((e) => (
            <button
              key={e.key}
              type="button"
              aria-label={`${lab(e.cluster)[lang][0]} ${e.start} ~ ${e.end}`}
              aria-pressed={current?.key === e.key}
              onClick={() => setSel(e.key)}
              className="absolute h-2.5 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              style={{
                left: pctLeft(e.a),
                width: pctWidth(e.a, e.b),
                minWidth: 6,
                top: e.lane * 12,
                background: lab(e.cluster).c,
                opacity: current?.key === e.key ? 1 : 0.55,
              }}
            />
          ))}
        </div>
        <div className="mt-1 flex justify-between text-[11px] text-neutral-500">
          <span>{short(w.weeks[0])}</span>
          <span>{short(w.weeks[n - 1])}</span>
        </div>
      </div>

      {current && (
        <div className="mt-4 rounded-lg border border-white/10 bg-black/20 p-4">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <span className="flex items-center gap-2 font-semibold">
              <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: lab(current.cluster).c }} />
              {lab(current.cluster)[lang][0]}
            </span>
            <span className="font-mono text-xs text-neutral-400">
              {t(lang, 'evPeriod', { start: current.start, end: current.end, w: current.weeks })}
            </span>
          </div>
          <div className="mt-1 text-sm text-neutral-300">
            {t(lang, 'evStat', { n: current.count, b: current.baseline_weekly, r: current.ratio, peak: current.peak })}
          </div>
          <div className="mt-3 text-xs text-neutral-400">{t(lang, 'evKw')}</div>
          <div className="mt-1 font-mono text-xs text-neutral-200">{current.keywords.join(', ')}</div>
          <div className="mt-3 text-xs text-neutral-400">{t(lang, 'evEx')}</div>
          <ul className="mt-1 space-y-2">
            {current.examples.map(([id, date, text]) => (
              <li key={id} className="border-l-2 border-white/15 pl-3 text-sm text-neutral-300">
                <a className="hover:underline" href={truthPostUrl(id)} target="_blank" rel="noreferrer">
                  <span className="mr-2 font-mono text-xs text-neutral-500">{date}</span>
                  {text}
                  {text.length >= 180 ? '…' : ''}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <h3 className="mt-5 text-sm font-semibold text-neutral-300">{t(lang, 'evList')}</h3>
      <ul className="mt-2 divide-y divide-white/5 text-sm">
        {(all ? recent : recent.slice(0, LIST_N)).map((e) => (
          <li key={e.key}>
            <button
              type="button"
              onClick={() => setSel(e.key)}
              className={`flex min-h-[44px] w-full flex-wrap items-center gap-x-3 gap-y-1 py-2 text-left hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                current?.key === e.key ? 'bg-white/5' : ''
              }`}
            >
              <span className="w-24 font-mono text-xs text-neutral-500">{short(e.start)}</span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-2 w-2 rounded-full" style={{ background: lab(e.cluster).c }} />
                {lab(e.cluster)[lang][0]}
              </span>
              <span className="font-mono text-xs text-neutral-400">×{e.ratio}</span>
              <span className="truncate font-mono text-xs text-neutral-500">{e.keywords.slice(0, 3).join(', ')}</span>
            </button>
          </li>
        ))}
      </ul>
      {recent.length > LIST_N && (
        <button type="button" onClick={() => setAll(!all)} className="mt-2 min-h-[36px] text-sm text-blue-300 underline">
          {all ? t(lang, 'evLess') : t(lang, 'evMore', { n: recent.length })}
        </button>
      )}
      <p className="mt-3 text-xs text-neutral-500">
        {w.events.rule[lang]} · {t(lang, 'evPoll')}
      </p>
    </section>
  );
}
