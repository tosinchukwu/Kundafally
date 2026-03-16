import React, { useMemo, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera, useProgress, Html } from "@react-three/drei";
import { EffectComposer, Bloom, Noise, ToneMapping } from "@react-three/postprocessing";
import * as THREE from "three";
import Environment from "./Environment";
import Platform3D from "./Platform3D";
import Token3D from "./Token3D";

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="text-cyan-400 font-display font-black text-2xl tracking-tighter filter drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">
        {Math.round(progress)}%
      </div>
    </Html>
  );
}

interface OptionDef {
  label: string;
  text: string;
}

interface PlatformConfig {
  id: string;
  label: string;
  position: [number, number, number];
  scale: [number, number, number];
}

// Platforms matching the blueprint POV: A (front-left), D (front-right), B/C (back-center)
const PLATFORM_CONFIGS: PlatformConfig[] = [
  { id: "A", label: "A", position: [-4.5, 0.2, 3],  scale: [1.4, 1.4, 1.4] },
  { id: "B", label: "B", position: [-2.0, -1.3, 0], scale: [1.0, 1.0, 1.0] },
  { id: "C", label: "C", position: [2.0, -1.3, 0],  scale: [1.0, 1.0, 1.0] },
  { id: "D", label: "D", position: [4.5, 0.2, 3],   scale: [1.4, 1.4, 1.4] },
];

interface GameSceneProps {
  distribution: Record<string, number>;
  options: OptionDef[];
  revealedAnswer: string | null;
  trapdoorPlatforms: string[];
  onPlatformClick?: (label: string) => void;
  selectedPlatform?: string | null;
}

function Platforms({ distribution, options, revealedAnswer, trapdoorPlatforms, onPlatformClick, selectedPlatform }: GameSceneProps) {
  const optionMap = useMemo(() => {
    const m: Record<string, string> = {};
    options.forEach(o => { m[o.label] = o.text; });
    return m;
  }, [options]);

  return (
    <>
      {PLATFORM_CONFIGS.map((cfg) => {
        const rawAmount = distribution[cfg.id] || 0;
        // Show 1 token per 100 units, cap at 12 for performance/visuals
        const tokenCount = Math.min(Math.ceil(rawAmount / 100), 12);
        
        const isCorrect = revealedAnswer === cfg.id;
        const isWrong = revealedAnswer !== null && revealedAnswer !== cfg.id;
        const trapdoorOpen = trapdoorPlatforms.includes(cfg.id);
        const isSelected = selectedPlatform === cfg.id;
        const answerText = optionMap[cfg.id] || "";

        return (
          <group key={cfg.id}>
            <Platform3D
              position={cfg.position}
              label={cfg.label}
              answerText={answerText}
              isSelected={isSelected}
              isCorrect={isCorrect}
              isWrong={isWrong}
              trapdoorOpen={trapdoorOpen}
              onClick={() => onPlatformClick?.(cfg.id)}
              scale={cfg.scale}
            />
            {/* Tokens stacked on platform — Organized grid/stack */}
            {Array.from({ length: tokenCount }, (_, i) => {
              // Create a 2x2 grid stack if more than 4 tokens
              const gridX = (i % 2) * 0.35 - 0.175;
              const gridZ = (Math.floor(i / 2) % 2) * 0.35 - 0.175;
              const heightIdx = Math.floor(i / 4);
              
              // If few tokens, just stack them in center
              const x = tokenCount <= 1 ? 0 : gridX;
              const z = tokenCount <= 1 ? 0 : gridZ;
              const y = 0.45 + heightIdx * 0.18;

              return (
                <Token3D
                  key={i}
                  position={[
                    cfg.position[0] + x,
                    cfg.position[1] + y,
                    cfg.position[2] + z,
                  ]}
                  label="₿"
                  falling={trapdoorOpen}
                />
              );
            })}
          </group>
        );
      })}
    </>
  );
}

export default function GameScene({
  distribution,
  options,
  revealedAnswer,
  trapdoorPlatforms,
  onPlatformClick,
  selectedPlatform,
}: GameSceneProps) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.5]}
      style={{ width: "100%", height: "100%" }}
      gl={{ 
        antialias: true, 
        alpha: false,
        powerPreference: "high-performance"
      }}
      onCreated={({ gl }) => {
        gl.setClearColor(new THREE.Color("#05010a"));
      }}
    >
      <PerspectiveCamera makeDefault position={[0, 8, 14]} fov={55} />

      <Suspense fallback={<Loader />}>
        <Environment />
        <Platforms
          distribution={distribution}
          options={options}
          revealedAnswer={revealedAnswer}
          trapdoorPlatforms={trapdoorPlatforms}
          onPlatformClick={onPlatformClick}
          selectedPlatform={selectedPlatform}
        />

        {/* Pit floor */}
        <mesh position={[0, -10.5, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial color="#0a0212" roughness={0.8} />
        </mesh>

        <EffectComposer disableNormalPass>
          <Bloom 
            intensity={1.5} 
            luminanceThreshold={0.2} 
            luminanceSmoothing={0.9} 
            mipmapBlur 
          />
          <Noise opacity={0.03} />
          <ToneMapping />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
}
