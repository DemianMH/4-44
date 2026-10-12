"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useLoader, useThree, type ThreeEvent } from "@react-three/fiber";
import { Html, OrbitControls, useProgress } from "@react-three/drei";
import * as THREE from "three";
import type { Item, Layout } from "@/lib/layouts";
import { lockScroll } from "@/lib/scroll";

const WALL_T = 0.14; // grosor de muro (m)
const WALL_H = 2.6; // altura de muro en el recorrido (m)
const CUT_H = 1.15; // altura de muro en la vista aérea (corte)
const EYE = 1.6;
const RADIUS = 0.24;

type Mode = "orbit" | "walk";
type Box = { x0: number; x1: number; z0: number; z1: number };
type Hover = { item: Item } | null;

type Dims = { W: number; H: number };
const world = (d: Dims, fx: number, fy: number): [number, number] => [(fx - 0.5) * d.W, (fy - 0.5) * d.H];

function setupTexture(tex: THREE.Texture, maxAniso: number) {
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = Math.min(8, maxAniso);
  tex.needsUpdate = true;
}

function setCameraMode(camera: THREE.Camera, mode: "walk" | "orbit") {
  camera.rotation.order = mode === "walk" ? "YXZ" : "XYZ";
  camera.up.set(0, 1, 0);
  if (camera instanceof THREE.PerspectiveCamera) {
    camera.fov = mode === "walk" ? 72 : 42;
    camera.updateProjectionMatrix();
  }
}

/* ---------------------------------- Escena ---------------------------------- */

function Floor({ tex, d, onPick, onDive, walk }: { tex: THREE.Texture; d: Dims; onPick: (x: number, z: number) => void; onDive: (x: number, z: number) => void; walk: boolean }) {
  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      onClick={(e) => {
        if (walk && e.delta < 6) {
          e.stopPropagation();
          onPick(e.point.x, e.point.z);
        }
      }}
      onDoubleClick={(e) => {
        if (!walk) {
          e.stopPropagation();
          onDive(e.point.x, e.point.z);
        }
      }}
    >
      <planeGeometry args={[d.W, d.H]} />
      <meshBasicMaterial map={tex} toneMapped={false} />
    </mesh>
  );
}

function Walls({ layout, d, tall }: { layout: Layout; d: Dims; tall: boolean }) {
  const group = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    const g = group.current;
    if (!g) return;
    const target = tall ? WALL_H : CUT_H;
    g.scale.y += (target - g.scale.y) * (1 - Math.exp(-dt * 5));
  });

  const segs = useMemo(() => {
    const conv = (w: [number, number, number, number]) => {
      const [x1, z1] = world(d, w[0], w[1]);
      const [x2, z2] = world(d, w[2], w[3]);
      const len = Math.hypot(x2 - x1, z2 - z1) + WALL_T;
      return { cx: (x1 + x2) / 2, cz: (z1 + z2) / 2, len, ang: -Math.atan2(z2 - z1, x2 - x1) };
    };
    return { walls: layout.walls.map(conv), low: (layout.low ?? []).map(conv) };
  }, [layout, d]);

  return (
    <>
      <group ref={group} scale={[1, CUT_H, 1]}>
        {segs.walls.map((s, i) => (
          <mesh key={i} position={[s.cx, 0.5, s.cz]} rotation={[0, s.ang, 0]}>
            <boxGeometry args={[s.len, 1, WALL_T]} />
            <meshStandardMaterial color="#ece6dc" roughness={0.95} />
          </mesh>
        ))}
      </group>
      {segs.low.map((s, i) => (
        <mesh key={`l${i}`} position={[s.cx, 0.55, s.cz]} rotation={[0, s.ang, 0]}>
          <boxGeometry args={[s.len, 1.1, WALL_T * 0.6]} />
          <meshStandardMaterial color="#9aa0a3" roughness={0.6} transparent opacity={0.55} />
        </mesh>
      ))}
    </>
  );
}

type FurnitureProps = {
  item: Item;
  tex: THREE.Texture;
  d: Dims;
  active: boolean;
  onHover: (item: Item | null) => void;
  onSelect: (item: Item) => void;
  moveTip: (x: number, y: number) => void;
};

function Furniture({ item, tex, d, active, onHover, onSelect, moveTip }: FurnitureProps) {
  const [px, pz] = world(d, item.x, item.y);
  const dw = item.w * d.W;
  const dh = item.h * d.H;
  const r = Math.min(dw, dh) / 2;

  // La cara superior reutiliza el recorte exacto de la planta, así se conserva el render original
  const top = useMemo(() => {
    const t = tex.clone();
    t.repeat.set(item.w, item.h);
    t.offset.set(item.x - item.w / 2, 1 - (item.y + item.h / 2));
    t.needsUpdate = true;
    return t;
  }, [tex, item.w, item.h, item.x, item.y]);
  useEffect(() => () => top.dispose(), [top]);

  const body = useRef<THREE.MeshStandardMaterial>(null);
  const cap = useRef<THREE.MeshBasicMaterial>(null);
  useEffect(() => {
    body.current?.emissive.set(active ? "#f57e25" : "#000000");
    if (body.current) body.current.emissiveIntensity = active ? 0.55 : 0;
    cap.current?.color.set(active ? "#ffcfa6" : "#ffffff");
  }, [active]);

  return (
    <group
      position={[px, 0, pz]}
      onPointerOver={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        onHover(item);
        moveTip(e.nativeEvent.clientX, e.nativeEvent.clientY);
        document.body.style.cursor = "pointer";
      }}
      onPointerMove={(e: ThreeEvent<PointerEvent>) => moveTip(e.nativeEvent.clientX, e.nativeEvent.clientY)}
      onPointerOut={() => {
        onHover(null);
        document.body.style.cursor = "";
      }}
      onClick={(e: ThreeEvent<MouseEvent>) => {
        if (e.delta < 6) {
          e.stopPropagation();
          onSelect(item);
        }
      }}
    >
      <mesh position={[0, item.z / 2, 0]}>
        {item.round ? <cylinderGeometry args={[r, r, item.z, 40]} /> : <boxGeometry args={[dw, item.z, dh]} />}
        <meshStandardMaterial ref={body} color={item.color} roughness={0.8} />
      </mesh>
      <mesh position={[0, item.z + 0.004, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        {item.round ? <circleGeometry args={[r, 40]} /> : <planeGeometry args={[dw, dh]} />}
        <meshBasicMaterial ref={cap} map={top} toneMapped={false} />
      </mesh>
    </group>
  );
}

/* -------------------------------- Recorrido 1ª persona -------------------------------- */

export type WalkApi = {
  goTo: (x: number, z: number, faceX?: number, faceZ?: number) => void;
  walkTo: (x: number, z: number) => void;
  setPos: (x: number, z: number, faceX?: number, faceZ?: number) => void;
};
type Held = { f: boolean; b: boolean; l: boolean; r: boolean };

type WalkProps = { active: boolean; boxes: Box[]; limit: { x: number; z: number }; start: [number, number]; apiRef: React.MutableRefObject<WalkApi | null>; held: React.MutableRefObject<Held>; onUserInput: () => void };

function WalkRig({ active, boxes, limit, start, apiRef, held, onUserInput }: WalkProps) {
  const get = useThree((s) => s.get);
  const gl = useThree((s) => s.gl);
  const st = useRef({ x: start[0], z: start[1], yaw: Math.PI, pitch: 0, keys: new Set<string>(), target: null as null | { x: number; z: number }, tween: null as null | { fx: number; fz: number; tx: number; tz: number; t: number; yaw0: number; yaw1: number; p0: number } });

  const blocked = useCallback(
    (x: number, z: number) => {
      if (Math.abs(x) > limit.x || Math.abs(z) > limit.z) return true;
      return boxes.some((b) => x > b.x0 - RADIUS && x < b.x1 + RADIUS && z > b.z0 - RADIUS && z < b.z1 + RADIUS);
    },
    [boxes, limit],
  );

  useEffect(() => {
    apiRef.current = {
      setPos: (x, z, faceX = 0, faceZ = 0) => {
        st.current.x = x;
        st.current.z = z;
        st.current.yaw = Math.atan2(x - faceX, z - faceZ); // de cara al punto de interés
        st.current.pitch = -0.3;
        st.current.target = null;
        st.current.tween = null;
      },
      walkTo: (x, z) => {
        st.current.tween = null;
        st.current.target = { x, z };
      },
      goTo: (x, z, faceX, faceZ) => {
        const s = st.current;
        const yaw1 = faceX === undefined || faceZ === undefined ? s.yaw : Math.atan2(-(faceX - x), -(faceZ - z));
        let yaw0 = s.yaw;
        while (yaw1 - yaw0 > Math.PI) yaw0 += Math.PI * 2;
        while (yaw1 - yaw0 < -Math.PI) yaw0 -= Math.PI * 2;
        s.target = null;
        s.tween = { fx: s.x, fz: s.z, tx: x, tz: z, t: 0, yaw0, yaw1, p0: s.pitch };
      },
    };
  }, [apiRef]);

  // Teclado
  useEffect(() => {
    if (!active) return;
    const down = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (["w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright", "shift"].includes(k)) {
        st.current.keys.add(k);
        st.current.tween = null;
        st.current.target = null;
        onUserInput();
        if (k.startsWith("arrow")) e.preventDefault();
      }
    };
    const keys = st.current.keys;
    const up = (e: KeyboardEvent) => keys.delete(e.key.toLowerCase());
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      keys.clear();
    };
  }, [active, onUserInput]);

  // Arrastrar para mirar (mouse y táctil)
  useEffect(() => {
    if (!active) return;
    const el = gl.domElement;
    let last: { x: number; y: number } | null = null;
    const down = (e: PointerEvent) => {
      last = { x: e.clientX, y: e.clientY };
    };
    const move = (e: PointerEvent) => {
      if (!last || !(e.buttons & 1 || e.pointerType === "touch")) return;
      const dx = e.clientX - last.x;
      const dy = e.clientY - last.y;
      last = { x: e.clientX, y: e.clientY };
      if (Math.abs(dx) + Math.abs(dy) > 0) onUserInput();
      st.current.yaw -= dx * 0.004;
      st.current.pitch = THREE.MathUtils.clamp(st.current.pitch - dy * 0.003, -1.1, 1.1);
    };
    const end = () => {
      last = null;
    };
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    window.addEventListener("pointerup", end);
    return () => {
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", end);
    };
  }, [active, gl, onUserInput]);

  // Al entrar en este modo, la cámara toma la posición del caminante
  useEffect(() => {
    if (active) setCameraMode(get().camera, "walk");
  }, [active, get]);

  useFrame((state, dt) => {
    if (!active) return;
    const camera = state.camera;
    const s = st.current;
    const k = s.keys;
    const h = held.current;
    const sprint = k.has("shift") ? 1.9 : 1;

    if (s.tween) {
      s.tween.t = Math.min(1, s.tween.t + dt / 1.1);
      const e = 1 - Math.pow(1 - s.tween.t, 3);
      s.x = s.tween.fx + (s.tween.tx - s.tween.fx) * e;
      s.z = s.tween.fz + (s.tween.tz - s.tween.fz) * e;
      s.yaw = s.tween.yaw0 + (s.tween.yaw1 - s.tween.yaw0) * e;
      s.pitch = s.tween.p0 + (-0.3 - s.tween.p0) * e;
      if (s.tween.t >= 1) s.tween = null;
    } else {
      const fwd = (k.has("w") || k.has("arrowup") || h.f ? 1 : 0) - (k.has("s") || k.has("arrowdown") || h.b ? 1 : 0);
      const turn = (k.has("arrowleft") || h.l ? 1 : 0) - (k.has("arrowright") || h.r ? 1 : 0);
      const strafe = (k.has("d") ? 1 : 0) - (k.has("a") ? 1 : 0);
      s.yaw += turn * dt * 1.8;
      let vx = 0;
      let vz = 0;
      if (fwd || strafe) {
        const sp = 1.9 * sprint * dt;
        vx = (-Math.sin(s.yaw) * fwd + Math.cos(s.yaw) * strafe) * sp;
        vz = (-Math.cos(s.yaw) * fwd - Math.sin(s.yaw) * strafe) * sp;
      } else if (s.target) {
        const dx = s.target.x - s.x;
        const dz = s.target.z - s.z;
        const dist = Math.hypot(dx, dz);
        if (dist < 0.08) s.target = null;
        else {
          const sp = Math.min(2.4 * dt, dist);
          vx = (dx / dist) * sp;
          vz = (dz / dist) * sp;
          const diff = ((Math.atan2(-dx, -dz) - s.yaw + Math.PI * 3) % (Math.PI * 2)) - Math.PI; // gira hacia donde camina
          s.yaw += diff * Math.min(1, dt * 4);
        }
      }
      // Colisión con deslizamiento por eje
      if (vx && !blocked(s.x + vx, s.z)) s.x += vx;
      else if (vx && s.target) s.target = null;
      if (vz && !blocked(s.x, s.z + vz)) s.z += vz;
      else if (vz && s.target) s.target = null;
    }

    camera.position.set(s.x, EYE + Math.sin(performance.now() / 380) * (k.size || s.target ? 0.012 : 0), s.z);
    camera.rotation.set(s.pitch, s.yaw, 0);
  });

  return null;
}

/* ---------------------------------- Contenedor ---------------------------------- */

function Loader() {
  const { active, progress } = useProgress();
  if (!active) return null;
  return (
    <div className="pointer-events-none absolute inset-0 z-10 grid place-items-center bg-ink/80 text-white">
      <p className="text-[0.75rem] font-bold uppercase tracking-[0.24em]">Cargando entorno · {Math.round(progress)}%</p>
    </div>
  );
}

function Scene({ layout, planSrc, aspect, mode, hovered, selectedId, setHover, setSelect, moveTip, apiRef, held, onUserInput, onDive }: {
  layout: Layout;
  planSrc: string;
  aspect: number;
  mode: Mode;
  hovered: string | null;
  selectedId: string | null;
  setHover: (i: Item | null) => void;
  setSelect: (i: Item | null) => void;
  moveTip: (x: number, y: number) => void;
  apiRef: React.MutableRefObject<WalkApi | null>;
  held: React.MutableRefObject<Held>;
  onUserInput: () => void;
  onDive: (x: number, z: number) => void;
}) {
  const tex = useLoader(THREE.TextureLoader, planSrc);
  const gl = useThree((s) => s.gl);
  useEffect(() => {
    setupTexture(tex, gl.capabilities.getMaxAnisotropy());
  }, [tex, gl]);

  const d: Dims = useMemo(() => ({ W: layout.widthM, H: layout.widthM * aspect }), [layout, aspect]);
  const walk = mode === "walk";

  const boxes = useMemo<Box[]>(() => {
    const out: Box[] = [];
    for (const w of layout.walls) {
      const [x1, z1] = world(d, w[0], w[1]);
      const [x2, z2] = world(d, w[2], w[3]);
      out.push({ x0: Math.min(x1, x2) - WALL_T / 2, x1: Math.max(x1, x2) + WALL_T / 2, z0: Math.min(z1, z2) - WALL_T / 2, z1: Math.max(z1, z2) + WALL_T / 2 });
    }
    for (const w of layout.low ?? []) {
      const [x1, z1] = world(d, w[0], w[1]);
      const [x2, z2] = world(d, w[2], w[3]);
      out.push({ x0: Math.min(x1, x2) - 0.05, x1: Math.max(x1, x2) + 0.05, z0: Math.min(z1, z2) - 0.05, z1: Math.max(z1, z2) + 0.05 });
    }
    for (const it of layout.items) {
      if (!it.block) continue;
      const [cx, cz] = world(d, it.x, it.y);
      out.push({ x0: cx - (it.w * d.W) / 2, x1: cx + (it.w * d.W) / 2, z0: cz - (it.h * d.H) / 2, z1: cz + (it.h * d.H) / 2 });
    }
    return out;
  }, [layout, d]);

  const start = useMemo(() => world(d, layout.start[0], layout.start[1]), [d, layout]);
  const limit = useMemo(() => ({ x: d.W / 2 - 0.1, z: d.H / 2 - 0.1 }), [d]);
  const outdoor = layout.id === "terraza";
  const controls = useRef<React.ComponentRef<typeof OrbitControls>>(null);
  const get = useThree((s) => s.get);

  // Vista aérea inicial / al volver desde el recorrido
  useEffect(() => {
    if (mode !== "orbit") return;
    const camera = get().camera;
    setCameraMode(camera, "orbit");
    // En pantallas verticales la cámara se aleja para que quepa toda la planta
    const size = get().size;
    const far = Math.max(1, 1.05 / (size.width / size.height));
    const m = Math.max(d.W, d.H) * far;
    camera.position.set(0, m * 1.02, m * 0.62);
    camera.lookAt(0, 0, 0);
    controls.current?.target.set(0, 0, 0);
    controls.current?.update();
  }, [mode, get, d]);

  return (
    <>
      <color attach="background" args={[outdoor ? "#cdd6da" : "#1b1d1e"]} />
      <ambientLight intensity={1.15} />
      <hemisphereLight args={["#ffffff", "#8c8579", 0.7]} />
      <directionalLight position={[3, 8, 4]} intensity={0.9} />

      <Floor tex={tex} d={d} walk={walk} onPick={(x, z) => apiRef.current?.walkTo(x, z)} onDive={onDive} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.03, 0]}>
        <planeGeometry args={[d.W * 4, d.H * 4]} />
        <meshBasicMaterial color={outdoor ? "#bfc8cc" : "#222426"} />
      </mesh>
      {!outdoor && walk && (
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, WALL_H + 0.01, 0]}>
          <planeGeometry args={[d.W + 0.4, d.H + 0.4]} />
          <meshBasicMaterial color="#efeae2" />
        </mesh>
      )}

      <Walls layout={layout} d={d} tall={walk} />
      {layout.items.map((it) => (
        <Furniture key={it.id} item={it} tex={tex} d={d} active={hovered === it.id || selectedId === it.id} onHover={setHover} onSelect={setSelect} moveTip={moveTip} />
      ))}

      {/* Puntos de interés visibles en la vista aérea */}
      {!walk &&
        layout.items
          .filter((i) => !i.part)
          .map((it) => {
            const [x, z] = world(d, it.x, it.y);
            return (
              <Html key={`pin-${it.id}`} position={[x, it.z + 0.25, z]} center zIndexRange={[20, 0]} style={{ pointerEvents: "none" }}>
                <span className="block h-2.5 w-2.5 rounded-full bg-orange shadow-[0_0_0_4px_rgba(245,126,37,0.35)]" />
              </Html>
            );
          })}

      <OrbitControls ref={controls} makeDefault enabled={!walk} enableDamping dampingFactor={0.08} maxPolarAngle={Math.PI / 2.08} minDistance={1.5} maxDistance={d.W * 2.2} zoomSpeed={0.8} />
      <WalkRig active={walk} boxes={boxes} limit={limit} start={start} apiRef={apiRef} held={held} onUserInput={onUserInput} />
    </>
  );
}

type Props = { layout: Layout; planSrc: string; planW: number; planH: number; title: string; onClose: () => void };

/** Entorno 3D a pantalla completa: vista aérea orbitable y recorrido en primera persona sobre la planta. */
export default function Entorno3D({ layout, planSrc, planW, planH, title, onClose }: Props) {
  const aspect = planH / planW;
  const d: Dims = useMemo(() => ({ W: layout.widthM, H: layout.widthM * aspect }), [layout, aspect]);

  const [mode, setMode] = useState<Mode>("orbit");
  const [hover, setHover] = useState<Hover>(null);
  const [selected, setSelected] = useState<Item | null>(null);
  const [tourIdx, setTourIdx] = useState<number | null>(null);
  const [room, setRoom] = useState<string | null>(null);
  const apiRef = useRef<WalkApi | null>(null);
  const held = useRef<Held>({ f: false, b: false, l: false, r: false });
  const tip = useRef<HTMLDivElement>(null);

  const moveTip = useCallback((x: number, y: number) => {
    if (tip.current) tip.current.style.transform = `translate(${x + 16}px, ${y + 16}px)`;
  }, []);

  useEffect(() => {
    lockScroll(true);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      lockScroll(false);
      window.removeEventListener("keydown", onKey);
      document.body.style.cursor = "";
    };
  }, [onClose]);

  /** Punto hacia el que mirar desde (x, z): el centro de los 3 muebles principales más cercanos. */
  const focusPoint = useCallback(
    (x: number, z: number): [number, number] => {
      const pts = layout.items
        .filter((i) => !i.part)
        .map((i) => {
          const [ix, iz] = world(d, i.x, i.y);
          return { ix, iz, dist: Math.hypot(ix - x, iz - z) };
        })
        .filter((p) => p.dist > 0.9)
        .sort((a, b) => a.dist - b.dist)
        .slice(0, 3);
      if (!pts.length) return [0, 0];
      return [pts.reduce((a, p) => a + p.ix, 0) / pts.length, pts.reduce((a, p) => a + p.iz, 0) / pts.length];
    },
    [layout, d],
  );

  const stopTour = useCallback(() => setTourIdx(null), []);
  const clearInfo = useCallback(() => {
    setHover(null);
    setSelected(null);
    document.body.style.cursor = "";
  }, []);

  const goRoom = useCallback(
    (i: number) => {
      const r = layout.rooms[i];
      if (!r) return;
      const [x, z] = world(d, r.x, r.y);
      const [cx, cz] = focusPoint(x, z);
      apiRef.current?.goTo(x, z, cx, cz);
      setMode("walk");
      setRoom(r.name);
      clearInfo();
    },
    [layout, d, clearInfo, focusPoint],
  );

  const dive = useCallback(
    (x: number, z: number) => {
      apiRef.current?.setPos(x, z, ...focusPoint(x, z));
      setMode("walk");
      setRoom(null);
      clearInfo();
    },
    [clearInfo, focusPoint],
  );

  // Recorrido guiado: visita cada habitación en orden
  useEffect(() => {
    if (tourIdx === null) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    goRoom(tourIdx);
    const t = window.setTimeout(() => setTourIdx((i) => (i === null ? null : i + 1 >= layout.rooms.length ? null : i + 1)), 4200);
    return () => window.clearTimeout(t);
  }, [tourIdx, goRoom, layout.rooms.length]);

  const hoveredId = hover?.item.id ?? null;
  const pad = "px-4 py-2.5 text-[0.75rem] font-bold uppercase tracking-[0.14em]";

  return (
    <div role="dialog" aria-modal="true" aria-label={`Entorno 3D: ${title}`} data-lenis-prevent className="fixed inset-0 z-[70] bg-ink text-white">
      <Canvas dpr={[1, 1.75]} camera={{ position: [0, 8, 6], fov: 42, near: 0.05, far: 200 }} gl={{ antialias: true, powerPreference: "high-performance" }} style={{ touchAction: "none" }}>
        <Suspense fallback={null}>
          <Scene
            layout={layout}
            planSrc={planSrc}
            aspect={aspect}
            mode={mode}
            hovered={hoveredId}
            selectedId={selected?.id ?? null}
            setHover={(item) => setHover(item ? { item } : null)}
            setSelect={setSelected}
            moveTip={moveTip}
            apiRef={apiRef}
            held={held}
            onUserInput={stopTour}
            onDive={dive}
          />
        </Suspense>
      </Canvas>
      <Loader />

      {/* Etiqueta que sigue al cursor */}
      <div ref={tip} aria-hidden className="pointer-events-none fixed left-0 top-0 z-20" style={{ transform: "translate(-999px,-999px)" }}>
        {hover && (
          <div className="max-w-[16rem] border border-white/20 bg-ink/95 px-3 py-2 shadow-xl">
            <p className="font-display text-sm font-extrabold text-orange">{hover.item.label}</p>
            <p className="mt-0.5 text-xs leading-snug text-white/90">{hover.item.desc}</p>
          </div>
        )}
      </div>

      {/* Barra superior */}
      <div className="pointer-events-none absolute inset-x-0 top-0 flex flex-wrap items-start justify-between gap-3 p-4 md:p-6">
        <div className="pointer-events-auto bg-ink/85 px-4 py-3 backdrop-blur">
          <p className="text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-orange">Entorno virtual 3D</p>
          <p className="font-display text-lg font-extrabold">{title}</p>
          {room && mode === "walk" && <p className="mt-0.5 text-xs text-white/80">Estás en: {room}</p>}
        </div>
        <div className="pointer-events-auto flex items-center gap-2">
          <div role="group" aria-label="Modo de vista" className="flex bg-ink/85 backdrop-blur">
            <button onClick={() => { setMode("orbit"); setRoom(null); clearInfo(); }} aria-pressed={mode === "orbit"} className={`${pad} ${mode === "orbit" ? "bg-orange text-ink" : "text-white hover:text-orange"}`}>Vista aérea</button>
            <button onClick={() => { setMode("walk"); { const [sx, sz] = world(d, layout.start[0], layout.start[1]); apiRef.current?.setPos(sx, sz, ...focusPoint(sx, sz)); } clearInfo(); }} aria-pressed={mode === "walk"} className={`${pad} ${mode === "walk" ? "bg-orange text-ink" : "text-white hover:text-orange"}`}>Recorrido</button>
          </div>
          <button onClick={onClose} aria-label="Cerrar entorno 3D" className="grid h-11 w-11 place-items-center bg-white text-xl text-ink transition-colors hover:bg-orange">✕</button>
        </div>
      </div>

      {/* Información del elemento seleccionado (también en táctil) */}
      {selected && (
        <div className="absolute bottom-24 left-4 z-10 max-w-[20rem] border border-white/20 bg-ink/95 p-4 md:bottom-28 md:left-6">
          <div className="flex items-start justify-between gap-4">
            <p className="font-display text-base font-extrabold text-orange">{selected.label}</p>
            <button onClick={() => setSelected(null)} aria-label="Cerrar descripción" className="text-white/80 hover:text-orange">✕</button>
          </div>
          <p className="mt-1 text-sm leading-snug text-white/90">{selected.desc}</p>
        </div>
      )}

      {/* Ayuda y habitaciones */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 grid gap-3 p-4 md:p-6">
        <p className="pointer-events-auto max-w-fit bg-ink/85 px-3 py-2 text-xs text-white/90 backdrop-blur">
          {mode === "orbit" ? (
            <>
              <span className="[@media(pointer:coarse)]:hidden">Arrastra para girar · rueda para acercar · pasa el cursor sobre un mueble · doble clic en el piso para entrar ahí</span>
              <span className="hidden [@media(pointer:coarse)]:inline">Arrastra para girar · pellizca para acercar · toca un mueble para ver qué es · toca dos veces el piso para entrar ahí</span>
            </>
          ) : (
            <>
              <span className="[@media(pointer:coarse)]:hidden">Arrastra para mirar · W A S D o flechas para caminar · clic en el piso para ir · Shift para correr</span>
              <span className="hidden [@media(pointer:coarse)]:inline">Arrastra para mirar · usa la cruceta para caminar · toca el piso para ir · toca un mueble para ver qué es</span>
            </>
          )}
        </p>
        <div className="pointer-events-auto flex gap-2 overflow-x-auto pb-1">
          <button onClick={() => (tourIdx === null ? setTourIdx(0) : stopTour())} className={`${pad} shrink-0 ${tourIdx === null ? "bg-white text-ink hover:bg-orange" : "bg-orange text-ink"}`}>
            {tourIdx === null ? "▶ Recorrido guiado" : "■ Detener"}
          </button>
          {layout.rooms.map((r, i) => (
            <button key={r.name} onClick={() => { stopTour(); goRoom(i); }} className={`${pad} shrink-0 border border-white/40 bg-ink/85 text-white backdrop-blur transition-colors hover:border-orange hover:text-orange ${room === r.name && mode === "walk" ? "!border-orange !text-orange" : ""}`}>
              {r.name}
            </button>
          ))}
        </div>
      </div>

      {/* Controles táctiles para caminar */}
      {mode === "walk" && (
        <div className="absolute bottom-28 right-4 z-10 hidden grid-cols-3 gap-1 [@media(pointer:coarse)]:grid md:bottom-32">
          {[
            { k: "l" as const, t: "⟲", c: "col-start-1 row-start-2" },
            { k: "f" as const, t: "▲", c: "col-start-2 row-start-1" },
            { k: "r" as const, t: "⟳", c: "col-start-3 row-start-2" },
            { k: "b" as const, t: "▼", c: "col-start-2 row-start-3" },
          ].map((b) => (
            <button
              key={b.k}
              aria-label={`Mover ${b.k}`}
              onPointerDown={() => { held.current[b.k] = true; stopTour(); }}
              onPointerUp={() => (held.current[b.k] = false)}
              onPointerLeave={() => (held.current[b.k] = false)}
              onPointerCancel={() => (held.current[b.k] = false)}
              className={`${b.c} grid h-12 w-12 select-none place-items-center bg-ink/85 text-lg text-white active:bg-orange active:text-ink`}
              style={{ touchAction: "none" }}
            >
              {b.t}
            </button>
          ))}
        </div>
      )}

    </div>
  );
}
