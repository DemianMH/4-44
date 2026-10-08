import { getBinary } from "@/lib/store";

/** Sirve las imágenes subidas desde el panel. */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const file = /^[a-z0-9-]{6,60}$/.test(id) ? await getBinary("media", id) : null;
  if (!file) return new Response("No encontrada", { status: 404 });
  return new Response(new Uint8Array(file.data), {
    headers: { "Content-Type": file.type, "Cache-Control": "public, max-age=31536000, immutable" },
  });
}
