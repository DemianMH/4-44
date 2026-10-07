"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const FLOORS = 9;
const FLOOR_H = 0.7;
const SIZE = 3;
const BUILD_START = 2.8; // segundos: tras el preloader
const BUILD_STEP = 0.42;
const TOTAL_H = FLOORS * FLOOR_H;

const GRAPHITE = "#464a4b";
const ORANGE = "#f57e25";

type Dim = { w: number; h: number; d: number };

/** Caja dibujada solo con aristas (estética de plano / estructura). */
function EdgeBox({ w, h, d, color = GRAPHITE, opacity = 0.8, position }: Dim & { color?: string; opacity?: number; position?: [number, number, number] }) {
  const geo = useMemo(() => new THREE.EdgesGeometry(new THREE.BoxGeometry(w, h, d)), [w, h, d]);
  return (
    <lineSegments geometry={geo} position={position}>
      <lineBasicMaterial color={color} transparent opacity={opacity} />
    </lineSegments>
  );
}

const ease = (t: number) => 1 - Math.pow(1 - t, 3);

function Floor({ index }: { index: number }) {
  const ref = useRef<THREE.Group>(null);
  const top = index === FLOORS - 1;
  const c = SIZE / 2 - 0.08;

  useFrame((state) => {
    const g = ref.current;
    if (!g) return;
    const k = ease(THREE.MathUtils.clamp((state.clock.elapsedTime - BUILD_START - index * BUILD_STEP) / 0.8, 0, 1));
    g.visible = k > 0;
    g.scale.y = Math.max(k, 0.0001);
  });

  return (
    <group ref={ref} position={[0, index * FLOOR_H, 0]}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[SIZE, 0.1, SIZE]} />
        <meshBasicMaterial color="#f5f3ef" transparent opacity={0.92} />
      </mesh>
      <EdgeBox w={SIZE} h={0.1} d={SIZE} color={top ? ORANGE : GRAPHITE} opacity={top ? 1 : 0.85} />
      {[
        [-c, c],
        [c, c],
        [-c, -c],
        [c, -c],
      ].map(([x, z]) => (
        <EdgeBox key={`${x}${z}`} w={0.1} h={FLOOR_H} d={0.1} position={[x, FLOOR_H / 2, z]} opacity={0.7} />
      ))}
      {/* Muro cortina por piso (paneles translúcidos) */}
      <mesh position={[0, FLOOR_H / 2, c + 0.04]}>
        <planeGeometry args={[SIZE - 0.3, FLOOR_H - 0.14]} />
        <meshBasicMaterial color={index % 3 === 0 ? ORANGE : "#ffffff"} transparent opacity={index % 3 === 0 ? 0.28 : 0.4} />
      </mesh>
    </group>
  );
}

function Crane() {
  const jib = useRef<THREE.Group>(null);
  const cable = useRef<THREE.Mesh>(null);
  const hook = useRef<THREE.Mesh>(null);
  const mastH = TOTAL_H + 2.2;

  const lattice = useMemo(() => {
    const pts: number[] = [];
    const seg = 0.55;
    for (let y = 0; y < mastH; y += seg) {
      const y2 = Math.min(y + seg, mastH);
      pts.push(-0.14, y, 0.14, 0.14, y2, 0.14, 0.14, y, 0.14, -0.14, y2, 0.14);
      pts.push(-0.14, y, -0.14, 0.14, y2, -0.14, 0.14, y, -0.14, -0.14, y2, -0.14);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    return g;
  }, [mastH]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (jib.current) jib.current.rotation.y = Math.sin(t * 0.28) * 0.7 - 0.35;
    const len = 1.7 + Math.sin(t * 0.8) * 0.7;
    if (cable.current) {
      cable.current.scale.y = len;
      cable.current.position.y = -len / 2;
    }
    if (hook.current) hook.current.position.y = -len - 0.12;
  });

  return (
    <group position={[SIZE / 2 + 1.1, 0, -0.4]}>
      <EdgeBox w={0.28} h={mastH} d={0.28} position={[0, mastH / 2, 0]} color={ORANGE} opacity={0.95} />
      <lineSegments geometry={lattice}>
        <lineBasicMaterial color={ORANGE} transparent opacity={0.7} />
      </lineSegments>
      <group ref={jib} position={[0, mastH, 0]}>
        <EdgeBox w={5} h={0.2} d={0.2} position={[1.2, 0, 0]} color={ORANGE} opacity={1} />
        <mesh position={[-1.2, -0.05, 0]}>
          <boxGeometry args={[0.6, 0.4, 0.4]} />
          <meshBasicMaterial color={GRAPHITE} />
        </mesh>
        <EdgeBox w={0.2} h={0.5} d={0.2} position={[0, 0.3, 0]} color={ORANGE} opacity={1} />
        <group position={[2.3, -0.1, 0]}>
          <mesh ref={cable}>
            <cylinderGeometry args={[0.012, 0.012, 1, 6]} />
            <meshBasicMaterial color={GRAPHITE} />
          </mesh>
          <mesh ref={hook}>
            <boxGeometry args={[0.16, 0.2, 0.16]} />
            <meshBasicMaterial color={ORANGE} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

const DUST = 160;

function Dust() {
  const positions = useMemo(() => {
    let a = 444;
    const rand = () => {
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    const arr = new Float32Array(DUST * 3);
    for (let i = 0; i < DUST; i++) {
      arr[i * 3] = (rand() - 0.5) * 14;
      arr[i * 3 + 1] = (rand() - 0.5) * 8;
      arr[i * 3 + 2] = (rand() - 0.5) * 8;
    }
    return arr;
  }, []);
  const ref = useRef<THREE.Points>(null);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.02;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#b9b3a8" size={0.03} sizeAttenuation transparent opacity={0.7} depthWrite={false} />
    </points>
  );
}

function Site() {
  const group = useRef<THREE.Group>(null);
  const width = useThree((s) => s.size.width);
  const wide = width > 900;

  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;
    const { x, y } = state.pointer;
    const k = 1 - Math.exp(-dt * 2.5);
    g.rotation.y += (-0.5 + x * 0.45 + Math.sin(state.clock.elapsedTime * 0.12) * 0.12 - g.rotation.y) * k;
    g.rotation.x += (-y * 0.12 - g.rotation.x) * k;
  });

  return (
    <group ref={group} position={[wide ? 2.6 : 0, -TOTAL_H / 2 - 0.4, 0]} scale={wide ? 1 : 0.85}>
      <gridHelper args={[14, 28, GRAPHITE, GRAPHITE]} position={[0, -0.06, 0]}>
        <meshBasicMaterial attach="material" transparent opacity={0.15} />
      </gridHelper>
      {Array.from({ length: FLOORS }, (_, i) => (
        <Floor key={i} index={i} />
      ))}
      <Crane />
    </group>
  );
}

export default function Scene() {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 1.8, 17.5], fov: 40 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      aria-hidden
    >
      <Dust />
      <Site />
    </Canvas>
  );
}
