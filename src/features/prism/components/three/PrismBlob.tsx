import { useRef, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { MeshDistortMaterial, Environment } from '@react-three/drei';
import * as THREE from 'three';

function Blob() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { pointer, gl } = useThree();
  const pressedRef = useRef(false);

  useEffect(() => {
    const canvas = gl.domElement;
    const onDown = () => { pressedRef.current = true; };
    const onUp = () => { pressedRef.current = false; };

    canvas.addEventListener('mousedown', onDown);
    canvas.addEventListener('mouseup', onUp);
    canvas.addEventListener('mouseleave', onUp);
    canvas.addEventListener('touchstart', onDown);
    canvas.addEventListener('touchend', onUp);

    return () => {
      canvas.removeEventListener('mousedown', onDown);
      canvas.removeEventListener('mouseup', onUp);
      canvas.removeEventListener('mouseleave', onUp);
      canvas.removeEventListener('touchstart', onDown);
      canvas.removeEventListener('touchend', onUp);
    };
  }, [gl]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const time = clock.getElapsedTime();

    if (pressedRef.current) {
      // While held: follow mouse rotation
      meshRef.current.rotation.x = THREE.MathUtils.lerp(
        meshRef.current.rotation.x,
        pointer.y * 0.5,
        0.08,
      );
      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        meshRef.current.rotation.y,
        pointer.x * 0.5,
        0.08,
      );

      // Mouse-driven scale boost
      const mouseDistance = Math.sqrt(pointer.x ** 2 + pointer.y ** 2);
      const targetScale = 1 + mouseDistance * 0.15 + Math.sin(time * 0.8) * 0.03;
      const currentScale = meshRef.current.scale.x;
      meshRef.current.scale.setScalar(
        THREE.MathUtils.lerp(currentScale, targetScale, 0.05),
      );
    } else {
      // Default idle: gentle auto-rotation
      meshRef.current.rotation.x = THREE.MathUtils.lerp(
        meshRef.current.rotation.x,
        Math.sin(time * 0.3) * 0.15,
        0.03,
      );
      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        meshRef.current.rotation.y,
        Math.cos(time * 0.2) * 0.15,
        0.03,
      );

      // Scale back to idle breathing
      const currentScale = meshRef.current.scale.x;
      const idleScale = 1 + Math.sin(time * 0.8) * 0.02;
      meshRef.current.scale.setScalar(
        THREE.MathUtils.lerp(currentScale, idleScale, 0.03),
      );
    }

    // Slow continuous z-rotation always
    meshRef.current.rotation.z += 0.002;
  });

  return (
    <mesh ref={meshRef}>
      <torusKnotGeometry args={[0.8, 0.3, 200, 40]} />
      <MeshDistortMaterial
        color="#ec4899"
        roughness={0.05}
        metalness={0.9}
        distort={0.35}
        speed={3}
        envMapIntensity={2}
      />
    </mesh>
  );
}

export default function PrismBlob() {
  return (
    <Canvas
      camera={{ position: [0, 0, 3.5], fov: 40 }}
      style={{ width: '100%', height: '100%' }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} color="#f97316" />
        <pointLight position={[-5, -3, 5]} intensity={1} color="#ec4899" />
        <pointLight position={[3, 3, -5]} intensity={0.6} color="#eab308" />
        <spotLight position={[0, 5, 0]} intensity={0.8} color="#a855f7" angle={0.5} penumbra={1} />
        <Environment preset="sunset" />
        <Blob />
      </Suspense>
    </Canvas>
  );
}
