import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { adminPassword, checkPassword, sameOrigin, sessionCookie, sessionToken } from "@/lib/auth";

const attempts = new Map<string, { n: number; t: number }>();

export async function POST(req: Request) {
  if (!(await sameOrigin())) return NextResponse.json({ error: "Origen no permitido" }, { status: 403 });
  if (!adminPassword()) return NextResponse.json({ error: "no-configurado" }, { status: 503 });

  const ip = req.headers.get("x-nf-client-connection-ip") ?? req.headers.get("x-forwarded-for") ?? "local";
  const rec = attempts.get(ip);
  if (rec && Date.now() - rec.t < 10 * 60_000 && rec.n >= 8) return NextResponse.json({ error: "Demasiados intentos. Espera unos minutos." }, { status: 429 });

  const body = (await req.json().catch(() => ({}))) as { password?: string };
  if (!checkPassword(String(body.password ?? ""))) {
    attempts.set(ip, { n: (rec && Date.now() - rec.t < 10 * 60_000 ? rec.n : 0) + 1, t: Date.now() });
    return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401 });
  }
  attempts.delete(ip);
  (await cookies()).set(sessionCookie(sessionToken()));
  return NextResponse.json({ ok: true });
}
