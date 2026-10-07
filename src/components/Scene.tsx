"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const COUNT = 700;

/** PRNG determinista (mulberry32) para generar el polvo sin Math.random en render. */
function prng(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function Dust() {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const rand = prng(444);
    const arr = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      arr[i * 3] = (rand() - 0.5) * 18;
      arr[i * 3 + 1] = (rand() - 0.5) * 10;
      arr[i * 3 + 2] = (rand() - 0.5) * 12;
    }
    return arr;
  }, []);

  useFrame((state, dt) => {
    const p = ref.current;
    if (!p) return;
    p.rotation.y += dt * 0.012;
    p.position.y = Math.sin(state.clock.elapsedTime * 0.15) * 0.15;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#d9c3a8" size={0.028} sizeAttenuation transparent opacity={0.55} depthWrite={false} />
    </points>
  );
}

/** Malla arquitectónica: retícula de planta + estructura icosaédrica en wireframe. */
function Lattice() {
  const group = useRef<THREE.Group>(null);

  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;
    const { x, y } = state.pointer;
    const k = 1 - Math.exp(-dt * 2.5);
    g.rotation.y += (x * 0.35 + state.clock.elapsedTime * 0.02 - g.rotation.y) * k;
    g.rotation.x += (-y * 0.18 - g.rotation.x) * k;
    state.camera.position.x += (x * 0.6 - state.camera.position.x) * k;
    state.camera.position.y += (y * 0.4 - state.camera.position.y) * k;
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <group ref={group} position={[2.2, 0, -2]}>
      <mesh>
        <icosahedronGeometry args={[3.2, 1]} />
        <meshBasicMaterial color="#d08049" wireframe transparent opacity={0.22} />
      </mesh>
      <mesh rotation={[0.4, 0.6, 0]}>
        <octahedronGeometry args={[2, 0]} />
        <meshBasicMaterial color="#f1eee7" wireframe transparent opacity={0.1} />
      </mesh>
      <gridHelper args={[16, 32, "#f1eee7", "#f1eee7"]} position={[-2.2, -3.2, 2]}>
        <meshBasicMaterial attach="material" transparent opacity={0.06} />
      </gridHelper>
    </group>
  );
}

export default function Scene() {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 7], fov: 45 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      aria-hidden
    >
      <Dust />
      <Lattice />
    </Canvas>
  );
}
