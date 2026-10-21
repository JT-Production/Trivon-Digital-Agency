import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, Lightformer } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { SYMBOL_SVG } from "./symbol-svg";

function useSymbolGeometry() {
  return useMemo(() => {
    const data = new SVGLoader().parse(SYMBOL_SVG);
    const shapes = data.paths.flatMap((p) => SVGLoader.createShapes(p));
    const geo = new THREE.ExtrudeGeometry(shapes, {
      depth: 40,
      bevelEnabled: true,
      bevelThickness: 8,
      bevelSize: 5,
      bevelSegments: 4,
      curveSegments: 10,
    });
    geo.center();
    geo.computeVertexNormals();
    return geo;
  }, []);
}

function Symbol3D() {
  const geo = useSymbolGeometry();
  const group = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const dt = Math.min(delta, 0.05);
    const scroll = typeof window !== "undefined" ? Math.min(window.scrollY / window.innerHeight, 1.2) : 0;
    const k = 1 - Math.exp(-4 * dt);
    g.rotation.y += dt * 0.25;
    const tx = state.pointer.y * -0.35 + scroll * 0.6;
    g.rotation.x += (tx - g.rotation.x) * k;
    g.position.x += (state.pointer.x * 0.25 - g.position.x) * k;
    g.position.y += (-scroll * 1.2 - g.position.y) * k;
  });
  return (
    <group ref={group}>
      <Float speed={1.4} rotationIntensity={0.3} floatIntensity={0.6}>
        {/* SVG coords are y-down — flip */}
        <mesh geometry={geo} scale={[0.0115, -0.0115, 0.0115]}>
          <meshPhysicalMaterial color="#79B83F" roughness={0.28} metalness={0.1} clearcoat={1} clearcoatRoughness={0.25} />
        </mesh>
      </Float>
    </group>
  );
}

export default function HeroScene() {
  return (
    <Canvas dpr={[1, 1.75]} camera={{ position: [0, 0, 6], fov: 40 }} gl={{ antialias: true, alpha: true }}>
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 4, 5]} intensity={2.2} color="#F5F7F2" />
      <pointLight position={[-4, -2, 2]} intensity={30} color="#A2E64A" />
      <Symbol3D />
      <Environment resolution={128}>
        <Lightformer intensity={2.5} position={[0, 5, 2]} scale={[10, 4, 1]} />
        <Lightformer intensity={1.2} color="#A2E64A" position={[-5, 0, 1]} rotation-y={Math.PI / 2} scale={[10, 2, 1]} />
        <Lightformer intensity={0.8} color="#315B2B" position={[5, -1, 1]} rotation-y={-Math.PI / 2} scale={[10, 2, 1]} />
      </Environment>
    </Canvas>
  );
}
