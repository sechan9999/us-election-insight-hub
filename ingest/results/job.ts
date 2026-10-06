// Cloud Run job entrypoint: one ingest pass → GCS object read by the hub (LIVE_RESULTS_URL).
//
// Env:
//   RESULTS_BUCKET  GCS bucket (required)
//   RESULTS_OBJECT  object path, default live/results.json
//   MODE            general (default) | rehearsal
//   FORCE           "1" to run outside the tracker window (testing only)
//
// Outside the tracker window a general run exits without writing, so a mis-scheduled trigger is harmless.
// Auth uses the job's service account token from the metadata server (no client library needed).

import { runIngest, summaryLines } from './run';
import { TRACKER_WINDOW, type LiveFeed } from '../../app/us/lib/live';
import { todayET } from '../../app/us/lib/schedule';

const BUCKET = process.env.RESULTS_BUCKET ?? '';
const OBJECT = process.env.RESULTS_OBJECT ?? 'live/results.json';
const MODE = process.env.MODE === 'rehearsal' ? 'rehearsal' : 'general';

async function token(): Promise<string> {
  const res = await fetch('http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token', {
    headers: { 'Metadata-Flavor': 'Google' },
  });
  if (!res.ok) throw new Error(`metadata token ${res.status}`);
  return ((await res.json()) as { access_token: string }).access_token;
}

async function readPrevious(tok: string): Promise<LiveFeed | null> {
  const url = `https://storage.googleapis.com/storage/v1/b/${BUCKET}/o/${encodeURIComponent(OBJECT)}?alt=media`;
  const res = await fetch(url, { headers: { authorization: `Bearer ${tok}` } });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`read previous ${res.status}`);
  return (await res.json()) as LiveFeed;
}

async function upload(tok: string, feed: LiveFeed): Promise<void> {
  const boundary = `b${Date.now()}`;
  const meta = { name: OBJECT, contentType: 'application/json', cacheControl: 'no-cache, max-age=0' };
  const body =
    `--${boundary}\r\ncontent-type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(meta)}\r\n` +
    `--${boundary}\r\ncontent-type: application/json\r\n\r\n${JSON.stringify(feed)}\r\n--${boundary}--`;
  const res = await fetch(`https://storage.googleapis.com/upload/storage/v1/b/${BUCKET}/o?uploadType=multipart`, {
    method: 'POST',
    headers: { authorization: `Bearer ${tok}`, 'content-type': `multipart/related; boundary=${boundary}` },
    body,
  });
  if (!res.ok) throw new Error(`upload ${res.status} ${await res.text()}`);
}

async function main() {
  if (!BUCKET) throw new Error('RESULTS_BUCKET is required');
  const today = todayET();
  if (MODE === 'general' && process.env.FORCE !== '1' && (today < TRACKER_WINDOW.start || today > TRACKER_WINDOW.end)) {
    console.log(`outside tracker window (${TRACKER_WINDOW.start}..${TRACKER_WINDOW.end}, today ${today} ET): nothing written`);
    return;
  }
  const tok = await token();
  const previous = await readPrevious(tok).catch((e) => {
    console.warn(`previous feed unreadable, continuing without it: ${e}`);
    return null;
  });
  const r = await runIngest({ jobs: 'general', rehearsal: MODE === 'rehearsal', previous });
  summaryLines(r).forEach((l) => console.log(l));
  await upload(tok, r.feed);
  console.log(`wrote gs://${BUCKET}/${OBJECT} (${r.feed.races.length} races, mode ${r.feed.mode})`);
  const failed = r.results.filter((x) => !x.status.ok && !x.status.notAvailable).length;
  if (failed) console.warn(`${failed} state(s) failed; their last good rows were kept`);
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
