"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import type { Content, Lead, Project } from "@/lib/types";
import { ProjectEditor } from "./ProjectEditor";
import { Area, Btn, Card, emptyImg, ImageField, ListEditor, Text } from "./ui";

type Session = { configured: boolean; authenticated: boolean };
type Tab = "general" | "proyectos" | "entregados" | "preguntas" | "mensajes";

const TABS: { id: Tab; label: string }[] = [
  { id: "general", label: "General y formulario" },
  { id: "proyectos", label: "Proyectos" },
  { id: "entregados", label: "Obra entregada" },
  { id: "preguntas", label: "Preguntas frecuentes" },
  { id: "mensajes", label: "Mensajes" },
];

const rid = (p: string) => `${p}-${Math.random().toString(36).slice(2, 8)}`;

const newProject = (): Project => ({
  id: rid("p"),
  slug: "",
  published: false,
  featured: true,
  name: "Nuevo proyecto",
  status: "Nuevo desarrollo",
  kind: "",
  location: "Guadalajara, Jalisco",
  tagline: "",
  summary: "",
  landingUrl: "",
  facts: [],
  cover: emptyImg(),
  gallery: [],
  facade: null,
  concept: [],
  terrace: null,
  tour: { title: "Recorrido virtual", stops: [] },
});

export function AdminApp() {
  const [session, setSession] = useState<Session | null>(null);
  const [content, setContent] = useState<Content | null>(null);
  const [tab, setTab] = useState<Tab>("general");
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ ok: boolean; text: string } | null>(null);

  const loadContent = useCallback(async () => {
    const res = await fetch("/api/admin/content");
    if (res.ok) setContent((await res.json()) as Content);
  }, []);

  useEffect(() => {
    let alive = true;
    fetch("/api/admin/session")
      .then((r) => r.json() as Promise<Session>)
      .then(async (s) => {
        if (!alive) return;
        setSession(s);
        if (s.authenticated) await loadContent();
      })
      .catch(() => alive && setSession({ configured: true, authenticated: false }));
    return () => {
      alive = false;
    };
  }, [loadContent]);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const edit = (fn: (c: Content) => Content) => {
    setContent((c) => (c ? fn(c) : c));
    setDirty(true);
  };

  async function save() {
    if (!content) return;
    setSaving(true);
    setToast(null);
    try {
      const res = await fetch("/api/admin/content", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(content) });
      if (!res.ok) throw new Error(((await res.json().catch(() => ({}))) as { error?: string }).error ?? "No se pudo guardar");
      setContent((await res.json()) as Content);
      setDirty(false);
      setToast({ ok: true, text: "Cambios guardados. El sitio ya los muestra." });
    } catch (e) {
      setToast({ ok: false, text: e instanceof Error ? e.message : "No se pudo guardar" });
    } finally {
      setSaving(false);
    }
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setContent(null);
    setSession((s) => (s ? { ...s, authenticated: false } : s));
  }

  if (!session) return <p className="p-10 text-graphite">Cargando…</p>;
  if (!session.configured) return <Setup />;
  if (!session.authenticated)
    return (
      <Login
        onDone={async () => {
          setSession({ configured: true, authenticated: true });
          await loadContent();
        }}
      />
    );
  if (!content) return <p className="p-10 text-graphite">Cargando contenido…</p>;

  return (
    <div className="min-h-svh bg-stone text-ink">
      <header className="sticky top-0 z-30 border-b border-graphite/30 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-[80rem] flex-wrap items-center gap-3 px-4 py-3">
          <p className="font-display text-lg font-extrabold">
            Panel <span className="text-orange-strong">4:44</span>
          </p>
          <div className="ml-auto flex flex-wrap items-center gap-2">
            {dirty && <span className="text-xs font-bold uppercase tracking-[0.14em] text-orange-ink">Cambios sin guardar</span>}
            <Btn kind="primary" onClick={save} disabled={saving || !dirty}>{saving ? "Guardando…" : "Guardar cambios"}</Btn>
            <a href="/" target="_blank" rel="noopener" className="border border-graphite/40 px-4 py-2.5 text-[0.75rem] font-bold uppercase tracking-[0.14em] hover:border-orange hover:text-orange-ink">Ver sitio ↗</a>
            <Btn onClick={logout}>Salir</Btn>
          </div>
        </div>
        <nav aria-label="Secciones del panel" className="mx-auto flex max-w-[80rem] gap-1 overflow-x-auto px-4">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              aria-current={tab === t.id}
              className={`whitespace-nowrap border-b-4 px-4 py-3 text-[0.8125rem] font-bold uppercase tracking-[0.12em] transition-colors ${tab === t.id ? "border-orange text-ink" : "border-transparent text-graphite hover:text-ink"}`}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </header>

      {toast && (
        <div role="status" className={`mx-auto mt-4 max-w-[80rem] px-4 text-sm font-semibold ${toast.ok ? "text-green-800" : "text-red-700"}`}>
          {toast.text}
        </div>
      )}

      <main className="mx-auto grid max-w-[80rem] gap-6 px-4 py-6">
        {tab === "general" && <General content={content} edit={edit} />}
        {tab === "proyectos" && <Projects content={content} edit={edit} />}
        {tab === "entregados" && <Delivered content={content} edit={edit} />}
        {tab === "preguntas" && <Faq content={content} edit={edit} />}
        {tab === "mensajes" && <Messages />}
      </main>
    </div>
  );
}

type EditProps = { content: Content; edit: (fn: (c: Content) => Content) => void };

function General({ content: c, edit }: EditProps) {
  const co = (k: keyof Content["company"]) => (v: string) => edit((x) => ({ ...x, company: { ...x.company, [k]: v } }));
  const hero = (k: "eyebrow" | "projectSlug" | "cta1" | "cta2") => (v: string) => edit((x) => ({ ...x, hero: { ...x.hero, [k]: v } }));
  const lines = [0, 1, 2].map((i) => c.hero.lines[i] ?? "");
  const setLine = (i: number, v: string) => edit((x) => ({ ...x, hero: { ...x.hero, lines: [0, 1, 2].map((k) => (k === i ? v : (x.hero.lines[k] ?? ""))).filter((s, k, a) => s || a.slice(k).some(Boolean)) } }));
  const form = (k: "title" | "submitLabel" | "successMessage") => (v: string) => edit((x) => ({ ...x, form: { ...x.form, [k]: v } }));

  return (
    <>
      <Card title="Datos de la empresa" hint="Se muestran en contacto y pie de página. Lo que dejes vacío no se muestra.">
        <div className="grid gap-5 md:grid-cols-2">
          <Text label="Nombre" value={c.company.name} onChange={co("name")} />
          <Text label="Lema" value={c.company.tagline} onChange={co("tagline")} />
          <Text label="Teléfono" value={c.company.phone} onChange={co("phone")} placeholder="+52 33 0000 0000" />
          <Text label="WhatsApp (solo números con lada)" value={c.company.whatsapp} onChange={co("whatsapp")} placeholder="523344941579" />
          <Text label="Correo" value={c.company.email} onChange={co("email")} />
          <Text label="Instagram (usuario)" value={c.company.instagram} onChange={co("instagram")} />
          <Text label="Facebook (enlace)" value={c.company.facebook} onChange={co("facebook")} />
          <Text label="Dirección" value={c.company.address} onChange={co("address")} />
        </div>
      </Card>

      <Card title="Portada del inicio">
        <div className="grid gap-5 md:grid-cols-2">
          <Text label="Texto superior" value={c.hero.eyebrow} onChange={hero("eyebrow")} />
          <Field2 label="Proyecto que da fondo a la portada">
            <select className="w-full border border-graphite/30 bg-white px-3 py-2.5 text-sm" value={c.hero.projectSlug} onChange={(e) => hero("projectSlug")(e.target.value)}>
              {c.projects.map((p) => (
                <option key={p.id} value={p.slug}>{p.name}{p.published ? "" : " (borrador)"}</option>
              ))}
            </select>
          </Field2>
          {lines.map((l, i) => (
            <Text key={i} label={`Título, línea ${i + 1}`} value={l} onChange={(v) => setLine(i, v)} />
          ))}
          <Text label="Botón principal" value={c.hero.cta1} onChange={hero("cta1")} />
          <Text label="Botón secundario" value={c.hero.cta2} onChange={hero("cta2")} />
        </div>
      </Card>

      <Card title="Servicios" hint="Aparecen en la sección «Constructora» y en la cinta del inicio.">
        <ListEditor
          items={c.services}
          onChange={(v) => edit((x) => ({ ...x, services: v }))}
          make={() => ({ id: rid("s"), title: "", short: "" })}
          addLabel="Agregar servicio"
          title={(s) => s.title || "Servicio"}
          render={(s, set) => (
            <div className="grid gap-4 md:grid-cols-2">
              <Text label="Título" value={s.title} onChange={(v) => set({ ...s, title: v })} />
              <Text label="Descripción corta" value={s.short} onChange={(v) => set({ ...s, short: v })} />
            </div>
          )}
        />
      </Card>

      <Card title="Formulario de contacto" hint="Los mensajes llegan a la pestaña «Mensajes».">
        <div className="grid gap-5 md:grid-cols-2">
          <Text label="Título junto al formulario" value={c.form.title} onChange={form("title")} />
          <Text label="Texto del botón" value={c.form.submitLabel} onChange={form("submitLabel")} />
        </div>
        <Text label="Mensaje al enviar correctamente" value={c.form.successMessage} onChange={form("successMessage")} />
        <p className="text-sm font-semibold text-ink">Opciones de «Me interesa» (además de cada proyecto publicado)</p>
        <ListEditor
          items={c.form.interests}
          onChange={(v) => edit((x) => ({ ...x, form: { ...x.form, interests: v } }))}
          make={() => ""}
          addLabel="Agregar opción"
          title={(s) => s || "Opción"}
          render={(s, set) => <Text label="Texto" value={s} onChange={set} />}
        />
      </Card>
    </>
  );
}

function Field2({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-1.5">
      <span className="text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-graphite">{label}</span>
      {children}
    </label>
  );
}

function Projects({ content: c, edit }: EditProps) {
  const setAll = (projects: Project[]) => edit((x) => ({ ...x, projects }));
  return (
    <>
      <p className="text-sm text-graphite">
        Cada proyecto tiene su propia página con galería, día/noche, recorrido virtual y más. Los nuevos nacen como <strong>borrador</strong>: actívalos con «Publicado» cuando estén listos.
      </p>
      {c.projects.map((p, i) => (
        <ProjectEditor
          key={p.id}
          project={p}
          first={i === 0}
          last={i === c.projects.length - 1}
          onChange={(np) => setAll(c.projects.map((x) => (x.id === p.id ? np : x)))}
          onDelete={() => setAll(c.projects.filter((x) => x.id !== p.id))}
          onMove={(d) => {
            const j = i + d;
            if (j < 0 || j >= c.projects.length) return;
            const next = [...c.projects];
            [next[i], next[j]] = [next[j], next[i]];
            setAll(next);
          }}
        />
      ))}
      <div>
        <Btn kind="primary" onClick={() => setAll([...c.projects, newProject()])}>+ Nuevo proyecto</Btn>
      </div>
    </>
  );
}

function Delivered({ content: c, edit }: EditProps) {
  return (
    <Card title="Obra entregada" hint="Portafolio de proyectos terminados (fotos de obra).">
      <ListEditor
        items={c.portfolio}
        onChange={(v) => edit((x) => ({ ...x, portfolio: v }))}
        make={() => ({ id: rid("e"), name: "", type: "", tag: "", img: emptyImg() })}
        addLabel="Agregar obra"
        title={(p) => p.name || "Obra"}
        render={(p, set) => (
          <div className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-3">
              <Text label="Nombre" value={p.name} onChange={(v) => set({ ...p, name: v })} />
              <Text label="Etiqueta" value={p.type} onChange={(v) => set({ ...p, type: v })} placeholder="Casa, Edificio…" />
              <Text label="Descripción corta" value={p.tag} onChange={(v) => set({ ...p, tag: v })} />
            </div>
            <ImageField label="Foto" value={p.img} onChange={(v) => set({ ...p, img: v })} />
          </div>
        )}
      />
    </Card>
  );
}

function Faq({ content: c, edit }: EditProps) {
  return (
    <Card title="Preguntas frecuentes" hint="También se publican para buscadores (resultados enriquecidos de Google).">
      <ListEditor
        items={c.faq}
        onChange={(v) => edit((x) => ({ ...x, faq: v }))}
        make={() => ({ id: rid("f"), q: "", a: "" })}
        addLabel="Agregar pregunta"
        title={(f) => f.q || "Pregunta"}
        render={(f, set) => (
          <div className="grid gap-4">
            <Text label="Pregunta" value={f.q} onChange={(v) => set({ ...f, q: v })} />
            <Area label="Respuesta" value={f.a} onChange={(v) => set({ ...f, a: v })} rows={3} />
          </div>
        )}
      />
    </Card>
  );
}

function Messages() {
  const [leads, setLeads] = useState<Lead[] | null>(null);
  const load = useCallback(async () => {
    const r = await fetch("/api/admin/leads");
    setLeads(r.ok ? ((await r.json()) as Lead[]) : []);
  }, []);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  const csv = () => {
    const esc = (s: string) => `"${s.replace(/"/g, '""')}"`;
    const rows = [["Fecha", "Nombre", "Correo", "Teléfono", "Interés", "Mensaje"], ...(leads ?? []).map((l) => [l.createdAt, l.name, l.email, l.phone, l.interest, l.message])];
    const blob = new Blob(["﻿" + rows.map((r) => r.map(esc).join(",")).join("\n")], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "mensajes-constructora-444.csv";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <Card title="Mensajes recibidos" hint="Enviados desde el formulario del sitio.">
      <div className="flex gap-2">
        <Btn onClick={load}>Actualizar</Btn>
        <Btn onClick={csv} disabled={!leads?.length}>Descargar CSV</Btn>
      </div>
      {leads === null && <p className="text-sm text-graphite">Cargando…</p>}
      {leads && leads.length === 0 && <p className="text-sm text-graphite">Aún no hay mensajes.</p>}
      <ul className="grid gap-3">
        {leads?.map((l) => (
          <li key={l.id} className="grid gap-2 border border-graphite/25 bg-paper p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-display text-base font-extrabold">{l.name}</p>
              <p className="text-xs text-graphite">{new Date(l.createdAt).toLocaleString("es-MX")}</p>
            </div>
            <p className="text-sm">
              {l.email && <a className="underline" href={`mailto:${l.email}`}>{l.email}</a>}
              {l.email && l.phone && " · "}
              {l.phone && <a className="underline" href={`tel:${l.phone}`}>{l.phone}</a>}
            </p>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-orange-ink">{l.interest}</p>
            <p className="whitespace-pre-wrap text-sm">{l.message}</p>
            <div>
              <Btn
                kind="danger"
                onClick={async () => {
                  if (!window.confirm("¿Eliminar este mensaje?")) return;
                  await fetch(`/api/admin/leads?id=${encodeURIComponent(l.id)}`, { method: "DELETE" });
                  await load();
                }}
              >
                Eliminar
              </Btn>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function Login({ onDone }: { onDone: () => void | Promise<void> }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    const res = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: pw }) });
    if (res.ok) await onDone();
    else setErr(((await res.json().catch(() => ({}))) as { error?: string }).error ?? "No se pudo entrar");
    setBusy(false);
  }

  return (
    <div className="grid min-h-svh place-items-center bg-stone p-4">
      <form onSubmit={submit} className="grid w-full max-w-sm gap-5 border border-graphite/30 bg-white p-8">
        <p className="font-display text-2xl font-extrabold">
          Panel <span className="text-orange-strong">4:44</span>
        </p>
        <Text label="Contraseña" type="password" value={pw} onChange={setPw} />
        {err && <p role="alert" className="text-sm font-semibold text-red-700">{err}</p>}
        <Btn kind="primary" type="submit" disabled={busy || !pw}>{busy ? "Entrando…" : "Entrar"}</Btn>
      </form>
    </div>
  );
}

function Setup() {
  return (
    <div className="grid min-h-svh place-items-center bg-stone p-4">
      <div className="grid w-full max-w-xl gap-4 border border-graphite/30 bg-white p-8">
        <p className="font-display text-2xl font-extrabold">Falta activar el panel</p>
        <p className="text-sm leading-relaxed text-graphite">
          Define la variable de entorno <code className="bg-stone px-1">ADMIN_PASSWORD</code> con la contraseña que quieras usar:
        </p>
        <ol className="list-decimal space-y-1 pl-5 text-sm text-ink">
          <li>En Netlify: Site configuration → Environment variables → Add a variable.</li>
          <li>Nombre: <code className="bg-stone px-1">ADMIN_PASSWORD</code>, valor: tu contraseña (larga y única).</li>
          <li>Vuelve a desplegar el sitio y recarga esta página.</li>
        </ol>
      </div>
    </div>
  );
}
