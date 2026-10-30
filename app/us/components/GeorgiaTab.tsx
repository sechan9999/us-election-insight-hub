'use client';

// "Georgia voting guide" tab — bilingual, nonpartisan voter information.
// Content: app/us/lib/georgia-guide.ts (facts verified 2026-10-15).

import { useEffect, useState } from 'react';
import {
  GA_BALLOT,
  GA_CHECKLIST,
  GA_CTA,
  GA_DATES,
  GA_FOOTER,
  GA_HB539_NOTE,
  GA_HERO,
  GA_MISTAKES,
  GA_QUESTIONS,
  GA_REFERENDUM,
  GA_SAMPLE,
  GA_SECTION2_NOTE,
  GA_WAYS,
  daysUntilElection,
  electionCountdown,
  tr,
  type BallotQ,
  type LText,
} from '../lib/georgia-guide';
import type { Lang } from '../lib/i18n';

function SectionHead({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <h2 className="mt-10 flex items-center gap-2 text-xl font-bold text-neutral-100">
      <span className="flex h-7 w-7 items-center justify-center rounded-md bg-sky-500/20 text-sm text-sky-300">{n}</span>
      {children}
    </h2>
  );
}

function PartyBadge({ party }: { party: 'R' | 'D' | LText | null }) {
  if (!party) return null;
  if (typeof party === 'string') {
    const red = party === 'R';
    return (
      <span className={`rounded px-2 py-0.5 text-xs font-semibold ${red ? 'bg-red-500/15 text-red-300' : 'bg-blue-500/15 text-blue-300'}`}>
        {party === 'R' ? '공화당 R' : '민주당 D'}
      </span>
    );
  }
  return <span className="rounded bg-neutral-500/15 px-2 py-0.5 text-xs font-semibold text-neutral-300">{tr('ko', party)}/{tr('en', party)}</span>;
}

function YesNo({ yes, no, lang }: { yes: LText; no: LText; lang: Lang }) {
  return (
    <div className="mt-3 grid gap-3 md:grid-cols-2">
      <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
        <div className="text-sm font-bold text-emerald-300">YES ({lang === 'ko' ? '찬성' : 'Yes'})</div>
        <p className="mt-1 text-sm text-neutral-300">{tr(lang, yes)}</p>
      </div>
      <div className="rounded-lg border border-rose-500/20 bg-rose-500/5 p-3">
        <div className="text-sm font-bold text-rose-300">NO ({lang === 'ko' ? '반대' : 'No'})</div>
        <p className="mt-1 text-sm text-neutral-300">{tr(lang, no)}</p>
      </div>
    </div>
  );
}

function ProCon({ yesPoints, noPoints, lang }: { yesPoints: LText[]; noPoints: LText[]; lang: Lang }) {
  return (
    <div className="mt-3 grid gap-3 md:grid-cols-2">
      <div>
        <div className="text-xs font-semibold text-emerald-300/90">{lang === 'ko' ? '찬성 쪽 논점' : 'Arguments for'}</div>
        <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-neutral-300">
          {yesPoints.map((p, i) => <li key={i}>{tr(lang, p)}</li>)}
        </ul>
      </div>
      <div>
        <div className="text-xs font-semibold text-rose-300/90">{lang === 'ko' ? '반대 쪽 논점' : 'Arguments against'}</div>
        <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-neutral-300">
          {noPoints.map((p, i) => <li key={i}>{tr(lang, p)}</li>)}
        </ul>
      </div>
    </div>
  );
}

function QuestionCard({ q, lang }: { q: BallotQ; lang: Lang }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-5">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sky-500/20 text-base font-bold text-sky-300">{q.num}</span>
        <div>
          <div className="text-xs text-neutral-400">{tr(lang, q.ref)}</div>
          <h3 className="text-lg font-bold text-neutral-100">{tr(lang, q.title)}</h3>
        </div>
      </div>
      <p className="mt-2 text-sm text-neutral-400">{tr(lang, q.gist)}</p>
      <div className="mt-3 rounded-lg bg-white/5 p-3">
        <div className="text-xs font-semibold text-neutral-300">{lang === 'ko' ? '쉽게 말하면' : 'In plain terms'}</div>
        <p className="mt-1 text-sm text-neutral-300">{tr(lang, q.plain)}</p>
      </div>
      <YesNo yes={q.yes} no={q.no} lang={lang} />
      <ProCon yesPoints={q.yesPoints} noPoints={q.noPoints} lang={lang} />
      {q.ballotText && (
        <details className="mt-3">
          <summary className="cursor-pointer text-xs text-sky-300 hover:text-sky-200">
            {lang === 'ko' ? '영문 원문 보기' : 'Show official ballot text'}
          </summary>
          <blockquote className="mt-2 border-l-2 border-sky-500/40 pl-3 text-xs italic text-neutral-400">
            {tr(lang, q.ballotText)}
          </blockquote>
        </details>
      )}
    </div>
  );
}

export default function GeorgiaTab({ lang }: { lang: Lang }) {
  // Live clock: the countdown re-computes every minute while the page is open.
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(id);
  }, []);
  const days = daysUntilElection(now);
  const cd = electionCountdown(now);
  const badges = cd.earlyOver
    ? [GA_HERO.badges[0], GA_HERO.badgeEarlyOver, GA_HERO.badges[2]]
    : GA_HERO.badges;
  return (
    <div className="mx-auto max-w-4xl pb-16">
      {/* Hero */}
      <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-sky-950/60 to-transparent p-6 md:p-8">
        <div className="flex flex-wrap gap-2">
          {badges.slice(0, 1).map((b, i) => (
            <span key={i} className="rounded-full bg-red-500/20 px-3 py-1 text-xs font-semibold text-red-200">{tr(lang, b)}</span>
          ))}
          {badges.slice(1).map((b, i) => (
            <span key={i} className="rounded-full bg-white/10 px-3 py-1 text-xs text-neutral-300">● {tr(lang, b)}</span>
          ))}
        </div>
        <h1 className="mt-4 text-3xl font-extrabold leading-tight text-neutral-50 md:text-4xl">
          2026 <span className="text-amber-300">{lang === 'ko' ? '조지아 투표,' : 'Georgia voting,'}</span>
          <br />
          {tr(lang, GA_HERO.title).replace(lang === 'ko' ? '2026 조지아 투표, ' : '2026 Georgia voting, ', '')}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-300 md:text-base">{tr(lang, GA_HERO.lede)}</p>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {GA_HERO.kpis.map((k, i) => (
            <div key={i} className="rounded-xl border border-white/10 bg-black/30 p-4">
              <div className="text-xs text-neutral-400">{tr(lang, k.label)}</div>
              <div className="mt-1 text-lg font-bold text-neutral-100">{tr(lang, k.value)}</div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-neutral-300">
          {days > 0 ? (
            <span className="font-bold text-amber-300">{tr(lang, GA_HERO.countdown(cd.days, cd.hours, cd.earlyOver))}</span>
          ) : days === 0 ? (
            tr(lang, GA_HERO.countdownToday)
          ) : (
            tr(lang, GA_HERO.countdownPast)
          )}
        </p>
      </div>

      {/* 1. Three ways */}
      <SectionHead n="1">{lang === 'ko' ? '투표하는 세 가지 방법' : 'Three ways to vote'}</SectionHead>
      <p className="mt-2 text-sm text-neutral-400">
        {lang === 'ko'
          ? '조지아에서는 직접 가서 미리 투표하거나, 선거일에 투표하거나, 우편으로 투표할 수 있습니다. 본인 일정에 맞는 방법을 고르세요.'
          : 'In Georgia you can vote early in person, on Election Day, or by mail. Pick what fits your schedule.'}
      </p>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {GA_WAYS.map((w, i) => (
          <div key={i} className="rounded-xl border border-white/10 bg-black/20 p-5">
            <span className="rounded bg-sky-500/15 px-2 py-0.5 text-xs font-semibold text-sky-300">{tr(lang, w.tag)}</span>
            <h3 className="mt-2 text-lg font-bold text-neutral-100">{tr(lang, w.title)}</h3>
            <div className="mt-1 text-sm font-semibold text-neutral-200">{tr(lang, w.date)}</div>
            <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-neutral-300">
              {w.points.map((p, j) => <li key={j}>{tr(lang, p)}</li>)}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-100">
        <span className="font-bold">⚠️ </span>{tr(lang, GA_MISTAKES)}
      </div>

      {/* 2. Key dates */}
      <SectionHead n="2">{lang === 'ko' ? '놓치면 안 되는 날짜' : 'Key dates'}</SectionHead>
      <p className="mt-2 text-sm text-neutral-400">{tr(lang, GA_SECTION2_NOTE)}</p>
      <div className="mt-4 overflow-hidden rounded-xl border border-white/10">
        {GA_DATES.map((d, i) => (
          <div key={i} className={`grid grid-cols-[140px_1fr] gap-3 p-3 text-sm md:grid-cols-[200px_1fr] ${i % 2 ? 'bg-white/[0.02]' : ''}`}>
            <div className="font-semibold text-neutral-200">
              {tr(lang, d.date)}
              {d.hot && <span className="ml-2 rounded bg-red-500/20 px-1.5 py-0.5 text-xs text-red-200">{lang === 'ko' ? '선거일' : 'E-Day'}</span>}
            </div>
            <div className="text-neutral-300">{tr(lang, d.note)}</div>
          </div>
        ))}
      </div>

      {/* 3. What is on the ballot */}
      <SectionHead n="3">{lang === 'ko' ? '투표용지에 무엇이 나오나요?' : "What's on the ballot?"}</SectionHead>
      <p className="mt-2 text-sm text-neutral-400">
        {lang === 'ko'
          ? '실제 투표용지는 내 집 주소에 따라 달라집니다. 아래는 이번 선거의 전체 구성이고, 그다음은 귀넷카운티 샘플 투표용지에 실제로 인쇄된 항목들입니다.'
          : 'Your actual ballot depends on your home address. Below is the full lineup for this election, followed by what is actually printed on a Gwinnett County sample ballot.'}
      </p>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {GA_BALLOT.map((b, i) => (
          <div key={i} className="rounded-xl border border-white/10 bg-black/20 p-5">
            <h3 className="font-bold text-neutral-100">{b.icon} {tr(lang, b.title)}</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-neutral-300">
              {b.items.map((it, j) => <li key={j}>{tr(lang, it)}</li>)}
            </ul>
          </div>
        ))}
      </div>

      {/* 4. Sample ballot */}
      <SectionHead n="4">{tr(lang, GA_SAMPLE.title)}</SectionHead>
      <p className="mt-2 text-sm text-neutral-400">{tr(lang, GA_SAMPLE.note)}</p>
      <div className="mt-3 rounded-lg border border-sky-500/20 bg-sky-500/5 p-3 text-sm text-sky-100/90">{tr(lang, GA_SAMPLE.howTo)}</div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {GA_SAMPLE.races.map((r, i) => (
          <div key={i} className="rounded-xl border border-white/10 bg-black/20 p-5">
            <div className="text-xs text-neutral-400">{tr(lang, r.office)}</div>
            <h3 className="mt-1 text-base font-bold text-neutral-100">{tr(lang, r.headline)}</h3>
            <div className="mt-3 space-y-2">
              {r.candidates.map((c, j) => (
                <div key={j} className="flex items-center justify-between gap-2">
                  <div className="text-sm text-neutral-200">
                    <span className="font-semibold">{c.name}</span>{' '}
                    <span className="text-neutral-400">{c.ko}</span>
                    {c.incumbent && <span className="ml-1 text-xs text-neutral-400">· {lang === 'ko' ? '현직' : 'incumbent'}</span>}
                  </div>
                  <PartyBadge party={c.party} />
                </div>
              ))}
            </div>
            <p className="mt-3 rounded-lg bg-white/5 p-2.5 text-xs leading-relaxed text-neutral-400">{tr(lang, r.explainer)}</p>
          </div>
        ))}
        <div className="rounded-xl border border-white/10 bg-black/20 p-5">
          <h3 className="text-base font-bold text-neutral-100">{tr(lang, GA_SAMPLE.orderNote.title)}</h3>
          <p className="mt-2 text-sm leading-relaxed text-neutral-300">{tr(lang, GA_SAMPLE.orderNote.body)}</p>
        </div>
      </div>

      {/* 5. Ballot questions */}
      <SectionHead n="5">{lang === 'ko' ? '투표용지 맨 아래 질문 4개, 쉽게 풀어쓰기' : 'The 4 questions at the bottom, in plain language'}</SectionHead>
      <p className="mt-2 text-sm text-neutral-400">
        {lang === 'ko'
          ? '후보가 아니라 제도 변경에 대한 찬반을 묻는 항목들입니다. 영문 법률 문장이 길고 어렵게 쓰여 있어서, 원래 뜻 → 쉬운 설명 → 찬성/반대를 눌렀을 때 무슨 일이 생기는지 순서로 정리했습니다.'
          : 'These ask about changes to law, not candidates. The legal English is long and dense, so each is organized: original meaning → plain explanation → what happens with Yes/No.'}
      </p>
      <div className="mt-4 space-y-4">
        {GA_QUESTIONS.map((q) => <QuestionCard key={q.num} q={q} lang={lang} />)}
        {/* Referendum */}
        <div className="rounded-xl border border-white/10 bg-black/20 p-5">
          <span className="rounded-full bg-red-500/20 px-3 py-1 text-xs font-semibold text-red-200">{tr(lang, GA_REFERENDUM.badge)}</span>
          <h3 className="mt-3 text-lg font-bold text-neutral-100">{tr(lang, GA_REFERENDUM.title)}</h3>
          <p className="mt-1 text-sm text-neutral-400">{tr(lang, GA_REFERENDUM.gist)}</p>
          <div className="mt-3 rounded-lg bg-white/5 p-3">
            <div className="text-xs font-semibold text-neutral-300">{lang === 'ko' ? '쉽게 말하면' : 'In plain terms'}</div>
            <p className="mt-1 text-sm text-neutral-300">{tr(lang, GA_REFERENDUM.plain)}</p>
          </div>
          <YesNo yes={GA_REFERENDUM.yes} no={GA_REFERENDUM.no} lang={lang} />
          <ProCon yesPoints={GA_REFERENDUM.yesPoints} noPoints={GA_REFERENDUM.noPoints} lang={lang} />
          <p className="mt-3 text-xs text-neutral-500">{tr(lang, GA_REFERENDUM.historyNote)}</p>
        </div>
        <p className="rounded-lg border border-white/10 bg-white/[0.03] p-3 text-xs text-neutral-400">{tr(lang, GA_HB539_NOTE)}</p>
      </div>

      {/* 6. Checklist + CTA */}
      <SectionHead n="6">{lang === 'ko' ? '투표하러 가기 전 체크리스트' : 'Before you go vote: checklist'}</SectionHead>
      <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-5">
        {GA_CHECKLIST.map((c, i) => (
          <div key={i} className={`flex gap-3 py-3 ${i ? 'border-t border-white/5' : ''}`}>
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-sm text-emerald-300">✓</span>
            <div>
              <div className="text-sm font-semibold text-neutral-100">{tr(lang, c.title)}</div>
              <div className="mt-0.5 text-sm text-neutral-400">{tr(lang, c.body)}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-2xl border border-sky-500/20 bg-gradient-to-b from-sky-950/50 to-transparent p-6">
        <h3 className="text-lg font-bold text-neutral-100">{tr(lang, GA_CTA.title)}</h3>
        <p className="mt-1 text-sm text-neutral-300">{tr(lang, GA_CTA.body)}</p>
        <ul className="mt-3 space-y-1.5 text-sm text-neutral-300">
          {GA_CTA.items.map((it, i) => <li key={i}><span className="text-emerald-300">✓ </span>{tr(lang, it)}</li>)}
        </ul>
        <a
          href={GA_CTA.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block rounded-lg bg-sky-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-sky-500"
        >
          {tr(lang, GA_CTA.button)}
        </a>
      </div>

      {/* Footer */}
      <footer className="mt-10 border-t border-white/10 pt-6 text-xs leading-relaxed text-neutral-500">
        <div className="font-bold text-neutral-300">{GA_FOOTER.org}</div>
        <p className="mt-2">{tr(lang, GA_FOOTER.disclaimer)}</p>
        <p className="mt-2">{tr(lang, GA_FOOTER.sources)}</p>
        <p className="mt-2">{tr(lang, GA_FOOTER.verify)}</p>
      </footer>
    </div>
  );
}
