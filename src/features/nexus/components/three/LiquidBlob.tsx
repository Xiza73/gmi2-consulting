import { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

function Blob() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const time = clock.getElapsedTime();

    // Slow rotation
    meshRef.current.rotation.y += 0.003;
    meshRef.current.rotation.x = Math.sin(time * 0.2) * 0.1;

    // Gentle scale breathing
    const scale = 1 + Math.sin(time * 0.6) * 0.03;
    meshRef.current.scale.setScalar(scale);
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1.8, 4]} />
      <MeshDistortMaterial
        color="#0ea5e9"
        emissive="#0369a1"
        emissiveIntensity={0.15}
        roughness={0.05}
        metalness={0.95}
        distort={0.35}
        speed={2.5}
      />
    </mesh>
  );
}

export default function LiquidBlob() {
  return (
    <Canvas
      camera={{ position: [0, 0, 4], fov: 45 }}
      style={{ width: '100%', height: '100%' }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={1} color="#e0f2fe" />
        <pointLight position={[-5, -3, 5]} intensity={0.8} color="#06b6d4" />
        <pointLight position={[3, 3, -5]} intensity={0.5} color="#0ea5e9" />
        <Blob />
      </Suspense>
    </Canvas>
  );
}
