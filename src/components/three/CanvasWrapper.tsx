import { Canvas } from '@react-three/fiber';
import { Suspense, type ReactNode } from 'react';

interface CanvasWrapperProps {
  children: ReactNode;
  className?: string;
  camera?: {
    position?: [number, number, number];
    fov?: number;
  };
}

export default function CanvasWrapper({
  children,
  className = '',
  camera = { position: [0, 0, 5], fov: 45 },
}: CanvasWrapperProps) {
  return (
    <Canvas
      camera={camera}
      className={className}
      style={{ width: '100%', height: '100%' }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
    >
      <Suspense fallback={null}>{children}</Suspense>
    </Canvas>
  );
}
