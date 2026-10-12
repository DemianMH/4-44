import { connection, NextResponse } from "next/server";

/** Diagnóstico temporal del almacenamiento (se retirará). No expone datos ni secretos. */
const race = async <T,>(label: string, fn: () => Promise<T>, ms: number): Promise<string> => {
  const t0 = Date.now();
  try {
    const v = await Promise.race([fn(), new Promise<never>((_, rej) => setTimeout(() => rej(new Error("TIMEOUT")), ms))]);
    return `${label}: ok ${Date.now() - t0}ms ${v === null ? "null" : typeof v}`;
  } catch (e) {
    const err = e as Error & { cause?: unknown; status?: number };
    return `${label}: ${err.name}: ${err.message.slice(0, 200)} status=${err.status ?? "-"} cause=${String(err.cause ?? "-").slice(0, 120)} ${Date.now() - t0}ms`;
  }
};

export async function GET() {
  await connection();
  let ctxKeys: string[] = [];
  let hasEdge = false;
  try {
    const raw = process.env.NETLIFY_BLOBS_CONTEXT;
    if (raw) {
      const ctx = JSON.parse(Buffer.from(raw, "base64").toString("utf8")) as Record<string, unknown>;
      ctxKeys = Object.keys(ctx);
      hasEdge = !!ctx.edgeURL;
    }
  } catch {
    ctxKeys = ["parse-error"];
  }
  const out: string[] = [];
  try {
    const { getStore } = await import("@netlify/blobs");
    const s = getStore({ name: "diag", consistency: "strong" });
    out.push(await race("set", () => s.set("k1", "hola"), 8000));
    out.push(await race("get-text", () => s.get("k1", { type: "text" }), 8000));
    out.push(await race("get-missing", () => s.get("no-existe", { type: "text" }), 8000));
    out.push(await race("get-json-missing", () => s.get("no-existe-2", { type: "json" }), 8000));
    out.push(await race("list", () => s.list(), 8000));
  } catch (e) {
    out.push(`import/store: ${(e as Error).name}: ${(e as Error).message.slice(0, 200)}`);
  }
  return NextResponse.json({ ctxKeys, hasEdge, out });
}
