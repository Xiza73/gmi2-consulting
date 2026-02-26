import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Suspense } from 'react';

function ParticleField() {
  const pointsRef = useRef<THREE.Points>(null);
  const { pointer } = useThree();
  const count = 6000;

  const [positions, colors, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const siz = new Float32Array(count);
    const colorA = new THREE.Color('#6366f1');
    const colorB = new THREE.Color('#8b5cf6');
    const colorC = new THREE.Color('#06b6d4');

    for (let i = 0; i < count; i++) {
      // Distribute in a sphere with density toward center
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 2 + Math.pow(Math.random(), 0.7) * 5;

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      // Three-color gradient
      const t = Math.random();
      let color: THREE.Color;
      if (t < 0.5) {
        color = colorA.clone().lerp(colorB, t * 2);
      } else {
        color = colorB.clone().lerp(colorC, (t - 0.5) * 2);
      }
      col[i * 3] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;

      // Variable particle sizes — some large "star" particles
      siz[i] = Math.random() < 0.05 ? 0.08 + Math.random() * 0.06 : 0.02 + Math.random() * 0.03;
    }

    return [pos, col, siz];
  }, []);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const time = clock.getElapsedTime();

    // Mouse-driven rotation
    const targetRotY = time * 0.03 + pointer.x * 0.4;
    const targetRotX = Math.sin(time * 0.02) * 0.1 + pointer.y * 0.2;
    pointsRef.current.rotation.y = THREE.MathUtils.lerp(pointsRef.current.rotation.y, targetRotY, 0.03);
    pointsRef.current.rotation.x = THREE.MathUtils.lerp(pointsRef.current.rotation.x, targetRotX, 0.03);

    // Wave animation on positions
    const posArray = pointsRef.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      const originalY = positions[ix + 1];
      const originalX = positions[ix];
      posArray[ix + 1] = originalY + Math.sin(time * 0.4 + originalX * 0.3) * 0.4;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions.slice(), 3]}
          count={count}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
          count={count}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[sizes, 1]}
          count={count}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        vertexColors
        transparent
        opacity={0.9}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function QuantumParticleField() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 60 }}
      style={{ width: '100%', height: '100%' }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.3} />
        <ParticleField />
      </Suspense>
    </Canvas>
  );
}
