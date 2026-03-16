import React from "react";
import { Stars, Float, SpotLight } from "@react-three/drei";
import * as THREE from "three";

export default function Environment() {
  return (
    <>
      <color attach="background" args={["#05010a"]} />
      <fog attach="fog" args={["#05010a", 10, 30]} />
      
      {/* Background Ambience */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <ambientLight intensity={0.2} />

      {/* Cinematic Spotlights from corners */}
      <SpotLight
        position={[10, 15, 10]}
        angle={0.3}
        penumbra={1}
        intensity={2}
        castShadow
        color="#8B5CF6"
      />
      <SpotLight
        position={[-10, 15, 10]}
        angle={0.3}
        penumbra={1}
        intensity={2}
        castShadow
        color="#06B6D4"
      />
      <SpotLight
        position={[10, 15, -10]}
        angle={0.4}
        penumbra={1}
        intensity={1}
        color="#8B5CF6"
      />
      <SpotLight
        position={[-10, 15, -10]}
        angle={0.4}
        penumbra={1}
        intensity={1}
        color="#06B6D4"
      />

      {/* The Pit Glow (Bottom Center) */}
      <mesh position={[0, -10, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshBasicMaterial color="#8B5CF6" transparent opacity={0.2} />
      </mesh>
      
      <pointLight 
        position={[0, -5, 0]} 
        intensity={10} 
        distance={20} 
        color="#8B5CF6" 
      />

      {/* Floating Particles/Debris */}
      <Float speed={1.5} rotationIntensity={1} floatIntensity={1}>
        <group position={[0, 0, -5]}>
          {[...Array(20)].map((_, i) => (
            <mesh 
              key={i} 
              position={[
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 10
              ]}
            >
              <boxGeometry args={[0.1, 0.1, 0.1]} />
              <meshStandardMaterial 
                color={i % 2 === 0 ? "#8B5CF6" : "#06B6D4"} 
                emissive={i % 2 === 0 ? "#8B5CF6" : "#06B6D4"}
                emissiveIntensity={2}
              />
            </mesh>
          ))}
        </group>
      </Float>
    </>
  );
}
