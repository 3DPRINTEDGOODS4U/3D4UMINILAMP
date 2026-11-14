
"use client";

import { Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";

// YOUR ACTUAL LAMP MODELS
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

// HOW FAR THE SHADE OVERLAPS THE BASE
const SHADE_OVERLAP = 0.12;

type PartProps = {
  url: string;
  color: string;
  glow?: boolean;
  type: "base" | "shade";
};

// REALISTIC 3D PRINTED MATERIALS
function Part({ url, color, glow = false, type }: PartProps) {
  const { scene } = useGLTF(url);

  const model = useMemo(() => {
    const copy = scene.clone(true);
    const isShade = type === "shade";

    copy.traverse((item) => {
      if (!(item instanceof THREE.Mesh)) return;

      // Recalculate normals to better reveal geometry.
      const geometry = item.geometry.clone();
      geometry.computeVertexNormals();
      item.geometry = geometry;

      item.material = isShade
        ? new THREE.MeshPhysicalMaterial({
            color: new THREE.Color(color),
            roughness: 0.78,
            metalness: 0,
            side: THREE.DoubleSide,

            // Subtle shade translucency
            transparent: true,
            opacity: 0.94,
            depthWrite: true,

            // Gentle warm glow, retaining shadows on ribs
            emissive: new THREE.Color("#ffbd72"),
            emissiveIntensity: glow ? 0.13 : 0,

            clearcoat: 0,
          })
        : new THREE.MeshStandardMaterial({
            color: new THREE.Color(color),
            roughness: 0.88,
            metalness: 0,
            side: THREE.DoubleSide,
          });

      item.castShadow = true;
      item.receiveShadow = true;
    });

    return copy;
  }, [scene, color, glow, type]);

  return <primitive object={model} />;
}

// PROCEDURAL DARK WOOD TABLE TEXTURE
function TableSurface() {
  const texture = useMemo(() => {
    const width = 256;
    const height = 256;
    const data = new Uint8Array(width * height * 4);

    // Stable noise without external images
    const noise = (x: number, y: number) => {
      const value = Math.sin(
        x * 127.1 + y * 311.7
      ) * 43758.5453;
      return value - Math.floor(value);
    };

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const index = (y * width + x) * 4;

        // Fine, natural-looking linear grain
        const wave =
          Math.sin(
            y * 0.42 +
            Math.sin(x * 0.035) * 1.8
          ) * 2.8;

        const fine = noise(x, y) * 3;
        const grain = wave + fine;

        // Very dark charcoal-brown wood
        data[index] = Math.max(0, 35 + grain);
        data[index + 1] = Math.max(0, 30 + grain);
        data[index + 2] = Math.max(0, 27 + grain);
        data[index + 3] = 255;
      }
    }

    const tex = new THREE.DataTexture(
      data,
      width,
      height,
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
        roughness={0.87}
        metalness={0}
      />
    </mesh>
  );
}

// ASSEMBLE BASE + SHADE
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
          type="shade"
          glow={lit}
        />

        {lit && (
          <>
            <pointLight
              position={[0, 0.32, 0]}
              color="#ffcb87"
              intensity={5}
              distance={1.5}
              decay={2}
            />

            <pointLight
              position={[0, 0.12, 0.05]}
              color="#ffdba7"
              intensity={1}
              distance={1.2}
              decay={2}
            />
          </>
        )}
      </group>
    </group>
  );
}

// COMPLETE BLACK STUDIO
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
      {/* SEAMLESS BLACK BACKGROUND */}
      <color
        attach="background"
        args={["#080808"]}
      />

      {/* FADE THE FLOOR INTO THE BACKGROUND */}
      <fog
        attach="fog"
        args={["#080808", 2.5, 12]}
      />

      {/* LOW AMBIENT LIGHT */}
      <ambientLight intensity={0.38} />

      {/* MAIN SOFT KEY LIGHT */}
      <directionalLight
        position={[3, 4, 3]}
        intensity={2.8}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.00015}
        shadow-radius={5}
        shadow-camera-left={-2.5}
        shadow-camera-right={2.5}
        shadow-camera-top={2.5}
        shadow-camera-bottom={-2.5}
      />

      {/* SIDE GRAZING LIGHT - REVEALS FLUTES */}
      <directionalLight
        position={[-2.5, 1.8, 0.5]}
        intensity={1.75}
        color="#d7e2ff"
      />

      {/* WARM SIDE RIM LIGHT */}
      <directionalLight
        position={[1, 1.5, -3]}
        intensity={1.5}
        color="#ffe2bf"
      />

      {/* FRONT FILL */}
      <spotLight
        position={[0.5, 3, 4]}
        intensity={1.1}
        angle={0.65}
        penumbra={1}
        distance={8}
      />

      {/* INFINITE DARK TABLE */}
      <TableSurface />

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
