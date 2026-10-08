import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { sameOrigin } from "@/lib/auth";
import { setJSON } from "@/lib/store";
import type { Lead } from "@/lib/types";

const hits = new Map<string, number[]>();
const clean = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

/** Recibe el formulario de contacto y lo guarda para verlo en el panel. */
export async function POST(req: Request) {
  if (!(await sameOrigin())) return NextResponse.json({ error: "Origen no permitido" }, { status: 403 });

  const ip = req.headers.get("x-nf-client-connection-ip") ?? req.headers.get("x-forwarded-for") ?? "local";
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  if (recent.length >= 5) return NextResponse.json({ error: "Demasiados envíos. Inténtalo más tarde." }, { status: 429 });

  const b = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  if (clean(b.website, 50)) return NextResponse.json({ ok: true }); // trampa para bots

  const lead: Lead = {
    id: `${now.toString(36)}-${randomBytes(3).toString("hex")}`,
    createdAt: new Date(now).toISOString(),
    name: clean(b.name, 120),
    email: clean(b.email, 160),
    phone: clean(b.phone, 40),
    interest: clean(b.interest, 120),
    message: clean(b.message, 2000),
  };
  if (!lead.name || !lead.message || (!lead.email && !lead.phone)) return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
  if (lead.email && !/^\S+@\S+\.\S+$/.test(lead.email)) return NextResponse.json({ error: "Correo inválido" }, { status: 400 });

  hits.set(ip, [...recent, now]);
  await setJSON("leads", lead.id, lead);
  return NextResponse.json({ ok: true });
}
