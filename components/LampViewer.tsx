
"use client";

import { Suspense, useMemo, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  ContactShadows,
  useGLTF,
} from "@react-three/drei";
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

// Base heights from the previous configurator
const BASE_HEIGHTS = [0.3551, 0.345, 0.3449];

// Smaller value raises the shade.
// 0.10 is the starting overlap setting.
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

// MATERIALS FOR 3D-PRINTED PARTS
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

      // Compute surface normals for STL-derived geometry.
      // Preserve the original ribbed mesh.
      geometry.computeVertexNormals();
      item.geometry = geometry;

      if (isShade) {
        item.material = new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(color),
          roughness: 0.82,
          metalness: 0,
          side: THREE.DoubleSide,

          // Slight translucency
          transparent: true,
          opacity: 0.92,
          depthWrite: true,

          // Soft, warm visible glow when ON
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

      item.castShadow = true;
      item.receiveShadow = false;
    });

    return copy;
  }, [scene, color, glow, type]);

  useEffect(() => {
    return () => {
      model.traverse((item) => {
        if (item instanceof THREE.Mesh) {
          item.material.dispose();
          item.geometry.dispose();
        }
      });
    };
  }, [model]);

  return <primitive object={model} />;
}

// PROCEDURAL DARK WOOD TABLETOP
function TableSurface() {
  const texture = useMemo(() => {
    const size = 256;
    const data = new Uint8Array(size * size * 4);

    const noise = (x: number, y: number) => {
      const n = Math.sin(
        x * 127.1 + y * 311.7
      ) * 43758.5453;
      return n - Math.floor(n);
    };

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const i = (y * size + x) * 4;

        const grain =
          Math.sin(
            y * 0.35 +
            Math.sin(x * 0.025) * 2
          ) * 3;

        const variation = noise(x, y) * 2;

        const v = grain + variation;

        data[i] = 34 + v;
        data[i + 1] = 29 + v;
        data[i + 2] = 27 + v;
        data[i + 3] = 255;
      }
    }

    const tex = new THREE.DataTexture(
      data,
      size,
      size,
      THREE.RGBAFormat
    );

    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(120, 120);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
    tex.needsUpdate = true;

    return tex;
  }, []);

  useEffect(() => {
    return () => texture.dispose();
  }, [texture]);

  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -0.015, 0]}
      receiveShadow
    >
      <planeGeometry args={[200, 200]} />
      <meshStandardMaterial
        map={texture}
        color="#d1c8c0"
        roughness={0.92}
        metalness={0}
      />
    </mesh>
  );
}

// ASSEMBLE THE LAMP
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

        {/* SINGLE WARM LIGHT SOURCE INSIDE THE SHADE */}
        {lit && (
          <pointLight
            position={[0, 0.32, 0]}
            color="#ffd5a0"
            intensity={2.5}
            distance={1.8}
            decay={2}
            castShadow={false}
          />
        )}
      </group>
    </group>
  );
}

// MAIN 3D VIEWER
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
      {/* BLACK BACKGROUND */}
      <color
        attach="background"
        args={["#080808"]}
      />

      {/* SEAMLESS STUDIO DEPTH */}
      />

      {/* EVEN, SHADOW-FREE ENVIRONMENT LIGHTING */}
     
{/* SOFT, EVEN AMBIENT LIGHTING */}
<ambientLight intensity={0.45} />

<hemisphereLight
  args={["#ffffff", "#a8a8a8", 0.55]}
/>

{/* GRAZING LIGHTS TO REVEAL VERTICAL FLUTES */}
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

     {/* Seamless matte-black studio floor */}
<mesh
  rotation={[-Math.PI / 2, 0, 0]}
  position={[0, -0.015, 0]}
  receiveShadow
>
  <planeGeometry args={[2000, 2000]} />

<meshBasicMaterial color="#080808" />

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

        {/* SOFT CONTACT SHADOW UNDER BASE */}
        <ContactShadows
          position={[0, -0.012, 0]}
          opacity={0.25}
          scale={2.5}
          blur={3.5}
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

BASE_FILES.forEach((url) => useGLTF.preload(url));
SHADE_FILES.forEach((url) => useGLTF.preload(url));
