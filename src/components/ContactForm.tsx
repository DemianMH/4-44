"use client";

import { useState, type FormEvent } from "react";
import { Magnetic } from "./Magnetic";

type Status = "idle" | "sending" | "ok" | "error";

const FIELD =
  "w-full border-b-2 border-graphite/40 bg-transparent py-3 text-sm text-ink placeholder:text-graphite/60 transition-colors focus:border-orange focus:outline-none";

/** Formulario compatible con Netlify Forms (declaración estática en public/__forms.html). */
export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const data = new URLSearchParams(new FormData(e.currentTarget) as unknown as Record<string, string>);
    try {
      const res = await fetch("/__forms.html", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: data.toString(),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("ok");
      e.currentTarget.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-8" aria-describedby="form-estado">
      <input type="hidden" name="form-name" value="contacto" />
      <p hidden>
        <label>
          No llenar <input name="bot-field" tabIndex={-1} autoComplete="off" />
        </label>
      </p>
      <label className="grid gap-1 text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-graphite">
        Nombre
        <input className={FIELD} name="nombre" required autoComplete="name" placeholder="Tu nombre" />
      </label>
      <label className="grid gap-1 text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-graphite">
        Correo
        <input className={FIELD} name="correo" type="email" required autoComplete="email" placeholder="correo@ejemplo.com" />
      </label>
      <label className="grid gap-1 text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-graphite">
        Teléfono
        <input className={FIELD} name="telefono" type="tel" autoComplete="tel" placeholder="33 0000 0000" />
      </label>
      <label className="grid gap-1 text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-graphite">
        Interés
        <select className={`${FIELD} bg-white`} name="interes" defaultValue="Casa residencial">
          <option>Casa residencial</option>
          <option>Supervisión de proyecto</option>
          <option>Renta de maquinaria</option>
          <option>Crowdfunding inmobiliario</option>
          <option>Otro</option>
        </select>
      </label>
      <label className="grid gap-1 text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-graphite">
        Mensaje
        <textarea className={FIELD} name="mensaje" rows={4} required placeholder="Cuéntanos de tu proyecto" />
      </label>
      <div className="flex flex-wrap items-center gap-6">
        <Magnetic>
          <button
            type="submit"
            disabled={status === "sending"}
            className="bg-orange px-8 py-4 text-[0.8125rem] font-bold uppercase tracking-[0.16em] text-ink transition-colors duration-500 [transition-timing-function:var(--ease)] hover:bg-ink hover:text-white disabled:opacity-60"
          >
            {status === "sending" ? "Enviando…" : "Enviar mensaje"}
          </button>
        </Magnetic>
        <p id="form-estado" role="status" className="text-sm font-medium text-ink">
          {status === "ok" && "Mensaje enviado. Te contactaremos pronto."}
          {status === "error" && "No pudimos enviarlo. Inténtalo de nuevo en unos minutos."}
        </p>
      </div>
    </form>
  );
}
