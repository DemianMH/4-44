"use client";

import { useState, type FormEvent } from "react";
import type { Content } from "@/lib/types";
import { Magnetic } from "./Magnetic";

type Status = "idle" | "sending" | "ok" | "error";

const FIELD =
  "w-full border-b-2 border-graphite/40 bg-transparent py-3 text-sm text-ink placeholder:text-graphite/60 transition-colors focus:border-orange focus:outline-none";
const LABEL = "grid gap-1 text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-graphite";

type ContactFormProps = {
  form: Content["form"];
  /** Nombres de proyectos publicados, se ofrecen como opciones de interés. */
  projects: string[];
  defaultInterest?: string;
};

/** Formulario de contacto: los mensajes llegan al panel de administración. */
export function ContactForm({ form, projects, defaultInterest }: ContactFormProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const options = [...projects.map((p) => `Proyecto: ${p}`), ...form.interests];
  const initial = defaultInterest ? `Proyecto: ${defaultInterest}` : options[0];

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const el = e.currentTarget;
    const fd = new FormData(el);
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(fd.entries())),
      });
      if (!res.ok) throw new Error(((await res.json().catch(() => ({}))) as { error?: string }).error ?? "Error");
      setStatus("ok");
      el.reset();
    } catch (err) {
      setError(err instanceof Error && err.message !== "Error" ? err.message : "No pudimos enviarlo. Inténtalo de nuevo en unos minutos.");
      setStatus("error");
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-8" aria-describedby="form-estado">
      <p hidden>
        <label>
          No llenar <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </p>
      <label className={LABEL}>
        Nombre
        <input className={FIELD} name="name" required maxLength={120} autoComplete="name" placeholder="Tu nombre" />
      </label>
      <div className="grid gap-8 sm:grid-cols-2">
        <label className={LABEL}>
          Correo
          <input className={FIELD} name="email" type="email" maxLength={160} autoComplete="email" placeholder="correo@ejemplo.com" />
        </label>
        <label className={LABEL}>
          Teléfono
          <input className={FIELD} name="phone" type="tel" maxLength={40} autoComplete="tel" placeholder="33 0000 0000" />
        </label>
      </div>
      <label className={LABEL}>
        Me interesa
        <select className={`${FIELD} bg-white`} name="interest" defaultValue={initial}>
          {options.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      </label>
      <label className={LABEL}>
        Mensaje
        <textarea className={FIELD} name="message" rows={4} required maxLength={2000} placeholder="Cuéntanos qué buscas" />
      </label>
      <p className="-mt-4 text-xs text-graphite">Déjanos al menos un correo o un teléfono para responderte.</p>
      <div className="flex flex-wrap items-center gap-6">
        <Magnetic>
          <button
            type="submit"
            disabled={status === "sending"}
            className="bg-orange px-8 py-4 text-[0.8125rem] font-bold uppercase tracking-[0.16em] text-ink transition-colors duration-500 [transition-timing-function:var(--ease)] hover:bg-ink hover:text-white disabled:opacity-60"
          >
            {status === "sending" ? "Enviando…" : form.submitLabel}
          </button>
        </Magnetic>
        <p id="form-estado" role="status" className="text-sm font-medium text-ink">
          {status === "ok" && form.successMessage}
          {status === "error" && error}
        </p>
      </div>
    </form>
  );
}
