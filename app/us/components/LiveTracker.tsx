'use client';

// Election results tracker. Before the window: schedule, sources and the "called" rule.
// In the window: polls the results feed, shows "updated N min ago", and falls back to the
// last good data with a warning when the feed fails or goes stale. Never shows results
// before the feed is configured.

import { useEffect, useState } from 'react';
import {
  fetchLiveFeed,
  LIVE_RESULTS_URL,
  LIVE_SOURCES,
  POLL_MS,
  STALE_FEED_MINUTES,
  TRACKER_WINDOW,
  trackerPhase,
  type LiveFeed,
  type TrackerPhase,
} from '../lib/live';
import { todayET } from '../lib/schedule';
import { t, type Lang } from '../lib/i18n';

interface RaceName {
  id: string;
  name: string;
}

const minutesAgo = (iso: string, now: number) => Math.max(0, Math.round((now - new Date(iso).getTime()) / 60_000));

export default function LiveTracker({ lang, races, daysLeft }: { lang: Lang; races: RaceName[]; daysLeft: number | null }) {
  const [phase, setPhase] = useState<TrackerPhase | null>(null);
  const [feed, setFeed] = useState<LiveFeed | null>(null);
  const [failedAt, setFailedAt] = useState<number | null>(null);
  const [now, setNow] = useState<number>(0);

  useEffect(() => {
    // Read the clock after mount so server and client HTML match.
    const tick = () => {
      setNow(Date.now());
      setPhase(trackerPhase(todayET()));
    };
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (phase !== 'window' || !LIVE_RESULTS_URL) return;
    const ac = new AbortController();
    const load = () =>
      fetchLiveFeed(ac.signal)
        .then((f) => {
          setFeed(f);
          setFailedAt(null);
        })
        .catch((e: unknown) => {
          if (!(e instanceof DOMException && e.name === 'AbortError')) setFailedAt(Date.now());
        });
    load();
    const id = setInterval(load, POLL_MS);
    return () => {
      ac.abort();
      clearInterval(id);
    };
  }, [phase]);

  const name = (id: string) => races.find((r) => r.id === id)?.name ?? id;
  const age = feed && now ? minutesAgo(feed.generatedAt, now) : null;
  const degraded = failedAt !== null || (age !== null && age > STALE_FEED_MINUTES);
  const waitingKey = !LIVE_RESULTS_URL ? 'liveNotConfigured' : failedAt ? 'liveDown' : 'liveWaiting';

  return (
    <section className="mt-8 rounded-xl border border-white/10 bg-white/5 p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-xl font-semibold">{t(lang, 'liveTitle')}</h2>
        {phase === 'before' && daysLeft !== null && (
          <span className="text-sm text-neutral-400">{t(lang, 'liveDays', { d: daysLeft })}</span>
        )}
        {feed && age !== null && (
          <span className={`text-sm ${degraded ? 'text-amber-300' : 'text-neutral-400'}`}>{t(lang, 'liveAgo', { m: age })}</span>
        )}
      </div>

      {(phase === 'before' || phase === null) && <p className="mt-2 text-sm text-neutral-400">{t(lang, 'livePre')}</p>}
      {phase === 'window' && !feed && <p className="mt-2 text-sm text-neutral-400">{t(lang, waitingKey)}</p>}
      {phase === 'after' && !feed && <p className="mt-2 text-sm text-neutral-400">{t(lang, 'liveClosed')}</p>}

      {feed && degraded && (
        <p className="mt-3 rounded bg-amber-400/10 px-3 py-2 text-sm text-amber-300">{t(lang, 'liveStale', { m: age ?? '—' })}</p>
      )}

      {feed && (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-neutral-400">
                <th className="py-2 pr-4">{t(lang, 'thState')}</th>
                <th className="py-2 pr-4">{t(lang, 'liveReporting')}</th>
                <th className="py-2 pr-4">D / R</th>
                <th className="py-2 pr-4">{t(lang, 'liveCalled')}</th>
                <th className="py-2">{t(lang, 'liveCountSource')}</th>
              </tr>
            </thead>
            <tbody>
              {feed.races.map((l) => (
                <tr key={l.id} className="border-b border-white/5">
                  <td className="py-2 pr-4">{name(l.id)}</td>
                  <td className="py-2 pr-4 font-mono">{l.pctReporting == null ? '—' : `${l.pctReporting.toFixed(0)}%`}</td>
                  <td className="py-2 pr-4 font-mono">
                    {l.demVotes.toLocaleString()} / {l.repVotes.toLocaleString()}
                  </td>
                  <td className="py-2 pr-4">
                    {l.called ? `${l.called}${l.calledBy ? ` (${l.calledBy})` : ''}` : t(lang, 'liveNotCalled')}
                  </td>
                  <td className="py-2 text-xs text-neutral-500">{l.countSource}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ul className="mt-3 space-y-1 text-xs text-neutral-500">
        <li>{t(lang, 'liveWindow', { start: TRACKER_WINDOW.start, end: TRACKER_WINDOW.end })}</li>
        <li>{t(lang, 'liveCalledRule')}</li>
        <li>
          {t(lang, 'liveSources')}{' '}
          {LIVE_SOURCES.map((s, i) => (
            <span key={s.key}>
              {i > 0 && ' · '}
              <a className="underline" href={s.url} target="_blank" rel="noreferrer">
                {lang === 'ko' ? s.nameKo : s.name}
              </a>
            </span>
          ))}
        </li>
      </ul>
    </section>
  );
}
