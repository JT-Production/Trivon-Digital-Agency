import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function Field({ count = 900 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const a = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 2 + Math.random() * 5;
      const t = Math.random() * Math.PI * 2;
      a[i * 3] = Math.cos(t) * r;
      a[i * 3 + 1] = (Math.random() - 0.5) * 5;
      a[i * 3 + 2] = Math.sin(t) * r - 2;
    }
    return a;
  }, [count]);
  useFrame((s, d) => {
    if (!ref.current) return;
    const dt = Math.min(d, 0.05);
    ref.current.rotation.y += dt * 0.05;
    ref.current.rotation.x += (s.pointer.y * 0.15 - ref.current.rotation.x) * (1 - Math.exp(-2 * dt));
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.035} color="#A2E64A" transparent opacity={0.75} sizeAttenuation depthWrite={false} />
    </points>
  );
}

export default function Particles() {
  return (
    <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 6], fov: 50 }} gl={{ alpha: true }}>
      <Field />
    </Canvas>
  );
}
