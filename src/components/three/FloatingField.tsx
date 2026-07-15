import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef, type MutableRefObject } from "react";
import * as THREE from "three";

interface FloatingFieldProps {
  isDark: boolean;
  reduceMotion: boolean;
}

interface ShapeDef {
  position: [number, number, number];
  rotationSpeed: [number, number, number];
  bobSpeed: number;
  bobOffset: number;
  scale: number;
  kind: 0 | 1 | 2;
  wireframe: boolean;
}

const SHAPE_COUNT = 16;

function makeShapes(): ShapeDef[] {
  const shapes: ShapeDef[] = [];
  // Deterministic pseudo-random so the scene composition is stable across reloads.
  let seed = 42;
  const rand = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return (seed % 1000) / 1000;
  };

  for (let i = 0; i < SHAPE_COUNT; i++) {
    shapes.push({
      position: [
        (rand() - 0.5) * 14,
        (rand() - 0.5) * 9,
        -rand() * 9 - 1,
      ],
      rotationSpeed: [
        (rand() - 0.5) * 0.12,
        (rand() - 0.5) * 0.12,
        (rand() - 0.5) * 0.08,
      ],
      bobSpeed: 0.12 + rand() * 0.22,
      bobOffset: rand() * Math.PI * 2,
      scale: 0.35 + rand() * 0.85,
      kind: Math.floor(rand() * 3) as 0 | 1 | 2,
      wireframe: rand() > 0.55,
    });
  }
  return shapes;
}

function Shape({
  def,
  color,
  wireColor,
  metalness,
  roughness,
  opacity,
}: {
  def: ShapeDef;
  color: string;
  wireColor: string;
  metalness: number;
  roughness: number;
  opacity: number;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const mesh = ref.current;
    if (!mesh) return;
    mesh.rotation.x += def.rotationSpeed[0] * 0.01;
    mesh.rotation.y += def.rotationSpeed[1] * 0.01;
    mesh.rotation.z += def.rotationSpeed[2] * 0.01;
    mesh.position.y =
      def.position[1] +
      Math.sin(state.clock.elapsedTime * def.bobSpeed + def.bobOffset) * 0.4;
  });

  const geometry = useMemo(() => {
    if (def.kind === 0) return <icosahedronGeometry args={[1, 0]} />;
    if (def.kind === 1) return <octahedronGeometry args={[1, 0]} />;
    return <torusGeometry args={[0.7, 0.25, 8, 24]} />;
  }, [def.kind]);

  return (
    <mesh
      ref={ref}
      position={def.position}
      scale={def.scale}
      rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}
    >
      {geometry}
      <meshStandardMaterial
        color={def.wireframe ? wireColor : color}
        wireframe={def.wireframe}
        metalness={metalness}
        roughness={roughness}
        transparent
        opacity={def.wireframe ? opacity * 1.35 : opacity}
      />
    </mesh>
  );
}

function ScrollRig({
  reduceMotion,
  fogRef,
}: {
  reduceMotion: boolean;
  fogRef: MutableRefObject<THREE.Fog | null>;
}) {
  const { camera } = useThree();
  const scrollRef = useRef(0);
  const targetRef = useRef(0);

  useFrame(() => {
    if (reduceMotion) return;
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    targetRef.current = max > 0 ? window.scrollY / max : 0;
    // ease toward target scroll progress for a smooth cinematic dolly
    scrollRef.current += (targetRef.current - scrollRef.current) * 0.055;
    const p = scrollRef.current;

    camera.position.y = -p * 3.6;
    camera.position.x = Math.sin(p * Math.PI) * 0.75;
    camera.position.z = 6 - p * 1.35;
    camera.rotation.z = Math.sin(p * Math.PI * 2) * 0.02;
    if ("fov" in camera) {
      const persp = camera as THREE.PerspectiveCamera;
      persp.fov = 55 - p * 4;
      persp.updateProjectionMatrix();
    }
    camera.lookAt(0, camera.position.y - 1.1, -4);

    const fog = fogRef.current;
    if (fog) {
      fog.near = 6 - p * 2.2;
      fog.far = 16 - p * 3.5;
    }
  });

  return null;
}

/**
 * Ambient 3D field tuned to the portrait: sage suit, silver car, warm beige
 * daylight — rather than neon indigo/cyan that fought the photo.
 */
export function FloatingField({ isDark, reduceMotion }: FloatingFieldProps) {
  const shapes = useMemo(() => makeShapes(), []);
  const fogRef = useRef<THREE.Fog | null>(null);

  const palette = isDark
    ? {
        color: "#9aa68e",
        wireColor: "#c9d0d6",
        ambient: "#1a1c18",
        key: "#d6c4a4",
        fill: "#8a9aa8",
        fog: "#0e100e",
        metalness: 0.28,
        roughness: 0.48,
        opacity: 0.48,
      }
    : {
        color: "#8f9d82",
        wireColor: "#7a858f",
        ambient: "#f5f2eb",
        key: "#c4b49a",
        fill: "#a8b4bc",
        fog: "#f7f4ee",
        metalness: 0.12,
        roughness: 0.62,
        opacity: 0.36,
      };

  return (
    <>
      <color attach="background" args={[palette.fog]} />
      <fog
        ref={fogRef}
        attach="fog"
        args={[palette.fog, 6, 16]}
      />
      <ambientLight intensity={isDark ? 0.55 : 0.95} color={palette.ambient} />
      <directionalLight
        position={[4, 6, 5]}
        intensity={isDark ? 1.05 : 0.85}
        color={palette.key}
      />
      <pointLight
        position={[-6, -3, -2]}
        intensity={isDark ? 0.45 : 0.28}
        color={palette.fill}
      />

      <ScrollRig reduceMotion={reduceMotion} fogRef={fogRef} />

      {shapes.map((def, i) => (
        <Shape
          key={i}
          def={def}
          color={palette.color}
          wireColor={palette.wireColor}
          metalness={palette.metalness}
          roughness={palette.roughness}
          opacity={palette.opacity}
        />
      ))}
    </>
  );
}
