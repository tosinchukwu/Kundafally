import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";

interface Platform3DProps {
  position: [number, number, number];
  label: string;
  answerText?: string;
  isSelected?: boolean;
  isCorrect?: boolean;
  isWrong?: boolean;
  trapdoorOpen?: boolean;
  onClick?: () => void;
  scale?: [number, number, number];
}


export default function Platform3D({
  position,
  label,
  answerText = "",
  isSelected = false,
  isCorrect = false,
  isWrong = false,
  trapdoorOpen = false,
  onClick,
  scale = [1, 1, 1],
}: Platform3DProps) {
  const leftDoorRef = useRef<THREE.Mesh>(null);
  const rightDoorRef = useRef<THREE.Mesh>(null);

  const baseColor = isCorrect ? "#22c55e" : isSelected ? "#A855F7" : "#4c1d95";
  const emissiveColor = isCorrect ? "#16a34a" : isSelected ? "#7c3aed" : "#2e1065";
  const emissiveIntensity = isCorrect ? 3 : isSelected ? 1 : 0.3;
  const backboardColor = isCorrect ? "#14532d" : "#1e1b4b";

  useFrame((state) => {
    if (leftDoorRef.current && rightDoorRef.current) {
      const targetAngle = trapdoorOpen ? -Math.PI / 1.8 : 0; // Slightly more than 90 deg for "swing"
      const speed = trapdoorOpen ? 0.15 : 0.1;
      
      leftDoorRef.current.rotation.z = THREE.MathUtils.lerp(
        leftDoorRef.current.rotation.z, targetAngle, speed
      );
      rightDoorRef.current.rotation.z = THREE.MathUtils.lerp(
        rightDoorRef.current.rotation.z, -targetAngle, speed
      );

      // Subtle vibration effect when open
      if (trapdoorOpen) {
        const vibration = Math.sin(state.clock.elapsedTime * 20) * 0.02;
        leftDoorRef.current.rotation.z += vibration;
        rightDoorRef.current.rotation.z -= vibration;
      }
    }
  });

  return (
    <group position={position} scale={scale} onClick={onClick}>
      {/* Vertical Backboard */}
      <mesh position={[0, 1.2, -0.5]} castShadow>
        <boxGeometry args={[1.6, 2.0, 0.15]} />
        <meshStandardMaterial
          color={backboardColor}
          emissive={backboardColor}
          emissiveIntensity={0.5}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Backboard neon edge */}
      <mesh position={[0, 1.2, -0.42]}>
        <boxGeometry args={[1.62, 2.02, 0.02]} />
        <meshStandardMaterial
          color={isCorrect ? "#22c55e" : "#A855F7"}
          emissive={isCorrect ? "#22c55e" : "#A855F7"}
          emissiveIntensity={2}
        />
      </mesh>

      {/* Letter Label on backboard */}
      <Text
        position={[0, 1.2, -0.34]}
        fontSize={1.0}
        color={isCorrect ? "#22c55e" : "#e2e8f0"}
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>

      {/* Platform Base */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.0, 0.25, 1.4]} />
        <meshStandardMaterial
          color={baseColor}
          emissive={emissiveColor}
          emissiveIntensity={emissiveIntensity}
          metalness={0.7}
          roughness={0.2}
        />
      </mesh>

      {/* Trapdoor Left */}
      <mesh
        ref={leftDoorRef}
        position={[-0.5, -0.05, 0]}
        castShadow
      >
        <boxGeometry args={[1.0, 0.1, 1.35]} />
        <meshStandardMaterial
          color={isWrong ? "#7f1d1d" : "#312e81"}
          emissive={isWrong ? "#ef4444" : "#4338ca"}
          emissiveIntensity={isWrong ? 2 : 0.5}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Trapdoor Right */}
      <mesh
        ref={rightDoorRef}
        position={[0.5, -0.05, 0]}
        castShadow
      >
        <boxGeometry args={[1.0, 0.1, 1.35]} />
        <meshStandardMaterial
          color={isWrong ? "#7f1d1d" : "#312e81"}
          emissive={isWrong ? "#ef4444" : "#4338ca"}
          emissiveIntensity={isWrong ? 2 : 0.5}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Neon Edge Glow at Base */}
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[2.02, 0.04, 1.42]} />
        <meshStandardMaterial
          color={isCorrect ? "#22c55e" : "#8B5CF6"}
          emissive={isCorrect ? "#22c55e" : "#8B5CF6"}
          emissiveIntensity={3}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Platform legs */}
      {[[-0.8, -0.3, 0], [0.8, -0.3, 0]].map((pos, i) => (
        <mesh key={i} position={pos as [number,number,number]}>
          <cylinderGeometry args={[0.05, 0.08, 0.5, 8]} />
          <meshStandardMaterial color="#4c1d95" metalness={0.9} roughness={0.1} />
        </mesh>
      ))}

      {/* Answer text label below the platform - centered and shifted forward */}
      {answerText && (
        <Text
          position={[0, -1.1, 0.8]}
          fontSize={0.32}
          color={isCorrect ? "#4ade80" : isSelected ? "#22d3ee" : "#d8b4fe"}
          anchorX="center"
          anchorY="top"
          maxWidth={2.8}
          textAlign="center"
          outlineWidth={0.02}
          outlineColor="#000000"
        >
          {answerText}
        </Text>
      )}
    </group>
  );
}
