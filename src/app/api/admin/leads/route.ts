import { NextResponse } from "next/server";
import { isAdmin, sameOrigin } from "@/lib/auth";
import { getJSON, listKeys, remove } from "@/lib/store";
import type { Lead } from "@/lib/types";

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const keys = await listKeys("leads");
  const leads = (await Promise.all(keys.map((k) => getJSON<Lead>("leads", k)))).filter((l): l is Lead => !!l);
  leads.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return NextResponse.json(leads);
}

export async function DELETE(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  if (!(await sameOrigin())) return NextResponse.json({ error: "Origen no permitido" }, { status: 403 });
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Falta id" }, { status: 400 });
  await remove("leads", id);
  return NextResponse.json({ ok: true });
}
