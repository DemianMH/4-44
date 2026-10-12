import { promises as fs } from "fs";
import path from "path";

/**
 * Almacenamiento persistente: Netlify Blobs en producción y archivos locales (`.data/`) en desarrollo.
 * Tres espacios: `cms` (contenido), `media` (imágenes subidas) y `leads` (mensajes del formulario).
 */
export type StoreName = "cms" | "media" | "leads";

const onNetlify = Boolean(process.env.NETLIFY || process.env.NETLIFY_BLOBS_CONTEXT || process.env.NETLIFY_LOCAL);

/** Evita que una lectura de Blobs que no responde deje colgado el sitio entero. */
const within = <T,>(p: Promise<T>, ms = 4000): Promise<T> =>
  Promise.race([p, new Promise<never>((_, rej) => setTimeout(() => rej(new Error("store-timeout")), ms))]);

async function blobs(name: StoreName) {
  const { getStore } = await import("@netlify/blobs");
  return getStore({ name, consistency: "strong" });
}

const localDir = (name: StoreName) => path.join(process.cwd(), ".data", name);
const safe = (key: string) => key.replace(/[^a-zA-Z0-9._-]/g, "_");

export async function getJSON<T>(name: StoreName, key: string): Promise<T | null> {
  try {
    if (onNetlify) return ((await within((await blobs(name)).get(key, { type: "json" }))) as T | null) ?? null;
    return JSON.parse(await fs.readFile(path.join(localDir(name), safe(key) + ".json"), "utf8")) as T;
  } catch {
    return null;
  }
}

export async function setJSON(name: StoreName, key: string, value: unknown): Promise<void> {
  if (onNetlify) {
    await (await blobs(name)).setJSON(key, value);
    return;
  }
  await fs.mkdir(localDir(name), { recursive: true });
  await fs.writeFile(path.join(localDir(name), safe(key) + ".json"), JSON.stringify(value, null, 1), "utf8");
}

export async function getBinary(name: StoreName, key: string): Promise<{ data: Buffer; type: string } | null> {
  try {
    if (onNetlify) {
      const r = await (await blobs(name)).getWithMetadata(key, { type: "arrayBuffer" });
      if (!r) return null;
      return { data: Buffer.from(r.data), type: String(r.metadata?.type ?? "application/octet-stream") };
    }
    const base = path.join(localDir(name), safe(key));
    const [data, meta] = await Promise.all([fs.readFile(base), fs.readFile(base + ".type", "utf8").catch(() => "application/octet-stream")]);
    return { data, type: meta };
  } catch {
    return null;
  }
}

export async function setBinary(name: StoreName, key: string, data: Buffer, type: string): Promise<void> {
  if (onNetlify) {
    const ab = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength) as ArrayBuffer;
    await (await blobs(name)).set(key, ab, { metadata: { type } });
    return;
  }
  await fs.mkdir(localDir(name), { recursive: true });
  const base = path.join(localDir(name), safe(key));
  await Promise.all([fs.writeFile(base, data), fs.writeFile(base + ".type", type, "utf8")]);
}

export async function listKeys(name: StoreName): Promise<string[]> {
  try {
    if (onNetlify) return (await (await blobs(name)).list()).blobs.map((b) => b.key);
    return (await fs.readdir(localDir(name))).filter((f) => f.endsWith(".json")).map((f) => f.slice(0, -5));
  } catch {
    return [];
  }
}

export async function remove(name: StoreName, key: string): Promise<void> {
  try {
    if (onNetlify) {
      await (await blobs(name)).delete(key);
      return;
    }
    await fs.rm(path.join(localDir(name), safe(key) + ".json"), { force: true });
  } catch {
    /* ya no existe */
  }
}
