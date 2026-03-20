import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, MeshWobbleMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface PiggyBankProps {
  activityLevel: number;
}

/**
 * Hand-crafted 3D piggy bank built from Three.js primitives.
 * Body, snout, ears, eyes, legs, curly tail, coin slot on top.
 */
export function PiggyBank({ activityLevel }: PiggyBankProps) {
  const groupRef = useRef<THREE.Group>(null);
  const tailRef  = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      // Gentle wobble side to side
      groupRef.current.rotation.y = Math.sin(t * 0.6) * 0.18;
    }
    if (tailRef.current) {
      // Tail wags faster with more activity
      tailRef.current.rotation.z = Math.sin(t * (2 + activityLevel * 4)) * 0.4;
    }
  });

  const pink      = '#f9a8d4';
  const darkPink  = '#ec4899';
  const snoutPink = '#fbc7de';

  return (
    <Float speed={1.2} rotationIntensity={0} floatIntensity={0.5}>
      <group ref={groupRef}>

        {/* === BODY === */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[1.5, 64, 64]} />
          <meshStandardMaterial color={pink} roughness={0.3} metalness={0.05} />
        </mesh>

        {/* === HEAD === */}
        <mesh position={[0, 1.1, 0.8]}>
          <sphereGeometry args={[0.9, 48, 48]} />
          <meshStandardMaterial color={pink} roughness={0.3} metalness={0.05} />
        </mesh>

        {/* === SNOUT === */}
        <mesh position={[0, 0.9, 1.58]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.35, 0.38, 0.18, 32]} />
          <meshStandardMaterial color={snoutPink} roughness={0.5} />
        </mesh>
        {/* Nostrils */}
        <mesh position={[-0.12, 0.88, 1.73]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshStandardMaterial color={darkPink} roughness={0.8} />
        </mesh>
        <mesh position={[0.12, 0.88, 1.73]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshStandardMaterial color={darkPink} roughness={0.8} />
        </mesh>

        {/* === LEFT EAR === */}
        <mesh position={[-0.65, 1.88, 0.65]} rotation={[0, 0.3, -0.4]}>
          <sphereGeometry args={[0.32, 24, 24]} />
          <meshStandardMaterial color={pink} roughness={0.4} />
        </mesh>
        <mesh position={[-0.63, 1.9, 0.72]} rotation={[0, 0.3, -0.4]}>
          <sphereGeometry args={[0.18, 24, 24]} />
          <meshStandardMaterial color={snoutPink} roughness={0.5} />
        </mesh>

        {/* === RIGHT EAR === */}
        <mesh position={[0.65, 1.88, 0.65]} rotation={[0, -0.3, 0.4]}>
          <sphereGeometry args={[0.32, 24, 24]} />
          <meshStandardMaterial color={pink} roughness={0.4} />
        </mesh>
        <mesh position={[0.63, 1.9, 0.72]} rotation={[0, -0.3, 0.4]}>
          <sphereGeometry args={[0.18, 24, 24]} />
          <meshStandardMaterial color={snoutPink} roughness={0.5} />
        </mesh>

        {/* === EYES (white + pupil) === */}
        <mesh position={[-0.3, 1.22, 1.55]}>
          <sphereGeometry args={[0.13, 20, 20]} />
          <meshStandardMaterial color="#ffffff" roughness={0.1} />
        </mesh>
        <mesh position={[-0.3, 1.22, 1.68]}>
          <sphereGeometry args={[0.065, 16, 16]} />
          <meshStandardMaterial color="#1a0a2e" roughness={0.2} />
        </mesh>
        <mesh position={[0.3, 1.22, 1.55]}>
          <sphereGeometry args={[0.13, 20, 20]} />
          <meshStandardMaterial color="#ffffff" roughness={0.1} />
        </mesh>
        <mesh position={[0.3, 1.22, 1.68]}>
          <sphereGeometry args={[0.065, 16, 16]} />
          <meshStandardMaterial color="#1a0a2e" roughness={0.2} />
        </mesh>

        {/* === COIN SLOT on top === */}
        <mesh position={[0, 1.52, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.06, 0.06, 0.5, 16]} />
          <meshStandardMaterial color={darkPink} roughness={0.6} />
        </mesh>

        {/* === LEGS (4 cylinders) === */}
        {[[-0.7, -1.35, 0.55], [0.7, -1.35, 0.55], [-0.65, -1.35, -0.55], [0.65, -1.35, -0.55]].map(
          ([x, y, z], i) => (
            <mesh key={i} position={[x, y, z]}>
              <cylinderGeometry args={[0.2, 0.22, 0.65, 20]} />
              <meshStandardMaterial color={pink} roughness={0.35} />
            </mesh>
          )
        )}

        {/* === TAIL (curly torus) === */}
        <mesh ref={tailRef} position={[-1.45, 0.2, -0.1]} rotation={[0, 0, Math.PI / 4]}>
          <torusGeometry args={[0.28, 0.06, 10, 30, Math.PI * 1.6]} />
          <MeshWobbleMaterial color={darkPink} factor={0.2} speed={3} roughness={0.4} />
        </mesh>

      </group>
    </Float>
  );
}
