import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { TorusKnot, MeshDistortMaterial, Float } from '@react-three/drei';
import * as THREE from 'three';

interface EnergyOrbProps {
  intensity: number;
  riskLevel: number;
}

/**
 * Central energy orb: a glowing torus knot with distort material
 * that morphs/pulses based on activity and risk level.
 */
export function EnergyOrb({ intensity, riskLevel }: EnergyOrbProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const ring1 = useRef<THREE.Mesh>(null);
  const ring2 = useRef<THREE.Mesh>(null);

  const primaryColor = riskLevel > 0.7 ? '#f43f5e' : '#836EF1';
  const secondaryColor = riskLevel > 0.7 ? '#fb7185' : '#38bdf8';
  const emissive = riskLevel > 0.7 ? '#9f1239' : '#4c1d95';

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.x = t * 0.3;
      meshRef.current.rotation.z = t * 0.2;
      const pulse = 1 + Math.sin(t * 4) * (0.04 + intensity * 0.06);
      meshRef.current.scale.setScalar(pulse);
    }
    if (ring1.current) {
      ring1.current.rotation.x = t * 0.7;
      ring1.current.rotation.y = t * 0.4;
    }
    if (ring2.current) {
      ring2.current.rotation.y = t * -0.6;
      ring2.current.rotation.z = t * 0.5;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.4}>
      {/* Main torus knot */}
      <TorusKnot ref={meshRef} args={[1, 0.35, 256, 32, 2, 3]}>
        <MeshDistortMaterial
          color={primaryColor}
          emissive={emissive}
          emissiveIntensity={1.2 + intensity}
          distort={0.25 + intensity * 0.35}
          speed={2 + intensity * 2}
          roughness={0}
          metalness={1}
          toneMapped={false}
        />
      </TorusKnot>

      {/* Outer spinning ring 1 */}
      <mesh ref={ring1}>
        <torusGeometry args={[2.2, 0.015, 12, 100]} />
        <meshBasicMaterial
          color={secondaryColor}
          transparent
          opacity={0.6}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {/* Outer spinning ring 2 */}
      <mesh ref={ring2}>
        <torusGeometry args={[2.7, 0.01, 12, 100]} />
        <meshBasicMaterial
          color={primaryColor}
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </Float>
  );
}
