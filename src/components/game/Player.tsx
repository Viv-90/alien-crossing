import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function Player({ 
  position = [0, 0, 0] as [number, number, number], 
  rotation = [0, 0, 0] as [number, number, number], 
  isWalking = false,
  isCombo = false,
  scale = 1.15
}) {
  const group = useRef<THREE.Group>(null);
  const leftArm = useRef<THREE.Group>(null);
  const rightArm = useRef<THREE.Group>(null);
  const leftLeg = useRef<THREE.Group>(null);
  const rightLeg = useRef<THREE.Group>(null);
  const head = useRef<THREE.Mesh>(null);
  const sword = useRef<THREE.Group>(null);

  const bodyMat = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: '#080808', roughness: 0.1, metalness: 1.0 
  }), []);
  const accentMat = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: '#cc2222', roughness: 0.2, metalness: 0.9, emissive: '#cc2222', emissiveIntensity: 0.6 
  }), []);
  const swordMat = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: '#dddddd', roughness: 0.1, metalness: 1.0, emissive: '#ff4444', emissiveIntensity: 0.2 
  }), []);
  const visorMat = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: '#ff3333', roughness: 0.0, metalness: 1.0, emissive: '#ff3333', emissiveIntensity: 1.2 
  }), []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    if (isWalking) {
      const speed = 10;
      const walkCycle = Math.sin(t * speed);
      if (rightLeg.current) rightLeg.current.rotation.x = walkCycle * 0.6;
      if (leftLeg.current) leftLeg.current.rotation.x = -walkCycle * 0.6;
      if (rightArm.current) {
        rightArm.current.rotation.x = -walkCycle * 0.6;
        rightArm.current.rotation.z = -0.2;
      }
      if (leftArm.current) {
        leftArm.current.rotation.x = walkCycle * 0.6;
        leftArm.current.rotation.z = 0.2;
      }
      if (group.current) {
        group.current.position.y = Math.abs(Math.cos(t * speed)) * 0.05 - 1.2;
        group.current.rotation.x = 0.1;
      }
      if (sword.current) sword.current.visible = false;
    } else if (isCombo) {
      const cycle = t % 6;
      if (sword.current) sword.current.visible = true;
      if (rightArm.current) {
        if (cycle < 2) {
          const punch = Math.sin(cycle * Math.PI * 3) * 1.2;
          rightArm.current.rotation.x = -Math.max(0, punch) * 1.5;
        } else if (cycle < 4) {
          const slash = (cycle - 2) / 2;
          rightArm.current.rotation.x = -1.5 + Math.sin(slash * Math.PI * 2) * 1.0;
          rightArm.current.rotation.z = -0.5 + Math.sin(slash * Math.PI * 2 + 1) * 0.8;
        } else {
          rightArm.current.rotation.x = -0.8 + Math.sin(t * 3) * 0.2;
        }
      }
      if (leftArm.current) {
        if (cycle < 2) {
          const punch = Math.sin(cycle * Math.PI * 3 + Math.PI) * 1.2;
          leftArm.current.rotation.x = -Math.max(0, punch) * 1.3;
        } else {
          leftArm.current.rotation.x = -0.5 + Math.sin(t * 2) * 0.3;
        }
      }
      if (rightLeg.current && leftLeg.current) {
        if (cycle >= 4) {
          const kick = (cycle - 4) / 2;
          rightLeg.current.rotation.x = Math.sin(kick * Math.PI * 2) * 1.2;
        } else {
          rightLeg.current.rotation.x = Math.sin(t * 2) * 0.15;
          leftLeg.current.rotation.x = Math.sin(t * 2 + Math.PI) * 0.15;
        }
      }
    }

    if (head.current) {
      head.current.rotation.y = Math.sin(t * 2) * 0.1;
    }
  });

  return (
    <group ref={group} position={position} rotation={rotation} scale={scale}>
      <mesh material={bodyMat} position={[0, 1.2, 0]}>
        <boxGeometry args={[0.7, 0.9, 0.4]} />
      </mesh>
      <mesh material={accentMat} position={[0, 1.35, 0.21]}>
        <boxGeometry args={[0.5, 0.15, 0.02]} />
      </mesh>
      <mesh material={accentMat} position={[0, 1.15, 0.21]}>
        <boxGeometry args={[0.3, 0.1, 0.02]} />
      </mesh>

      <mesh ref={head} material={bodyMat} position={[0, 2.0, 0]}>
        <boxGeometry args={[0.4, 0.45, 0.4]} />
        <mesh material={visorMat} position={[0, 0.02, 0.21]}>
          <boxGeometry args={[0.32, 0.08, 0.02]} />
        </mesh>
        <mesh material={accentMat} position={[0, 0.18, 0.05]}>
          <boxGeometry args={[0.42, 0.06, 0.42]} />
        </mesh>
      </mesh>

      <mesh material={bodyMat} position={[0, 1.72, 0]}>
        <cylinderGeometry args={[0.1, 0.12, 0.15, 8]} />
      </mesh>

      <group ref={rightArm} position={[-0.5, 1.55, 0]}>
        <mesh material={accentMat} position={[0, 0, 0]}>
          <sphereGeometry args={[0.13, 8, 8]} />
        </mesh>
        <mesh material={bodyMat} position={[0, -0.25, 0]}>
          <boxGeometry args={[0.18, 0.35, 0.18]} />
        </mesh>
        <mesh material={bodyMat} position={[0, -0.55, 0]}>
          <boxGeometry args={[0.16, 0.3, 0.16]} />
        </mesh>
        <mesh material={accentMat} position={[0, -0.75, 0]}>
          <boxGeometry args={[0.14, 0.12, 0.14]} />
        </mesh>

        <group ref={sword} position={[0, -0.8, 0]}>
          <mesh material={swordMat} position={[0, -0.5, 0]}>
            <boxGeometry args={[0.04, 0.9, 0.01]} />
          </mesh>
          <mesh material={accentMat} position={[0, -0.02, 0]}>
            <boxGeometry args={[0.2, 0.04, 0.06]} />
          </mesh>
        </group>
      </group>

      {/* Left Arm */}
      <group ref={leftArm} position={[0.5, 1.55, 0]}>
        <mesh material={accentMat} position={[0, 0, 0]}>
          <sphereGeometry args={[0.13, 8, 8]} />
        </mesh>
        <mesh material={bodyMat} position={[0, -0.25, 0]}>
          <boxGeometry args={[0.18, 0.35, 0.18]} />
        </mesh>
        <mesh material={bodyMat} position={[0, -0.55, 0]}>
          <boxGeometry args={[0.16, 0.3, 0.16]} />
        </mesh>
        <mesh material={accentMat} position={[0, -0.75, 0]}>
          <boxGeometry args={[0.14, 0.12, 0.14]} />
        </mesh>
      </group>

      {/* Hip */}
      <mesh material={bodyMat} position={[0, 0.7, 0]}>
        <boxGeometry args={[0.55, 0.2, 0.35]} />
      </mesh>

      {/* Belt accent */}
      <mesh material={accentMat} position={[0, 0.7, 0.18]}>
        <boxGeometry args={[0.57, 0.06, 0.02]} />
      </mesh>

      {/* Right Leg */}
      <group ref={rightLeg} position={[-0.18, 0.55, 0]}>
        <mesh material={bodyMat} position={[0, -0.25, 0]}>
          <boxGeometry args={[0.2, 0.4, 0.22]} />
        </mesh>
        <mesh material={bodyMat} position={[0, -0.6, 0]}>
          <boxGeometry args={[0.18, 0.35, 0.2]} />
        </mesh>
        <mesh material={accentMat} position={[0, -0.82, 0.03]}>
          <boxGeometry args={[0.2, 0.1, 0.28]} />
        </mesh>
      </group>

      {/* Left Leg */}
      <group ref={leftLeg} position={[0.18, 0.55, 0]}>
        <mesh material={bodyMat} position={[0, -0.25, 0]}>
          <boxGeometry args={[0.2, 0.4, 0.22]} />
        </mesh>
        <mesh material={bodyMat} position={[0, -0.6, 0]}>
          <boxGeometry args={[0.18, 0.35, 0.2]} />
        </mesh>
        <mesh material={accentMat} position={[0, -0.82, 0.03]}>
          <boxGeometry args={[0.2, 0.1, 0.28]} />
        </mesh>
      </group>
    </group>
  );
}
