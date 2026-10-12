import { connection, NextResponse } from "next/server";

/** Diagnóstico temporal del almacenamiento (se retirará). No expone datos, solo tiempos y banderas. */
const race = async <T,>(p: Promise<T>, ms: number): Promise<string> => {
  const t0 = Date.now();
  try {
    const v = await Promise.race([p, new Promise<never>((_, rej) => setTimeout(() => rej(new Error("TIMEOUT")), ms))]);
    return `ok ${Date.now() - t0}ms ${v === null ? "null" : typeof v}`;
  } catch (e) {
    return `${(e as Error).name}: ${(e as Error).message.slice(0, 160)} ${Date.now() - t0}ms`;
  }
};

export async function GET() {
  await connection();
  const env = {
    NETLIFY: !!process.env.NETLIFY,
    NETLIFY_BLOBS_CONTEXT: !!process.env.NETLIFY_BLOBS_CONTEXT,
    SITE_ID: !!process.env.SITE_ID,
    NETLIFY_SITE_ID: !!process.env.NETLIFY_SITE_ID,
    NODE_ENV: process.env.NODE_ENV,
  };
  const out: Record<string, string> = {};
  try {
    const { getStore } = await import("@netlify/blobs");
    out.strong = await race(getStore({ name: "cms", consistency: "strong" }).get("content", { type: "json" }), 6000);
    out.eventual = await race(getStore("cms").get("content", { type: "json" }), 6000);
    out.list = await race(getStore("cms").list(), 6000);
  } catch (e) {
    out.import = `${(e as Error).name}: ${(e as Error).message.slice(0, 200)}`;
  }
  return NextResponse.json({ env, out });
}
