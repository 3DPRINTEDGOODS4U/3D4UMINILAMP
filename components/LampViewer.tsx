
"use client";

import { Suspense, useMemo, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";

// YOUR 3 BASES AND 5 SHADES
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

const BASE_HEIGHTS = [0.3551, 0.345, 0.3449];

// Smaller value raises the shade.
const SHADE_OVERLAP = 0.10;

type LampProps = {
  base: number;
  shade: number;
  baseColor: string;
  shadeColor: string;
  lit: boolean;
};

type PartProps = {
  url: string;
  color: string;
  glow?: boolean;
  type: "base" | "shade";
};

// 3D PRINTED MATERIALS
function Part({
  url,
  color,
  glow = false,
  type,
}: PartProps) {
  const { scene } = useGLTF(url);

  const model = useMemo(() => {
    const copy = scene.clone(true);
    const isShade = type === "shade";

    copy.traverse((item) => {
      if (!(item instanceof THREE.Mesh)) return;

      const geometry = item.geometry.clone();
      geometry.computeVertexNormals();
      item.geometry = geometry;

      if (isShade) {
        item.material = new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(color),
          roughness: 0.82,
          metalness: 0,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.92,
          depthWrite: true,
          emissive: new THREE.Color("#ffc98c"),
          emissiveIntensity: glow ? 0.18 : 0,
        });
      } else {
        item.material = new THREE.MeshStandardMaterial({
          color: new THREE.Color(color),
          roughness: 0.86,
          metalness: 0,
          side: THREE.DoubleSide,
        });
      }

      item.castShadow = false;
      item.receiveShadow = false;
    });

    return copy;
  }, [scene, color, glow, type]);

  useEffect(() => {
    return () => {
      model.traverse((item) => {
        if (item instanceof THREE.Mesh) {
          (item.material as THREE.Material).dispose();
          item.geometry.dispose();
        }
      });
    };
  }, [model]);

  return <primitive object={model} />;
}

// ASSEMBLE BASE AND SHADE
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

      <group
        position={[
          0,
          baseHeight - SHADE_OVERLAP,
          0,
        ]}
      >
        <Part
          url={SHADE_FILES[shade]}
          color={shadeColor}
          glow={lit}
          type="shade"
        />

        {/* ONE INTERNAL WARM LIGHT */}
        {lit && (
          <pointLight
            position={[0, 0.32, 0]}
            color="#ffd5a0"
            intensity={2.5}
            distance={1.8}
            decay={2}
          />
        )}
      </group>
    </group>
  );
}

// SEAMLESS BLACK 3D VIEWER
export default function LampViewer({
  base,
  shade,
  baseColor,
  shadeColor,
  lit,
}: LampProps) {
  return (
    <Canvas
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
      {/* EXACT BLACK BACKGROUND */}
      <color
        attach="background"
        args={["#000000"]}
      />

      {/* SOFT AMBIENT LIGHTING */}
      <ambientLight intensity={0.45} />

      <hemisphereLight
        args={["#ffffff", "#a8a8a8", 0.55]}
      />

      {/* GRAZING LIGHTS TO REVEAL THE FLUTES */}
      <directionalLight
        position={[3, 2, 1]}
        intensity={1.5}
        castShadow={false}
      />

      <directionalLight
        position={[-3, 2, -1]}
        intensity={1.1}
        castShadow={false}
      />

      <directionalLight
        position={[0, 2, -3]}
        intensity={0.7}
        castShadow={false}
      />

      {/* NO FLOOR, NO SQUARE, NO HORIZON LINE */}

      <Suspense fallback={null}>
        <Assembly
          base={base}
          shade={shade}
          baseColor={baseColor}
          shadeColor={shadeColor}
          lit={lit}
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

BASE_FILES.forEach((url) => useGLTF.preload(url));
SHADE_FILES.forEach((url) => useGLTF.preload(url));
