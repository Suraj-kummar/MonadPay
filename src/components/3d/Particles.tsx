import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface GalaxyDustProps {
  count?: number;
}

/**
 * Beautiful galaxy dust — two spiral arms of particles
 * that slowly rotate to create a cosmic backdrop
 */
export function GalaxyDust({ count = 3000 }: GalaxyDustProps) {
  const pointsRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Distribute in a disc with some height variance
      const angle = Math.random() * Math.PI * 2;
      const arm = Math.floor(Math.random() * 2) * Math.PI; // two arms
      const r = 4 + Math.random() * 14;
      const spread = (r / 18) * 1.5;
      arr[i * 3]     = Math.cos(angle + arm + r * 0.25) * r + (Math.random() - 0.5) * spread * 2;
      arr[i * 3 + 1] = (Math.random() - 0.5) * spread * 2.5;
      arr[i * 3 + 2] = Math.sin(angle + arm + r * 0.25) * r + (Math.random() - 0.5) * spread * 2;
    }
    return arr;
  }, [count]);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.02;
    }
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3}>
      <PointMaterial
        transparent
        color="#a78bfa"
        size={0.04}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.8}
      />
    </Points>
  );
}

interface DataStreamProps {
  activityLevel: number;
  riskLevel: number;
}

/**
 * Fast-moving upward data stream particles — give the
 * impression of live blockchain transactions flowing up
 */
export function DataStream({ activityLevel, riskLevel }: DataStreamProps) {
  const particleCount = 200;
  const posRef = useRef<THREE.Points>(null);

  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const vel = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
      vel[i]         = 0.01 + Math.random() * 0.03;
    }
    return { positions: pos, velocities: vel };
  }, []);

  useFrame(() => {
    if (!posRef.current) return;
    const arr = posRef.current.geometry.attributes.position.array as Float32Array;
    const speed = 1 + activityLevel * 3;
    for (let i = 0; i < particleCount; i++) {
      arr[i * 3 + 1] += velocities[i] * speed;
      if (arr[i * 3 + 1] > 10) {
        arr[i * 3 + 1] = -10;
      }
    }
    posRef.current.geometry.attributes.position.needsUpdate = true;
  });

  const color = riskLevel > 0.7 ? '#f43f5e' : '#38bdf8';

  return (
    <points ref={posRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={0.06}
        sizeAttenuation
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        toneMapped={false}
      />
    </points>
  );
}
