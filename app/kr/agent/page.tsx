// Electoral Evidence Agent tab (Korean elections 2012–2025).
// Client component: asks /api/agent (Muse Spark function calling over BigQuery
// kr_precinct) and renders the short answer first, then the tool trace and the
// archive-index citations. Every number shown comes from a tool call.
"use client";
import { useState, type ReactNode } from "react";

// Minimal answer renderer: the model returns Markdown, but the page used to
// show it as plain text (literal ** markers). Render bold, links, headers,
// and lists. Text is never injected as HTML — React escapes all string
// children — so a model answer containing HTML tags displays as text.
function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const re = /(\*\*[^*]+\*\*)|(https?:\/\/[^\s)]+)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    if (m[1]) {
      nodes.push(<strong key={`${keyPrefix}-b${i}`}>{m[1].slice(2, -2)}</strong>);
    } else if (m[2]) {
      nodes.push(<a key={`${keyPrefix}-a${i}`} href={m[2]} target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:underline">{m[2]}</a>);
    }
    last = m.index + m[0].length;
    i++;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

function renderAnswer(text: string): ReactNode[] {
  const lines = text.split("\n");
  const blocks: ReactNode[] = [];
  let i = 0;
  let key = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.trim() === "") { i++; continue; }
    if (/^\s*-\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*-\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*-\s+/, ""));
        i++;
      }
      blocks.push(
        <ul key={key++} className="list-disc space-y-1 pl-5">
          {items.map((it, j) => <li key={j}>{renderInline(it, `ul${key}-${j}`)}</li>)}
        </ul>,
      );
      continue;
    }
    if (/^\s*\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*\d+\.\s+/, ""));
        i++;
      }
      blocks.push(
        <ol key={key++} className="list-decimal space-y-1 pl-5">
          {items.map((it, j) => <li key={j}>{renderInline(it, `ol${key}-${j}`)}</li>)}
        </ol>,
      );
      continue;
    }
    const header = line.match(/^#{1,6}\s+(.*)$/);
    if (header) {
      blocks.push(<p key={key++} className="font-semibold">{renderInline(header[1], `h${key}`)}</p>);
      i++;
      continue;
    }
    blocks.push(<p key={key++}>{renderInline(line, `p${key}`)}</p>);
    i++;
  }
  return blocks;
}

type Step = {
  tool: string; args: Record<string, unknown>; ok: boolean;
  data?: unknown; error?: { code: string; message_en: string; message_ko: string; suggestions: string[] };
};
type Citation = { election: number; election_year: number; citation_url: string };
type Res = {
  answer?: string; steps?: Step[]; citations?: Citation[]; source?: string;
  abstain?: boolean; reason?: string; error?: string;
  model?: string; fallback?: boolean; fallback_reason?: string;
};

const EXAMPLES = [
  "부천시 투표율 추이 2012 → 2025?",
  "2017→2022년 심상정 득표율이 가장 많이 떨어진 지역 5곳은?",
  "2025년 서울특별시|송파구 1위와 2위의 표 차이는?",
  "Who won 서울특별시|송파구 in 2025, and by how much?",
];

function stepSummary(s: Step): string {
  if (!s.ok) return s.error ? `${s.error.code}: ${s.error.message_ko || s.error.message_en}` : "failed";
  const d = s.data as Record<string, unknown> | undefined;
  if (!d) return "ok";
  if (typeof d.turnout_pct === "number") return `turnout ${d.turnout_pct}%`;
  if (typeof d.margin_votes === "number") {
    const w = d.winner as { name?: string } | undefined;
    return `${w?.name ?? ""} +${d.margin_votes} votes (${d.margin_pp}pp)`;
  }
  if (Array.isArray(d.rows)) return `${d.rows.length} rows`;
  if (Array.isArray(d.candidates)) return `${d.candidates.length} candidates`;
  return "ok";
}

export default function Agent() {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [res, setRes] = useState<Res | null>(null);
  const [err, setErr] = useState("");

  async function ask(question?: string) {
    const query = (question ?? q).trim();
    if (!query) { setErr("질문을 입력하세요."); return; }
    setErr(""); setLoading(true); setRes(null);
    try {
      const r = await fetch("/api/agent", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ question: query }),
      });
      setRes(await r.json());
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Request failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-4 py-8 text-neutral-200">
      <a href="/kr" className="text-sm text-blue-300">← 한국 대선 데이터로 돌아가기</a>
      <h1 className="mt-3 text-3xl font-bold">선거 증거 에이전트</h1>
      <p className="mt-1 text-sm text-neutral-400">
        한국 대통령 선거 18대(2012)–21대(2025)에 대해 물어보세요. 모든 숫자는 BigQuery 도구 호출에서 가져오며,
        모델이 지어낸 수치는 없습니다. 출처는 선거별 아카이브 색인 페이지입니다.
        Ask in Korean or English — the agent answers in the language you asked in.
      </p>

      <div className="mt-6 flex gap-2">
        <input
          value={q} onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && ask()}
          placeholder="예: 부천시 투표율 추이 2012 → 2025?"
          className="flex-1 rounded-lg border border-white/15 bg-white/5 px-3 py-2.5 text-neutral-100 placeholder:text-neutral-500"
        />
        <button onClick={() => ask()} disabled={loading}
          className="rounded-lg border border-white/15 bg-teal-800 px-5 py-2.5 font-medium text-white disabled:opacity-50">
          {loading ? "…" : "묻기"}
        </button>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {EXAMPLES.map((ex) => (
          <button key={ex} onClick={() => { setQ(ex); ask(ex); }}
            className="rounded-md border border-white/15 px-2 py-1 text-xs text-blue-300 hover:bg-white/10">
            {ex}
          </button>
        ))}
      </div>

      {err && <p className="mt-4 text-red-400">{err}</p>}
      {res?.error && (
        <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4">
          <strong>에이전트를 사용할 수 없습니다.</strong>
          <p className="mt-1 text-sm text-neutral-400">
            {res.error === "agent_not_configured"
              ? "서비스에 Meta Model API 키가 설정되지 않았습니다. 관리자가 META_MODEL_API_KEY를 설정한 뒤 다시 시도하세요."
              : `Error: ${res.error}`}
          </p>
        </div>
      )}
      {res?.abstain && (
        <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4">
          <strong>자료에서 답할 수 없습니다.</strong>
          <p className="mt-1 text-sm text-neutral-400">{res.reason}</p>
        </div>
      )}
      {res?.answer && (
        <div className="mt-6">
          {res.fallback && (
            <div className="mb-3 rounded-xl border border-amber-400/30 bg-amber-400/10 p-3 text-sm text-amber-200">
              Meta API 문제로 Gemini가 대신 답했습니다. 수치 출처(도구)는 동일합니다.
            </div>
          )}
          <div className="rounded-xl border border-white/10 bg-white/5 p-5">
            <div className="space-y-3 text-base leading-relaxed text-neutral-100">{renderAnswer(res.answer)}</div>
          </div>

          {res.steps && res.steps.length > 0 && (
            <div className="mt-4">
              <h2 className="text-sm font-semibold text-neutral-300">도구 호출 기록 (Tool trace)</h2>
              <ul className="mt-2 space-y-2">
                {res.steps.map((s, i) => (
                  <li key={i} className="rounded-lg border border-white/10 bg-black/30 p-3 text-sm">
                    <span className={s.ok ? "text-emerald-300" : "text-red-300"}>
                      {s.ok ? "✓" : "✗"} {s.tool}
                    </span>
                    <span className="ml-2 text-neutral-400">{stepSummary(s)}</span>
                    <details className="mt-1">
                      <summary className="cursor-pointer text-xs text-neutral-500">자세히 보기</summary>
                      <pre className="mt-1 overflow-x-auto text-xs text-neutral-400">{JSON.stringify({ args: s.args, data: s.data, error: s.error }, null, 2)}</pre>
                    </details>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {res.citations && res.citations.length > 0 && (
            <div className="mt-4 text-sm">
              <span className="text-neutral-400">출처: </span>
              {res.citations.map((c) => (
                <a key={c.election} href={c.citation_url} target="_blank" rel="noopener noreferrer"
                  className="mr-3 text-blue-300 hover:underline">
                  {c.election_year}년 선거 아카이브 색인 →
                </a>
              ))}
            </div>
          )}
          {res.source && <p className="mt-2 text-xs text-neutral-500">{res.source}</p>}
        </div>
      )}
    </main>
  );
}
