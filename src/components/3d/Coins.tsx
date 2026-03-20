import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CoinData {
  x: number;
  z: number;
  y: number;
  speed: number;
  rot: number;
  rotSpeed: number;
  size: number;
}

interface FloatingCoinsProps {
  count?: number;
  activityLevel: number;
}

/**
 * Gold coins that rain from above into the piggy bank slot.
 * Each coin spins and falls at its own speed; activity level
 * controls how fast they fall.
 */
export function FloatingCoins({ count = 18, activityLevel }: FloatingCoinsProps) {
  const groupRef = useRef<THREE.Group>(null);

  const coins = useMemo<CoinData[]>(() => {
    return Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 5,
      z: (Math.random() - 0.5) * 5,
      y: Math.random() * 10 + 1.5,     // start above the pig
      speed: 0.015 + Math.random() * 0.025,
      rot: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.08,
      size: 0.13 + Math.random() * 0.1,
    }));
  }, [count]);

  // Use refs to track per-coin Y position mutably
  const yPositions = useRef<number[]>(coins.map(c => c.y));
  const meshRefs   = useRef<(THREE.Mesh | null)[]>([]);

  useFrame(() => {
    const speedMultiplier = 1 + activityLevel * 3;
    coins.forEach((coin, i) => {
      const mesh = meshRefs.current[i];
      if (!mesh) return;

      // Fall down
      yPositions.current[i] -= coin.speed * speedMultiplier;
      // Reset above when below pig body
      if (yPositions.current[i] < -2.2) {
        yPositions.current[i] = 6 + Math.random() * 5;
      }

      mesh.position.y = yPositions.current[i];
      mesh.rotation.y += coin.rotSpeed * speedMultiplier;
      mesh.rotation.x += coin.rotSpeed * 0.5 * speedMultiplier;
    });
  });

  return (
    <group ref={groupRef}>
      {coins.map((coin, i) => (
        <mesh
          key={i}
          ref={(el) => { meshRefs.current[i] = el; }}
          position={[coin.x, coin.y, coin.z]}
          rotation={[coin.rot, coin.rot * 0.5, 0]}
        >
          {/* Coin = flat cylinder */}
          <cylinderGeometry args={[coin.size, coin.size, 0.04, 32]} />
          <meshStandardMaterial
            color="#facc15"
            emissive="#ca8a04"
            emissiveIntensity={0.6}
            metalness={0.9}
            roughness={0.15}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

/**
 * Gold sparkle particles that burst around the piggy bank
 * to give a magical "money magic" feel
 */
export function SparkleParticles({ activityLevel }: { activityLevel: number }) {
  const ref = useRef<THREE.Points>(null);

  const { positions, velocities } = useMemo(() => {
    const count = 120;
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(Math.random() * 2 - 1);
      const r     = 1.6 + Math.random() * 2.5;
      pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) - 0.3;
      pos[i * 3 + 2] = r * Math.cos(phi);
      vel[i * 3]     = (Math.random() - 0.5) * 0.006;
      vel[i * 3 + 1] = 0.003 + Math.random() * 0.006;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.006;
    }
    return { positions: pos, velocities: vel };
  }, []);

  useFrame(() => {
    if (!ref.current) return;
    const arr = ref.current.geometry.attributes.position.array as Float32Array;
    const speed = 1 + activityLevel * 2;
    for (let i = 0; i < arr.length / 3; i++) {
      arr[i * 3]     += velocities[i * 3]     * speed;
      arr[i * 3 + 1] += velocities[i * 3 + 1] * speed;
      arr[i * 3 + 2] += velocities[i * 3 + 2] * speed;
      // Reset when too far
      const dx = arr[i * 3], dy = arr[i * 3 + 1], dz = arr[i * 3 + 2];
      if (dx * dx + dy * dy + dz * dz > 20) {
        const theta = Math.random() * Math.PI * 2;
        const phi   = Math.acos(Math.random() * 2 - 1);
        const r = 1.6;
        arr[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
        arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        arr[i * 3 + 2] = r * Math.cos(phi);
      }
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#fde68a"
        size={0.055}
        sizeAttenuation
        transparent
        opacity={0.9}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        toneMapped={false}
      />
    </points>
  );
}
