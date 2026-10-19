'use client';

// "Research" tab — the MPSA 2027 submitted paper on the diploma divide.
// Content: app/us/lib/paper.ts (submitted abstract/keywords, 2026-10-13).

import {
  PAPER_ABSTRACT,
  PAPER_CTA,
  PAPER_FINDINGS,
  PAPER_FOOTER,
  PAPER_HERO,
  PAPER_KEYWORDS,
  PAPER_METHODS,
  tr,
} from '../lib/paper';
import type { Lang } from '../lib/i18n';

function SectionHead({ children }: { children: React.ReactNode }) {
  return <h2 className="mt-10 text-xl font-bold text-neutral-100">{children}</h2>;
}

export default function PaperTab({ lang }: { lang: Lang }) {
  return (
    <div className="mx-auto mt-6 max-w-4xl">
      {/* Hero */}
      <div className="flex flex-wrap gap-2">
        {PAPER_HERO.badges.map((b, i) => (
          <span key={i} className="rounded-full bg-amber-500/15 px-3 py-1 text-xs font-medium text-amber-300">
            {tr(lang, b)}
          </span>
        ))}
      </div>
      <p className="mt-4 text-xs text-neutral-500">{tr(lang, PAPER_HERO.section)}</p>
      <h1 className="mt-2 text-2xl font-bold leading-snug text-neutral-50 md:text-3xl">
        {tr(lang, PAPER_HERO.title)}
      </h1>
      <p className="mt-2 text-sm text-neutral-400">{tr(lang, PAPER_HERO.author)}</p>
      <p className="mt-4 leading-relaxed text-neutral-300">{tr(lang, PAPER_HERO.lede)}</p>

      {/* Abstract */}
      <SectionHead>{tr(lang, PAPER_ABSTRACT.heading)}</SectionHead>
      <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.02] p-5">
        {tr(lang, PAPER_ABSTRACT.body)
          .split('\n\n')
          .map((p, i) => (
            <p key={i} className="mb-4 text-sm leading-relaxed text-neutral-300 last:mb-0">
              {p}
            </p>
          ))}
      </div>

      {/* Findings */}
      <SectionHead>{tr(lang, PAPER_FINDINGS.heading)}</SectionHead>
      <div className="mt-3 grid gap-4 md:grid-cols-3">
        {PAPER_FINDINGS.items.map((f) => (
          <div key={f.n} className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-sky-500/20 text-sm font-bold text-sky-300">
              {f.n}
            </div>
            <h3 className="mt-3 font-semibold text-neutral-100">{tr(lang, f.title)}</h3>
            <p className="mt-2 text-sm leading-relaxed text-neutral-400">{tr(lang, f.body)}</p>
          </div>
        ))}
      </div>

      {/* Methods */}
      <SectionHead>{tr(lang, PAPER_METHODS.heading)}</SectionHead>
      <ul className="mt-3 space-y-2">
        {PAPER_METHODS.items.map((m, i) => (
          <li key={i} className="flex gap-2 text-sm text-neutral-300">
            <span className="text-sky-400">•</span>
            {tr(lang, m)}
          </li>
        ))}
      </ul>
      <p className="mt-3 rounded-lg border border-white/10 bg-white/[0.02] p-4 text-xs leading-relaxed text-neutral-500">
        {tr(lang, PAPER_METHODS.note)}
      </p>

      {/* Keywords */}
      <SectionHead>{tr(lang, PAPER_KEYWORDS.heading)}</SectionHead>
      <p className="mt-3 text-sm text-neutral-400">{tr(lang, PAPER_KEYWORDS.body)}</p>

      {/* CTA to maps */}
      <div className="mt-10 rounded-xl border border-sky-500/20 bg-sky-500/5 p-6 text-center">
        <h2 className="text-lg font-bold text-neutral-100">{tr(lang, PAPER_CTA.heading)}</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-neutral-400">{tr(lang, PAPER_CTA.body)}</p>
        <a
          href="/maps"
          className="mt-4 inline-block rounded-lg bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-sky-500"
        >
          {tr(lang, PAPER_CTA.button)}
        </a>
      </div>

      <p className="mt-8 border-t border-white/10 pt-4 text-xs leading-relaxed text-neutral-500">
        {tr(lang, PAPER_FOOTER)}
      </p>
    </div>
  );
}
