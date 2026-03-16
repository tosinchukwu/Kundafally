import React, { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";

interface Token3DProps {
  position: [number, number, number];
  label?: string;
  falling?: boolean;
  onFallComplete?: () => void;
}

export default function Token3D({ position, label = "₿", falling = false, onFallComplete }: Token3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [pos, setPos] = useState<THREE.Vector3>(new THREE.Vector3(...position));
  const [vel, setVel] = useState(new THREE.Vector3(
    (Math.random() - 0.5) * 0.05,
    0,
    (Math.random() - 0.5) * 0.05
  ));
  const [fallen, setFallen] = useState(false);
  const gravity = -0.015;
  const bounce = 0.4;
  const floorY = -8;

  // Float animation when not falling
  const floatOffset = useRef(Math.random() * Math.PI * 2);

  useFrame((state) => {
    if (!groupRef.current || fallen) return;

    if (falling) {
      // Apply gravity
      vel.y += gravity;
      pos.x += vel.x;
      pos.y += vel.y;
      pos.z += vel.z;

      // Bounce on "floor" before disappearing
      if (pos.y < floorY && Math.abs(vel.y) > 0.01) {
        vel.y *= -bounce;
        vel.x *= 0.8;
        vel.z *= 0.8;
      }

      if (pos.y < floorY - 3) {
        setFallen(true);
        onFallComplete?.();
      }

      groupRef.current.position.copy(pos);
      groupRef.current.rotation.z += 0.05;
      groupRef.current.rotation.x += 0.03;

      // Fade out as it falls
      if (groupRef.current) {
        const opacity = Math.max(0, 1 - (floorY - pos.y) / 5);
        groupRef.current.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            if (child.material && (child.material as THREE.MeshStandardMaterial).transparent !== undefined) {
              (child.material as THREE.MeshStandardMaterial).opacity = opacity;
            }
          }
        });
      }
    } else {
      // Gentle floating
      const t = state.clock.elapsedTime + floatOffset.current;
      groupRef.current.position.set(
        position[0],
        position[1] + Math.sin(t) * 0.05,
        position[2]
      );
    }
  });

  if (fallen) return null;

  return (
    <group ref={groupRef} position={position}>
      {/* Coin cylinder */}
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.28, 0.28, 0.08, 32]} />
        <meshStandardMaterial
          color="#f59e0b"
          emissive="#d97706"
          emissiveIntensity={0.5}
          metalness={0.95}
          roughness={0.05}
          transparent
          opacity={1}
        />
      </mesh>

      {/* Coin face inner ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.045]}>
        <ringGeometry args={[0.18, 0.26, 32]} />
        <meshStandardMaterial
          color="#fbbf24"
          emissive="#fbbf24"
          emissiveIntensity={2}
          side={THREE.DoubleSide}
          transparent
          opacity={1}
        />
      </mesh>

      {/* Label on coin */}
      <Text
        position={[0, 0.01, 0.05]}
        rotation={[0, 0, 0]}
        fontSize={0.22}
        color="#7c2d12"
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>

      {/* Glow halo */}
      <pointLight
        position={[0, 0, 0.1]}
        intensity={1.2}
        distance={1.5}
        color="#fef08a"
      />
    </group>
  );
}
