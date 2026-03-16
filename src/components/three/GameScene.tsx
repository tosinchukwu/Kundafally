import React, { useMemo, Suspense, useRef, useEffect } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { PerspectiveCamera, useProgress, Html, SpotLight } from "@react-three/drei";
import { EffectComposer, Bloom, Noise, ToneMapping } from "@react-three/postprocessing";
import * as THREE from "three";
import Environment from "./Environment";
import Platform3D from "./Platform3D";
import Token3D from "./Token3D";


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
  phase?: string;
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
    if (options && Array.isArray(options)) {
      options.forEach(o => { if (o && o.label) m[o.label] = o.text; });
    }
    return m;
  }, [options]);

  console.log("3D Platforms rendering with options count:", options?.length);
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
          <group 
            key={cfg.id} 
            onClick={(e) => {
              e.stopPropagation();
              console.log("3D Group Clicked:", cfg.id);
              onPlatformClick?.(cfg.id);
            }}
          >
            <Platform3D
              position={cfg.position}
              label={cfg.label}
              answerText={answerText}
              isSelected={isSelected}
              isCorrect={isCorrect}
              isWrong={isWrong}
              trapdoorOpen={trapdoorOpen}
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

function SceneContent({ distribution, options, revealedAnswer, trapdoorPlatforms, onPlatformClick, selectedPlatform }: GameSceneProps) {
  const { camera } = useThree();
  const initialCameraPos = useMemo(() => camera.position.clone(), [camera]);
  const shakeRef = useRef(0);

  useEffect(() => {
    if (trapdoorPlatforms.length > 0) {
      shakeRef.current = 0.5; // Trigger shake
    }
  }, [trapdoorPlatforms]);

  useFrame((state) => {
    if (shakeRef.current > 0.01) {
      const s = shakeRef.current;
      camera.position.x = initialCameraPos.x + (Math.random() - 0.5) * s;
      camera.position.y = initialCameraPos.y + (Math.random() - 0.5) * s;
      shakeRef.current *= 0.9; // Decay
    } else {
      camera.position.copy(initialCameraPos);
    }
  });

  return (
    <>
      <Environment />
      <Platforms
        distribution={distribution}
        options={options}
        revealedAnswer={revealedAnswer}
        trapdoorPlatforms={trapdoorPlatforms}
        onPlatformClick={onPlatformClick}
        selectedPlatform={selectedPlatform}
      />

      {/* Cinematic Reveal: God Ray on Correct Platform */}
      {revealedAnswer && (
        <group>
          {(() => {
            const cfg = PLATFORM_CONFIGS.find(c => c.id === revealedAnswer);
            if (!cfg) return null;
            return (
              <>
                <mesh position={[cfg.position[0], cfg.position[1] + 10, cfg.position[2]]}>
                  <cylinderGeometry args={[0.05, 3, 20, 32]} />
                  <meshBasicMaterial color="#4ade80" transparent opacity={0.3} />
                </mesh>
                <SpotLight
                  position={[cfg.position[0], cfg.position[1] + 15, cfg.position[2]]}
                  target-position={[cfg.position[0], cfg.position[1], cfg.position[2]]}
                  angle={0.15}
                  penumbra={1}
                  intensity={10}
                  color="#4ade80"
                />
                <pointLight 
                  position={[cfg.position[0], cfg.position[1] + 2, cfg.position[2]]} 
                  intensity={5} 
                  color="#4ade80" 
                />
              </>
            );
          })()}
        </group>
      )}

      {/* Pit floor */}
      <mesh position={[0, -10.5, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#0a0212" roughness={0.8} />
      </mesh>
    </>
  );
}

function ResponsiveCamera() {
  const { size } = useThree();
  const aspect = size.width / size.height;
  const isPortrait = aspect < 1.1;

  // On mobile (portrait), we pull back and increase FOV to see all platforms
  const position: [number, number, number] = isPortrait ? [0, 14, 20] : [0, 7, 13];
  const fov = isPortrait ? 65 : 60;

  return <PerspectiveCamera makeDefault position={position} fov={fov} />;
}

export default function GameScene({
  phase,
  distribution,
  options,
  revealedAnswer,
  trapdoorPlatforms,
  onPlatformClick,
  selectedPlatform,
}: GameSceneProps) {
  const showPlatforms = phase === "playing" || phase === "reveal";

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
      <ResponsiveCamera />
      
      <Suspense fallback={null}>
        {showPlatforms && (
          <SceneContent
            distribution={distribution}
            options={options}
            revealedAnswer={revealedAnswer}
            trapdoorPlatforms={trapdoorPlatforms}
            onPlatformClick={onPlatformClick}
            selectedPlatform={selectedPlatform}
          />
        )}
        {!showPlatforms && <Environment />}
      </Suspense>
    </Canvas>
  );
}
