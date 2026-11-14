"use client";
import { Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, ContactShadows, Environment, useGLTF } from "@react-three/drei";
import * as THREE from "three";

const BASE_FILES = ["/models/base-01.glb", "/models/base-02.glb", "/models/base-03.glb"];
const SHADE_FILES = ["/models/shade-01.glb", "/models/shade-02.glb", "/models/shade-03.glb", "/models/shade-04.glb", "/models/shade-05.glb"];
// Source STL heights: 35.51, 34.50, 34.49 mm. All GLBs are scaled 1/100.
const BASE_HEIGHTS = [0.3551, 0.3450, 0.3449];

function Part({ url, color, glow = false }: { url: string; color: string; glow?: boolean }) {
  const { scene } = useGLTF(url);
  const model = useMemo(() => {
    const copy = scene.clone(true);
    copy.traverse((item) => {
      if (item instanceof THREE.Mesh) {
        const makeMaterial = () => new THREE.MeshStandardMaterial({
          color,
          roughness: glow ? 0.52 : 0.75,
          metalness: 0,
          side: THREE.DoubleSide,
          emissive: glow ? new THREE.Color(color) : new THREE.Color("#000000"),
          emissiveIntensity: glow ? 0.20 : 0,
        });
        item.material = makeMaterial();
        item.castShadow = true;
        item.receiveShadow = true;
      }
    });
    return copy;
  }, [scene, color, glow]);
  return <primitive object={model} />;
}

function Assembly({base,shade,baseColor,shadeColor,lit}:{base:number;shade:number;baseColor:string;shadeColor:string;lit:boolean}) {
  const baseHeight = BASE_HEIGHTS[base];
  return <group>
    <Part url={BASE_FILES[base]} color={baseColor}/>
    {/* Provisional attachment position: bottom of shade meets top of base. */}
   <group position={[0, baseHeight - 0.12, 0]}>
      <Part url={SHADE_FILES[shade]} color={shadeColor} glow={lit}/>
      {lit && <pointLight position={[0,0.26,0]} color="#ffd6a1" intensity={1.2} distance={2} />}
    </group>
  </group>;
}

export default function LampViewer({base,shade,baseColor,shadeColor,lit}:{base:number;shade:number;baseColor:string;shadeColor:string;lit:boolean}) {
  return <Canvas shadows camera={{position:[1.6,1.2,1.9],fov:35}} gl={{antialias:true}} dpr={[1,1.8]}>
     <color attach="background" args={["#080808"]} />
    
<mesh
  rotation={[-Math.PI / 2, 0, 0]}
  position={[0, -0.02, 0]}
  receiveShadow
>
  <planeGeometry args={[200, 200]} />
  <meshStandardMaterial
    color="#101010"
    roughness={0.9}
    metalness={0.05}
  />
</mesh>
    <ambientLight intensity={2.2}/>
    <directionalLight position={[2,3,4]} intensity={2.8} castShadow shadow-mapSize={[1024,1024]}/>
    <Suspense fallback={null}>
      <Assembly base={base} shade={shade} baseColor={baseColor} shadeColor={shadeColor} lit={lit}/>
      <ContactShadows position={[0,-0.012,0]} opacity={0.25} scale={2.5} blur={2.3} far={1}/>
      <Environment preset="city" environmentIntensity={0.25}/>
    </Suspense>
    <OrbitControls target={[0,0.53,0]} minDistance={1.35} maxDistance={5} enablePan={false} maxPolarAngle={Math.PI/2}/>
  </Canvas>;
}

BASE_FILES.forEach((url) => useGLTF.preload(url));
SHADE_FILES.forEach((url) => useGLTF.preload(url));
