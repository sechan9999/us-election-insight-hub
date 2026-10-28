// TypeScript port of kr_tools.py (Meta hackathon agent core, v1).
// Semantics are identical to the Python tools: same tables, same DISTINCT-units
// aggregates, same error codes, same bloc mapping, same deterministic checks.
// Differences from the Python original are noted inline (guardrail fix 2026-10-27).

import { BigQuery } from "@google-cloud/bigquery";

const PROJECT = process.env.GOOGLE_CLOUD_PROJECT || "electoral-hub-510410";
const TABLE = `\`${PROJECT}.elections.kr_precinct\``;
const MAP_TABLE = `\`${PROJECT}.elections.district_map\``;

export const ELECTION_YEARS: Record<number, number> = { 18: 2012, 19: 2017, 20: 2022, 21: 2025 };
export const INDEX_URL: Record<number, string> = {
  18: "https://storage.googleapis.com/k18-archive/index.html",
  19: "https://storage.googleapis.com/k19-archive/index.html",
  20: "https://storage.googleapis.com/k20-tally-archive/index.html",
  21: "https://storage.googleapis.com/k21-tally-archive/index.html",
};

const SD: Record<string, string> = {
  강원: "강원특별자치도", 강원도: "강원특별자치도", 경기: "경기도",
  경남: "경상남도", 경북: "경상북도", 광주: "광주광역시",
  대구: "대구광역시", 대전: "대전광역시", 부산: "부산광역시",
  서울: "서울특별시", 세종: "세종특별자치도", 울산: "울산광역시",
  인천: "인천광역시", 전남: "전라남도", 전북: "전북특별자치도",
  전라북도: "전북특별자치도", 제주: "제주특별자치도",
  충남: "충청남도", 충북: "충청북도",
};

// HK decisions 2026-10-27. 3 blocs (보수/진보/기타), no 중도. Candidate-based,
// never party-based. Key: `${election}:${candidate}`.
export const BLOC_MAP: Record<string, string> = {
  "18:박근혜": "보수", "18:문재인": "진보", "18:강지원": "기타", "18:김순자": "기타",
  "18:김소연": "기타", "18:박종선": "기타",
  "19:문재인": "진보", "19:홍준표": "보수", "19:안철수": "보수", "19:유승민": "보수",
  "19:심상정": "진보", "19:조원진": "보수", "19:김민찬": "기타", "19:김선동": "기타",
  "19:장성민": "기타", "19:윤홍식": "기타", "19:이경희": "기타", "19:이재오": "보수",
  "19:오영국": "기타",
  "20:윤석열": "보수", "20:이재명": "진보", "20:심상정": "진보", "20:허경영": "기타",
  "20:김재연": "진보", "20:조원진": "보수", "20:오준호": "기타", "20:김민찬": "기타",
  "20:이경희": "기타", "20:이백윤": "기타", "20:김경재": "기타", "20:옥은호": "기타",
  "21:이재명": "진보", "21:김문수": "보수", "21:이준석": "보수",
  "21:권영국": "진보", "21:송진호": "기타",
};
export const BLOCS = ["보수", "진보", "기타"] as const;

export class ToolError extends Error {
  code: string;
  message_ko: string;
  suggestions: string[];
  constructor(code: string, message_en: string, message_ko = "", suggestions: string[] = []) {
    super(message_en);
    this.code = code;
    this.message_ko = message_ko;
    this.suggestions = suggestions;
  }
}

const bq = new BigQuery({ projectId: PROJECT });
const MAX_BYTES = "1000000000"; // 1 GB scan cap, same as /api/ask

type Row = Record<string, unknown>;
const num = (v: unknown): number => (typeof v === "number" ? v : Number(v));
const str = (v: unknown): string => String(v);

async function query(sql: string, params: Record<string, unknown> = {}): Promise<Row[]> {
  const types: Record<string, string> = {};
  for (const [k, v] of Object.entries(params)) types[k] = typeof v === "number" ? "INT64" : "STRING";
  try {
    const [rows] = await bq.query({ query: sql, params, types, maximumBytesBilled: MAX_BYTES });
    return (rows as Row[]) || [];
  } catch (e) {
    throw new ToolError("BIGQUERY_ERROR", `BigQuery query failed: ${e instanceof Error ? e.message : e}`, "BigQuery 조회에 실패했습니다.");
  }
}

function normSido(sido?: string | null): string | undefined {
  if (!sido) return undefined;
  return SD[sido] ?? sido;
}

export type Resolved = { key: string; published: string[]; mapping: string };

export async function resolveDistrict(
  election: number,
  opts: { district_key?: string; sido?: string; sigungu?: string },
): Promise<Resolved> {
  if (!(election in ELECTION_YEARS)) {
    throw new ToolError("INVALID_ELECTION", `Election must be one of 18, 19, 20, 21, got ${election}.`, "대선은 18, 19, 20, 21 중 하나여야 합니다.");
  }
  if (opts.district_key) {
    const rows = await query(
      `SELECT DISTINCT sido, sigungu, mapping_type FROM ${MAP_TABLE} WHERE election = @election AND district_key = @district_key`,
      { election, district_key: opts.district_key },
    );
    if (!rows.length) {
      throw new ToolError("NOT_FOUND",
        `No district with key "${opts.district_key}" in election ${election}. Keys look like "경기도|부천시" (sido|sigungu of the mapped unit).`,
        `${election}대선에 "${opts.district_key}" 키의 구역이 없습니다. 키는 "경기도|부천시" 형식(시도|비교단위)입니다.`);
    }
    const published = [...new Set(rows.map((r) => `${str(r.sido)}|${str(r.sigungu)}`))].sort();
    const mapping = rows.some((r) => r.mapping_type === "merged") ? "merged"
      : rows.some((r) => r.mapping_type === "rename") ? "rename" : "identical";
    return { key: opts.district_key, published, mapping };
  }
  if (opts.sido && opts.sigungu) {
    const sidoN = normSido(opts.sido)!;
    const rows = await query(
      `SELECT district_key, mapping_type FROM ${MAP_TABLE} WHERE election = @election AND sido = @sido AND sigungu = @sigungu`,
      { election, sido: sidoN, sigungu: opts.sigungu },
    );
    if (!rows.length) {
      const sugg = await query(
        `SELECT DISTINCT sigungu FROM ${MAP_TABLE} WHERE election = @election AND sido = @sido ORDER BY sigungu LIMIT 50`,
        { election, sido: sidoN },
      );
      throw new ToolError("NOT_FOUND",
        `No sigungu "${opts.sigungu}" in ${sidoN} for election ${election}.`,
        `${election}대선 ${sidoN}에 "${opts.sigungu}" 구역이 없습니다.`,
        sugg.map((r) => str(r.sigungu)));
    }
    return { key: str(rows[0].district_key), published: [`${sidoN}|${opts.sigungu}`], mapping: str(rows[0].mapping_type) };
  }
  if (opts.sigungu) {
    const rows = await query(
      `SELECT DISTINCT district_key, sido FROM ${MAP_TABLE} WHERE election = @election AND sigungu = @sigungu`,
      { election, sigungu: opts.sigungu },
    );
    if (!rows.length) {
      throw new ToolError("NOT_FOUND", `No sigungu named "${opts.sigungu}" in election ${election}.`, `${election}대선에 "${opts.sigungu}" 구역이 없습니다.`);
    }
    const keys = [...new Set(rows.map((r) => str(r.district_key)))].sort();
    if (keys.length > 1) {
      throw new ToolError("AMBIGUOUS_DISTRICT",
        `"${opts.sigungu}" matches ${keys.length} districts; specify the sido.`,
        `"${opts.sigungu}"에 해당하는 구역이 ${keys.length}개입니다. 시도를 함께 지정해 주세요.`,
        keys);
    }
    return { key: keys[0], published: [`${str(rows[0].sido)}|${opts.sigungu}`], mapping: "identical" };
  }
  throw new ToolError("DISTRICT_REQUIRED", "Give district_key, or sido + sigungu, or sigungu.", "district_key, 또는 시도+시군구, 또는 시군구를 지정해 주세요.");
}

export type Candidate = { name: string; label: string; party: string | null; votes: number; share_pct: number };
export type Agg = {
  electorate: number; votes_cast: number; total_valid: number; invalid_votes: number; abstentions: number;
  unit_count: number; precinct_count: number; early_count: number; special_count: number;
  candidates: Candidate[]; checks: { shares_sum_pct: number; shares_sum_ok: boolean };
};

const UNITS_COLS = "election, district_key, sido, sigungu, eupmyeondong, precinct, source_row_number, unit_type, electorate, votes_cast, total_valid, invalid_votes, abstentions";

async function aggregate(election: number, key: string, precinct?: string): Promise<Agg | null> {
  const extra = precinct ? ` AND precinct = @precinct AND unit_type = 'precinct'` : "";
  const params: Record<string, unknown> = { election, district_key: key };
  if (precinct) params.precinct = precinct;
  const sql = `WITH units AS (
    SELECT DISTINCT ${UNITS_COLS} FROM ${TABLE}
    WHERE election = @election AND district_key = @district_key ${extra}
  ), totals AS (
    SELECT SUM(electorate) AS electorate, SUM(votes_cast) AS votes_cast,
      SUM(total_valid) AS total_valid, SUM(invalid_votes) AS invalid_votes,
      SUM(abstentions) AS abstentions, COUNT(*) AS unit_count,
      SUM(CASE WHEN unit_type = 'precinct' THEN 1 ELSE 0 END) AS precinct_count,
      SUM(CASE WHEN unit_type = 'early_vote' THEN 1 ELSE 0 END) AS early_count,
      SUM(CASE WHEN unit_type = 'special' THEN 1 ELSE 0 END) AS special_count
    FROM units
  ), cand AS (
    SELECT candidate_key, candidate_label_as_published, party, SUM(votes) AS votes
    FROM ${TABLE}
    WHERE election = @election AND district_key = @district_key ${extra}
    GROUP BY candidate_key, candidate_label_as_published, party
  )
  SELECT c.candidate_key, c.candidate_label_as_published, c.party, c.votes,
    t.electorate, t.votes_cast, t.total_valid, t.invalid_votes, t.abstentions,
    t.unit_count, t.precinct_count, t.early_count, t.special_count
  FROM cand c CROSS JOIN totals t ORDER BY c.votes DESC`;
  const rows = await query(sql, params);
  if (!rows.length) return null;
  const t = rows[0];
  const total_valid = num(t.total_valid);
  const cands: Candidate[] = rows.map((r) => ({
    name: str(r.candidate_key), label: str(r.candidate_label_as_published),
    party: r.party == null ? null : str(r.party), votes: num(r.votes),
    share_pct: total_valid ? Math.round((num(r.votes) / total_valid) * 100 * 1e4) / 1e4 : 0,
  }));
  const share_sum = cands.reduce((s, c) => s + c.share_pct, 0);
  const checks = { shares_sum_pct: Math.round(share_sum * 1e4) / 1e4, shares_sum_ok: Math.abs(share_sum - 100) < 0.05 };
  if (!checks.shares_sum_ok) {
    throw new ToolError("DATA_CHECK_FAILED",
      `Candidate shares sum to ${share_sum}%, not 100%. Data error; figure blocked.`,
      `후보 득표율 합이 ${share_sum}%로 100%가 아닙니다. 데이터 오류로 수치를 차단합니다.`);
  }
  return {
    electorate: num(t.electorate), votes_cast: num(t.votes_cast), total_valid,
    invalid_votes: num(t.invalid_votes), abstentions: num(t.abstentions),
    unit_count: num(t.unit_count), precinct_count: num(t.precinct_count),
    early_count: num(t.early_count), special_count: num(t.special_count),
    candidates: cands, checks,
  };
}

function round4(x: number): number { return Math.round(x * 1e4) / 1e4; }
export function citationsFor(elections: number[]) {
  return elections.map((e) => ({
    election: e, election_year: ELECTION_YEARS[e], citation_url: INDEX_URL[e],
    note: "Archive index page (HK decision 2026-10-27; per-figure sheet URLs not promised in v1).",
  }));
}

export type ToolResult = { ok: true; tool: string; params: Record<string, unknown>; data: unknown; citations: unknown[] }
  | { ok: false; error: { code: string; message_en: string; message_ko: string; suggestions: string[] } };
function wrap(tool: string, params: Record<string, unknown>, data: unknown, elections: number[]): ToolResult {
  return { ok: true, tool, params, data, citations: citationsFor(elections) };
}
function err(e: ToolError): ToolResult {
  return { ok: false, error: { code: e.code, message_en: e.message, message_ko: e.message_ko, suggestions: e.suggestions } };
}

// Normalize election inputs: the model may pass a year (2012/2017/2022/2025)
// instead of the 18/19/20/21 code; the schema enum should prevent it, but be safe.
export function normElection(v: unknown): number {
  const n = num(v);
  const byYear: Record<number, number> = { 2012: 18, 2017: 19, 2022: 20, 2025: 21 };
  return byYear[n] ?? n;
}

export async function precinctLookup(args: { election: number; district_key?: string; sido?: string; sigungu?: string; precinct?: string }): Promise<ToolResult> {
  try {
    const election = normElection(args.election);
    const { key, published, mapping } = await resolveDistrict(election, args);
    const agg = await aggregate(election, key, args.precinct);
    if (!agg) {
      const sugg = await query(
        `SELECT DISTINCT precinct FROM ${TABLE} WHERE election = @election AND district_key = @district_key AND unit_type = 'precinct' ORDER BY precinct LIMIT 20`,
        { election, district_key: key },
      );
      throw new ToolError("PRECINCT_NOT_FOUND",
        `No precinct named "${args.precinct}" in district ${key} for election ${election}. Do NOT silently substitute the district aggregate; offer it only if the user accepts the level change.`,
        `${election}대선 ${key} 구역에 "${args.precinct}" 투표구가 없습니다. 구역 전체 수치로 슬쩍 바꾸지 말고, 사용자가 수준 변경을 받아들일 때만 제시하세요.`,
        sugg.map((r) => str(r.precinct)));
    }
    const level = args.precinct ? "precinct" : "district";
    return wrap("precinct_lookup", { election, district_key: key, precinct: args.precinct ?? null },
      { region: { district_key: key, published_sigungu: published, mapping_type: mapping, precinct: args.precinct ?? null },
        level, ...agg, turnout_pct: agg.electorate ? round4((agg.votes_cast / agg.electorate) * 100) : null }, [election]);
  } catch (e) { return err(e as ToolError); }
}

export async function turnout(args: { election: number; district_key?: string; sido?: string; sigungu?: string; precinct?: string }): Promise<ToolResult> {
  try {
    const election = normElection(args.election);
    if (!args.district_key && !args.sido && !args.sigungu) {
      const rows = await query(
        `WITH units AS (SELECT DISTINCT ${UNITS_COLS} FROM ${TABLE} WHERE election = @election)
         SELECT SUM(electorate) AS electorate, SUM(votes_cast) AS votes_cast, COUNT(*) AS unit_count FROM units`,
        { election },
      );
      const t = rows[0];
      const elect = num(t.electorate), cast = num(t.votes_cast);
      return wrap("turnout", { election },
        { region: { level: "national" }, level: "national", electorate: elect, votes_cast: cast,
          turnout_pct: elect ? round4((cast / elect) * 100) : null, unit_count: num(t.unit_count) }, [election]);
    }
    const { key, published, mapping } = await resolveDistrict(election, args);
    const agg = await aggregate(election, key, args.precinct);
    if (!agg) {
      throw new ToolError("PRECINCT_NOT_FOUND", `No precinct named "${args.precinct}" in district ${key}.`, `${key} 구역에 "${args.precinct}" 투표구가 없습니다.`);
    }
    const level = args.precinct ? "precinct" : "district";
    return wrap("turnout", { election, district_key: key, precinct: args.precinct ?? null },
      { region: { district_key: key, published_sigungu: published, mapping_type: mapping, precinct: args.precinct ?? null },
        level, electorate: agg.electorate, votes_cast: agg.votes_cast,
        turnout_pct: agg.electorate ? round4((agg.votes_cast / agg.electorate) * 100) : null,
        unit_count: agg.unit_count, precinct_count: agg.precinct_count,
        early_count: agg.early_count, special_count: agg.special_count }, [election]);
  } catch (e) { return err(e as ToolError); }
}

export async function margin(args: { election: number; district_key?: string; sido?: string; sigungu?: string; precinct?: string }): Promise<ToolResult> {
  try {
    const election = normElection(args.election);
    const { key, published, mapping } = await resolveDistrict(election, args);
    const agg = await aggregate(election, key, args.precinct);
    if (!agg) {
      throw new ToolError("PRECINCT_NOT_FOUND", `No precinct named "${args.precinct}" in district ${key}.`, `${key} 구역에 "${args.precinct}" 투표구가 없습니다.`);
    }
    if (agg.candidates.length < 2) {
      throw new ToolError("NO_CONTEST", "Fewer than two candidates; no margin computable.", "후보가 2명 미만이라 마진을 계산할 수 없습니다.");
    }
    const [w, r] = agg.candidates;
    const margin_votes = w.votes - r.votes;
    const margin_pp = round4(w.share_pct - r.share_pct);
    const level = args.precinct ? "precinct" : "district";
    return wrap("margin", { election, district_key: key, precinct: args.precinct ?? null },
      { region: { district_key: key, published_sigungu: published, mapping_type: mapping, precinct: args.precinct ?? null },
        level, winner: w, runner_up: r, margin_votes, margin_pp,
        total_valid: agg.total_valid,
        turnout_pct: agg.electorate ? round4((agg.votes_cast / agg.electorate) * 100) : null,
        electorate: agg.electorate, votes_cast: agg.votes_cast,
        checks: { ...agg.checks, margin_ok: margin_votes === w.votes - r.votes } }, [election]);
  } catch (e) { return err(e as ToolError); }
}

function blocShares(election: number, agg: Agg) {
  const out: Record<string, { votes: number; share_pct: number | null }> = {};
  for (const b of BLOCS) {
    const v = agg.candidates.filter((c) => BLOC_MAP[`${election}:${c.name}`] === b)
      .reduce((s, c) => s + c.votes, 0);
    out[b] = { votes: v, share_pct: agg.total_valid ? round4((v / agg.total_valid) * 100) : null };
  }
  return out;
}

export async function swingCalculation(args: {
  election_a: number; election_b: number; district_key?: string; sido?: string; sigungu?: string;
  candidate?: string; bloc?: string; scope_sido?: string; top_n?: number;
  direction?: string; include_absent?: boolean;
}): Promise<ToolResult> {
  try {
    const ea = normElection(args.election_a);
    const eb = normElection(args.election_b);
    if (!(ea in ELECTION_YEARS) || !(eb in ELECTION_YEARS)) {
      throw new ToolError("INVALID_ELECTION", "Elections must be in 18, 19, 20, 21.", "대선은 18, 19, 20, 21 중 하나여야 합니다.");
    }
    // District mode
    if (args.district_key || (args.sido && args.sigungu) || args.sigungu) {
      const { key, published, mapping } = await resolveDistrict(ea, args);
      const chk = await query(
        `SELECT COUNT(*) AS n FROM ${MAP_TABLE} WHERE election = @election AND district_key = @district_key`,
        { election: eb, district_key: key },
      );
      if (num(chk[0].n) === 0) {
        throw new ToolError("NO_MATCHING_DISTRICT_ACROSS_ELECTIONS",
          `District ${key} exists in election ${ea} but not ${eb}.`,
          `${key} 구역이 ${ea}대선에는 있으나 ${eb}대선에는 없습니다.`);
      }
      const aggA = (await aggregate(ea, key))!;
      const aggB = (await aggregate(eb, key))!;
      const byA = new Map(aggA.candidates.map((c) => [c.name, c]));
      const byB = new Map(aggB.candidates.map((c) => [c.name, c]));
      let rows = [...new Set([...byA.keys(), ...byB.keys()])].sort().map((name) => {
        const a = byA.get(name);
        const b = byB.get(name);
        const ranA = a !== undefined;
        const ranB = b !== undefined;
        // Guardrail fix 2026-10-27: absent side gets null share/swing (entry is not swing).
        const sa = ranA ? a!.share_pct : null;
        const sb = ranB ? b!.share_pct : null;
        return { candidate: name, party_a: a?.party ?? null, party_b: b?.party ?? null,
          votes_a: a?.votes ?? 0, votes_b: b?.votes ?? 0, share_a_pct: sa, share_b_pct: sb,
          swing_pp: ranA && ranB ? round4(sb! - sa!) : null, ran_in_a: ranA, ran_in_b: ranB };
      });
      rows.sort((x, y) => (y.swing_pp === null ? -Infinity : Math.abs(y.swing_pp)) - (x.swing_pp === null ? -Infinity : Math.abs(x.swing_pp)));
      const blA = blocShares(ea, aggA);
      const blB = blocShares(eb, aggB);
      const blocs: Record<string, unknown> = {};
      for (const b of BLOCS) {
        blocs[b] = { votes_a: blA[b].votes, share_a_pct: blA[b].share_pct,
          votes_b: blB[b].votes, share_b_pct: blB[b].share_pct,
          swing_pp: blA[b].share_pct !== null && blB[b].share_pct !== null ? round4(blB[b].share_pct! - blA[b].share_pct!) : null };
      }
      const wA = aggA.candidates[0];
      const wB = aggB.candidates[0];
      if (args.candidate) {
        rows = rows.filter((r) => r.candidate === args.candidate);
        if (!rows.length) {
          throw new ToolError("NOT_FOUND", `Candidate "${args.candidate}" ran in neither election.`, `"${args.candidate}" 후보는 두 대선 모두 출마하지 않았습니다.`);
        }
      }
      const data = {
        region: { district_key: key, published_sigungu: published, mapping_type: mapping },
        match_level: "district_key",
        match_note: "district_key is the harmonized unit (247 keys, identical in all four elections); precinct-level cross-election matching is not attempted in v1.",
        election_a: { election: ea, total_valid: aggA.total_valid,
          turnout_pct: aggA.electorate ? round4((aggA.votes_cast / aggA.electorate) * 100) : null, winner: wA },
        election_b: { election: eb, total_valid: aggB.total_valid,
          turnout_pct: aggB.electorate ? round4((aggB.votes_cast / aggB.electorate) * 100) : null, winner: wB },
        winner_share_swing_pp: wA.name === wB.name ? round4(wB.share_pct - wA.share_pct) : null,
        turnout_swing_pp: round4(
          (aggB.electorate ? (aggB.votes_cast / aggB.electorate) * 100 : 0) -
          (aggA.electorate ? (aggA.votes_cast / aggA.electorate) * 100 : 0)),
        blocs, candidates: rows,
      };
      return wrap("swing_calculation", { election_a: ea, election_b: eb, district_key: key }, data, [ea, eb]);
    }
    // Ranking mode
    if (args.candidate && args.bloc) {
      throw new ToolError("CANDIDATE_AND_BLOC", "Give candidate or bloc, not both.", "후보와 bloc 중 하나만 지정해 주세요.");
    }
    if (args.bloc && !(BLOCS as readonly string[]).includes(args.bloc)) {
      throw new ToolError("INVALID_BLOC", `Bloc must be one of ${BLOCS}, got "${args.bloc}".`, `bloc은 ${BLOCS} 중 하나여야 합니다.`);
    }
    if (!args.candidate && !args.bloc) {
      throw new ToolError("CANDIDATE_OR_DISTRICT_REQUIRED",
        "Give a district (district_key or sido+sigungu), a candidate, or a bloc for ranking.",
        "구역(district_key 또는 시도+시군구), 후보, 또는 bloc을 지정해 주세요.");
    }
    const topN = Math.max(1, Math.min(args.top_n ?? 10, 50));
    const direction = args.direction ?? "largest_absolute";
    const scopePrefix = args.scope_sido ? `${normSido(args.scope_sido)}|` : null;
    // Unit totals per district per election (DISTINCT units, same as the Python tools).
    const totRows = await query(
      `WITH units AS (SELECT DISTINCT ${UNITS_COLS} FROM ${TABLE} WHERE election IN (@ea, @eb))
       SELECT district_key, election, SUM(total_valid) AS tv FROM units GROUP BY district_key, election`,
      { ea, eb },
    );
    const tot = new Map<string, number>();
    for (const r of totRows) tot.set(`${str(r.district_key)}:${num(r.election)}`, num(r.tv));
    const candRows = await query(
      `SELECT election, district_key, candidate_key, SUM(votes) AS votes FROM ${TABLE}
       WHERE election IN (@ea, @eb) GROUP BY election, district_key, candidate_key`,
      { ea, eb },
    );
    const votes = new Map<string, number>();
    for (const r of candRows) votes.set(`${str(r.district_key)}:${num(r.election)}:${str(r.candidate_key)}`, num(r.votes));
    const districts = [...new Set(totRows.map((r) => str(r.district_key)))]
      .filter((dk) => !scopePrefix || dk.startsWith(scopePrefix)).sort();
    let note = "Ranked by district_key (harmonized unit); precinct-level cross-election matching is not attempted in v1.";
    let rowsOut: Record<string, unknown>[] = [];
    let extra: Record<string, unknown> = {};
    if (args.bloc) {
      // Bloc mode: sum member votes per district per election; a candidate absent
      // in an election contributes 0 to every bloc in that election.
      const agg = new Map<string, { va: number; vb: number; ta: number; tb: number }>();
      for (const dk of districts) {
        agg.set(dk, { va: 0, vb: 0, ta: tot.get(`${dk}:${ea}`) ?? 0, tb: tot.get(`${dk}:${eb}`) ?? 0 });
      }
      for (const r of candRows) {
        const dk = str(r.district_key);
        if (!agg.has(dk)) continue;
        const el = num(r.election);
        const cand = str(r.candidate_key);
        if (BLOC_MAP[`${el}:${cand}`] !== args.bloc) continue;
        const d = agg.get(dk)!;
        if (el === ea) d.va += num(r.votes);
        if (el === eb) d.vb += num(r.votes);
      }
      const list = [...agg.entries()].map(([dk, d]) => {
        const sa = d.ta ? (d.va / d.ta) * 100 : 0;
        const sb = d.tb ? (d.vb / d.tb) * 100 : 0;
        return { district_key: dk, votes_a: d.va, votes_b: d.vb,
          share_a_pct: round4(sa), share_b_pct: round4(sb), swing_pp: round4(sb - sa) };
      });
      list.sort((x, y) => direction === "largest_gain" ? y.swing_pp - x.swing_pp
        : direction === "largest_loss" ? x.swing_pp - y.swing_pp
        : Math.abs(y.swing_pp) - Math.abs(x.swing_pp));
      rowsOut = list.slice(0, topN);
      note += ` Bloc '${args.bloc}' aggregates its members in each election (see members_a/members_b).`;
      extra = { bloc: args.bloc,
        members_a: Object.keys(BLOC_MAP).filter((k) => k.startsWith(`${ea}:`) && BLOC_MAP[k] === args.bloc).map((k) => k.slice(3)).sort(),
        members_b: Object.keys(BLOC_MAP).filter((k) => k.startsWith(`${eb}:`) && BLOC_MAP[k] === args.bloc).map((k) => k.slice(3)).sort(),
        excluded_absent_count: 0 };
    } else {
      const cand = args.candidate!;
      type RRow = { district_key: string; votes_a: number; votes_b: number; share_a_pct: number;
        share_b_pct: number; swing_pp: number; absent_a: boolean; absent_b: boolean };
      const rows: RRow[] = [];
      for (const dk of districts) {
        const va = votes.get(`${dk}:${ea}:${cand}`);
        const vb = votes.get(`${dk}:${eb}:${cand}`);
        const ta = tot.get(`${dk}:${ea}`) ?? 0;
        const tb = tot.get(`${dk}:${eb}`) ?? 0;
        if (va === undefined && vb === undefined) continue;
        const sa = va === undefined ? 0 : (va / ta) * 100;
        const sb = vb === undefined ? 0 : (vb / tb) * 100;
        rows.push({ district_key: dk, votes_a: va ?? 0, votes_b: vb ?? 0,
          share_a_pct: round4(sa), share_b_pct: round4(sb),
          swing_pp: round4(sb - sa), absent_a: va === undefined, absent_b: vb === undefined });
      }
      if (!rows.length) {
        throw new ToolError("NOT_FOUND",
          `Candidate "${cand}" ran in neither election ${ea} nor ${eb}.`,
          `"${cand}" 후보는 ${ea}대선과 ${eb}대선 모두 출마하지 않았습니다.`);
      }
      for (const r of rows) {
        if (Math.abs(r.swing_pp - (r.share_b_pct - r.share_a_pct)) > 0.01) {
          throw new ToolError("DATA_CHECK_FAILED", "Swing arithmetic check failed.", "스윙 계산 검증에 실패했습니다.");
        }
      }
      const ranA = rows.some((r) => !r.absent_a);
      const ranB = rows.some((r) => !r.absent_b);
      let excluded = 0;
      let kept = rows;
      if (!args.include_absent) {
        excluded = rows.filter((r) => r.absent_a || r.absent_b).length;
        kept = rows.filter((r) => !r.absent_a && !r.absent_b);
      }
      if (!ranA || !ranB) {
        const missing = [ranA ? null : String(ea), ranB ? null : String(eb)].filter(Boolean);
        note += ` Candidate did not run in election(s) ${missing.join(", ")}; ${excluded} districts excluded as entry/exit, not swing.`;
      } else if (excluded) {
        note += ` ${excluded} districts where the candidate ran in only one election excluded.`;
      }
      kept.sort((x, y) => direction === "largest_gain" ? y.swing_pp - x.swing_pp
        : direction === "largest_loss" ? x.swing_pp - y.swing_pp
        : Math.abs(y.swing_pp) - Math.abs(x.swing_pp));
      rowsOut = kept.slice(0, topN).map((r) => ({
        district_key: r.district_key, votes_a: r.votes_a, votes_b: r.votes_b,
        share_a_pct: r.share_a_pct, share_b_pct: r.share_b_pct, swing_pp: r.swing_pp,
        absent_in_a: r.absent_a, absent_in_b: r.absent_b }));
      extra = { candidate: cand, ran_in_a: ranA, ran_in_b: ranB, excluded_absent_count: excluded };
    }
    // Attach published sigungu names (election_b) for display.
    const mapRows = await query(
      `SELECT district_key, sido, sigungu FROM ${MAP_TABLE} WHERE election = @election`, { election: eb },
    );
    const names = new Map<string, string[]>();
    for (const r of mapRows) {
      const k = str(r.district_key);
      if (!names.has(k)) names.set(k, []);
      names.get(k)!.push(`${str(r.sido)}|${str(r.sigungu)}`);
    }
    for (const r of rowsOut) (r as Record<string, unknown>).published_sigungu = names.get(str(r.district_key)) ?? [];
    return wrap("swing_calculation",
      { election_a: ea, election_b: eb, candidate: args.candidate ?? null, bloc: args.bloc ?? null,
        scope_sido: args.scope_sido ?? null, top_n: topN, direction, include_absent: !!args.include_absent },
      { match_level: "district_key", match_note: note, rows: rowsOut, ...extra }, [ea, eb]);
  } catch (e) { return err(e as ToolError); }
}

export const TOOLS: Record<string, (args: Record<string, unknown>) => Promise<ToolResult>> = {
  precinct_lookup: (a) => precinctLookup(a as never),
  turnout: (a) => turnout(a as never),
  margin: (a) => margin(a as never),
  swing_calculation: (a) => swingCalculation(a as never),
};
