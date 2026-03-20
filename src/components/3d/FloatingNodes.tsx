import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface FloatingNodesProps {
  count?: number;
  riskLevel: number;
  activityLevel: number;
}

/**
 * Animated network of interconnected blockchain nodes
 * with pulsating connections and dynamic colors
 */
export function FloatingNodes({ count = 30, riskLevel, activityLevel }: FloatingNodesProps) {
  const groupRef = useRef<THREE.Group>(null);
  const lineRef = useRef<THREE.LineSegments>(null);

  // Generate node positions in a sphere layout
  const nodePositions = useMemo(() => {
    const positions: THREE.Vector3[] = [];
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = 2.5 + Math.random() * 3.5;
      positions.push(new THREE.Vector3(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      ));
    }
    return positions;
  }, [count]);

  // Build connection lines between nearby nodes
  const linePositions = useMemo(() => {
    const verts: number[] = [];
    const maxDist = 3.5;
    for (let i = 0; i < nodePositions.length; i++) {
      for (let j = i + 1; j < nodePositions.length; j++) {
        const dist = nodePositions[i].distanceTo(nodePositions[j]);
        if (dist < maxDist) {
          verts.push(
            nodePositions[i].x, nodePositions[i].y, nodePositions[i].z,
            nodePositions[j].x, nodePositions[j].y, nodePositions[j].z
          );
        }
      }
    }
    return new Float32Array(verts);
  }, [nodePositions]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = t * (0.05 + activityLevel * 0.05);
      groupRef.current.rotation.x = Math.sin(t * 0.1) * 0.15;
    }
    if (lineRef.current) {
      const mat = lineRef.current.material as THREE.LineBasicMaterial;
      mat.opacity = 0.25 + Math.sin(t * 2) * 0.1 + activityLevel * 0.15;
    }
  });

  const nodeColor = riskLevel > 0.7 ? '#f43f5e' : '#836EF1';
  const lineColor = riskLevel > 0.7 ? '#fb7185' : '#a78bfa';

  return (
    <group ref={groupRef}>
      {/* Connection lines */}
      <lineSegments ref={lineRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[linePositions, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color={lineColor}
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>

      {/* Node spheres */}
      {nodePositions.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.04 + (i % 3) * 0.02, 8, 8]} />
          <meshStandardMaterial
            color={nodeColor}
            emissive={nodeColor}
            emissiveIntensity={1.5 + activityLevel}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}
