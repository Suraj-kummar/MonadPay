import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Sphere, Float } from '@react-three/drei';
import * as THREE from 'three';
import { SwarmParticles } from './SwarmParticles';

interface AICoreProps {
    intensity: number;
    riskLevel: number;
}

/**
 * Central AI core sphere with distortion material
 * Pulsates based on activity intensity
 */
export function AICore({ intensity, riskLevel }: AICoreProps) {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state: { clock: { getElapsedTime: () => number } }) => {
        if (meshRef.current) {
            meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
            meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
            const s = 1 + Math.sin(state.clock.getElapsedTime() * 5) * (intensity * 0.1);
            meshRef.current.scale.set(s, s, s);
        }
    });

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <Sphere args={[1.5, 64, 64]} ref={meshRef}>
                <MeshDistortMaterial
                    color={riskLevel > 0.7 ? "#f43f5e" : (intensity > 0.5 ? "#8b5cf6" : "#6366f1")}
                    attach="material"
                    distort={0.3 + (intensity * 0.4)}
                    speed={2 + (intensity * 3)}
                    roughness={0}
                    metalness={1}
                    emissive={riskLevel > 0.7 ? "#881337" : (intensity > 0.5 ? "#5b21b6" : "#4c1d95")}
                    emissiveIntensity={1}
                />
            </Sphere>
            <SwarmParticles riskLevel={riskLevel} />
        </Float>
    );
}
