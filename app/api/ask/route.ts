import { NextRequest, NextResponse } from "next/server";
import { BigQuery } from "@google-cloud/bigquery";
import { GoogleGenAI } from "@google/genai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PROJECT = process.env.GOOGLE_CLOUD_PROJECT || "electoral-hub-510410";
const LOCATION = process.env.GOOGLE_CLOUD_LOCATION || "us-central1";
const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";
// flash picks the right columns but sometimes mis-sorts Korean superlatives; a deterministic guard below
// fixes the ORDER BY direction, which is more reliable than swapping to pro (pro mis-maps "득표율"→swing).
const SQL_MODEL = process.env.GEMINI_SQL_MODEL || "gemini-2.5-flash";

const SCHEMA = `BigQuery project ${PROJECT}, dataset "elections".

Table \`${PROJECT}.elections.county_2024\` — one row per US county, 2024 presidential election:
  county_fips STRING (5 digits), NAME STRING (e.g. "Autauga County, Alabama"),
  DEMOCRAT INT64 (Democratic votes), REPUBLICAN INT64 (Republican votes), total INT64 (total votes),
  dem_share FLOAT64 (0..1) = Democratic vote share — use this for "Democratic/민주당 vote share / 득표율",
  rep_share FLOAT64 (0..1) = Republican vote share — use this for "Republican/공화당 vote share / 득표율",
  pop INT64 (population), median_income INT64 (median household income in USD — NOT a vote metric),
  bachelors INT64 (count with a bachelor's degree), bachelors_pct FLOAT64 (bachelors / pop).

Table \`${PROJECT}.elections.swing_2020_2024\` — one row per county:
  county_fips STRING, dem_2020 FLOAT64, dem_2024 FLOAT64,
  swing FLOAT64 (dem_2024 - dem_2020; negative = shift toward Republican).

Rules: a single SELECT only; fully-qualified table names; add LIMIT 50 unless the question needs more.`;

const bq = new BigQuery({ projectId: PROJECT });
const ai = new GoogleGenAI({ vertexai: true, project: PROJECT, location: LOCATION });

// strip any triple-backtick fence (```sql, ```bigquery, ```) — single backticks for table names are kept
const cleanSQL = (s: string) => s.replace(/```[a-z]*/gi, "").trim();

// Deterministic ORDER BY direction from the question's superlative wording (fixes flash's Korean mis-sort).
// Only acts when the question is unambiguously "highest" XOR "lowest" and the SQL already has an ORDER BY.
function enforceSortDirection(sql: string, question: string): string {
  // Skip sign/semantic orderings: "most toward Republicans" = lowest (most negative) swing, not DESC.
  if (/\bswing\b/i.test(sql)) return sql;
  // Build Hangul keywords at runtime from code points (ASCII source) and substring-match on the
  // space-stripped, NFC-normalized question — avoids regex/encoding pitfalls that broke literal Hangul.
  const C = String.fromCharCode, G = C(0xAC00, 0xC7A5);
  const highKO = [G + C(0xB192), G + C(0xB9CE), G + C(0xD070), C(0xCD5C, 0xACE0), C(0xCD5C, 0xB300), C(0xC0C1, 0xC704)];
  const lowKO = [G + C(0xB0AE), G + C(0xC801), G + C(0xC791), C(0xCD5C, 0xC800), C(0xCD5C, 0xC18C), C(0xD558, 0xC704)];
  const shiftKO = [C(0xC6C0, 0xC9C1), C(0xC774, 0xB3D9), C(0xC2A4, 0xC708), C(0xBA40, 0xC5B4)];
  const q = question.normalize("NFC").toLowerCase();
  const qc = q.replace(/\s+/g, "");
  if (/swing|shift|toward|rightward|leftward/i.test(q) || shiftKO.some((k) => qc.includes(k))) return sql;
  const high = /highest|greatest|most\b|largest|biggest|\btop\b/i.test(q) || highKO.some((k) => qc.includes(k));
  const low = /lowest|least|smallest|fewest|\bbottom\b/i.test(q) || lowKO.some((k) => qc.includes(k));
  if (high === low) return sql; // ambiguous or neither — trust the model
  if (!/\border\s+by\b/i.test(sql)) return sql;
  const want = high ? "DESC" : "ASC";
  if (/\border\s+by\b[\s\S]*?\b(asc|desc)\b/i.test(sql)) {
    return sql.replace(/(\border\s+by\b[\s\S]*?\b)(asc|desc)\b/i, (_m, pre) => pre + want);
  }
  if (/\blimit\b/i.test(sql)) return sql.replace(/\blimit\b/i, `${want} LIMIT`);
  return `${sql} ${want}`;
}

function isSafeSelect(sql: string): boolean {
  const body = sql.trim().replace(/;$/, "");
  if (body.includes(";")) return false; // no multiple statements
  if (!/^select\b/i.test(body)) return false;
  return !/\b(insert|update|delete|drop|create|alter|merge|truncate|grant|revoke)\b/i.test(body);
}

// Table allowlist: the generated SQL may reference ONLY these two public tables.
// This closes prompt-injection exfiltration even if the runtime service account
// can read other datasets in the project.
const ALLOWED_TABLES = [
  `${PROJECT}.elections.county_2024`,
  `${PROJECT}.elections.swing_2020_2024`,
];
function onlyAllowedTables(sql: string): boolean {
  let rest = sql;
  for (const t of ALLOWED_TABLES) rest = rest.split(`\`${t}\``).join("");
  // Any remaining backtick-quoted identifier containing a dot = another table reference.
  if (/`[^`]*\.[^`]*`/.test(rest)) return false;
  // At least one allowed table must be present.
  return ALLOWED_TABLES.some((t) => sql.includes(`\`${t}\``));
}

// Per-IP rate limit (in-memory, per instance): 20 requests / 60s / IP.
// Cloud Run may run several instances, so this is a flood brake, not a hard
// global cap — the hard cap belongs at Cloud Armor / a shared store later.
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

const MAX_QUESTION_CHARS = 500;

export async function POST(req: NextRequest) {
  try {
    if (rateLimited(clientIp(req))) {
      return NextResponse.json({ error: "Too many requests. Please wait a minute and try again." }, { status: 429 });
    }
    const { question } = await req.json();
    if (!question || typeof question !== "string") {
      return NextResponse.json({ error: "Missing question" }, { status: 400 });
    }
    if (question.length > MAX_QUESTION_CHARS) {
      return NextResponse.json({ error: `Question too long (max ${MAX_QUESTION_CHARS} characters).` }, { status: 400 });
    }

    // 1) Natural language -> SQL
    const gen = await ai.models.generateContent({
      model: SQL_MODEL,
      contents:
        `You translate a question into ONE BigQuery Standard SQL SELECT query.\n${SCHEMA}\n` +
        `Guidance:\n` +
        `- "vote share" / "득표율" means the dem_share or rep_share column (a 0..1 fraction), NOT raw vote counts.\n` +
        `- For ranking questions use ORDER BY ... LIMIT N; never answer a ranking with SELECT *.\n` +
        `- Select only the columns needed to answer, plus an identifier (NAME and/or county_fips) for context.\n` +
        `- Filter by state with STARTS_WITH(county_fips, '<2-digit state FIPS>'), e.g. '55'=Wisconsin, '48'=Texas, '06'=California, '13'=Georgia, '36'=New York.\n` +
        `- county_fips is a STRING; compare it to quoted strings.\n` +
        `Two worked examples (same columns, opposite direction — copy the direction from the QUESTION, not from an example):\n` +
        `  "민주당 득표율이 가장 높은 카운티 5곳" (highest) -> SELECT NAME, dem_share FROM \`${PROJECT}.elections.county_2024\` ORDER BY dem_share DESC LIMIT 5\n` +
        `  "민주당 득표율이 가장 낮은 카운티 5곳" (lowest)  -> SELECT NAME, dem_share FROM \`${PROJECT}.elections.county_2024\` ORDER BY dem_share ASC LIMIT 5\n` +
        `CRITICAL last step — read the question's own words to choose the sort direction:\n` +
        `  highest / most / largest / top / 가장 높은 / 가장 많은 / 상위  => ORDER BY ... DESC\n` +
        `  lowest / least / smallest / fewest / 가장 낮은 / 가장 적은 / 하위  => ORDER BY ... ASC\n` +
        `Return ONLY the SQL, nothing else.\nQuestion: ${question}`,
      config: { temperature: 0 },
    });
    let sql = cleanSQL(gen.text || "");
    if (!isSafeSelect(sql)) {
      return NextResponse.json({ abstain: true, reason: "I could not form a safe query for that.", sql });
    }
    if (!onlyAllowedTables(sql)) {
      return NextResponse.json({ abstain: true, reason: "I could not form a safe query for that.", sql });
    }
    sql = enforceSortDirection(sql, question);
    if (!/\blimit\s+\d+/i.test(sql)) sql = sql.replace(/;?\s*$/, "") + "\nLIMIT 50";

    // 2) Run on BigQuery — maximumBytesBilled caps the scan (legit queries
    // scan megabytes; a CROSS JOIN attack would blow past 1 GB and fail).
    const [rows] = await bq.query({ query: sql, maximumBytesBilled: "1000000000" });
    if (!rows || rows.length === 0) {
      return NextResponse.json({ abstain: true, reason: "The data does not cover that — no matching rows.", sql });
    }
    const clean = JSON.parse(JSON.stringify(rows)).slice(0, 50);

    // 3) Grounded summary from the rows only
    const sum = await ai.models.generateContent({
      model: MODEL,
      contents:
        `Answer the question in 1-2 sentences using ONLY these query results. Cite exact numbers (round shares to 1 decimal %). ` +
        `Language: detect the language of the Question text and answer ONLY in that language — English question -> English answer, Korean question -> Korean answer. ` +
        `Do NOT default to Korean. ` +
        `Column meaning: 'swing' = dem_2024 - dem_2020; a NEGATIVE swing means the county shifted TOWARD Republicans, a POSITIVE swing means it shifted toward Democrats. ` +
        `'dem_share'/'rep_share' are 0..1 vote-share fractions. ` +
        `The SQL already ordered and filtered the rows to answer the question, so trust them and summarize directly; do not claim they fail to answer unless they are truly unrelated.\n` +
        `Question: ${question}\nResults (JSON): ${JSON.stringify(clean)}`,
      config: { temperature: 0 },
    });

    return NextResponse.json({
      answer: (sum.text || "").trim(),
      sql,
      rows: clean,
      source: `BigQuery · ${PROJECT}.elections · ${MODEL}`,
    });
  } catch (e: unknown) {
    // Never leak internals to the client (raw errors can reveal project
    // details); the message still lands in Cloud Logging server-side.
    console.error("ask route error:", e instanceof Error ? e.message : e);
    return NextResponse.json({ error: "Internal error. Please try again." }, { status: 500 });
  }
}
