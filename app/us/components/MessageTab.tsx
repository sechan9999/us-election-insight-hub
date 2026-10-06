'use client';

// "Message analysis" tab (Trump Truth Social). Descriptive layer only: never a forecast input.
// Renders the checked-in snapshot immediately, then swaps in the latest weekly export if reachable.

import { useEffect, useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  fetchLatestMessageIndex,
  MESSAGE_SITE_URL,
  MESSAGE_SNAPSHOT,
  stateCode,
  type MessageIndexWeekly,
} from '../lib/seed-messages';
import { t, type Lang } from '../lib/i18n';

// Kept apart from the forecast's blue/red on purpose: messaging is not a forecast.
const AMBER = '#fbbf24';
const TEAL = '#2dd4bf';
const OTHER = '#525252';
const TOP_TOPICS = 6;
const MIN_N = 20; // same small-sample rule as the endorsement window
const MARKS = ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧'];

export interface RaceLite {
  id: string;
  name: string;
  label: string;
  stateKo: string;
}

const pctText = (x: number | null | undefined) => (x == null ? '—' : `${Math.round(x * 100)}%`);

function Kpi({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-white/10 bg-black/20 p-4">
      <div className="text-xs text-neutral-400">{title}</div>
      <div className="mt-1 text-sm text-neutral-100">{children}</div>
    </div>
  );
}

const SmallBadge = ({ lang }: { lang: Lang }) => (
  <span className="rounded bg-amber-400/15 px-2 py-0.5 text-xs text-amber-300">{t(lang, 'ivSmall')}</span>
);

function Intervention({ lang, d, races }: { lang: Lang; d: MessageIndexWeekly; races: RaceLite[] }) {
  const [sel, setSel] = useState<string | null>(null);
  const rows = races
    .map((r) => {
      const s = d.states[stateCode(r.id)];
      return s ? { code: stateCode(r.id), name: r.name, alt: lang === 'ko' ? r.label : '', ...s } : null;
    })
    .filter((x): x is NonNullable<typeof x> => x !== null)
    .sort((a, b) => a.rank - b.rank || a.name.localeCompare(b.name));
  const nDem = rows.reduce((s, r) => s + r.nDemMention, 0);
  const demSmall = nDem < MIN_N;
  const chart = rows.map((r) => ({
    name: r.name,
    code: r.code,
    endorse: r.endorseShare * 100,
    dem: demSmall ? 0 : (r.demMentionShare ?? 0) * 100,
  }));
  const top = rows[0];
  const surges = rows.filter((r) => r.surge);
  const cur = rows.find((r) => r.code === (sel ?? rows[0]?.code));
  const small = d.smallN;

  return (
    <section className="mt-6 rounded-xl border border-white/10 bg-white/5 p-5">
      <h2 className="text-xl font-semibold">{t(lang, 'ivTitle')}</h2>
      <p className="mt-1 text-sm text-neutral-400">{t(lang, 'ivNote', { w: d.windowWeeks })}</p>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <Kpi title={t(lang, 'ivKpiTop')}>
          {small || !top ? (
            <SmallBadge lang={lang} />
          ) : (
            t(lang, 'ivTopSentence', { p: Math.round(top.endorseShare * 100), state: top.name, rank: top.rank })
          )}
        </Kpi>
        <Kpi title={t(lang, 'ivKpiSurge')}>
          {small ? <SmallBadge lang={lang} /> : surges.length ? surges.map((r) => r.name).join(', ') : t(lang, 'ivNone')}
        </Kpi>
        <Kpi title={t(lang, 'ivKpiCoverage')}>
          {t(lang, 'ivCoverage', { n: d.coverage.nEndorseWindow, p: pctText(d.coverage.mappedShare).replace('%', '') })}
        </Kpi>
      </div>

      {small && (
        <p className="mt-3 rounded bg-amber-400/10 px-3 py-2 text-sm text-amber-300">
          {t(lang, 'ivSmallNote', { n: Math.round(d.coverage.nMapped) })}
        </p>
      )}
      {demSmall && (
        <p className="mt-2 rounded bg-teal-400/10 px-3 py-2 text-sm text-teal-300">{t(lang, 'ivDemSmall', { n: +nDem.toFixed(1) })}</p>
      )}

      <div className={`mt-4 h-[460px] ${small ? 'opacity-40' : ''}`}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chart} layout="vertical" margin={{ left: 8, right: 24 }} barGap={2}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis type="number" stroke="#888" tick={{ fill: '#aaa', fontSize: 12 }} tickFormatter={(v) => `${v}%`} hide={small} />
            <YAxis type="category" dataKey="name" width={110} stroke="#888" tick={{ fill: '#ddd', fontSize: 13 }} />
            {!small && (
              <Tooltip
                contentStyle={{ background: '#111', border: '1px solid #333' }}
                formatter={(v, k) => [`${Number(v).toFixed(0)}%`, k === 'endorse' ? t(lang, 'ivEndorse') : t(lang, 'ivDem')]}
              />
            )}
            <Legend formatter={(k) => (k === 'endorse' ? t(lang, 'ivEndorse') : t(lang, 'ivDem'))} wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="endorse" fill={AMBER} onClick={(e) => setSel((e as { code?: string }).code ?? null)} cursor="pointer">
              {chart.map((c) => (
                <Cell key={c.code} fillOpacity={sel && sel !== c.code ? 0.4 : 1} />
              ))}
            </Bar>
            <Bar dataKey="dem" fill={TEAL} onClick={(e) => setSel((e as { code?: string }).code ?? null)} cursor="pointer">
              {chart.map((c) => (
                <Cell key={c.code} fillOpacity={sel && sel !== c.code ? 0.4 : 1} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 flex flex-wrap gap-1.5" role="group" aria-label={t(lang, 'ivPick')}>
        {rows.map((r) => (
          <button
            key={r.code}
            type="button"
            aria-pressed={sel === r.code}
            onClick={() => setSel(sel === r.code ? null : r.code)}
            className={`min-h-[36px] rounded border px-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              sel === r.code ? 'border-amber-300 text-amber-200' : 'border-white/15 text-neutral-300 hover:bg-white/10'
            }`}
          >
            {r.code}
          </button>
        ))}
      </div>
      {cur ? (
        <div className="mt-3 rounded-lg border border-white/10 bg-black/20 p-4 text-sm">
          <div className="font-semibold">
            {cur.name} <span className="text-xs text-neutral-500">{cur.alt}</span>
          </div>
          <div className="mt-1 text-neutral-300">{t(lang, 'ivPosts', { n: +cur.nEndorse.toFixed(1), m: +cur.nDemMention.toFixed(1) })}</div>
          {cur.smallN ? (
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-neutral-400">
              <SmallBadge lang={lang} />
              <span>{t(lang, 'ivSmallDetail', { n: Math.round(d.coverage.nMapped) })}</span>
            </div>
          ) : (
            <div className="mt-1 flex flex-wrap gap-x-4 font-mono text-xs text-neutral-400">
              <span>{t(lang, 'ivEndorse')} {pctText(cur.endorseShare)}</span>
              <span>{t(lang, 'ivDem')} {demSmall ? t(lang, 'ivSmall') : pctText(cur.demMentionShare)}</span>
              <span>{t(lang, 'ivZ')} {cur.zVsBaseline?.toFixed(1) ?? '—'}</span>
              <span>{t(lang, 'ivRank')} {cur.rank}/12</span>
            </div>
          )}
        </div>
      ) : (
        <p className="mt-2 text-xs text-neutral-500">{t(lang, 'ivPick')}</p>
      )}
    </section>
  );
}

function TopicMix({ lang, d }: { lang: Lang; d: MessageIndexWeekly }) {
  const slugs = Object.keys(d.topicLabels);
  const top = useMemo(() => {
    const tot = (k: string) => d.topics.reduce((s, m) => s + Number(m[k] ?? 0), 0);
    return [...slugs].sort((a, b) => tot(b) - tot(a)).slice(0, TOP_TOPICS);
  }, [d, slugs]);
  const data = d.topics.map((m) => {
    const row: Record<string, number | string> = { month: m.month.slice(2).replace('-', '.') };
    let other = 0;
    for (const k of slugs) {
      if (top.includes(k)) row[k] = Number(m[k] ?? 0);
      else other += Number(m[k] ?? 0);
    }
    row.other = other;
    return row;
  });
  const name = (k: string) => (k === 'other' ? t(lang, 'mixOther') : d.topicLabels[k]?.[lang] ?? k);
  const last = d.topics[d.topics.length - 1]?.month.slice(2).replace('-', '.') ?? '';

  return (
    <section className="mt-6 rounded-xl border border-white/10 bg-white/5 p-5">
      <h2 className="text-xl font-semibold">{t(lang, 'mixTitle')}</h2>
      <p className="mt-1 text-sm text-neutral-400">{t(lang, 'mixNote', { last })}</p>
      <div className="mt-4 h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} stackOffset="expand" margin={{ top: 20, right: 12, left: -12, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="month" stroke="#888" tick={{ fill: '#aaa', fontSize: 11 }} interval="preserveStartEnd" />
            <YAxis stroke="#888" tick={{ fill: '#aaa', fontSize: 11 }} tickFormatter={(v) => `${Math.round(Number(v) * 100)}%`} />
            <Tooltip
              contentStyle={{ background: '#111', border: '1px solid #333' }}
              formatter={(v, k) => [Number(v), name(String(k))]}
            />
            {[...top, 'other'].map((k) => (
              <Area
                key={k}
                type="monotone"
                dataKey={k}
                stackId="1"
                stroke={k === 'other' ? OTHER : d.topicLabels[k].color}
                fill={k === 'other' ? OTHER : d.topicLabels[k].color}
                fillOpacity={0.75}
              />
            ))}
            {[...new Set(d.annotations.map((a) => a.month))].map((m) => (
              <ReferenceLine
                key={m}
                x={m.slice(2).replace('-', '.')}
                stroke="#e5e5e5"
                strokeDasharray="3 3"
                label={{
                  value: d.annotations.flatMap((a, i) => (a.month === m ? [MARKS[i]] : [])).join(''),
                  fill: '#e5e5e5',
                  fontSize: 12,
                  position: 'top',
                }}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-neutral-300">
        {[...top, 'other'].map((k) => (
          <li key={k} className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: k === 'other' ? OTHER : d.topicLabels[k].color }} />
            {name(k)}
            {k !== 'other' && d.topicLabels[k].caution && <span className="text-amber-300/80">*</span>}
          </li>
        ))}
      </ul>
      <ol className="mt-4 space-y-1.5 text-sm text-neutral-300">
        {d.annotations.map((a, i) => (
          <li key={`${a.month}-${a.topic}`}>
            <span className="mr-1.5 text-neutral-400">{MARKS[i]}</span>
            {t(lang, 'mixAnn', { month: a.month, topic: name(a.topic), n: a.nMonth, p: (a.shareMonth * 100).toFixed(1) })}
            <span className="ml-2 font-mono text-xs text-neutral-500">
              {t(lang, 'mixAnnKw')}: {a.keywords.join(', ')}
            </span>
          </li>
        ))}
      </ol>
      <p className="mt-2 text-xs text-neutral-500">
        {t(lang, 'mixCaution')} {t(lang, 'mixAnnNote')}
      </p>
    </section>
  );
}

const GALLUP_STROKES = ['#2dd4bf', '#99f6e4'];
const YOUGOV = '#a3a3a3';
const mlabel = (m: string) => m.slice(2).replace('-', '.');

function GallupDot(props: { cx?: number; cy?: number; payload?: Record<string, unknown>; value?: number | null; stroke?: string }) {
  const { cx, cy, payload, value, stroke } = props;
  if (cx == null || cy == null || value == null) return null;
  const filled = payload?.gq === 'primary' || payload?.gq === 'partial';
  return <circle cx={cx} cy={cy} r={3} stroke={stroke} strokeWidth={1.5} fill={filled ? stroke : '#0a0a0a'} />;
}

function MessageVsPublic({ lang, d }: { lang: Lang; d: MessageIndexWeekly }) {
  const mvp = d.messageVsPublic;
  if (!mvp) return null; // hidden until poll data is exported
  const matchKey = (m: string) => (m === 'partial' ? 'mvpMatchPartial' : m === 'approximate' ? 'mvpMatchApprox' : 'mvpMatchDirect');
  const topicName = (k: string) => d.topicLabels[k]?.[lang] ?? k;
  const partial = mlabel(mvp.partialMonth);

  return (
    <section className="mt-6 rounded-xl border border-white/10 bg-white/5 p-5">
      <h2 className="text-xl font-semibold">{t(lang, 'mvpTitle')}</h2>
      <p className="mt-1 text-sm text-neutral-400">{t(lang, 'mvpNote', { v: mvp.mappingVersion })}</p>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-neutral-300">
        <span className="flex items-center gap-1.5"><span className="inline-block h-0.5 w-5" style={{ background: AMBER }} />{t(lang, 'mvpTrump')}</span>
        <span className="flex items-center gap-1.5"><span className="inline-block h-0.5 w-5" style={{ background: TEAL }} />{t(lang, 'mvpGallup')}</span>
        <span className="flex items-center gap-1.5"><span className="inline-block h-0 w-5 border-t-2 border-dashed" style={{ borderColor: YOUGOV }} />{t(lang, 'mvpYouGov')}</span>
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        {mvp.pairs.map((p) => {
          const gal = p.public.filter((s) => s.source === 'gallup');
          const yg = p.public.filter((s) => s.source === 'yougov');
          const data = mvp.months.map((m, i) => {
            const row: Record<string, number | string | null> = { month: m === mvp.partialMonth ? `${mlabel(m)}*` : mlabel(m), trump: p.trump[i], gq: mvp.gallupQuality[m] ?? null };
            p.public.forEach((s, j) => (row[`s${j}`] = s.values[i]));
            return row;
          });
          const names: Record<string, string> = { trump: t(lang, 'mvpTrump') };
          p.public.forEach((s, j) => (names[`s${j}`] = `${s.source === 'gallup' ? 'Gallup' : 'YouGov'}: ${s.label}`));
          return (
            <div key={p.topic} className="rounded-lg border border-white/10 bg-black/20 p-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="font-semibold">{topicName(p.topic)}</span>
                <span className={`rounded px-2 py-0.5 text-xs ${p.match === 'direct' ? 'bg-white/10 text-neutral-300' : 'bg-amber-400/15 text-amber-300'}`}>
                  {t(lang, matchKey(p.match))}
                </span>
              </div>
              <div className="mt-1 text-xs text-neutral-500">↔ {p.public.map((s) => `${s.source === 'gallup' ? 'Gallup' : 'YouGov'}: ${s.label}`).join(' · ')}</div>
              <div className="mt-3 h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="month" stroke="#888" tick={{ fill: '#aaa', fontSize: 10 }} interval="preserveStartEnd" />
                    <YAxis stroke="#888" tick={{ fill: '#aaa', fontSize: 10 }} tickFormatter={(v) => `${v}%`} />
                    <Tooltip
                      contentStyle={{ background: '#111', border: '1px solid #333' }}
                      formatter={(v, k) => [v == null ? '—' : `${Number(v).toFixed(1)}%`, names[String(k)] ?? String(k)]}
                    />
                    {mvp.months
                      .filter((m) => mvp.gallupQuality[m] === 'missing' || mvp.gallupQuality[m] === 'excluded')
                      .map((m) => (
                        <ReferenceArea key={m} x1={mlabel(m)} x2={mlabel(m)} fill="#737373" fillOpacity={0.18} ifOverflow="extendDomain" />
                      ))}
                    <ReferenceLine x={mlabel(mvp.yougovMethodBreak)} stroke="#525252" strokeDasharray="2 4" label={{ value: t(lang, 'mvpYgBreak'), fill: '#737373', fontSize: 9, position: 'insideTopLeft' }} />
                    <Line type="monotone" dataKey="trump" stroke={AMBER} strokeWidth={2} dot={false} connectNulls={false} isAnimationActive={false} />
                    {p.public.map((s, j) =>
                      s.source === 'gallup' ? (
                        <Line key={j} type="monotone" dataKey={`s${j}`} stroke={GALLUP_STROKES[gal.indexOf(s)] ?? TEAL} strokeWidth={2} strokeDasharray={gal.indexOf(s) > 0 ? '5 3' : undefined} dot={<GallupDot />} connectNulls={false} isAnimationActive={false} />
                      ) : (
                        <Line key={j} type="monotone" dataKey={`s${j}`} stroke={YOUGOV} strokeWidth={1.5} strokeDasharray="4 3" dot={false} connectNulls={false} isAnimationActive={false} />
                      ),
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 font-mono text-xs text-neutral-400">
                <span>{t(lang, 'mvpPeak')}:</span>
                <span style={{ color: AMBER }}>Trump {p.trumpPeak ?? '—'}</span>
                {gal.map((s) => (
                  <span key={s.key} style={{ color: TEAL }}>Gallup {gal.length > 1 ? `(${s.label}) ` : ''}{s.peak ?? '—'}</span>
                ))}
                {yg.map((s) => (
                  <span key={s.key}>YouGov {yg.length > 1 ? `(${s.label}) ` : ''}{s.peak ?? '—'}</span>
                ))}
              </div>
              <p className="mt-1 text-xs text-neutral-500">{lang === 'ko' ? p.noteKo : p.note}</p>
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-xs text-neutral-500">{t(lang, 'mvpLegend', { partial })} {t(lang, 'mvpGaps')}</p>
      <p className="mt-1 text-xs text-amber-300/80">{t(lang, 'mvpGuard')}</p>
      <p className="mt-1 text-xs text-neutral-500">{t(lang, 'mvpSources')}</p>
    </section>
  );
}

function Method({ lang, d }: { lang: Lang; d: MessageIndexWeekly }) {
  return (
    <section className="mt-6 rounded-xl border border-white/10 bg-white/5 p-5 text-sm">
      <h2 className="text-xl font-semibold">{t(lang, 'msgMethodTitle')}</h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-neutral-400">
        <li>{t(lang, 'msgM1', { collected: d.collected })}</li>
        <li>{t(lang, 'msgM2', { sil: d.silhouette.toFixed(2), lv: d.labelsVersion })}</li>
        <li>{t(lang, 'msgM3', { g: d.gazetteerVersion, m: d.methodVersion })}</li>
        {d.labelAudit && (
          <li>
            {t(lang, 'msgAudit', {
              v: d.labelAudit.labelVersion,
              n: d.labelAudit.n,
              per: Math.round(d.labelAudit.n / Object.keys(d.topicLabels).length),
              k: d.labelAudit.fit,
              p: (d.labelAudit.fitRate * 100).toFixed(1),
              lo: (d.labelAudit.ci95[0] * 100).toFixed(1),
              hi: (d.labelAudit.ci95[1] * 100).toFixed(1),
            })}{' '}
            {t(lang, 'msgAuditHow', {
              c: lang === 'ko' ? d.labelAudit.criterionKo : d.labelAudit.criterion,
              r: d.labelAudit.reviewers,
            })}{' '}
            {d.labelAudit.rereview &&
              t(lang, 'msgAuditRe', {
                r2: d.labelAudit.rereview.reviewers,
                ch: d.labelAudit.rereview.changed,
                ny: d.labelAudit.rereview.nToY,
                yn: d.labelAudit.rereview.yToN,
                ret: (d.labelAudit.rereview.retention * 100).toFixed(1),
                k: d.labelAudit.rereview.kappaFirstVsFinal.toFixed(2),
              })}{' '}
            {d.labelAudit.interRaterAgreement == null && t(lang, 'msgAuditIrr')}{' '}
            {t(lang, 'msgAuditLow', {
              list: d.labelAudit.lowest
                .map((x) => `${d.topicLabels[x.topic]?.[lang] ?? x.topic} ${Math.round(x.fitRate * 100)}%`)
                .join(', '),
            })}
          </li>
        )}
      </ul>
      <h3 className="mt-4 font-semibold text-amber-300">{t(lang, 'msgLimitsTitle')}</h3>
      <ol className="mt-2 list-decimal space-y-1 pl-5 text-amber-200/80">
        <li>{t(lang, 'msgL1')}</li>
        <li>{t(lang, 'msgL2')}</li>
        <li>{t(lang, 'msgL3')}</li>
        <li>{t(lang, 'msgL4')}</li>
      </ol>
      <p className="mt-3 text-xs text-neutral-500">{t(lang, 'msgGuard')}</p>
    </section>
  );
}

export default function MessageTab({ lang, races }: { lang: Lang; races: RaceLite[] }) {
  const [d, setD] = useState<MessageIndexWeekly>(MESSAGE_SNAPSHOT);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const ac = new AbortController();
    fetchLatestMessageIndex(ac.signal)
      .then((x) => {
        setD(x);
        setLive(true);
      })
      .catch(() => {
        /* keep the checked-in snapshot */
      });
    return () => ac.abort();
  }, []);

  const end = d.topics[d.topics.length - 1]?.month.replace('-', '.') ?? '';
  return (
    <div className="mt-6">
      {/* Header strip */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-5">
        <h2 className="text-xl font-semibold">{t(lang, 'msgTitle')}</h2>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-sm text-neutral-400">
            {t(lang, 'msgMeta', { end, total: d.nPostsTotal.toLocaleString(), n: d.nPostsAnalyzed.toLocaleString() })}
          </span>
          <span className="rounded bg-teal-400/15 px-2 py-1 text-teal-300">
            {t(lang, 'msgAsOf', { week: d.week })}
            {!live && ` · ${t(lang, 'msgSnapshot')}`}
          </span>
          <a className="ml-auto text-blue-300 underline" href={`${MESSAGE_SITE_URL}?lang=${lang}`} target="_blank" rel="noreferrer">
            {t(lang, 'msgFull')} →
          </a>
        </div>
      </div>
      <Intervention lang={lang} d={d} races={races} />
      <TopicMix lang={lang} d={d} />
      <MessageVsPublic lang={lang} d={d} />
      <Method lang={lang} d={d} />
    </div>
  );
}
