import { useRef, useEffect, useCallback, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

const FRICTION = 0.985;
const REPULSION_DISTANCE = 2.2;
const REPULSION_FORCE = 0.015;
const BOUNDARY = 4;
const BOUNDARY_FORCE = 0.05;
const SPIN_FRICTION = 0.98;

interface PolyBody {
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  spinVel: THREE.Vector3;
  home: THREE.Vector3;
  scale: number;
  grabbed: boolean;
}

const POLY_CONFIG = [
  { home: [-2, 0.5, 0], geometry: 'icosahedron' as const, color: '#6366f1', emissive: '#818cf8', scale: 1 },
  { home: [2.2, -0.3, -0.5], geometry: 'octahedron' as const, color: '#8b5cf6', emissive: '#a78bfa', scale: 0.75 },
  { home: [0.3, 1.8, -1.5], geometry: 'dodecahedron' as const, color: '#a78bfa', emissive: '#c4b5fd', scale: 0.6 },
];

function PhysicsScene() {
  const { camera, gl, raycaster, pointer } = useThree();
  const meshRefs = useRef<(THREE.Mesh | null)[]>([null, null, null]);
  const groupRefs = useRef<(THREE.Group | null)[]>([null, null, null]);

  const bodies = useRef<PolyBody[]>(
    POLY_CONFIG.map((c) => ({
      pos: new THREE.Vector3(...(c.home as [number, number, number])),
      vel: new THREE.Vector3(0, 0, 0),
      spinVel: new THREE.Vector3(
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.01,
      ),
      home: new THREE.Vector3(...(c.home as [number, number, number])),
      scale: c.scale,
      grabbed: false,
    })),
  );

  const dragState = useRef({
    active: false,
    index: -1,
    prevMouse: new THREE.Vector3(),
    mouseVel: new THREE.Vector3(),
    plane: new THREE.Plane(new THREE.Vector3(0, 0, 1), 0),
  });

  const getMouseWorldPos = useCallback(() => {
    raycaster.setFromCamera(pointer, camera);
    const target = new THREE.Vector3();
    raycaster.ray.intersectPlane(dragState.current.plane, target);
    return target;
  }, [raycaster, pointer, camera]);

  useEffect(() => {
    const canvas = gl.domElement;

    const onPointerDown = () => {
      raycaster.setFromCamera(pointer, camera);
      const meshes = meshRefs.current.filter(Boolean) as THREE.Mesh[];
      const intersects = raycaster.intersectObjects(meshes, true);

      if (intersects.length > 0) {
        // Find which polyhedron was hit
        let hitObj = intersects[0].object;
        while (hitObj.parent && !meshes.includes(hitObj as THREE.Mesh)) {
          hitObj = hitObj.parent as THREE.Object3D;
        }
        const idx = meshes.indexOf(hitObj as THREE.Mesh);
        if (idx === -1) return;

        // Set drag plane at the z-depth of the grabbed object
        const body = bodies.current[idx];
        dragState.current.plane.setFromNormalAndCoplanarPoint(
          new THREE.Vector3(0, 0, 1),
          body.pos,
        );

        dragState.current.active = true;
        dragState.current.index = idx;
        dragState.current.prevMouse.copy(getMouseWorldPos());
        dragState.current.mouseVel.set(0, 0, 0);
        body.grabbed = true;
        body.vel.set(0, 0, 0);
        canvas.style.cursor = 'grabbing';
      }
    };

    const onPointerMove = () => {
      if (!dragState.current.active) return;
      const worldPos = getMouseWorldPos();
      dragState.current.mouseVel.copy(worldPos).sub(dragState.current.prevMouse);
      dragState.current.prevMouse.copy(worldPos);
    };

    const onPointerUp = () => {
      if (!dragState.current.active) return;
      const idx = dragState.current.index;
      const body = bodies.current[idx];

      // Transfer mouse velocity to the body (throw!)
      body.vel.copy(dragState.current.mouseVel).multiplyScalar(1.5);
      // Add spin based on throw direction
      body.spinVel.set(
        dragState.current.mouseVel.y * 3,
        -dragState.current.mouseVel.x * 3,
        (Math.random() - 0.5) * dragState.current.mouseVel.length() * 2,
      );
      body.grabbed = false;

      dragState.current.active = false;
      dragState.current.index = -1;
      canvas.style.cursor = 'grab';
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointerleave', onPointerUp);

    return () => {
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('pointerleave', onPointerUp);
    };
  }, [gl, camera, raycaster, pointer, getMouseWorldPos]);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    const allBodies = bodies.current;

    for (let i = 0; i < allBodies.length; i++) {
      const body = allBodies[i];
      const group = groupRefs.current[i];
      if (!group) continue;

      if (body.grabbed) {
        // Follow mouse position smoothly
        const target = getMouseWorldPos();
        body.pos.lerp(target, 0.3);
      } else {
        const speed = body.vel.length();

        if (speed > 0.003) {
          // Moving: apply velocity + friction
          body.pos.add(body.vel);
          body.vel.multiplyScalar(FRICTION);

          // Boundary: soft bounce back if too far from center
          if (body.pos.length() > BOUNDARY) {
            const pushBack = body.pos.clone().normalize().multiplyScalar(-BOUNDARY_FORCE);
            body.vel.add(pushBack);
          }
        } else {
          // Nearly stopped: smoothly lerp back to home with floating offset
          body.vel.set(0, 0, 0);
          const floatY = Math.sin(time * 0.8 + i * 2) * 0.08;
          const homeWithFloat = body.home.clone();
          homeWithFloat.y += floatY;
          body.pos.lerp(homeWithFloat, 0.02);
        }
      }

      // Repulsion between polyhedra
      for (let j = i + 1; j < allBodies.length; j++) {
        const other = allBodies[j];
        const diff = body.pos.clone().sub(other.pos);
        const dist = diff.length();

        if (dist < REPULSION_DISTANCE && dist > 0.01) {
          const force = diff.normalize().multiplyScalar(
            REPULSION_FORCE * (1 - dist / REPULSION_DISTANCE),
          );
          if (!body.grabbed) body.vel.add(force);
          if (!other.grabbed) other.vel.sub(force);

          // Add spin on close approach
          body.spinVel.x += force.y * 0.5;
          body.spinVel.y -= force.x * 0.5;
          other.spinVel.x -= force.y * 0.5;
          other.spinVel.y += force.x * 0.5;
        }
      }

      // Apply spin with friction
      body.spinVel.multiplyScalar(SPIN_FRICTION);
      group.rotation.x += body.spinVel.x;
      group.rotation.y += body.spinVel.y;
      group.rotation.z += body.spinVel.z;

      // Update position
      group.position.copy(body.pos);

      // Scale pulse when grabbed
      const targetScale = body.grabbed ? body.scale * 1.15 : body.scale;
      const currentScale = group.scale.x;
      const newScale = THREE.MathUtils.lerp(currentScale, targetScale, 0.1);
      group.scale.setScalar(newScale);
    }
  });

  const geometries = {
    icosahedron: <icosahedronGeometry args={[1, 1]} />,
    octahedron: <octahedronGeometry args={[1, 0]} />,
    dodecahedron: <dodecahedronGeometry args={[1, 0]} />,
  };

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-5, -5, 5]} intensity={0.8} color="#8b5cf6" />
      <pointLight position={[5, 3, 3]} intensity={0.5} color="#6366f1" />

      {POLY_CONFIG.map((config, i) => (
        <group
          key={i}
          ref={(el) => { groupRefs.current[i] = el; }}
          position={config.home as [number, number, number]}
          scale={config.scale}
        >
          {/* Hit target for raycasting */}
          <mesh ref={(el) => { meshRefs.current[i] = el; }}>
            <sphereGeometry args={[1.2, 8, 8]} />
            <meshBasicMaterial visible={false} />
          </mesh>

          {/* Solid distorted mesh */}
          <mesh>
            {geometries[config.geometry]}
            <MeshDistortMaterial
              color={config.color}
              emissive={config.emissive}
              emissiveIntensity={0.15}
              roughness={0.05}
              metalness={0.95}
              distort={0.35}
              speed={2}
            />
          </mesh>

          {/* Wireframe overlay */}
          <mesh scale={1.02}>
            {geometries[config.geometry]}
            <meshBasicMaterial
              color={config.color}
              wireframe
              transparent
              opacity={0.4}
              blending={THREE.AdditiveBlending}
            />
          </mesh>

          {/* Glow halo */}
          <mesh scale={1.3}>
            {geometries[config.geometry]}
            <meshBasicMaterial
              color={config.emissive}
              transparent
              opacity={0.05}
              side={THREE.BackSide}
            />
          </mesh>
        </group>
      ))}
    </>
  );
}

export default function FloatingPolyhedra() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      style={{ width: '100%', height: '100%', cursor: 'grab' }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
    >
      <Suspense fallback={null}>
        <PhysicsScene />
      </Suspense>
    </Canvas>
  );
}
