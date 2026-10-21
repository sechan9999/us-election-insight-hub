'use client';

// "Prediction markets" tab — Polymarket snapshot for stock-market-linked markets.
// Content/data: app/us/lib/polymarket.ts (CLOB prices retrieved 2026-10-21).

import {
  PM_ELECTION,
  PM_FOOTER,
  PM_HERO,
  PM_SECTIONS,
  tr,
} from '../lib/polymarket';
import type { Lang } from '../lib/i18n';

function SectionHead({ children }: { children: React.ReactNode }) {
  return <h2 className="mt-10 text-xl font-bold text-neutral-100">{children}</h2>;
}

const pct = (x: number) => `${(x * 100).toFixed(1)}%`;

function barColor(yes: number): string {
  if (yes >= 0.65) return 'bg-emerald-500';
  if (yes >= 0.35) return 'bg-amber-500';
  return 'bg-sky-500';
}

export default function PolymarketTab({ lang }: { lang: Lang }) {
  return (
    <div className="mx-auto mt-6 max-w-4xl">
      {/* Hero */}
      <div className="flex flex-wrap gap-2">
        {PM_HERO.badges.map((b, i) => (
          <span key={i} className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-300">
            {tr(lang, b)}
          </span>
        ))}
      </div>
      <h1 className="mt-3 text-2xl font-bold leading-snug text-neutral-50 md:text-3xl">
        {tr(lang, PM_HERO.title)}
      </h1>
      <p className="mt-4 leading-relaxed text-neutral-300">{tr(lang, PM_HERO.lede)}</p>
      <p className="mt-3 rounded-lg border border-white/10 bg-white/[0.02] p-4 text-xs leading-relaxed text-neutral-500">
        {tr(lang, PM_HERO.howTo)}
      </p>

      {/* Market sections */}
      {PM_SECTIONS.map((sec, si) => (
        <div key={si}>
          <SectionHead>{tr(lang, sec.heading)}</SectionHead>
          <p className="mt-2 text-sm leading-relaxed text-neutral-400">{tr(lang, sec.blurb)}</p>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {sec.items.map((it) => (
              <div key={it.slug} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                <div className="flex items-baseline justify-between gap-3">
                  <a
                    href={`https://polymarket.com/event/${it.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-neutral-100 hover:underline"
                  >
                    {tr(lang, it.label)}
                  </a>
                  <span className="shrink-0 text-xl font-bold text-neutral-50">{pct(it.yes)}</span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                  <div className={`h-full rounded-full ${barColor(it.yes)}`} style={{ width: pct(it.yes) }} />
                </div>
                <p className="mt-2 text-xs italic leading-relaxed text-neutral-500">“{it.question}”</p>
                {it.note && <p className="mt-1 text-xs leading-relaxed text-neutral-400">{tr(lang, it.note)}</p>}
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Election: market vs model */}
      <SectionHead>{tr(lang, PM_ELECTION.heading)}</SectionHead>
      <p className="mt-2 text-sm leading-relaxed text-neutral-400">{tr(lang, PM_ELECTION.blurb)}</p>
      <div className="mt-3 overflow-hidden rounded-xl border border-white/10">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-white/[0.04] text-left text-neutral-400">
              <th className="px-4 py-3 font-medium"></th>
              <th className="px-4 py-3 font-medium">{tr(lang, PM_ELECTION.colMarket)}</th>
              <th className="px-4 py-3 font-medium">{tr(lang, PM_ELECTION.colModel)}</th>
            </tr>
          </thead>
          <tbody>
            {PM_ELECTION.rows.map((r) => (
              <tr key={r.slug} className="border-t border-white/10">
                <td className="px-4 py-3">
                  <a
                    href={`https://polymarket.com/event/${r.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-neutral-100 hover:underline"
                  >
                    {tr(lang, r.label)}
                  </a>
                </td>
                <td className="px-4 py-3 text-lg font-bold text-emerald-300">{pct(r.market)}</td>
                <td className="px-4 py-3 text-lg font-bold text-sky-300">{pct(r.model)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h3 className="mt-5 font-semibold text-neutral-100">{tr(lang, PM_ELECTION.balance.label)}</h3>
      <div className="mt-3 grid gap-3 md:grid-cols-3">
        {PM_ELECTION.balance.items.map((b) => (
          <div key={b.slug} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-sm font-medium text-neutral-200">{tr(lang, b.label)}</span>
              <span className="text-lg font-bold text-neutral-50">{pct(b.yes)}</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
              <div className={`h-full rounded-full ${barColor(b.yes)}`} style={{ width: pct(b.yes) }} />
            </div>
          </div>
        ))}
      </div>

      <p className="mt-8 border-t border-white/10 pt-4 text-xs leading-relaxed text-neutral-500">
        {tr(lang, PM_FOOTER)}
      </p>
    </div>
  );
}
