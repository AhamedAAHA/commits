import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
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
        (rand() - 0.5) * 0.15,
        (rand() - 0.5) * 0.15,
        (rand() - 0.5) * 0.1,
      ],
      bobSpeed: 0.15 + rand() * 0.25,
      bobOffset: rand() * Math.PI * 2,
      scale: 0.35 + rand() * 0.85,
      kind: (Math.floor(rand() * 3) as 0 | 1 | 2),
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
        opacity={def.wireframe ? opacity * 1.4 : opacity}
      />
    </mesh>
  );
}

function ScrollRig({ reduceMotion }: { reduceMotion: boolean }) {
  const { camera } = useThree();
  const scrollRef = useRef(0);
  const targetRef = useRef(0);

  useFrame(() => {
    if (reduceMotion) return;
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    targetRef.current = max > 0 ? window.scrollY / max : 0;
    // ease toward target scroll progress for a smooth "camera dolly" feel
    scrollRef.current += (targetRef.current - scrollRef.current) * 0.06;

    camera.position.y = -scrollRef.current * 3.2;
    camera.position.x = Math.sin(scrollRef.current * Math.PI) * 0.6;
    camera.rotation.z = Math.sin(scrollRef.current * Math.PI * 2) * 0.015;
    camera.lookAt(0, camera.position.y - 1, -4);
  });

  return null;
}

export function FloatingField({ isDark, reduceMotion }: FloatingFieldProps) {
  const shapes = useMemo(() => makeShapes(), []);

  const palette = isDark
    ? {
        color: "#5b6bd6",
        wireColor: "#7fd8ff",
        ambient: "#1a1830",
        key: "#8b7cff",
        fill: "#4ce1ff",
        fog: "#0d0c18",
        metalness: 0.35,
        roughness: 0.35,
        opacity: 0.55,
      }
    : {
        color: "#7f8fe8",
        wireColor: "#5b6bd6",
        ambient: "#f3f2fb",
        key: "#8b7cff",
        fill: "#bcd9ff",
        fog: "#f8f7fc",
        metalness: 0.15,
        roughness: 0.55,
        opacity: 0.4,
      };

  return (
    <>
      <color attach="background" args={[palette.fog]} />
      <fog attach="fog" args={[palette.fog, 6, 16]} />
      <ambientLight intensity={isDark ? 0.5 : 0.9} color={palette.ambient} />
      <directionalLight
        position={[4, 6, 5]}
        intensity={isDark ? 1.1 : 0.8}
        color={palette.key}
      />
      <pointLight position={[-6, -3, -2]} intensity={isDark ? 0.6 : 0.3} color={palette.fill} />

      <ScrollRig reduceMotion={reduceMotion} />

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
