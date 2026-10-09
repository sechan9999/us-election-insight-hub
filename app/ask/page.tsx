"use client";
import { useState } from "react";

type Res = {
  answer?: string; sql?: string; rows?: Record<string, unknown>[];
  source?: string; abstain?: boolean; reason?: string; error?: string;
};

const EXAMPLES = [
  "Top 10 counties by Democratic vote share",
  "Which 10 counties shifted most toward Republicans from 2020 to 2024?",
  "Average dem_share for counties where bachelors_pct > 0.3",
  "Counties in Texas with the biggest Republican swing",
];

export default function Ask() {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [res, setRes] = useState<Res | null>(null);
  const [err, setErr] = useState("");

  async function ask(question?: string) {
    const query = (question ?? q).trim();
    if (!query) { setErr("Enter a question first."); return; }
    setErr(""); setLoading(true); setRes(null);
    try {
      const r = await fetch("/api/ask", {
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

  const input = "padding:10px 12px;border-radius:8px;border:1px solid #374151;background:#111827;color:#e5e7eb";
  return (
    <main style={{ maxWidth: 860, margin: "0 auto", padding: "2rem 1rem", color: "#e5e7eb", minHeight: "100vh", background: "#0a0a0a" }}>
      <a href="/us" style={{ color: "#93c5fd", fontSize: 13 }}>← back to the board</a>
      <h1 style={{ fontSize: 26, fontWeight: 700, marginTop: 8 }}>Ask the Data</h1>
      <p style={{ color: "#9ca3af" }}>
        Ask about 2024 county results. Answers are grounded in BigQuery — the exact SQL and rows are shown as the citation, and it abstains when the data can&rsquo;t answer.
      </p>

      <div style={{ display: "flex", gap: 8, margin: "1rem 0" }}>
        <input
          value={q} onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && ask()}
          placeholder="e.g. Top 10 counties by Democratic vote share"
          style={{ flex: 1, padding: "10px 12px", borderRadius: 8, border: "1px solid #374151", background: "#111827", color: "#e5e7eb" }}
        />
        <button onClick={() => ask()} disabled={loading}
          style={{ padding: "10px 18px", borderRadius: 8, border: "1px solid #374151", background: "#1f5f6b", color: "#fff", cursor: "pointer" }}>
          {loading ? "…" : "Ask"}
        </button>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
        {EXAMPLES.map((ex) => (
          <button key={ex} onClick={() => { setQ(ex); ask(ex); }}
            style={{ fontSize: 12, color: "#93c5fd", background: "none", border: "1px solid #374151", borderRadius: 6, padding: "4px 8px", cursor: "pointer" }}>
            {ex}
          </button>
        ))}
      </div>

      {err && <p style={{ color: "#f87171" }}>{err}</p>}
      {res?.error && <p style={{ color: "#f87171" }}>Error: {res.error}</p>}
      {res?.abstain && (
        <div style={{ padding: 14, background: "#1f2937", borderRadius: 10 }}>
          <strong>Not answerable from the data.</strong> {res.reason}
          {res.sql && <pre style={{ marginTop: 8, fontSize: 12, color: "#9ca3af", whiteSpace: "pre-wrap" }}>{res.sql}</pre>}
        </div>
      )}

      {res?.answer && (
        <div>
          <div style={{ padding: 16, background: "#111827", border: "1px solid #374151", borderRadius: 10, marginBottom: 12, fontSize: 16 }}>
            {res.answer}
          </div>
          <details open>
            <summary style={{ cursor: "pointer", color: "#9ca3af", marginBottom: 8 }}>Citation — SQL &amp; rows ({res.source})</summary>
            <pre style={{ background: "#0b1220", padding: 12, borderRadius: 8, overflowX: "auto", fontSize: 12, color: "#cbd5e1" }}>{res.sql}</pre>
            <div style={{ overflowX: "auto", marginTop: 8 }}>
              <table style={{ fontSize: 12, borderCollapse: "collapse", width: "100%" }}>
                <thead>
                  <tr>{res.rows && res.rows[0] && Object.keys(res.rows[0]).map((k) => (
                    <th key={k} style={{ textAlign: "left", borderBottom: "1px solid #374151", padding: "4px 8px", color: "#9ca3af" }}>{k}</th>
                  ))}</tr>
                </thead>
                <tbody>
                  {res.rows && res.rows.map((row, i) => (
                    <tr key={i}>{Object.values(row).map((v, j) => (
                      <td key={j} style={{ padding: "4px 8px", borderBottom: "1px solid #1f2937" }}>{String(v)}</td>
                    ))}</tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        </div>
      )}
    </main>
  );
}
