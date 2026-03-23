import React, { useMemo, Suspense } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { PerspectiveCamera, Text } from "@react-three/drei";
import * as THREE from "three";
import { Physics, usePlane } from "@react-three/cannon";
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

const PLATFORM_CONFIGS: PlatformConfig[] = [
  { id: "A", label: "A", position: [-10.5, 0.0, 3], scale: [1.2, 1.2, 1.2] },
  { id: "B", label: "B", position: [-3.5, 0.0, 3], scale: [1.2, 1.2, 1.2] },
  { id: "C", label: "C", position: [3.5, 0.0, 3], scale: [1.2, 1.2, 1.2] },
  { id: "D", label: "D", position: [10.5, 0.0, 3], scale: [1.2, 1.2, 1.2] },
];

interface GameSceneProps {
  phase?: string;
  distribution: Record<string, number>;
  options: OptionDef[];
  revealedAnswer: string | null;
  trapdoorPlatforms: string[];
  onPlatformClick?: (label: string) => void;
  selectedPlatform?: string | null;
  currentToken?: string;
}

import { useGame } from "@/context/GameContext";

function SourceStack({ amount, token }: { amount: number, token: string }) {
  const tokenCount = Math.floor(amount / 100);
  const position: [number, number, number] = [0, 0, -2]; // Behind the platforms center

  return (
    <group position={position}>
      {/* Optional: A small pedestal for the source stack */}
      <mesh position={[0, -0.05, 0]}>
        <cylinderGeometry args={[0.8, 1, 0.1, 32]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {Array.from({ length: tokenCount }, (_, i) => {
        const heightIdx = i; // Single vertical stack
        const y = 0.05 + heightIdx * 0.1;

        return (
          <Token3D
            key={`source-${i}`}
            position={[0, y, 0]}
            label={token}
            falling={false}
          />
        );
      })}
      
      {tokenCount > 0 && (
         <Text
           position={[0, (tokenCount * 0.1) + 0.5, 0]}
           fontSize={0.4}
           color="#22d3ee"
           font="/fonts/Inter-Bold.woff"
         >
           POOL
         </Text>
      )}
    </group>
  );
}

function Platforms({ distribution, options, revealedAnswer, trapdoorPlatforms, onPlatformClick, selectedPlatform, currentToken }: GameSceneProps) {
  const { currentToken: stateToken, state } = useGame();
  const activeToken = currentToken || stateToken || "₿";

  const totalDistributed = Object.values(distribution).reduce((a, b) => a + b, 0);
  const available = state.tokens - totalDistributed;

  const optionMap = useMemo(() => {
    const m: Record<string, string> = {};
    if (options && Array.isArray(options)) {
      options.forEach(o => { if (o && o.label) m[o.label] = o.text; });
    }
    return m;
  }, [options]);

  return (
    <>
      <SourceStack amount={available} token={activeToken} />
      {PLATFORM_CONFIGS.map((cfg) => {
        const rawAmount = distribution[cfg.id] || 0;
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
              scale={cfg.scale}
            />
            {Array.from({ length: tokenCount }, (_, i) => {
              const gridX = (i % 2) * 0.35 - 0.175;
              const gridZ = (Math.floor(i / 2) % 2) * 0.35 - 0.175;
              const heightIdx = Math.floor(i / 4);

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
                  label={activeToken}
                  falling={false}
                />
              );
            })}
          </group>
        );
      })}
    </>
  );
}

function PhysicsFloor() {
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, -10.5, 0],
    type: "Static"
  }));

  return (
    <mesh ref={ref as any} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color="#0a0212" roughness={0.8} />
    </mesh>
  );
}

function SceneContent(props: GameSceneProps) {
  return (
    <Physics gravity={[0, -9.81, 0]}>
      <Environment />
      <Platforms {...props} />
      <PhysicsFloor />
    </Physics>
  );
}

function ResponsiveCamera() {
  const { size } = useThree();
  const aspect = size.width / size.height;
  const isPortrait = aspect < 1.1;

  const position: [number, number, number] = isPortrait ? [0, 14, 20] : [0, 7, 13];
  const fov = isPortrait ? 65 : 60;

  return <PerspectiveCamera makeDefault position={position} fov={fov} />;
}

export default function GameScene(props: GameSceneProps) {
  const showPlatforms = props.phase === "playing" || props.phase === "reveal";

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
        {showPlatforms ? (
          <SceneContent {...props} />
        ) : (
          <Environment />
        )}
      </Suspense>
    </Canvas>
  );
}
