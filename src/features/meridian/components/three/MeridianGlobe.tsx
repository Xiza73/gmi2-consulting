import { useRef, useMemo, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { QuadraticBezierLine } from '@react-three/drei';
import * as THREE from 'three';

const FRICTION = 0.97; // How quickly momentum decays (closer to 1 = slower decay)
const DRAG_SENSITIVITY = 0.008; // How responsive dragging feels
const IDLE_SPEED = 0.08; // Gentle auto-rotation when untouched

function GlobeWireframe() {
  const groupRef = useRef<THREE.Group>(null);
  const { gl } = useThree();

  const state = useRef({
    isDragging: false,
    hasBeenTouched: false, // true once the user has interacted at least once
    prevPointer: { x: 0, y: 0 },
    velocityX: 0, // rotation velocity around X axis
    velocityY: IDLE_SPEED, // rotation velocity around Y axis (starts with idle spin)
  });

  useEffect(() => {
    const canvas = gl.domElement;

    const onPointerDown = (e: PointerEvent) => {
      state.current.isDragging = true;
      state.current.hasBeenTouched = true;
      state.current.prevPointer = { x: e.clientX, y: e.clientY };
      canvas.style.cursor = 'grabbing';
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!state.current.isDragging) return;

      const dx = e.clientX - state.current.prevPointer.x;
      const dy = e.clientY - state.current.prevPointer.y;

      // Accumulate velocity from drag delta
      state.current.velocityY = dx * DRAG_SENSITIVITY;
      state.current.velocityX = -dy * DRAG_SENSITIVITY;

      state.current.prevPointer = { x: e.clientX, y: e.clientY };
    };

    const onPointerUp = () => {
      state.current.isDragging = false;
      canvas.style.cursor = 'grab';
    };

    // Touch support
    const onTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      state.current.isDragging = true;
      state.current.hasBeenTouched = true;
      state.current.prevPointer = { x: touch.clientX, y: touch.clientY };
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!state.current.isDragging) return;
      const touch = e.touches[0];

      const dx = touch.clientX - state.current.prevPointer.x;
      const dy = touch.clientY - state.current.prevPointer.y;

      state.current.velocityY = dx * DRAG_SENSITIVITY;
      state.current.velocityX = -dy * DRAG_SENSITIVITY;

      state.current.prevPointer = { x: touch.clientX, y: touch.clientY };
    };

    const onTouchEnd = () => {
      state.current.isDragging = false;
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointerleave', onPointerUp);
    canvas.addEventListener('touchstart', onTouchStart, { passive: true });
    canvas.addEventListener('touchmove', onTouchMove, { passive: true });
    canvas.addEventListener('touchend', onTouchEnd);

    return () => {
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('pointerleave', onPointerUp);
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchmove', onTouchMove);
      canvas.removeEventListener('touchend', onTouchEnd);
    };
  }, [gl]);

  useFrame(() => {
    if (!groupRef.current) return;
    const s = state.current;

    if (!s.isDragging) {
      // Apply friction to slow down momentum
      s.velocityX *= FRICTION;
      s.velocityY *= FRICTION;

      // When momentum is nearly zero and user has interacted, let it rest
      // If never touched, keep the idle rotation going
      if (!s.hasBeenTouched) {
        s.velocityY = IDLE_SPEED;
      } else if (Math.abs(s.velocityY) < 0.001 && Math.abs(s.velocityX) < 0.001) {
        // Gradually resume gentle idle spin after momentum dies
        s.velocityY = THREE.MathUtils.lerp(s.velocityY, IDLE_SPEED * 0.3, 0.005);
      }
    }

    // Apply velocity to rotation
    groupRef.current.rotation.y += s.velocityY;
    groupRef.current.rotation.x += s.velocityX;

    // Clamp X rotation so it doesn't flip upside down
    groupRef.current.rotation.x = THREE.MathUtils.clamp(
      groupRef.current.rotation.x,
      -Math.PI / 3,
      Math.PI / 3,
    );
  });

  // Generate random points on sphere surface
  const points = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i < 35; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 1.8;
      pts.push(
        new THREE.Vector3(
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.sin(phi) * Math.sin(theta),
          r * Math.cos(phi),
        ),
      );
    }
    return pts;
  }, []);

  // Generate connections between nearby points
  const connections = useMemo(() => {
    const conns: [THREE.Vector3, THREE.Vector3, THREE.Vector3][] = [];
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        if (points[i].distanceTo(points[j]) < 2.5) {
          const mid = points[i].clone().add(points[j]).multiplyScalar(0.5);
          mid.normalize().multiplyScalar(2.2);
          conns.push([points[i], mid, points[j]]);
        }
      }
    }
    return conns;
  }, [points]);

  return (
    <group ref={groupRef}>
      {/* Wireframe Globe */}
      <mesh>
        <sphereGeometry args={[1.8, 48, 48]} />
        <meshBasicMaterial color="#3b82f6" wireframe transparent opacity={0.06} />
      </mesh>

      {/* Inner solid sphere */}
      <mesh>
        <sphereGeometry args={[1.75, 48, 48]} />
        <meshPhongMaterial color="#eff6ff" transparent opacity={0.02} />
      </mesh>

      {/* Atmosphere Glow */}
      <mesh scale={1.95}>
        <sphereGeometry args={[1, 48, 48]} />
        <meshBasicMaterial color="#3b82f6" transparent opacity={0.04} side={THREE.BackSide} />
      </mesh>

      {/* Points on surface */}
      {points.map((point, i) => (
        <mesh key={`point-${i}`} position={point}>
          <sphereGeometry args={[0.04, 12, 12]} />
          <meshBasicMaterial color="#3b82f6" />
        </mesh>
      ))}

      {/* Glow halos on points */}
      {points.map((point, i) => (
        <mesh key={`glow-${i}`} position={point}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshBasicMaterial color="#60a5fa" transparent opacity={0.15} />
        </mesh>
      ))}

      {/* Connection Lines */}
      {connections.map(([start, mid, end], i) => (
        <QuadraticBezierLine
          key={`line-${i}`}
          start={start}
          mid={mid}
          end={end}
          color="#3b82f6"
          lineWidth={0.8}
          transparent
          opacity={0.25}
        />
      ))}
    </group>
  );
}

export default function MeridianGlobe() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 50 }}
      style={{ width: '100%', height: '100%', cursor: 'grab' }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={0.3} />
        <GlobeWireframe />
      </Suspense>
    </Canvas>
  );
}
