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
  // Test both Unicode normal forms so Hangul keywords match whether the request arrives NFC or NFD.
  const q = (question.normalize("NFC") + " " + question.normalize("NFD")).toLowerCase();
  if (/(swing|shift|toward|움직|이동|스윙|멀어|rightward|leftward)/.test(q)) return sql;
  const high = /(highest|greatest|most\b|largest|biggest|\btop\b|가장\s*높|가장\s*많|가장\s*큰|최고|최대|상위)/.test(q);
  const low = /(lowest|least|smallest|fewest|\bbottom\b|가장\s*낮|가장\s*적|가장\s*작|최저|최소|하위)/.test(q);
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

export async function POST(req: NextRequest) {
  try {
    const { question } = await req.json();
    if (!question || typeof question !== "string") {
      return NextResponse.json({ error: "Missing question" }, { status: 400 });
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
    sql = enforceSortDirection(sql, question);
    if (!/\blimit\s+\d+/i.test(sql)) sql = sql.replace(/;?\s*$/, "") + "\nLIMIT 50";

    // 2) Run on BigQuery
    const [rows] = await bq.query({ query: sql });
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
    const msg = e instanceof Error ? e.message : "error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
