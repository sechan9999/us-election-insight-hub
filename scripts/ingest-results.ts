// Results ingest: fetch official state counts for the automatable battlegrounds and write a LiveFeed JSON.
//
//   npx tsx scripts/ingest-results.ts --mode general --out results.json   # election window
//   npx tsx scripts/ingest-results.ts --mode test                         # 2026 primaries, checks known values
//   npx tsx scripts/ingest-results.ts --mode general --rehearsal          # ignore poll-close gates to exercise
//                                                                         # states' pre-election TEST files (output marked mode: test)
//
// Never marks a race called: `called` comes only from the NYT call entered by the operator (manual path).
// A state that fails keeps its last good row when --previous is given, and is reported in `sources`.

import { readFileSync, writeFileSync } from 'node:fs';
import { GENERAL, TEST, type StateJob } from '../ingest/results/config';
import { NotAvailable, type RawContest } from '../ingest/results/adapters';
import type { LiveFeed, LiveRace, SourceStatus } from '../app/us/lib/live';

const args = Object.fromEntries(
  process.argv.slice(2).reduce<[string, string][]>((acc, a, i, all) => (a.startsWith('--') ? [...acc, [a.slice(2), all[i + 1] ?? '']] : acc), []),
);
const rehearsal = 'rehearsal' in args;
const mode = args.mode === 'test' || rehearsal ? 'test' : 'general';
const jobs = args.mode === 'test' ? TEST : GENERAL;

function pick(raw: RawContest, re: RegExp | null, who: string): number | null {
  if (!re) return null;
  const hits = raw.candidates.filter((c) => re.test(c.name));
  if (hits.length !== 1) {
    throw new Error(`${who} matcher ${re} hit ${hits.length} candidates in "${raw.contest}": ${raw.candidates.map((c) => c.name).join(' | ')}`);
  }
  return hits[0].votes;
}

async function run(job: StateJob, now: string): Promise<{ race: LiveRace | null; status: SourceStatus }> {
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

async function main() {
  const now = new Date().toISOString();
  const prev: LiveFeed | null = args.previous ? (JSON.parse(readFileSync(args.previous, 'utf8')) as LiveFeed) : null;
  const results = await Promise.all(jobs.map((j) => run(j, now)));
  const races: LiveRace[] = results.map((r, i) => r.race ?? prev?.races.find((x) => x.id === jobs[i].raceId) ?? null).filter((x): x is LiveRace => x !== null);
  const feed: LiveFeed = { generatedAt: now, mode, races, sources: results.map((r) => r.status) };

  for (const { race, status } of results) {
    const line = status.ok
      ? `OK   ${status.raceId}  D ${race!.demVotes.toLocaleString()}  R ${race!.repVotes.toLocaleString()}  reporting ${race!.pctReporting ?? '—'}${race!.reportingBasis ? ` (${race!.reportingBasis})` : ''}  [${status.contest}]`
      : `${status.notAvailable ? 'WAIT' : 'FAIL'} ${status.raceId}  ${status.message}`;
    console.log(line);
  }
  if (args.out) writeFileSync(args.out, JSON.stringify(feed, null, 1));
  const failed = results.filter((r) => !r.status.ok && !r.status.notAvailable).length;
  if (mode === 'test' && results.some((r) => !r.status.ok)) process.exitCode = 1;
  else if (failed) process.exitCode = 2;
}

main();
