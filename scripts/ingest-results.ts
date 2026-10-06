// Results ingest CLI: fetch official state counts for the automatable battlegrounds and write a LiveFeed JSON.
//
//   npx tsx scripts/ingest-results.ts --mode general --out results.json   # election window
//   npx tsx scripts/ingest-results.ts --mode test                         # 2026 primaries, checks known values
//   npx tsx scripts/ingest-results.ts --mode general --rehearsal          # ignore poll-close gates to exercise
//                                                                         # states' pre-election TEST files (output marked mode: test)
//   --previous feed.json   keep a state's last good row if its fetch fails
//
// The Cloud Run job (ingest/results/job.ts) runs the same core and writes to GCS.

import { readFileSync, writeFileSync } from 'node:fs';
import { runIngest, summaryLines } from '../ingest/results/run';
import type { LiveFeed } from '../app/us/lib/live';

const args = Object.fromEntries(
  process.argv.slice(2).reduce<[string, string][]>((acc, a, i, all) => (a.startsWith('--') ? [...acc, [a.slice(2), all[i + 1] ?? '']] : acc), []),
);

async function main() {
  const previous = args.previous ? (JSON.parse(readFileSync(args.previous, 'utf8')) as LiveFeed) : null;
  const r = await runIngest({ jobs: args.mode === 'test' ? 'test' : 'general', rehearsal: 'rehearsal' in args, previous });
  summaryLines(r).forEach((l) => console.log(l));
  if (args.out) writeFileSync(args.out, JSON.stringify(r.feed, null, 1));
  const failed = r.results.filter((x) => !x.status.ok && !x.status.notAvailable).length;
  if (args.mode === 'test' && r.results.some((x) => !x.status.ok)) process.exitCode = 1;
  else if (failed) process.exitCode = 2;
}

main();
