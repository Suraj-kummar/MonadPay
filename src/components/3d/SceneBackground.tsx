import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { PiggyBank } from './PiggyBank';
import { FloatingCoins, SparkleParticles } from './Coins';

interface SceneBackgroundProps {
    activityLevel: number;
    riskLevel: number;
}

/**
 * 3D background scene featuring:
 *  - Animated 3D piggy bank (wobbles, tail wags)
 *  - Gold coins raining down into the pig's coin slot
 *  - Gold sparkle particles floating around
 *  - Warm star field backdrop
 *  - Soft pink / gold lighting
 */
export function SceneBackground({ activityLevel, riskLevel }: SceneBackgroundProps) {
    // Danger mode shifts to red-orange lighting
    const danger = riskLevel > 0.7;
    const keyColor  = danger ? '#f97316' : '#fbbf24';
    const fillColor = danger ? '#ef4444' : '#f9a8d4';
    const bgColor   = '#0a040f';

    return (
        <Canvas
            className="absolute inset-0 z-0"
            camera={{ position: [0, 1, 8], fov: 50 }}
            gl={{
                antialias: true,
                alpha: false,
                toneMapping: THREE.ACESFilmicToneMapping,
                toneMappingExposure: 1.2,
            }}
            style={{ background: bgColor }}
        >
            {/* Ambient fill — soft warm glow */}
            <ambientLight intensity={0.4} color="#ffe4e6" />

            {/* Key light from above-front — warm gold */}
            <pointLight position={[3, 6, 5]}  intensity={6}   color={keyColor}  />
            {/* Fill light left side — pink */}
            <pointLight position={[-5, 2, 3]} intensity={3}   color={fillColor} />
            {/* Rim light behind — deep purple */}
            <pointLight position={[0, -4, -5]} intensity={2}  color="#7c3aed"   />

            <Environment preset="sunset" />

            {/* THE PIGGY BANK — centre stage */}
            <PiggyBank activityLevel={activityLevel} />

            {/* Coins raining into the pig */}
            <FloatingCoins count={20} activityLevel={activityLevel} />

            {/* Gold sparkle halo */}
            <SparkleParticles activityLevel={activityLevel} />

            {/* Distant star field */}
            <Stars
                radius={80}
                depth={40}
                count={3000}
                factor={3}
                saturation={0.5}
                fade
                speed={0.5}
            />

            <OrbitControls
                enableZoom={false}
                autoRotate
                autoRotateSpeed={0.4}
                enablePan={false}
                minPolarAngle={Math.PI / 4}
                maxPolarAngle={Math.PI * 0.7}
            />
        </Canvas>
    );
}
