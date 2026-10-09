import { NextRequest, NextResponse } from "next/server";
import { BigQuery } from "@google-cloud/bigquery";
import { GoogleGenAI } from "@google/genai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PROJECT = process.env.GOOGLE_CLOUD_PROJECT || "electoral-hub-510410";
const LOCATION = process.env.GOOGLE_CLOUD_LOCATION || "us-central1";
const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

const SCHEMA = `BigQuery project ${PROJECT}, dataset "elections".

Table \`${PROJECT}.elections.county_2024\` — one row per US county, 2024 presidential election:
  county_fips STRING (5 digits), NAME STRING (e.g. "Autauga County, Alabama"),
  DEMOCRAT INT64, REPUBLICAN INT64, total INT64 (total votes),
  dem_share FLOAT64 (0..1), rep_share FLOAT64 (0..1),
  pop INT64 (population), median_income INT64, bachelors INT64 (count with a bachelor's degree),
  bachelors_pct FLOAT64 (bachelors / pop).

Table \`${PROJECT}.elections.swing_2020_2024\` — one row per county:
  county_fips STRING, dem_2020 FLOAT64, dem_2024 FLOAT64,
  swing FLOAT64 (dem_2024 - dem_2020; negative = shift toward Republican).

Rules: a single SELECT only; fully-qualified table names; add LIMIT 50 unless the question needs more.`;

const bq = new BigQuery({ projectId: PROJECT });
const ai = new GoogleGenAI({ vertexai: true, project: PROJECT, location: LOCATION });

// strip any triple-backtick fence (```sql, ```bigquery, ```) — single backticks for table names are kept
const cleanSQL = (s: string) => s.replace(/```[a-z]*/gi, "").trim();

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
      model: MODEL,
      contents:
        `You translate a question into ONE BigQuery Standard SQL SELECT query.\n${SCHEMA}\n` +
        `Guidance:\n` +
        `- "vote share" / "득표율" means the dem_share or rep_share column (a 0..1 fraction), NOT raw vote counts.\n` +
        `- For "top / highest / lowest / most / biggest / 가장 ... N" questions, ORDER BY the relevant column (DESC or ASC) and LIMIT N. Never answer a ranking with SELECT *.\n` +
        `- Select only the columns needed to answer, plus an identifier (NAME and/or county_fips) for context.\n` +
        `- Filter by state with STARTS_WITH(county_fips, '<2-digit state FIPS>'), e.g. '55'=Wisconsin, '48'=Texas, '06'=California, '13'=Georgia, '36'=New York.\n` +
        `- county_fips is a STRING; compare it to quoted strings.\n` +
        `Return ONLY the SQL, nothing else.\nQuestion: ${question}`,
    });
    let sql = cleanSQL(gen.text || "");
    if (!isSafeSelect(sql)) {
      return NextResponse.json({ abstain: true, reason: "I could not form a safe query for that.", sql });
    }
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
        `Answer the question in 1-2 sentences using ONLY these query results. Cite exact numbers. ` +
        `Reply in the same language as the question (Korean question -> Korean answer). ` +
        `If the results do not answer it, say so.\n` +
        `Question: ${question}\nResults (JSON): ${JSON.stringify(clean)}`,
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
