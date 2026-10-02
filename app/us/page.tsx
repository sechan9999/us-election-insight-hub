'use client';

// US Election Insights Hub — forecast board (Nov 3, 2026 midterms).
// Bilingual (ko default, ?lang=en), TV-first, no login.

import { useEffect, useMemo, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ReferenceArea,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { simulateChamber, analyticWinProb, type ChamberResult } from './lib/forecast';
import {
  SENATE_BATTLEGROUND,
  SENATE_BASELINE,
  HOUSE_SNAPSHOT,
  HOUSE_BASELINE,
  houseTossupSeed,
  MODEL_NOTES,
  DATA_AS_OF,
  DATA_SOURCE,
  SOURCE_URLS,
} from './lib/seed-data';
import { ELECTION_DAY, LIVE_RESULTS } from './lib/live';
import { forecastRunId } from './lib/run';
import { t, tl, tRating, type Lang } from './lib/i18n';

const TAU = MODEL_NOTES.tau;
const DEM_BLUE = '#60a5fa';
const REP_RED = '#f87171';
const Z90 = 1.6449;
const SIM_OPTS = { tau: TAU, sims: MODEL_NOTES.sims, seed: MODEL_NOTES.seed };

const pct = (p: number) => `${(p * 100).toFixed(1)}%`;
const margin = (m: number) => `${m > 0 ? 'D+' : m < 0 ? 'R+' : ''}${Math.abs(m).toFixed(1)}`;

function SeatDistribution({ lang, result, needed }: { lang: Lang; result: ChamberResult; needed: number }) {
  return (
    <div className="mt-3 h-40">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={result.histogram} margin={{ top: 8, right: 8, bottom: 0, left: -24 }}>
          <ReferenceArea x1={result.seatBand.p10} x2={result.seatBand.p90} fill="#ffffff" fillOpacity={0.06} />
          <XAxis dataKey="seats" stroke="#666" tick={{ fill: '#aaa', fontSize: 11 }} interval="preserveStartEnd" />
          <YAxis stroke="#666" tick={{ fill: '#aaa', fontSize: 11 }} tickFormatter={(v) => `${Math.round(Number(v) * 100)}%`} />
          <Tooltip
            contentStyle={{ background: '#111', border: '1px solid #333' }}
            formatter={(v) => [pct(Number(v)), lang === 'ko' ? '시뮬레이션 비율' : 'Share of sims']}
            labelFormatter={(s) => (lang === 'ko' ? `민주 ${String(s)}석` : `${String(s)} Dem seats`)}
          />
          <ReferenceLine x={needed} stroke="#fbbf24" strokeDasharray="4 4" />
          <Bar dataKey="prob" radius={[3, 3, 0, 0]}>
            {result.histogram.map((d) => (
              <Cell key={d.seats} fill={d.seats >= needed ? DEM_BLUE : REP_RED} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function USElectionHub() {
  const [lang, setLang] = useState<Lang>('ko');
  const [daysLeft, setDaysLeft] = useState<number | null>(null);

  useEffect(() => {
    // Read ?lang= and the countdown after mount so server and client HTML match.
    const q = new URLSearchParams(window.location.search).get('lang');
    const ms = new Date(`${ELECTION_DAY}T00:00:00-05:00`).getTime() - Date.now();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (q === 'en' || q === 'ko') setLang(q);
    setDaysLeft(Math.max(0, Math.ceil(ms / 86_400_000)));
  }, []);

  const switchLang = () => {
    const next: Lang = lang === 'ko' ? 'en' : 'ko';
    setLang(next);
    const url = new URL(window.location.href);
    url.searchParams.set('lang', next);
    window.history.replaceState(null, '', url);
  };

  const runId = useMemo(() => forecastRunId(), []);
  const senate = useMemo(
    () => simulateChamber(SENATE_BATTLEGROUND, SENATE_BASELINE.safeDemSeats, SENATE_BASELINE.needed, SIM_OPTS),
    [],
  );
  const house = useMemo(
    () => simulateChamber(houseTossupSeed(), HOUSE_BASELINE.safeDemSeats, HOUSE_BASELINE.needed, SIM_OPTS),
    [],
  );

  const races = useMemo(
    () =>
      [...SENATE_BATTLEGROUND]
        .sort((a, b) => b.demMargin - a.demMargin)
        .map((r) => {
          const spread = Z90 * Math.sqrt(r.sigma * r.sigma + TAU * TAU);
          return {
            ...r,
            name: lang === 'ko' ? r.stateKo : r.label,
            pWin: analyticWinProb(r.demMargin, r.sigma, TAU),
            lo: r.demMargin - spread,
            hi: r.demMargin + spread,
          };
        }),
    [lang],
  );

  const n = MODEL_NOTES.sims.toLocaleString(lang === 'ko' ? 'ko-KR' : 'en-US');
  const live = LIVE_RESULTS.length > 0;
  const kpis = [
    { key: 'senateKpi' as const, r: senate, need: SENATE_BASELINE.needed, extra: null },
    { key: 'houseKpi' as const, r: house, need: HOUSE_BASELINE.needed, extra: t(lang, 'houseAssume', { safe: HOUSE_BASELINE.safeDemSeats }) },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100" lang={lang}>
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <header className="mb-6">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="rounded bg-amber-400/15 px-2 py-1 text-amber-300">
              {t(lang, 'sample')} · {t(lang, 'dataAsOf')} {DATA_AS_OF}
            </span>
            <span className="rounded bg-white/5 px-2 py-1 text-neutral-400">{DATA_SOURCE}</span>
            <span className="rounded bg-white/5 px-2 py-1 font-mono text-neutral-400">
              {t(lang, 'runId')} {runId}
            </span>
            <button
              type="button"
              onClick={switchLang}
              className="ml-auto rounded border border-white/15 px-3 py-1 text-neutral-200 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {t(lang, 'langSwitch')}
            </button>
          </div>
          <h1 className="mt-3 text-3xl font-bold">{t(lang, 'title')}</h1>
          <p className="mt-1 text-neutral-400">{t(lang, 'subtitle', { n })}</p>
        </header>

        {/* KPI cards with seat distributions */}
        <div className="grid gap-4 md:grid-cols-2">
          {kpis.map(({ key, r, need, extra }) => (
            <div key={key} className="rounded-xl border border-white/10 bg-white/5 p-5">
              <div className="text-sm text-neutral-400">{t(lang, key)}</div>
              <div className="mt-1 text-4xl font-bold text-blue-400">{pct(r.demWinProb)}</div>
              <div className="mt-2 text-sm text-neutral-400">
                {t(lang, 'expected', { e: r.expectedDemSeats.toFixed(1), need })} ·{' '}
                {t(lang, 'band', { lo: r.seatBand.p10, hi: r.seatBand.p90 })}
              </div>
              {extra && <div className="mt-1 text-xs text-amber-300/80">{extra}</div>}
              <div className="mt-3 text-xs font-semibold text-neutral-300">{t(lang, 'distTitle')}</div>
              <SeatDistribution lang={lang} result={r} needed={need} />
            </div>
          ))}
        </div>
        <p className="mt-2 text-xs text-neutral-500">{t(lang, 'distNote')}</p>

        {/* Election-night tracker */}
        <section className="mt-8 rounded-xl border border-white/10 bg-white/5 p-5">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-xl font-semibold">{t(lang, 'liveTitle')}</h2>
            {daysLeft !== null && !live && <span className="text-sm text-neutral-400">{t(lang, 'liveDays', { d: daysLeft })}</span>}
          </div>
          {!live ? (
            <p className="mt-2 text-sm text-neutral-400">{t(lang, 'livePre')}</p>
          ) : (
            <table className="mt-4 w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-neutral-400">
                  <th className="py-2 pr-4">{t(lang, 'thState')}</th>
                  <th className="py-2 pr-4">{t(lang, 'liveReporting')}</th>
                  <th className="py-2 pr-4">D / R</th>
                  <th className="py-2">{t(lang, 'liveCalled')}</th>
                </tr>
              </thead>
              <tbody>
                {LIVE_RESULTS.map((l) => (
                  <tr key={l.id} className="border-b border-white/5">
                    <td className="py-2 pr-4">{l.id}</td>
                    <td className="py-2 pr-4 font-mono">{l.pctReporting.toFixed(0)}%</td>
                    <td className="py-2 pr-4 font-mono">
                      {l.demVotes.toLocaleString()} / {l.repVotes.toLocaleString()}
                    </td>
                    <td className="py-2">{l.called ? `${l.called}${l.calledBy ? ` (${l.calledBy})` : ''}` : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <p className="mt-2 text-xs text-neutral-500">{t(lang, 'liveSource')}</p>
        </section>

        {/* Senate battleground chart (vertical layout keeps labels off the 4-pt line) */}
        <section className="mt-8 rounded-xl border border-white/10 bg-white/5 p-5">
          <h2 className="text-xl font-semibold">{t(lang, 'battleTitle')}</h2>
          <p className="mt-1 text-sm text-neutral-400">{t(lang, 'battleNote')}</p>
          <div className="mt-4 h-[460px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={races} layout="vertical" margin={{ left: 8, right: 24 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis type="number" stroke="#888" tick={{ fill: '#aaa', fontSize: 12 }} />
                <YAxis type="category" dataKey="name" width={110} stroke="#888" tick={{ fill: '#ddd', fontSize: 13 }} />
                <Tooltip
                  contentStyle={{ background: '#111', border: '1px solid #333' }}
                  formatter={(value) => [margin(Number(value)), lang === 'ko' ? '민주당 우위' : 'Dem margin']}
                  labelFormatter={(label) => {
                    const r = races.find((d) => d.name === String(label));
                    return r ? `${r.label} · ${r.demCandidate} vs ${r.repCandidate}` : String(label);
                  }}
                />
                <ReferenceLine x={0} stroke="#666" />
                <ReferenceLine x={4} stroke="#fbbf24" strokeDasharray="5 5" label={{ value: '4pt', fill: '#fbbf24', fontSize: 12, position: 'top' }} />
                <Bar dataKey="demMargin">
                  {races.map((d) => (
                    <Cell key={d.id} fill={d.demMargin >= 0 ? DEM_BLUE : REP_RED} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Race table with uncertainty band */}
        <section className="mt-8 overflow-x-auto rounded-xl border border-white/10 bg-white/5 p-5">
          <h2 className="text-xl font-semibold">{t(lang, 'detailTitle')}</h2>
          <table className="mt-4 w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-neutral-400">
                <th className="py-2 pr-4">{t(lang, 'thState')}</th>
                <th className="py-2 pr-4">{t(lang, 'thDem')}</th>
                <th className="py-2 pr-4">{t(lang, 'thRep')}</th>
                <th className="py-2 pr-4">{t(lang, 'thAvg')}</th>
                <th className="py-2 pr-4">{t(lang, 'thBand')}</th>
                <th className="py-2 pr-4">{t(lang, 'thRating')}</th>
                <th className="py-2">{t(lang, 'thProb')}</th>
              </tr>
            </thead>
            <tbody>
              {races.map((d) => (
                <tr key={d.id} className="border-b border-white/5">
                  <td className="py-2 pr-4 font-medium">
                    {d.name} <span className="text-neutral-500">({lang === 'ko' ? d.label : d.stateKo})</span>
                  </td>
                  <td className="py-2 pr-4">{d.demCandidate}</td>
                  <td className="py-2 pr-4">{d.repCandidate}</td>
                  <td className={`py-2 pr-4 font-mono ${d.demMargin >= 0 ? 'text-blue-300' : 'text-rose-300'}`}>{margin(d.demMargin)}</td>
                  <td className="py-2 pr-4 font-mono text-neutral-400">
                    {margin(d.lo)} ~ {margin(d.hi)}
                  </td>
                  <td className="py-2 pr-4 text-neutral-400">{tRating(lang, d.rating)}</td>
                  <td className="py-2 font-mono">{pct(d.pWin)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* House panel */}
        <section className="mt-8 rounded-xl border border-white/10 bg-white/5 p-5">
          <h2 className="text-xl font-semibold">{t(lang, 'houseTitle')}</h2>
          <div className="mt-3 grid gap-4 text-sm md:grid-cols-3">
            <div>
              <div className="text-neutral-400">{t(lang, 'generic')}</div>
              <div className="mt-1 text-2xl font-bold text-blue-400">D+{HOUSE_SNAPSHOT.genericBallotDemMargin.toFixed(1)}</div>
              <div className="text-neutral-500">{HOUSE_SNAPSHOT.genericBallotSource}</div>
            </div>
            <div>
              <div className="text-neutral-400">{t(lang, 'compDist', { n: HOUSE_SNAPSHOT.competitiveDistricts.n })}</div>
              <div className="mt-1 text-2xl font-bold">
                {HOUSE_SNAPSHOT.competitiveDistricts.dem} : {HOUSE_SNAPSHOT.competitiveDistricts.rep}
              </div>
              <div className="text-neutral-500">
                {HOUSE_SNAPSHOT.competitiveDistricts.dates} · {HOUSE_SNAPSHOT.competitiveDistricts.source}
              </div>
            </div>
            <div>
              <div className="text-neutral-400">{t(lang, 'houseSim')}</div>
              <div className="mt-1 text-2xl font-bold text-blue-400">{pct(house.demWinProb)}</div>
              <div className="text-neutral-500">{t(lang, 'band', { lo: house.seatBand.p10, hi: house.seatBand.p90 })}</div>
            </div>
          </div>
          <p className="mt-3 text-xs text-amber-300/80">{t(lang, 'houseNote')}</p>
        </section>

        {/* Methodology */}
        <section className="mt-8 rounded-xl border border-white/10 bg-white/5 p-5 text-sm">
          <h2 className="text-xl font-semibold">{t(lang, 'methodTitle')}</h2>
          <p className="mt-3 text-neutral-300">{t(lang, 'method1')}</p>
          <p className="mt-2 font-mono text-neutral-300">P(D wins race i | s) = Φ((mᵢ + s) / σᵢ), published P = Φ(mᵢ / √(σᵢ² + τ²))</p>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-neutral-400">
            <li>{t(lang, 'mTau', { tau: TAU })}</li>
            <li>{t(lang, 'mSigma')}</li>
            <li>{t(lang, 'mSims', { n, seed: MODEL_NOTES.seed })}</li>
            <li>{t(lang, 'mGeneric')}</li>
          </ul>
          <h3 className="mt-4 font-semibold text-amber-300">{t(lang, 'assumptions')}</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-amber-200/80">
            <li>{t(lang, 'aSigma', { sigma: SENATE_BATTLEGROUND[0].sigma.toFixed(1) })}</li>
            <li>{t(lang, 'aTau', { tau: TAU })}</li>
            <li>{t(lang, 'aHouseSafe', { safe: HOUSE_BASELINE.safeDemSeats })}</li>
            <li>{t(lang, 'aHouseTossup', { n: HOUSE_SNAPSHOT.tossUps })}</li>
          </ul>
          <h3 className="mt-4 font-semibold">{t(lang, 'sources')}</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-neutral-400">
            {SOURCE_URLS.map((u) => (
              <li key={u}>
                <a className="underline" href={u} target="_blank" rel="noreferrer">
                  {u.replace(/^https:\/\/(www\.)?/, '')}
                </a>
              </li>
            ))}
          </ul>
        </section>

        {/* Editorial charter */}
        <section className="mt-8 rounded-xl border border-white/10 bg-white/5 p-5 text-sm">
          <h2 className="text-xl font-semibold">{t(lang, 'charterTitle')}</h2>
          <ol className="mt-3 list-decimal space-y-1 pl-5 text-neutral-300">
            {tl(lang, 'charter').map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ol>
        </section>

        <footer className="mt-8 border-t border-white/10 pt-4 text-xs text-neutral-500">
          {t(lang, 'footer')} · {runId} · {DATA_SOURCE}, {DATA_AS_OF}
        </footer>
      </div>
    </div>
  );
}
