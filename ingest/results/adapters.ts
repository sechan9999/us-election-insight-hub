// State results adapters. Each returns raw candidate rows for one contest plus reporting units.
// Sources and formats were verified against 2026 primaries (see docs/RESULTS_SOURCES.md).

import { inflateRawSync } from 'node:zlib';

const UA = 'us-election-insights-hub results ingest (+https://github.com/sechan9999/us-election-insight-hub)';

export interface RawCandidate {
  name: string;
  party: string;
  votes: number;
}

export interface RawContest {
  contest: string; // contest title as published
  candidates: RawCandidate[];
  reporting: { reported: number; total: number; basis: 'precincts' | 'counties' } | null;
  sourceUpdatedAt: string | null; // ISO, when the source states it
  sourceUrl: string;
}

export class NotAvailable extends Error {} // source reachable but this election/contest is not published yet

export class Blocked extends Error {} // the source answers with a bot-protection response; never bypassed

async function get(url: string, init: RequestInit = {}, attempt = 0): Promise<Response> {
  let res: Response;
  try {
    res = await fetch(url, { ...init, headers: { 'user-agent': UA, ...(init.headers ?? {}) }, signal: AbortSignal.timeout(30_000) });
  } catch (e) {
    if (attempt === 0) {
      await new Promise((r) => setTimeout(r, 2_000)); // one retry for transient network errors
      return get(url, init, 1);
    }
    throw e;
  }
  if (res.status === 404) throw new NotAvailable(`404 ${url}`);
  // Iowa answers cloud IPs with 202 + empty body (seen from Cloud Run 2026-10-06): a bot-protection response.
  if (res.status === 202 || res.status === 403 || res.status === 429) throw new Blocked(`${res.status} from ${url} (bot protection or rate limit; not bypassed)`);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res;
}

const num = (s: string | number | null | undefined) => {
  const n = Number(String(s ?? '').replace(/,/g, ''));
  return Number.isFinite(n) ? n : 0;
};

/** Pick exactly one contest; zero or several matches is an error, never a guess. */
function one<T>(items: T[], what: string): T {
  if (items.length === 0) throw new NotAvailable(`no contest matching ${what}`);
  if (items.length > 1) throw new Error(`${items.length} contests match ${what}`);
  return items[0];
}

// ---------------------------------------------------------------- North Carolina (JSON)
export async function nc(p: { date: string; contest: RegExp }): Promise<RawContest> {
  const url = `https://er.ncsbe.gov/enr/${p.date}/data/results_0.txt`;
  const rows = (await (await get(url)).json()) as Record<string, string>[];
  const names = [...new Set(rows.map((r) => r.cnm).filter((c) => p.contest.test(c)))];
  const contest = one(names, String(p.contest));
  const rs = rows.filter((r) => r.cnm === contest);
  return {
    contest,
    candidates: rs.map((r) => ({ name: r.bnm, party: r.pty, votes: num(r.vct) })),
    reporting: { reported: num(rs[0].prt), total: num(rs[0].ptl), basis: 'precincts' },
    sourceUpdatedAt: null,
    sourceUrl: url,
  };
}

// ---------------------------------------------------------------- Georgia (Enhanced Voting JSON API)
type Txt = { languageId: string; text: string }[];
const en = (t: Txt | null | undefined) => t?.find((x) => x.languageId === 'en')?.text ?? t?.[0]?.text ?? '';

export async function ga(p: { slug: string | null; contest: RegExp }): Promise<RawContest> {
  if (!p.slug) throw new NotAvailable('Georgia election slug not configured (published by the SOS once the election is set up)');
  const url = `https://results.sos.ga.gov/results/public/api/elections/Georgia/${p.slug}/ballot-items`;
  const body = (await (await get(url)).json()) as {
    data: {
      name: Txt;
      reportingStatus: { reportingUnits: number; totalUnits: number; asOf: string } | null;
      summaryResults: { ballotOptions: { name: Txt; voteCount: number; party: { abbreviation: string } | null }[] };
    }[];
  };
  const item = one(body.data.filter((d) => p.contest.test(en(d.name))), String(p.contest));
  return {
    contest: en(item.name),
    candidates: item.summaryResults.ballotOptions.map((o) => ({ name: en(o.name), party: o.party?.abbreviation ?? '', votes: o.voteCount })),
    reporting: item.reportingStatus
      ? { reported: item.reportingStatus.reportingUnits, total: item.reportingStatus.totalUnits, basis: 'counties' }
      : null,
    sourceUpdatedAt: item.reportingStatus?.asOf ?? null,
    sourceUrl: url,
  };
}

// ---------------------------------------------------------------- Minnesota (semicolon media file)
export async function mn(p: { date: string; file: string; contest: RegExp }): Promise<RawContest> {
  const url = `https://electionresultsfiles.sos.mn.gov/${p.date}/${p.file}`;
  const text = await (await get(url)).text();
  // state;county;precinct;office id;office;district;cand order;candidate;suffix;incumbent;party;reporting;total;votes;pct;total votes
  const rows = text.split(/\r?\n/).filter(Boolean).map((l) => l.split(';'));
  const rs = rows.filter((r) => p.contest.test(r[4] ?? ''));
  one([...new Set(rs.map((r) => r[4]))], String(p.contest));
  return {
    contest: rs[0][4],
    candidates: rs.map((r) => ({ name: r[7], party: r[10], votes: num(r[13]) })),
    reporting: { reported: num(rs[0][11]), total: num(rs[0][12]), basis: 'precincts' },
    sourceUpdatedAt: null,
    sourceUrl: url,
  };
}

/** Read one file from a zip archive via the central directory (stored or deflate). */
export function unzipOne(buf: Buffer, nameRe: RegExp): string {
  let eocd = -1;
  for (let i = buf.length - 22; i >= Math.max(0, buf.length - 65_557); i--) {
    if (buf.readUInt32LE(i) === 0x06054b50) {
      eocd = i;
      break;
    }
  }
  if (eocd < 0) throw new Error('zip: end of central directory not found');
  let p = buf.readUInt32LE(eocd + 16);
  const n = buf.readUInt16LE(eocd + 10);
  for (let k = 0; k < n; k++) {
    if (buf.readUInt32LE(p) !== 0x02014b50) throw new Error('zip: bad central directory');
    const method = buf.readUInt16LE(p + 10);
    const csize = buf.readUInt32LE(p + 20);
    const nlen = buf.readUInt16LE(p + 28);
    const xlen = buf.readUInt16LE(p + 30);
    const clen = buf.readUInt16LE(p + 32);
    const off = buf.readUInt32LE(p + 42);
    const name = buf.toString('utf8', p + 46, p + 46 + nlen);
    if (nameRe.test(name)) {
      const start = off + 30 + buf.readUInt16LE(off + 26) + buf.readUInt16LE(off + 28);
      const data = buf.subarray(start, start + csize);
      return (method === 0 ? data : inflateRawSync(data)).toString('utf8');
    }
    p += 46 + nlen + xlen + clen;
  }
  throw new Error(`zip: ${nameRe} not found`);
}

// ---------------------------------------------------------------- Iowa (Clarity ENR)
export async function ia(p: { electionName: RegExp; contest: RegExp }): Promise<RawContest> {
  const base = 'https://electionresults.iowa.gov/IA';
  const list = (await (await get(`${base}/elections.json?v=${Date.now()}`)).json()) as { EID: string; ElectionName: string }[];
  const el = one(list.filter((e) => p.electionName.test(e.ElectionName)), String(p.electionName));
  const ver = (await (await get(`${base}/${el.EID}/current_ver.txt`)).text()).trim();
  const url = `${base}/${el.EID}/${ver}/json/en/summary.json`;
  const items = (await (await get(url)).json()) as { C: string; CH: string[]; P: string[]; V: number[]; PR: number; TP: number }[];
  const c = one(items.filter((i) => p.contest.test(i.C)), String(p.contest));
  // summary.json PR/TP is not a reporting share (88/99 on the certified primary); use detail.xml contest attributes.
  const xml = unzipOne(Buffer.from(await (await get(`${base}/${el.EID}/${ver}/reports/detailxml.zip`)).arrayBuffer()), /detail\.xml$/i);
  const tag = [...xml.matchAll(/<Contest [^>]*>/g)].map((m) => m[0]).find((t) => t.includes(`text="${c.C}"`));
  const attr = (k: string) => Number(tag?.match(new RegExp(`${k}="([0-9.]+)"`))?.[1]);
  const ts = xml.match(/<Timestamp>([^<]+)<\/Timestamp>/)?.[1] ?? null;
  return {
    contest: c.C,
    candidates: c.CH.map((name, i) => ({ name, party: c.P[i] ?? '', votes: c.V[i] ?? 0 })),
    reporting: tag ? { reported: attr('precinctsReported'), total: attr('precinctsParticipating'), basis: 'precincts' } : null,
    sourceUpdatedAt: ts ? new Date(ts.replace(/ (CDT|CST)$/, (z) => (z.trim() === 'CDT' ? ' GMT-0500' : ' GMT-0600'))).toISOString() : null,
    sourceUrl: url,
  };
}

// ---------------------------------------------------------------- Florida (tab-delimited extract, POST)
export async function fl(p: { date: string; raceCode: string; official?: boolean }): Promise<RawContest> {
  const url = 'https://results.elections.myflorida.com/ResultsExtract.Asp';
  const res = await get(url, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ ElectionDate: p.date, OfficialResults: p.official ? 'Y' : 'N', PartyRaces: 'Y', DataMode: '', FormsButton2: 'Download' }).toString(),
  });
  if (!(res.headers.get('content-type') ?? '').includes('tab-separated')) {
    throw new NotAvailable('Florida extract not available (the utility opens after polls close at 7 PM ET)');
  }
  const lines = (await res.text()).split(/\r?\n/).filter(Boolean).map((l) => l.split('\t'));
  const h = lines[0];
  const col = (k: string) => h.indexOf(k);
  const rows = lines.slice(1).filter((r) => r[col('RaceCode')] === p.raceCode);
  if (!rows.length) throw new NotAvailable(`no Florida rows for race ${p.raceCode}`);
  // One row per county × candidate (checked on the 2026-08-18 extract: no duplicate rows).
  const byCand = new Map<string, RawCandidate>();
  const precinctsByCounty = new Map<string, [number, number]>();
  for (const r of rows) {
    const name = [r[col('CanNameFirst')], r[col('CanNameMiddle')], r[col('CanNameLast')]].filter(Boolean).join(' ');
    const c = byCand.get(`${r[col('PartyCode')]}|${name}`) ?? { name, party: r[col('PartyCode')], votes: 0 };
    c.votes += num(r[col('CanVotes')]);
    byCand.set(`${r[col('PartyCode')]}|${name}`, c);
    precinctsByCounty.set(r[col('CountyCode')], [num(r[col('PrecinctsReporting')]), num(r[col('Precincts')])]);
  }
  const [reported, total] = [...precinctsByCounty.values()].reduce((a, b) => [a[0] + b[0], a[1] + b[1]], [0, 0]);
  return {
    contest: rows[0][col('OfficeDesc')],
    candidates: [...byCand.values()],
    reporting: { reported, total, basis: 'precincts' },
    sourceUpdatedAt: null,
    sourceUrl: url,
  };
}

// ---------------------------------------------------------------- Alaska (precinct CSV, linked from the election page)
function parseCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = '';
  let q = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (q) {
      if (ch === '"' && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else if (ch === '"') q = false;
      else cur += ch;
    } else if (ch === '"') q = true;
    else if (ch === ',') {
      out.push(cur);
      cur = '';
    } else cur += ch;
  }
  out.push(cur);
  return out;
}

export async function ak(p: { electionPageId: string; contest: string }): Promise<RawContest> {
  // Resolve the CSV from the election's own page so a stale file from another election is never used.
  const page = await (await get(`https://www.elections.alaska.gov/election-results/e/?id=${p.electionPageId}`)).text();
  const href = page.match(/href="([^"]+GA_ENR_Precinct_State_of_Alaska\.csv)"/)?.[1];
  if (!href) throw new NotAvailable(`no precinct CSV linked on election page ${p.electionPageId}`);
  const text = await (await get(href)).text();
  const lines = text.split(/\r?\n/).filter(Boolean);
  const h = parseCsvLine(lines[0]);
  const col = (k: string) => h.indexOf(k);
  // Precinct rows plus district-level absentee / early / question rows (empty Pct_Id): all are summed.
  const byCand = new Map<string, RawCandidate>();
  for (const l of lines.slice(1)) {
    const r = parseCsvLine(l);
    if (r[col('Contest_title')] !== p.contest) continue;
    const name = r[col('candidate_name')];
    const c = byCand.get(name) ?? { name, party: r[col('Party_Code')], votes: 0 };
    c.votes += num(r[col('total_votes')]);
    byCand.set(name, c);
  }
  if (!byCand.size) throw new NotAvailable(`no rows for contest "${p.contest}"`);
  return {
    contest: p.contest,
    candidates: [...byCand.values()],
    reporting: null, // Reporting_flag semantics are not documented (0 on every row of the certified primary file)
    sourceUpdatedAt: null,
    sourceUrl: href,
  };
}
