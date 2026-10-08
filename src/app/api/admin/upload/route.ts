import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import sharp from "sharp";
import { isAdmin, sameOrigin } from "@/lib/auth";
import { setBinary } from "@/lib/store";
import type { Img } from "@/lib/types";

const MAX_BYTES = 25 * 1024 * 1024;

/** Recibe una imagen, la optimiza a WebP (máx. 2560 px) y devuelve su ficha lista para usar. */
export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  if (!(await sameOrigin())) return NextResponse.json({ error: "Origen no permitido" }, { status: 403 });

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "Falta el archivo" }, { status: 400 });
  if (!file.type.startsWith("image/")) return NextResponse.json({ error: "Solo se aceptan imágenes" }, { status: 400 });
  if (file.size > MAX_BYTES) return NextResponse.json({ error: "La imagen supera 25 MB" }, { status: 413 });

  try {
    const input = Buffer.from(await file.arrayBuffer());
    const out = await sharp(input)
      .rotate()
      .resize({ width: 2560, withoutEnlargement: true })
      .webp({ quality: 88, effort: 5 })
      .toBuffer({ resolveWithObject: true });
    const blur = "data:image/jpeg;base64," + (await sharp(input).rotate().resize(16).blur(1).jpeg({ quality: 40 }).toBuffer()).toString("base64");
    const id = `${Date.now().toString(36)}-${randomBytes(4).toString("hex")}`;
    await setBinary("media", id, out.data, "image/webp");
    const img: Img = { src: `/media/${id}`, w: out.info.width, h: out.info.height, alt: file.name.replace(/\.[^.]+$/, "").slice(0, 120), blur };
    return NextResponse.json(img);
  } catch {
    return NextResponse.json({ error: "No se pudo procesar la imagen" }, { status: 422 });
  }
}
