// Gemini fallback driver for /api/agent. Used ONLY when the Meta Model API
// fails to deliver an answer (API error, or no final message after the loop).
// Tool execution is shared with the Meta path (lib/tools.ts), so figures come
// from the same BigQuery tools either way; only the language model differs.
// Auth mirrors /api/ask: Vertex AI with the Cloud Run service account.

import { GoogleGenAI } from "@google/genai";
import { TOOLS, type ToolResult } from "./tools";

const PROJECT = process.env.GOOGLE_CLOUD_PROJECT || "electoral-hub-510410";
const LOCATION = process.env.GOOGLE_CLOUD_LOCATION || "us-central1";
const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const MAX_ITERATIONS = 4;

export type Step = {
  tool: string; args: Record<string, unknown>; ok: boolean;
  data?: unknown; error?: unknown;
};
export type LoopResult = {
  answer: string; steps: Step[]; elections: number[]; error?: string;
};

// Convert a Responses-API-style tool schema to a Gemini function declaration.
// Gemini declarations do not take default/minimum/maximum, so those are
// stripped (the server clamps top_n to 1..50 in tools.ts regardless).
function toGeminiType(t: string): string {
  switch (t) {
    case "string": return "STRING";
    case "integer": return "INTEGER";
    case "number": return "NUMBER";
    case "boolean": return "BOOLEAN";
    case "array": return "ARRAY";
    case "object": return "OBJECT";
    default: return "STRING";
  }
}
function convertSchema(s: Record<string, any>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  if (s.type) out.type = toGeminiType(s.type);
  if (s.description) out.description = s.description;
  // Vertex requires enum values to be strings even for INTEGER parameters
  // (verified 2026-10-27: numeric enums return 400). The model then returns
  // election as "21", which tools.ts normElection coerces back to 21.
  if (s.enum) out.enum = (s.enum as unknown[]).map((v) => String(v));
  if (s.properties) {
    const props: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(s.properties)) props[k] = convertSchema(v as Record<string, any>);
    out.properties = props;
  }
  if (s.required) out.required = s.required;
  return out;
}

export function toGeminiDeclarations(toolsSchema: { name: string; description: string; parameters: Record<string, any> }[]) {
  return toolsSchema.map((t) => ({
    name: t.name,
    description: t.description,
    parameters: convertSchema(t.parameters),
  }));
}

export async function runGeminiLoop(
  question: string,
  system: string,
  toolsSchema: { name: string; description: string; parameters: Record<string, any> }[],
): Promise<LoopResult> {
  try {
    const ai = new GoogleGenAI({ vertexai: true, project: PROJECT, location: LOCATION });
    const declarations = toGeminiDeclarations(toolsSchema);
    const contents: any[] = [{ role: "user", parts: [{ text: question }] }];
    const steps: Step[] = [];
    const elections = new Set<number>();

    async function generate() {
      const res = await ai.models.generateContent({
        model: MODEL,
        contents,
        config: {
          systemInstruction: system,
          tools: [{ functionDeclarations: declarations }],
          temperature: 0,
        },
      });
      return res.candidates?.[0]?.content?.parts ?? [];
    }

    for (let iter = 0; iter < MAX_ITERATIONS; iter++) {
      const parts = await generate();
      const calls: { name: string; args: Record<string, unknown> }[] = [];
      for (const p of parts) {
        const fc = (p as any).functionCall;
        if (fc) calls.push({ name: fc.name as string, args: (fc.args ?? {}) as Record<string, unknown> });
      }
      contents.push({ role: "model", parts });
      if (!calls.length) {
        const text = parts.filter((p: any) => typeof p.text === "string").map((p: any) => p.text).join("\n");
        return { answer: text, steps, elections: [...elections] };
      }
      const responses: any[] = [];
      for (const call of calls) {
        const name = call.name;
        const args = call.args;
        const fn = TOOLS[name];
        let result: ToolResult;
        if (!fn) {
          result = { ok: false, error: { code: "UNKNOWN_TOOL", message_en: `Unknown tool "${name}".`, message_ko: `알 수 없는 도구 "${name}"입니다.`, suggestions: [] } };
        } else {
          result = await fn(args);
        }
        if (result.ok) {
          for (const c of result.citations as { election: number }[]) elections.add(c.election);
          steps.push({ tool: name, args, ok: true, data: result.data });
        } else {
          steps.push({ tool: name, args, ok: false, error: result.error });
        }
        responses.push({ functionResponse: { name, response: { result } } });
      }
      contents.push({ role: "user", parts: responses });
      if (iter === MAX_ITERATIONS - 1) {
        const last = await generate();
        const text = last.filter((p: any) => typeof p.text === "string").map((p: any) => p.text).join("\n");
        return { answer: text, steps, elections: [...elections] };
      }
    }
    return { answer: "", steps, elections: [...elections], error: "Gemini loop ended without a final answer." };
  } catch (e) {
    return { answer: "", steps: [], elections: [], error: e instanceof Error ? e.message : String(e) };
  }
}
