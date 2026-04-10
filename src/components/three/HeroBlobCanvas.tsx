import { useRef, useEffect, useState, Suspense } from 'react';
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
      {/* Middle ground: 160x24 instead of original 200x40.
          Smooth enough that the distort shader's per-frame vertex
          displacement doesn't reveal facets, while still ~52% fewer
          triangles than the original (≈7.7k vs ≈16k). */}
      <torusKnotGeometry args={[0.8, 0.3, 160, 24]} />
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

export default function HeroBlobCanvas() {
  // Pause the render loop when the canvas is offscreen or the tab is hidden.
  // `frameloop="never"` completely halts useFrame callbacks → 0% CPU/GPU when invisible.
  const [frameloop, setFrameloop] = useState<'always' | 'never'>('always');
  const wrapperRef = useRef<HTMLDivElement>(null);
  const visibleRef = useRef(true);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const apply = () => {
      const shouldRun = visibleRef.current && !document.hidden;
      setFrameloop(shouldRun ? 'always' : 'never');
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
        apply();
      },
      { threshold: 0.01 },
    );
    io.observe(el);

    const onVisibility = () => apply();
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return (
    <div ref={wrapperRef} style={{ width: '100%', height: '100%' }}>
      <Canvas
        camera={{ position: [0, 0, 3.5], fov: 40 }}
        style={{ width: '100%', height: '100%' }}
        // antialias off: the blob sits behind a dark radial vignette, aliasing is invisible.
        // dpr capped at 1.5: on Retina screens this ~halves framebuffer memory vs dpr=2.
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
        frameloop={frameloop}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1.2} color="#f97316" />
          <pointLight position={[-5, -3, 5]} intensity={1} color="#ec4899" />
          {/* Environment resolution lowered from default 256 → 64.
              Cuts PMREM env-map VRAM ~16× while still giving metallic reflections. */}
          <Environment preset="sunset" resolution={64} />
          <Blob />
        </Suspense>
      </Canvas>
    </div>
  );
}
