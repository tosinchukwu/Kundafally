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

import { useCylinder } from "@react-three/cannon";

// ... existing code ...

export default function Token3D({ position, label = "₿", falling = false, onFallComplete }: Token3DProps) {
  const [fallen, setFallen] = useState(false);
  const floatOffset = useRef(Math.random() * Math.PI * 2);

  // Physics body
  const [ref, api] = useCylinder(() => ({
    mass: 1,
    position: [position[0], position[1], position[2]],
    args: [0.28, 0.28, 0.08, 32],
    type: falling ? "Dynamic" : "Kinematic", // Kinematic when floating, Dynamic when falling
    rotation: [Math.PI / 2, 0, 0],
    onCollide: (e) => {
      // Optional: Add impact sounds or particles here
    }
  }), useRef<THREE.Group>(null));

  useFrame((state) => {
    if (fallen) return;

    if (!falling) {
      // Gentle floating (Kinematic control)
      const t = state.clock.elapsedTime + floatOffset.current;
      const y = position[1] + Math.sin(t) * 0.05;
      api.position.set(position[0], y, position[2]);
      api.rotation.set(Math.PI / 2, Math.sin(t * 0.5) * 0.1, 0);
    } else {
      // Logic to check if it has fallen deep enough to disappear
      // We can't easily get the position from API synchronously without a subscription
      // But we can subscribe to position to check for despawn
    }
  });

  useEffect(() => {
    if (!falling) return;
    
    // Subscribe to position for despawn check
    const unsubscribe = api.position.subscribe((p) => {
      if (p[1] < -15) {
        setFallen(true);
        onFallComplete?.();
      }
    });
    
    return unsubscribe;
  }, [falling, api, onFallComplete]);

  if (fallen) return null;

  return (
    <group ref={ref}>
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
