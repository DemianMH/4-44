"use client";

import { useState } from "react";
import type { Project } from "@/lib/types";
import { Area, Btn, Card, emptyImg, ImageField, ListEditor, Text, Toggle } from "./ui";

type Props = { project: Project; onChange: (p: Project) => void; onDelete: () => void; onMove: (d: number) => void; first: boolean; last: boolean };

export function ProjectEditor({ project: p, onChange, onDelete, onMove, first, last }: Props) {
  const [open, setOpen] = useState(false);
  const set = <K extends keyof Project>(k: K, v: Project[K]) => onChange({ ...p, [k]: v });

  return (
    <div className="border border-graphite/30 bg-white">
      <div className="flex flex-wrap items-center gap-3 p-4">
        <div className="relative h-14 w-20 shrink-0 overflow-hidden bg-stone">
          {p.cover.src && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={p.cover.src} alt="" className="h-full w-full object-cover" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-lg font-extrabold text-ink">{p.name || "Proyecto sin nombre"}</p>
          <p className="text-xs text-graphite">
            {p.published ? "Publicado" : "Borrador (oculto)"} · /proyectos/{p.slug}
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <Btn onClick={() => onMove(-1)} disabled={first}>↑</Btn>
          <Btn onClick={() => onMove(1)} disabled={last}>↓</Btn>
          <Btn kind={open ? "primary" : "ghost"} onClick={() => setOpen(!open)}>{open ? "Cerrar" : "Editar"}</Btn>
        </div>
      </div>

      {open && (
        <div className="grid gap-5 border-t border-graphite/25 bg-paper p-4 md:p-6">
          <Card title="Datos principales">
            <div className="grid gap-5 md:grid-cols-2">
              <Toggle label="Publicado" checked={p.published} onChange={(v) => set("published", v)} hint="Si está apagado, el proyecto no aparece en el sitio." />
              <Toggle label="Destacado" checked={p.featured} onChange={(v) => set("featured", v)} hint="Los destacados pueden usarse en la portada." />
              <Text label="Nombre" value={p.name} onChange={(v) => set("name", v)} />
              <Text label="Dirección web (slug)" value={p.slug} onChange={(v) => set("slug", v)} hint="Solo minúsculas y guiones. Se ajusta automáticamente al guardar." />
              <Text label="Estado" value={p.status} onChange={(v) => set("status", v)} placeholder="Nuevo desarrollo, Entrega inmediata…" />
              <Text label="Tipo" value={p.kind} onChange={(v) => set("kind", v)} placeholder="Departamentos, Casa…" />
              <Text label="Ubicación" value={p.location} onChange={(v) => set("location", v)} />
              <Text label="Frase corta" value={p.tagline} onChange={(v) => set("tagline", v)} />
            </div>
            <Area label="Resumen" value={p.summary} onChange={(v) => set("summary", v)} />
            <Text label="Landing del proyecto (opcional)" value={p.landingUrl} onChange={(v) => set("landingUrl", v)} placeholder="https://coronado.constructora444.com/" hint="Si lo llenas, aparecerá el botón «Ir a la landing»." />
            <ImageField label="Imagen de portada" value={p.cover} onChange={(v) => set("cover", v)} />
          </Card>

          <Card title="Datos clave" hint="Cifras que aparecen bajo el título (unidades, desde, superficie…).">
            <ListEditor
              items={p.facts}
              onChange={(v) => set("facts", v)}
              make={() => ({ label: "", value: "" })}
              addLabel="Agregar dato"
              title={(f) => f.label || "Dato"}
              render={(f, s) => (
                <div className="grid gap-4 md:grid-cols-2">
                  <Text label="Etiqueta" value={f.label} onChange={(v) => s({ ...f, label: v })} placeholder="Unidades" />
                  <Text label="Valor" value={f.value} onChange={(v) => s({ ...f, value: v })} placeholder="6" />
                </div>
              )}
            />
          </Card>

          <Card title="Galería (scroll horizontal)" hint="Renders o fotos que se recorren al hacer scroll.">
            <ListEditor
              items={p.gallery}
              onChange={(v) => set("gallery", v)}
              make={() => ({ label: "", img: emptyImg() })}
              addLabel="Agregar imagen"
              title={(g) => g.label || "Imagen"}
              render={(g, s) => (
                <div className="grid gap-4">
                  <Text label="Nombre del espacio" value={g.label} onChange={(v) => s({ ...g, label: v })} placeholder="Sala, Cocina…" />
                  <ImageField label="Imagen" value={g.img} onChange={(v) => s({ ...g, img: v })} />
                </div>
              )}
            />
          </Card>

          <Card title="Día y noche" hint="Dos tomas de la misma cámara: el scroll las revela. Déjalo apagado si no aplica.">
            <Toggle label="Mostrar esta sección" checked={!!p.facade} onChange={(v) => set("facade", v ? { title: "De día. De noche.", day: emptyImg(), night: emptyImg() } : null)} />
            {p.facade && (
              <div className="grid gap-5">
                <Text label="Título" value={p.facade.title} onChange={(v) => set("facade", { ...p.facade!, title: v })} />
                <ImageField label="Imagen de día" value={p.facade.day} onChange={(v) => set("facade", { ...p.facade!, day: v })} />
                <ImageField label="Imagen de noche" value={p.facade.night} onChange={(v) => set("facade", { ...p.facade!, night: v })} />
              </div>
            )}
          </Card>

          <Card title="Concepto y detalles" hint="Tarjetas verticales con detalles del proyecto.">
            <ListEditor
              items={p.concept}
              onChange={(v) => set("concept", v)}
              make={() => ({ title: "", img: emptyImg() })}
              addLabel="Agregar tarjeta"
              title={(c) => c.title || "Tarjeta"}
              render={(c, s) => (
                <div className="grid gap-4">
                  <Text label="Título" value={c.title} onChange={(v) => s({ ...c, title: v })} />
                  <ImageField label="Imagen" value={c.img} onChange={(v) => s({ ...c, img: v })} />
                </div>
              )}
            />
          </Card>

          <Card title="Terraza / jardín" hint="Banda a pantalla completa con parallax.">
            <Toggle label="Mostrar esta sección" checked={!!p.terrace} onChange={(v) => set("terrace", v ? { title: "Terraza en azotea.", subtitle: "", hero: emptyImg() } : null)} />
            {p.terrace && (
              <div className="grid gap-5">
                <Text label="Título" value={p.terrace.title} onChange={(v) => set("terrace", { ...p.terrace!, title: v })} />
                <Text label="Subtítulo" value={p.terrace.subtitle} onChange={(v) => set("terrace", { ...p.terrace!, subtitle: v })} />
                <ImageField label="Imagen principal" value={p.terrace.hero} onChange={(v) => set("terrace", { ...p.terrace!, hero: v })} />
                <ImageField label="Imagen pequeña (opcional)" optional value={p.terrace.card ?? emptyImg()} onChange={(v) => set("terrace", { ...p.terrace!, card: v.src ? v : undefined })} />
              </div>
            )}
          </Card>

          <Card title="Recorrido virtual" hint="Plantas, modelos o espacios que se exploran con perspectiva 3D. Sin paradas, la sección no aparece.">
            <Text label="Título" value={p.tour.title} onChange={(v) => set("tour", { ...p.tour, title: v })} />
            <ListEditor
              items={p.tour.stops}
              onChange={(v) => set("tour", { ...p.tour, stops: v })}
              make={() => ({ name: "", img: emptyImg() })}
              addLabel="Agregar parada"
              title={(s) => s.name || "Parada"}
              render={(s, st) => (
                <div className="grid gap-4">
                  <Text label="Nombre" value={s.name} onChange={(v) => st({ ...s, name: v })} placeholder="Modelo 46 m²" />
                  <ImageField label="Imagen" value={s.img} onChange={(v) => st({ ...s, img: v })} />
                </div>
              )}
            />
          </Card>

          <div className="flex justify-end">
            <Btn
              kind="danger"
              onClick={() => {
                if (window.confirm(`¿Eliminar «${p.name}»? Esta acción se aplica al guardar.`)) onDelete();
              }}
            >
              Eliminar proyecto
            </Btn>
          </div>
        </div>
      )}
    </div>
  );
}
