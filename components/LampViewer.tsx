
"use client";

import { Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import {
  ContactShadows,
  OrbitControls,
  useGLTF,
} from "@react-three/drei";
import * as THREE from "three";

const BASE_FILES = [
  "/models/base-01.glb",
  "/models/base-02.glb",
  "/models/base-03.glb",
];

const SHADE_FILES = [
  "/models/shade-01.glb",
  "/models/shade-02.glb",
  "/models/shade-03.glb",
  "/models/shade-04.glb",
  "/models/shade-05.glb",
];

// Provisional heights based on your original models.
const BASE_HEIGHTS = [0.355, 0.345, 0.344];

type PartProps = {
  url: string;
  color: string;
  glow?: boolean;
  type: "base" | "shade";
};

function Part({
  url,
  color,
  glow = false,
  type,
}: PartProps) {
  const { scene } = useGLTF(url);

  const model = useMemo(() => {
    const copy = scene.clone(true);

    copy.traverse((item) => {
      if (!(item instanceof THREE.Mesh)) return;

      const isShade = type === "shade";

      item.material = isShade
        ? new THREE.MeshPhysicalMaterial({
            color: new THREE.Color(color),
            roughness: 0.62,
            metalness: 0,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.9,
            depthWrite: true,
            emissive: new THREE.Color(
              glow ? "#ffcf91" : "#000000"
            ),
            emissiveIntensity: glow ? 0.32 : 0,
          })
        : new THREE.MeshStandardMaterial({
            color: new THREE.Color(color),
            roughness: 0.8,
            metalness: 0,
            side: THREE.DoubleSide,
          });

      item.castShadow = true;
      item.receiveShadow = !isShade;
    });

    return copy;
  }, [scene, color, glow, type]);

  return <primitive object={model} />;
}

type LampProps = {
  base: number;
  shade: number;
  baseColor: string;
  shadeColor: string;
  lit: boolean;
};

function Assembly({
  base,
  shade,
  baseColor,
  shadeColor,
  lit,
}: LampProps) {
  const baseHeight = BASE_HEIGHTS[base];

  return (
    <group>
      <Part
        url={BASE_FILES[base]}
        color={baseColor}
        type="base"
      />

      <group position={[0, baseHeight - 0.12, 0]}>
        <Part
          url={SHADE_FILES[shade]}
          color={shadeColor}
          glow={lit}
          type="shade"
        />

        {lit && (
          <pointLight
            position={[0, 0.26, 0]}
            color="#ffd6a1"
            intensity={1.8}
            distance={2.5}
            decay={2}
          />
        )}
      </group>
    </group>
  );
}

export default function LampViewer({
  base,
  shade,
  baseColor,
  shadeColor,
  lit,
}: LampProps) {
  return (
    <Canvas
      shadows
      camera={{
        position: [1.6, 1.2, 1.9],
        fov: 35,
      }}
      dpr={[1, 1.75]}
      gl={{
        antialias: true,
        alpha: false,
      }}
    >
      {/* BLACK STUDIO BACKGROUND */}
      <color
        attach="background"
        args={["#080808"]}
      />

      <ambientLight intensity={0.85} />

      {/* MAIN STUDIO LIGHT */}
      <directionalLight
        position={[2.5, 4, 3]}
        intensity={2.4}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0001}
      />

      {/* SIDE LIGHT FOR RIBBED DETAILS */}
      <directionalLight
        position={[-3, 2, -1.5]}
        intensity={1.15}
        color="#dce8ff"
      />

      {/* SOFT FRONT LIGHT */}
      <spotLight
        position={[0, 3, 3]}
        intensity={0.8}
        angle={0.65}
        penumbra={1}
        distance={8}
      />

      {/* MATTE BLACK STUDIO FLOOR */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.02, 0]}
        receiveShadow
      >
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial
          color="#101010"
          roughness={0.94}
          metalness={0}
        />
      </mesh>

      <Suspense fallback={null}>
        <Assembly
          base={base}
          shade={shade}
          baseColor={baseColor}
          shadeColor={shadeColor}
          lit={lit}
        />

        <ContactShadows
          position={[0, -0.012, 0]}
          opacity={0.3}
          scale={2.5}
          blur={2.8}
          far={1}
        />
      </Suspense>

      <OrbitControls
        target={[0, 0.53, 0]}
        minDistance={1.35}
        maxDistance={5}
        enablePan={false}
        maxPolarAngle={Math.PI / 2}
      />
    </Canvas>
  );
}
