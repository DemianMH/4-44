import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { isAdmin, sameOrigin } from "@/lib/auth";
import { CONTENT_TAG, getContent } from "@/lib/content";
import { setJSON } from "@/lib/store";
import { validateContent } from "@/lib/validate";

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  return NextResponse.json(await getContent());
}

export async function PUT(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  if (!(await sameOrigin())) return NextResponse.json({ error: "Origen no permitido" }, { status: 403 });

  const content = validateContent(await req.json().catch(() => null));
  if (!content) return NextResponse.json({ error: "Contenido inválido" }, { status: 400 });

  await setJSON("cms", "content", content);
  revalidateTag(CONTENT_TAG, { expire: 0 });
  return NextResponse.json(content);
}
