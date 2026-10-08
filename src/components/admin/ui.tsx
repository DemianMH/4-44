"use client";

import { useId, useRef, useState, type ReactNode } from "react";
import type { Img } from "@/lib/types";

export const emptyImg = (): Img => ({ src: "", w: 1600, h: 900, alt: "" });

const INPUT =
  "w-full rounded-none border border-graphite/30 bg-white px-3 py-2.5 text-sm text-ink placeholder:text-graphite/50 focus:border-orange focus:outline-none focus:ring-2 focus:ring-orange/30";

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="grid gap-1.5">
      <span className="text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-graphite">{label}</span>
      {children}
      {hint && <span className="text-xs text-graphite/80">{hint}</span>}
    </label>
  );
}

type TextProps = { label: string; value: string; onChange: (v: string) => void; hint?: string; placeholder?: string; type?: string };

export function Text({ label, value, onChange, hint, placeholder, type = "text" }: TextProps) {
  return (
    <Field label={label} hint={hint}>
      <input className={INPUT} type={type} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
    </Field>
  );
}

export function Area({ label, value, onChange, rows = 3, hint }: { label: string; value: string; onChange: (v: string) => void; rows?: number; hint?: string }) {
  return (
    <Field label={label} hint={hint}>
      <textarea className={INPUT} rows={rows} value={value} onChange={(e) => onChange(e.target.value)} />
    </Field>
  );
}

export function Toggle({ label, checked, onChange, hint }: { label: string; checked: boolean; onChange: (v: boolean) => void; hint?: string }) {
  const id = useId();
  return (
    <div className="flex items-start gap-3">
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative mt-0.5 h-6 w-11 shrink-0 transition-colors ${checked ? "bg-orange" : "bg-graphite/30"}`}
      >
        <span className={`absolute top-0.5 h-5 w-5 bg-white transition-all ${checked ? "left-[1.375rem]" : "left-0.5"}`} />
      </button>
      <label htmlFor={id} className="grid cursor-pointer gap-0.5 text-sm font-semibold text-ink">
        {label}
        {hint && <span className="text-xs font-normal text-graphite/80">{hint}</span>}
      </label>
    </div>
  );
}

export function Btn({ children, onClick, kind = "ghost", disabled, type = "button" }: { children: ReactNode; onClick?: () => void; kind?: "primary" | "ghost" | "danger"; disabled?: boolean; type?: "button" | "submit" }) {
  const styles = {
    primary: "bg-orange text-ink hover:bg-ink hover:text-white",
    ghost: "border border-graphite/40 text-ink hover:border-orange hover:text-orange-ink",
    danger: "border border-red-700/50 text-red-800 hover:bg-red-700 hover:text-white",
  }[kind];
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`px-4 py-2.5 text-[0.75rem] font-bold uppercase tracking-[0.14em] transition-colors disabled:opacity-50 ${styles}`}>
      {children}
    </button>
  );
}

/** Campo de imagen: vista previa, subida (se optimiza en el servidor) y texto alternativo. */
export function ImageField({ label, value, onChange, optional = false }: { label: string; value: Img; onChange: (v: Img) => void; optional?: boolean }) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function upload(file: File) {
    setBusy(true);
    setErr("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = (await res.json()) as Img & { error?: string };
      if (!res.ok) throw new Error(data.error ?? "No se pudo subir");
      onChange({ ...data, alt: value.alt || data.alt });
    } catch (e) {
      setErr(e instanceof Error ? e.message : "No se pudo subir");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-2">
      <span className="text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-graphite">{label}</span>
      <div className="flex gap-4">
        <div className="relative h-28 w-40 shrink-0 overflow-hidden border border-graphite/30 bg-stone">
          {value.src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value.src} alt={value.alt} className="h-full w-full object-cover" />
          ) : (
            <span className="grid h-full place-items-center px-2 text-center text-xs text-graphite">Sin imagen</span>
          )}
        </div>
        <div className="grid flex-1 content-start gap-2">
          <input className={INPUT} placeholder="Descripción de la imagen (accesibilidad y SEO)" value={value.alt} onChange={(e) => onChange({ ...value, alt: e.target.value })} />
          <div className="flex flex-wrap items-center gap-2">
            <input ref={input} type="file" accept="image/*" hidden onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
            <Btn onClick={() => input.current?.click()} disabled={busy}>
              {busy ? "Subiendo…" : value.src ? "Cambiar imagen" : "Subir imagen"}
            </Btn>
            {optional && value.src && <Btn kind="danger" onClick={() => onChange(emptyImg())}>Quitar</Btn>}
            {err && <span className="text-xs font-semibold text-red-700">{err}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Lista editable con agregar, subir/bajar y eliminar. */
export function ListEditor<T>({
  items,
  onChange,
  render,
  make,
  addLabel,
  title,
}: {
  items: T[];
  onChange: (v: T[]) => void;
  render: (item: T, set: (v: T) => void, i: number) => ReactNode;
  make: () => T;
  addLabel: string;
  title?: (item: T, i: number) => string;
}) {
  const move = (i: number, d: number) => {
    const j = i + d;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  return (
    <div className="grid gap-3">
      {items.map((it, i) => (
        <div key={i} className="grid gap-4 border border-graphite/25 bg-paper p-4">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold uppercase tracking-[0.14em] text-graphite">{title ? title(it, i) : `#${i + 1}`}</span>
            <div className="flex gap-1.5">
              <Btn onClick={() => move(i, -1)} disabled={i === 0}>↑</Btn>
              <Btn onClick={() => move(i, 1)} disabled={i === items.length - 1}>↓</Btn>
              <Btn kind="danger" onClick={() => onChange(items.filter((_, k) => k !== i))}>Eliminar</Btn>
            </div>
          </div>
          {render(it, (v) => onChange(items.map((x, k) => (k === i ? v : x))), i)}
        </div>
      ))}
      <div>
        <Btn onClick={() => onChange([...items, make()])}>+ {addLabel}</Btn>
      </div>
    </div>
  );
}

export function Card({ title, children, hint }: { title: string; children: ReactNode; hint?: string }) {
  return (
    <section className="grid gap-5 border border-graphite/25 bg-white p-5 md:p-6">
      <header>
        <h2 className="font-display text-lg font-extrabold text-ink">{title}</h2>
        {hint && <p className="mt-1 text-sm text-graphite">{hint}</p>}
      </header>
      {children}
    </section>
  );
}
