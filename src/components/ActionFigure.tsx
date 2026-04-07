import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, Grid } from '@react-three/drei';
import * as THREE from 'three';

function Figure() {
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
    
    // Cycle: 0-2s punch combo, 2-4s sword slash, 4-6s kick sequence
    const cycle = t % 6;
    
    if (group.current) {
      group.current.rotation.y = Math.sin(t * 0.5) * 0.3;
      group.current.position.y = -1.2 + Math.sin(t * 2) * 0.05;
    }

    if (rightArm.current) {
      if (cycle < 2) {
        // Punch combo
        const punch = Math.sin(cycle * Math.PI * 3) * 1.2;
        rightArm.current.rotation.x = -Math.max(0, punch) * 1.5;
        rightArm.current.rotation.z = -0.2 + Math.max(0, punch) * 0.3;
      } else if (cycle < 4) {
        // Sword slash - wide arc
        const slash = (cycle - 2) / 2;
        rightArm.current.rotation.x = -1.5 + Math.sin(slash * Math.PI * 2) * 1.0;
        rightArm.current.rotation.z = -0.5 + Math.sin(slash * Math.PI * 2 + 1) * 0.8;
      } else {
        // Guard stance
        rightArm.current.rotation.x = -0.8 + Math.sin(t * 3) * 0.2;
        rightArm.current.rotation.z = -0.3;
      }
    }

    if (leftArm.current) {
      if (cycle < 2) {
        const punch = Math.sin(cycle * Math.PI * 3 + Math.PI) * 1.2;
        leftArm.current.rotation.x = -Math.max(0, punch) * 1.3;
        leftArm.current.rotation.z = 0.2 - Math.max(0, punch) * 0.3;
      } else {
        leftArm.current.rotation.x = -0.5 + Math.sin(t * 2) * 0.3;
        leftArm.current.rotation.z = 0.3;
      }
    }

    if (rightLeg.current && leftLeg.current) {
      if (cycle >= 4) {
        // Kick sequence
        const kick = (cycle - 4) / 2;
        rightLeg.current.rotation.x = Math.sin(kick * Math.PI * 2) * 1.2;
        leftLeg.current.rotation.x = -0.2;
      } else {
        // Subtle stance shift
        rightLeg.current.rotation.x = Math.sin(t * 2) * 0.15;
        leftLeg.current.rotation.x = Math.sin(t * 2 + Math.PI) * 0.15;
      }
    }

    if (head.current) {
      head.current.rotation.y = Math.sin(t * 1.5) * 0.2;
      head.current.rotation.x = Math.sin(t * 1) * 0.1 - 0.1;
    }
  });

  return (
    <group ref={group} position={[0, -1.2, 0]} scale={1.15}>
      {/* Torso */}
      <mesh material={bodyMat} position={[0, 1.2, 0]}>
        <boxGeometry args={[0.7, 0.9, 0.4]} />
      </mesh>
      {/* Chest accent */}
      <mesh material={accentMat} position={[0, 1.35, 0.21]}>
        <boxGeometry args={[0.5, 0.15, 0.02]} />
      </mesh>
      <mesh material={accentMat} position={[0, 1.15, 0.21]}>
        <boxGeometry args={[0.3, 0.1, 0.02]} />
      </mesh>

      {/* Head */}
      <mesh ref={head} material={bodyMat} position={[0, 2.0, 0]}>
        <boxGeometry args={[0.4, 0.45, 0.4]} />
        {/* Visor */}
        <mesh material={visorMat} position={[0, 0.02, 0.21]}>
          <boxGeometry args={[0.32, 0.08, 0.02]} />
        </mesh>
        {/* Helmet accent */}
        <mesh material={accentMat} position={[0, 0.18, 0.05]}>
          <boxGeometry args={[0.42, 0.06, 0.42]} />
        </mesh>
      </mesh>

      {/* Neck */}
      <mesh material={bodyMat} position={[0, 1.72, 0]}>
        <cylinderGeometry args={[0.1, 0.12, 0.15, 8]} />
      </mesh>

      {/* Right Arm */}
      <group ref={rightArm} position={[-0.5, 1.55, 0]}>
        {/* Shoulder */}
        <mesh material={accentMat} position={[0, 0, 0]}>
          <sphereGeometry args={[0.13, 8, 8]} />
        </mesh>
        {/* Upper arm */}
        <mesh material={bodyMat} position={[0, -0.25, 0]}>
          <boxGeometry args={[0.18, 0.35, 0.18]} />
        </mesh>
        {/* Forearm */}
        <mesh material={bodyMat} position={[0, -0.55, 0]}>
          <boxGeometry args={[0.16, 0.3, 0.16]} />
        </mesh>
        {/* Fist */}
        <mesh material={accentMat} position={[0, -0.75, 0]}>
          <boxGeometry args={[0.14, 0.12, 0.14]} />
        </mesh>
        {/* Sword */}
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

function Particles() {
  const points = useRef<THREE.Points>(null);
  const count = 400;
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (points.current) {
      points.current.rotation.y = state.clock.elapsedTime * 0.05;
      points.current.rotation.x = state.clock.elapsedTime * 0.02;
      points.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial 
        size={0.015} 
        color="#ff3333" 
        transparent 
        opacity={0.4} 
        sizeAttenuation 
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function ActionFigure() {
  return (
    <Canvas
      camera={{ position: [0, 0.4, 4.2], fov: 45 }}
      style={{ width: '100%', height: '100%' }}
      gl={{ antialias: true, alpha: true }}
    >
      <color attach="background" args={['#050505']} />
      <fog attach="fog" args={['#050505', 5, 12]} />
      
      <Environment preset="city" />
      
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 5, 2]} intensity={2.0} color="#ffffff" />
      <pointLight position={[-3, 2, -2]} intensity={1.5} color="#ff3333" />
      <pointLight position={[2, -1, 3]} intensity={1.0} color="#ff4422" />
      <spotLight position={[0, 8, 2]} intensity={2.5} angle={0.4} penumbra={1} color="#ff2222" />
      
      {/* Volumetric-ish light effect */}
      <spotLight position={[-2, 5, -2]} intensity={1.0} angle={0.15} penumbra={1} color="#ffffff" />

      <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
        <Figure />
      </Float>
      
      <Particles />

      {/* Enhanced Floor with Grid */}
      <group position={[0, -1.5, 0]}>
        <Grid 
          infiniteGrid 
          fadeDistance={10} 
          fadeStrength={5} 
          cellSize={0.5} 
          sectionSize={2.5} 
          sectionColor="#ff2222" 
          cellColor="#333333" 
          sectionThickness={1} 
          cellThickness={0.5}
        />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
          <planeGeometry args={[50, 50]} />
          <meshStandardMaterial color="#050505" roughness={0.8} metalness={0.2} transparent opacity={0.8} />
        </mesh>
      </group>
    </Canvas>
  );
}
