// Shared ingest core used by the CLI (scripts/ingest-results.ts) and the Cloud Run job (ingest/results/job.ts).
// Never marks a race called from automated data: `called` comes only from the operator overrides
// (ingest/results/overrides.ts) — NYT calls cited by name, plus manual counts for races with no
// automatable adapter (Iowa; the six non-automated battlegrounds).

import { GENERAL, TEST, type StateJob } from './config';
import { NotAvailable, type RawContest } from './adapters';
import { applyOverrides, type Overrides } from './overrides';
import type { LiveFeed, LiveRace, SourceStatus } from '../../app/us/lib/live';

export interface RunOptions {
  jobs: 'general' | 'test'; // which config to run
  rehearsal?: boolean; // ignore poll-close gates (output marked mode: test)
  previous?: LiveFeed | null; // keep a state's last good row when its fetch fails
  overrides?: Overrides | null; // operator overrides merged after automated rows
  now?: string;
}

export interface RunResult {
  feed: LiveFeed;
  results: { job: StateJob; race: LiveRace | null; status: SourceStatus }[];
  warnings: string[];
}

function pick(raw: RawContest, re: RegExp | null, who: string): number | null {
  if (!re) return null;
  const hits = raw.candidates.filter((c) => re.test(c.name));
  if (hits.length !== 1) {
    throw new Error(`${who} matcher ${re} hit ${hits.length} candidates in "${raw.contest}": ${raw.candidates.map((c) => c.name).join(' | ')}`);
  }
  return hits[0].votes;
}

async function runOne(job: StateJob, now: string, rehearsal: boolean): Promise<{ race: LiveRace | null; status: SourceStatus }> {
  try {
    if (job.notBefore && now < job.notBefore && !rehearsal) {
      throw new NotAvailable(`before polls close (${job.notBefore}); any data now is pre-election test data and is ignored`);
    }
    const raw = await job.fetch();
    const dem = pick(raw, job.dem, 'dem');
    const rep = pick(raw, job.rep, 'rep');
    if (job.expect) {
      for (const [k, v] of [['dem', dem], ['rep', rep]] as const) {
        const want = job.expect[k];
        if (want !== undefined && want !== v) throw new Error(`test mismatch ${k}: got ${v}, expected ${want}`);
      }
    }
    const r = raw.reporting;
    return {
      race: {
        id: job.raceId,
        pctReporting: r && r.total > 0 ? Math.round((r.reported / r.total) * 1000) / 10 : null,
        reportingBasis: r?.basis,
        demVotes: dem ?? 0,
        repVotes: rep ?? 0,
        called: null,
        countSource: job.countSource,
        firstChoiceOnly: job.firstChoiceOnly,
        updatedAt: raw.sourceUpdatedAt ?? now,
      },
      status: { raceId: job.raceId, ok: true, fetchedAt: now, contest: raw.contest, url: raw.sourceUrl },
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { race: null, status: { raceId: job.raceId, ok: false, notAvailable: e instanceof NotAvailable, fetchedAt: now, message: msg } };
  }
}

export async function runIngest(o: RunOptions): Promise<RunResult> {
  const now = o.now ?? new Date().toISOString();
  const jobs = o.jobs === 'test' ? TEST : GENERAL;
  const out = await Promise.all(jobs.map((j) => runOne(j, now, !!o.rehearsal)));
  const prevFeed = o.previous && o.previous.mode === (o.jobs === 'test' || o.rehearsal ? 'test' : 'general') ? o.previous : null;
  const races = out
    .map((r, i) => r.race ?? prevFeed?.races.find((x) => x.id === jobs[i].raceId) ?? null)
    .filter((x): x is LiveRace => x !== null);
  const feed: LiveFeed = { generatedAt: now, mode: o.jobs === 'test' || o.rehearsal ? 'test' : 'general', races, sources: out.map((r) => r.status) };
  const { warnings } = applyOverrides(feed, o.overrides ?? null);
  return {
    feed,
    results: out.map((r, i) => ({ job: jobs[i], ...r })),
    warnings,
  };
}

export function summaryLines(r: RunResult): string[] {
  return [
    ...r.results.map(({ race, status }) =>
      status.ok
        ? `OK   ${status.raceId}  D ${race!.demVotes.toLocaleString()}  R ${race!.repVotes.toLocaleString()}  reporting ${race!.pctReporting ?? '—'}${race!.reportingBasis ? ` (${race!.reportingBasis})` : ''}  [${status.contest}]`
        : `${status.notAvailable ? 'WAIT' : 'FAIL'} ${status.raceId}  ${status.message}`,
    ),
    ...r.warnings.map((w) => `WARN ${w}`),
  ];
}
