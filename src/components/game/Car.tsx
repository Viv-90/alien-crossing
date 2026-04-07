import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function Car({ index, carId, speed, direction }) {
  const mesh = useRef<THREE.Group>(null);

  const bodyMat = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: '#0a0a0a', roughness: 0.1, metalness: 1.0 
  }), []);
  const accentMat = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: carId % 2 === 0 ? '#cc2222' : '#2222cc', roughness: 0.2, metalness: 0.9, emissive: carId % 2 === 0 ? '#cc2222' : '#2222cc', emissiveIntensity: 0.6 
  }), [carId]);
  const glowMat = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: '#ffffff', roughness: 0.0, metalness: 1.0, emissive: '#ffffff', emissiveIntensity: 2.0 
  }), []);
  const tireMat = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: '#050505', roughness: 0.9, metalness: 0.1 
  }), []);

  useFrame((state) => {
    if (mesh.current) {
      const t = state.clock.elapsedTime;
      const initialZ = direction > 0 ? -6 : 6;
      let z = initialZ + (speed * direction * (t + index * 0.5)) % 12;
      if (direction < 0) {
        if (z < -6) z += 12;
      } else {
        if (z > 6) z -= 12;
      }
      mesh.current.position.z = z;
    }
  });

  return (
    <group ref={mesh}>
      <mesh material={bodyMat} position={[0, 0.45, 0]}>
        <boxGeometry args={[1.1, 0.45, 2.3]} />
      </mesh>
      
      <mesh material={bodyMat} position={[0, 0.75, direction > 0 ? 0.3 : -0.3]}>
        <boxGeometry args={[0.9, 0.3, 0.9]} />
      </mesh>

      <mesh material={accentMat} position={[0.58, 0.4, 0]}>
        <boxGeometry args={[0.1, 0.35, 1.9]} />
      </mesh>
      <mesh material={accentMat} position={[-0.58, 0.4, 0]}>
        <boxGeometry args={[0.1, 0.35, 1.9]} />
      </mesh>

      {/* Tires */}
      {[[-0.6, 0.25, 0.7], [0.6, 0.25, 0.7], [-0.6, 0.25, -0.7], [0.6, 0.25, -0.7]].map((pos, i) => (
        <mesh key={i} material={tireMat} position={[pos[0], pos[1], pos[2]]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.25, 0.25, 0.2, 16]} />
        </mesh>
      ))}

      <mesh material={accentMat} position={[0, 0.4, direction > 0 ? -1.18 : 1.18]}>
        <boxGeometry args={[0.8, 0.25, 0.1]} />
      </mesh>
      
      <mesh material={glowMat} position={[0.35, 0.5, direction > 0 ? 1.16 : -1.16]}>
        <boxGeometry args={[0.25, 0.08, 0.02]} />
      </mesh>
      <mesh material={glowMat} position={[-0.35, 0.5, direction > 0 ? 1.16 : -1.16]}>
        <boxGeometry args={[0.25, 0.08, 0.02]} />
      </mesh>

      <pointLight position={[0, 0.1, 0]} intensity={1.5} distance={3} color={accentMat.color} />
    </group>
  );
}
