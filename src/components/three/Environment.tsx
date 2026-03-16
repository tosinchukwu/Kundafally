import React from "react";
import { Stars, Float, SpotLight, Text, Grid } from "@react-three/drei";
import * as THREE from "three";

export default function Environment() {
  return (
    <>
      <color attach="background" args={["#05010a"]} />
      <fog attach="fog" args={["#05010a", 5, 45]} />
      
      {/* Background Ambience */}
      <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
      <ambientLight intensity={0.4} />

      {/* Sponsor Neon Sign (High Background) */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <group position={[0, 12, -15]}>
          <Text
            fontSize={4}
            color="#06B6D4"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.1}
            outlineColor="#0891b2"
          >
            BASE
          </Text>
          <pointLight intensity={5} distance={15} color="#06B6D4" />
        </group>
      </Float>

      {/* Cinematic Spotlights from corners */}
      <SpotLight
        position={[15, 20, 10]}
        angle={0.4}
        penumbra={1}
        intensity={3}
        castShadow
        color="#8B5CF6"
      />
      <SpotLight
        position={[-15, 20, 10]}
        angle={0.4}
        penumbra={1}
        intensity={3}
        castShadow
        color="#06B6D4"
      />

      {/* Volumetric Light Beams (Static Cylinders) */}
      {[[-8, 0, -5], [8, 0, -5]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} rotation={[0.2, 0, i === 0 ? 0.3 : -0.3]}>
          <cylinderGeometry args={[0.01, 2, 25, 32]} />
          <meshBasicMaterial 
            color={i === 0 ? "#8B5CF6" : "#06B6D4"} 
            transparent 
            opacity={0.05} 
            side={THREE.DoubleSide} 
          />
        </mesh>
      ))}

      {/* The Pit Glow & Grid (Bottom Center) */}
      <group position={[0, -10, 0]}>
        <Grid
          infiniteGrid
          fadeDistance={50}
          fadeStrength={5}
          cellSize={1}
          sectionSize={5}
          sectionColor="#8B5CF6"
          cellColor="#06B6D4"
          cellThickness={1}
          sectionThickness={1.5}
        />
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[100, 100]} />
          <meshBasicMaterial color="#4c1d95" transparent opacity={0.15} />
        </mesh>
      </group>
      
      <pointLight 
        position={[0, -8, 0]} 
        intensity={15} 
        distance={25} 
        color="#8B5CF6" 
      />

      {/* Neon Pylons at Corners */}
      {[[-15, 0, -15], [15, 0, -15], [-15, 0, 15], [15, 0, 15]].map((pos, i) => (
        <group key={i} position={pos as [number, number, number]}>
          <mesh>
            <cylinderGeometry args={[0.1, 0.1, 40, 8]} />
            <meshStandardMaterial 
              color={i % 2 === 0 ? "#8B5CF6" : "#06B6D4"} 
              emissive={i % 2 === 0 ? "#8B5CF6" : "#06B6D4"}
              emissiveIntensity={10}
            />
          </mesh>
          <pointLight intensity={10} distance={10} color={i % 2 === 0 ? "#8B5CF6" : "#06B6D4"} />
        </group>
      ))}

      {/* Floating Particles/Debris */}
      <group position={[0, 0, -5]}>
        {[...Array(40)].map((_, i) => (
          <Float key={i} speed={Math.random() * 2} rotationIntensity={2} floatIntensity={2}>
            <mesh 
              position={[
                (Math.random() - 0.5) * 30,
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 15
              ]}
            >
              <boxGeometry args={[0.05, 0.05, 0.05]} />
              <meshStandardMaterial 
                color={i % 2 === 0 ? "#8B5CF6" : "#06B6D4"} 
                emissive={i % 2 === 0 ? "#8B5CF6" : "#06B6D4"}
                emissiveIntensity={4}
              />
            </mesh>
          </Float>
        ))}
      </group>
    </>
  );
}
