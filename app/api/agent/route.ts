// Electoral Evidence Agent API — Muse Spark (Meta Model API) function calling
// over BigQuery kr_precinct. Mirrors /api/ask's discipline: per-IP rate limit,
// 500-char question cap, 1 GB scan cap (in tools.ts), generic errors.
// Every number in the answer comes from a tool call; the model never generates
// figures. Citations are archive index pages, never per-figure sheet URLs (v1).
import { NextRequest, NextResponse } from "next/server";
import { TOOLS, citationsFor, type ToolResult } from "./lib/tools";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MODEL = "muse-spark-1.3";
const META_API = "https://api.meta.ai/v1/responses";
const MAX_QUESTION_CHARS = 500;
const MAX_ITERATIONS = 4;

const RATE_WINDOW_MS = 60_000;
const RATE_LIMIT = 20;
const rateBuckets = new Map<string, { count: number; resetAt: number }>();
function rateLimited(ip: string): boolean {
  const now = Date.now();
  if (rateBuckets.size > 10_000) {
    for (const [k, v] of rateBuckets) if (v.resetAt <= now) rateBuckets.delete(k);
  }
  const b = rateBuckets.get(ip);
  if (!b || b.resetAt <= now) {
    rateBuckets.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }
  b.count += 1;
  return b.count > RATE_LIMIT;
}
function clientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  return (fwd ? fwd.split(",")[0].trim() : null) || "unknown";
}

// Condensed from agent-prompts-ko-en-v1.md (final 2026-10-27). The full prompts
// live in the submission package; the tool semantics here are the enforcement.
const SYSTEM = `You are the Electoral Insights Hub election-data agent. You answer questions about South Korean presidential elections 18 (2012), 19 (2017), 20 (2022) and 21 (2025) in the language the user asked in.

NON-NEGOTIABLE RULES — the tools enforce them; never work around them in prose:
1. Every number in your answer MUST come from a tool call (precinct_lookup, swing_calculation, turnout, margin). Never generate, estimate, or recall a figure from memory. If a tool returns no figure, say the data is not available — do not fill it.
2. Cross-election comparison is ONLY at district_key level (247 harmonized units, identical in all four elections). Precinct identity is not stable across elections: never match precincts across elections, never present a precinct-level swing.
3. A candidate swing is computed ONLY where the candidate ran in BOTH elections. If they did not run in one election, say so (e.g. "did not run in 2017") — never report a 0-to-X jump as a swing. In district-mode tool output, an absent side has share null and swing_pp null: report the absence, not a number.
4. Bloc swings use ONLY the candidate-based mapping (3 blocs: 보수 conservative / 진보 progressive / 기타 other; there is NO centrist bloc). Never map by party name: party names changed and split, and the 20th-election file has no party column.
5. Citations are the election archive index pages returned by the tools. Do NOT promise or invent a per-figure tally-sheet URL.
6. If a tool check fails (DATA_CHECK_FAILED), block that figure and say the check failed. Do not substitute another figure.
7. Stay neutral and factual. Report figures and their level (precinct / district / national) plainly, without partisan commentary.
8. Two registered 20th-election candidates, 안철수 (People Party) and 김동연 (New Wave), withdrew before election day and have NO rows: if asked, say they withdrew and received no votes in the file; do not invent figures.
9. When a district is a merged or renamed unit (mapping_type merged / rename), name the published districts the tool returns for it (e.g. Bucheon = Sosa + Ojeong + Wonmi summed).

TOOL-CALL RECIPES (do not improvise shortcuts):
- Turnout trend for one district, 2012→2025: four turnout calls (one per election, same district).
- Top-N swing districts + their margins: one swing_calculation ranking call, then one margin call per listed district (same election as the ranking's election_b).
- "Who won X / by how much": margin (district, precinct, or national via turnout with no district).
- Bloc swing: swing_calculation with the bloc parameter (ranking), or the blocs section of a district-mode swing_calculation call.
- "What happened in X": precinct_lookup (district aggregate, or one precinct when the user names one).

ERROR HANDLING (use the tool's error, do not improvise):
- AMBIGUOUS_DISTRICT (a bare sigungu matching several districts): list the options and ask the user for the province (sido).
- PRECINCT_NOT_FOUND: do NOT silently answer with the district figure. Say no precinct with that name was found in that district; offer the district figure only as a clearly-labelled level change, if the user accepts.
- NOT_FOUND (unknown district/candidate): retry once with a suggested canonical value from the tool, then stop and ask if that still fails.
- District aggregates sum ALL unit types in the district (regular precincts, early-vote and special rows). That is why district totals reproduce the published turnouts.

ANSWER FORMAT: short answer first (the figure + its level + election), then the supporting tool figures, then the archive-index citation. Keep units explicit: votes, share (%), turnout (%), swing (percentage points, pp).`;

const TOOLS_SCHEMA = [
  { type: "function", name: "precinct_lookup",
    description: "Official results for one district (aggregate over all its units) or one precinct in one election. Returns candidate votes and shares, total valid votes, electorate, votes cast, turnout, and the archive index-page citation. Unknown precinct returns PRECINCT_NOT_FOUND (never silently substituted with the district aggregate).",
    parameters: { type: "object",
      properties: {
        district_key: { type: "string", description: "Harmonized comparison unit, 'sido|sigungu' of the mapped unit, e.g. '경기도|부천시'. Preferred when already known." },
        election: { type: "integer", enum: [18, 19, 20, 21], description: "18=2012, 19=2017, 20=2022, 21=2025" },
        precinct: { type: "string", description: "Precinct name as published, e.g. '가락1동제1투'. Omit for a district aggregate." },
        sido: { type: "string", description: "Korean sido, full or short form, e.g. '경기도' or '경기'." },
        sigungu: { type: "string", description: "Published sigungu name, e.g. '송파구'. Alone it may be ambiguous (see AMBIGUOUS_DISTRICT)." },
      }, required: ["election"] } },
  { type: "function", name: "turnout",
    description: "Electorate, votes cast, and turnout rate for one election and one region. Turnout is SUM(votes_cast)/SUM(electorate) over distinct units in scope, which reproduces published turnouts exactly. Omit the district for the national figure.",
    parameters: { type: "object",
      properties: {
        district_key: { type: "string" }, election: { type: "integer", enum: [18, 19, 20, 21] },
        precinct: { type: "string", description: "Omit for a district or national aggregate." },
        sido: { type: "string" }, sigungu: { type: "string" },
      }, required: ["election"] } },
  { type: "function", name: "margin",
    description: "Winning margin for one election and one region: winner, runner-up, margin in votes and percentage points, plus total valid votes and turnout.",
    parameters: { type: "object",
      properties: {
        district_key: { type: "string" }, election: { type: "integer", enum: [18, 19, 20, 21] },
        precinct: { type: "string", description: "Omit for a district or national aggregate." },
        sido: { type: "string" }, sigungu: { type: "string" },
      }, required: ["election"] } },
  { type: "function", name: "swing_calculation",
    description: "Vote-share change (percentage points) between two elections. District mode: full candidate table plus winner/margin/turnout deltas and bloc shares/swings (보수/진보/기타, candidate-based mapping) for one district_key. In district mode, a candidate who did not run in one election has share null and swing_pp null on that side (entry/exit is not swing). Ranking mode: district_keys ranked by one candidate's swing, or by one bloc's share swing. A swing is only computed where the candidate ran in BOTH elections; districts where they ran in only one are excluded by default because a 0-to-X jump is an entry effect, not a swing. match_level is always district_key in v1; precinct-level cross-election matching is not attempted because precinct identity is not stable across elections. Bloc mapping is candidate-based, never party-based.",
    parameters: { type: "object",
      properties: {
        bloc: { type: "string", enum: ["보수", "진보", "기타"], description: "Ranking mode (alternative to candidate). Blocs are defined for every election, so there is no absent/entry concept in bloc mode." },
        candidate: { type: "string", description: "Candidate person name, e.g. '심상정'." },
        direction: { type: "string", enum: ["largest_gain", "largest_loss", "largest_absolute"], default: "largest_absolute" },
        district_key: { type: "string", description: "District mode: the harmonized unit." },
        election_a: { type: "integer", enum: [18, 19, 20, 21] },
        election_b: { type: "integer", enum: [18, 19, 20, 21] },
        include_absent: { type: "boolean", description: "Candidate ranking mode only: if true, include districts where the candidate ran in only one election, flagged absent_in_a/absent_in_b." },
        scope_sido: { type: "string", description: "Ranking mode: limit ranking to one sido." },
        sido: { type: "string" }, sigungu: { type: "string" },
        top_n: { type: "integer", default: 10, minimum: 1, maximum: 50 },
      }, required: ["election_a", "election_b"] } },
];

type MsgItem = Record<string, unknown>;

async function callSpark(apiKey: string, input: MsgItem[]): Promise<{ output: MsgItem[]; error?: string }> {
  const res = await fetch(META_API, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: MODEL, temperature: 0, reasoning: { effort: "low" },
      instructions: SYSTEM, input, tools: TOOLS_SCHEMA,
    }),
  });
  const payload = await res.json().catch(() => ({}));
  if (!res.ok) {
    return { output: [], error: `Meta Model API error (${res.status}).` };
  }
  return { output: (payload.output as MsgItem[]) || [] };
}

function finalText(output: MsgItem[]): string {
  for (let i = output.length - 1; i >= 0; i--) {
    const item = output[i];
    if (item.type === "message" && Array.isArray(item.content)) {
      const texts = (item.content as MsgItem[])
        .filter((c) => c.type === "output_text" && typeof c.text === "string")
        .map((c) => c.text as string);
      if (texts.length) return texts.join("\n");
    }
  }
  return "";
}

export async function POST(req: NextRequest) {
  try {
    if (rateLimited(clientIp(req))) {
      return NextResponse.json({ error: "Too many requests. Please wait a minute and try again." }, { status: 429 });
    }
    const apiKey = process.env.META_MODEL_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        error: "agent_not_configured",
        reason: "The agent's Meta Model API key is not set on this service. Set META_MODEL_API_KEY and redeploy.",
      }, { status: 503 });
    }
    const { question } = await req.json();
    if (!question || typeof question !== "string") {
      return NextResponse.json({ error: "Missing question" }, { status: 400 });
    }
    if (question.length > MAX_QUESTION_CHARS) {
      return NextResponse.json({ error: `Question too long (max ${MAX_QUESTION_CHARS} characters).` }, { status: 400 });
    }

    const input: MsgItem[] = [
      { role: "user", content: [{ type: "input_text", text: question }] },
    ];
    const steps: { tool: string; args: Record<string, unknown>; ok: boolean; data?: unknown; error?: unknown }[] = [];
    const usedElections = new Set<number>();
    let answer = "";
    for (let iter = 0; iter < MAX_ITERATIONS; iter++) {
      const { output, error } = await callSpark(apiKey, input);
      if (error) {
        return NextResponse.json({ error, steps }, { status: 502 });
      }
      const calls = output.filter((o) => o.type === "function_call");
      input.push(...output);
      if (!calls.length) {
        answer = finalText(output);
        break;
      }
      for (const call of calls) {
        const name = call.name as string;
        let args: Record<string, unknown> = {};
        try { args = JSON.parse((call.arguments as string) || "{}"); } catch { args = {}; }
        const fn = TOOLS[name];
        let result: ToolResult;
        if (!fn) {
          result = { ok: false, error: { code: "UNKNOWN_TOOL", message_en: `Unknown tool "${name}".`, message_ko: `알 수 없는 도구 "${name}"입니다.`, suggestions: [] } };
        } else {
          result = await fn(args);
        }
        if (result.ok) {
          for (const c of result.citations as { election: number }[]) usedElections.add(c.election);
          steps.push({ tool: name, args, ok: true, data: result.data });
        } else {
          steps.push({ tool: name, args, ok: false, error: result.error });
        }
        input.push({ type: "function_call_output", call_id: call.call_id, output: JSON.stringify(result) });
      }
      // If the model only emitted calls, loop again for its final message.
      if (iter === MAX_ITERATIONS - 1) {
        const { output: last } = await callSpark(apiKey, input);
        answer = finalText(last);
      }
    }
    if (!answer) {
      return NextResponse.json({ abstain: true, reason: "The agent did not produce a final answer.", steps }, { status: 200 });
    }
    return NextResponse.json({
      answer, steps,
      citations: citationsFor([...usedElections].sort((a, b) => a - b)),
      source: `Meta Model API · ${MODEL} · BigQuery electoral-hub-510410.elections.kr_precinct`,
    });
  } catch (e: unknown) {
    console.error("agent route error:", e instanceof Error ? e.message : e);
    return NextResponse.json({ error: "Internal error. Please try again." }, { status: 500 });
  }
}
