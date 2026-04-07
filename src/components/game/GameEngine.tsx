import { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, PerspectiveCamera, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { Player } from './Player';
import { World } from './World';

export function GameEngine() {
  const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'GAMEOVER'>('START');
  const [score, setScore] = useState(0);
  const playerPosition = useRef(new THREE.Vector3(0, 0, 0));
  const [controls, setControls] = useState({ up: false, down: false, forward: false });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'w') setControls(c => ({ ...c, up: true }));
      if (e.key === 'ArrowDown' || e.key === 's') setControls(c => ({ ...c, down: true }));
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === ' ') setControls(c => ({ ...c, forward: true }));
      if (e.key === ' ' && gameState !== 'PLAYING') startGame();
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'w') setControls(c => ({ ...c, up: false }));
      if (e.key === 'ArrowDown' || e.key === 's') setControls(c => ({ ...c, down: false }));
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === ' ') setControls(c => ({ ...c, forward: false }));
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState]);

  const startGame = () => {
    setGameState('PLAYING');
    setScore(0);
    playerPosition.current.set(0, 0, 0);
  };

  return (
    <div className="relative h-screen w-full bg-[#050505] overflow-hidden">
      <Canvas shadows gl={{ antialias: true }}>
        <CameraEngine gameState={gameState} isMobile={isMobile} />
        <Environment preset="city" />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} />
        
        {gameState === 'PLAYING' ? (
          <GameLoop 
            gameState={gameState} 
            setGameState={setGameState} 
            setScore={setScore} 
            playerPosition={playerPosition} 
            controls={controls}
          />
        ) : (
          <group position={isMobile ? [0, 1.2, 0] : [3.0, -0.4, 0]}>
             <Player 
                position={[0, -1.2, 0]} 
                rotation={[0, -Math.PI / 6, 0]} 
                isWalking={false} 
                isCombo={true}
                scale={isMobile ? 2.2 : 3.5}
              />
             <mesh position={[0, -1.3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[isMobile ? 1.6 : 2.5, isMobile ? 1.7 : 2.6, 0.1, 32]} />
                <meshStandardMaterial color="#0a0a0a" roughness={0.1} metalness={0.9} />
             </mesh>
             <pointLight position={[0, 2, 2]} intensity={4} color="#ff3333" />
             <spotLight position={[0, 5, 0]} intensity={isMobile ? 6 : 8} angle={0.3} penumbra={1} color="#ffffff" target-position={[0, 0, 0]} />
          </group>
        )}
      </Canvas>

      <div className={`absolute inset-0 z-10 pointer-events-none flex flex-col ${isMobile ? 'items-center justify-end pb-24' : 'items-start justify-center pl-32'}`}>
        {gameState === 'START' && (
          <div className={`flex flex-col ${isMobile ? 'items-center gap-2 text-center' : 'items-start gap-4'} animate-in fade-in zoom-in duration-700`}>
            <div className={`text-primary font-display ${isMobile ? 'text-[8px] tracking-[0.8em]' : 'text-[10px] tracking-[1em]'} mb-[-1rem] ml-1 bg-black/40 px-3 py-1 backdrop-blur-sm`}>ALIEN_OS_4.2</div>
            <h1 className={`font-display font-black text-white italic tracking-tighter text-glow drop-shadow-[0_0_20px_rgba(255,255,255,0.15)] ${isMobile ? 'text-6xl' : 'text-9xl'}`}>
              ALIEN <span className="text-primary">CROSSING</span>
            </h1>
            <p className={`text-white/60 font-body font-bold ${isMobile ? 'text-[9px] tracking-[0.2em]' : 'text-xs tracking-[0.3em]'}`}>CROSS THE ROADS. SURVIVE THE CROSSING.</p>
            <div className={`flex flex-col ${isMobile ? 'items-center mt-6' : 'items-start mt-8'} gap-4`}>
              <button 
                onClick={startGame}
                className={`pointer-events-auto bg-primary text-white font-display font-black hover:bg-white hover:text-black transition-all hover:scale-105 skew-x-[-12deg] shadow-[0_0_40px_hsl(var(--primary)/0.6)] ${isMobile ? 'px-8 py-3 text-lg' : 'px-12 py-5 text-xl'}`}
              >
                START MISSION
              </button>
              <div className="flex items-center gap-8 mt-4 text-white/40 text-[10px] font-bold tracking-widest uppercase">
                <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-primary" /> [W/S] TO DODGE</span>
                <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-primary" /> [SPACE] TO START</span>
              </div>
            </div>
          </div>
        )}

        {gameState === 'PLAYING' && (
          <div className="absolute top-12 left-12 flex flex-col items-start gap-1 p-6 border-l-2 border-primary bg-black/40 backdrop-blur-md">
             <div className="text-primary font-display text-[10px] font-bold tracking-[0.4em]">MISSION PROGRESS</div>
             <div className="text-white font-display text-5xl font-black italic tracking-tighter">{Math.floor(score)}m</div>
          </div>
        )}

        {gameState === 'GAMEOVER' && (
          <div className={`flex flex-col ${isMobile ? 'items-center gap-2 text-center' : 'items-start gap-4'} animate-in fade-in zoom-in duration-700`}>
            <div className={`text-primary font-display ${isMobile ? 'text-[8px] tracking-[0.8em]' : 'text-[10px] tracking-[1em]'} mb-[-1rem] ml-1 bg-black/40 px-3 py-1 backdrop-blur-sm`}>MISSION_REPORT_01</div>
            <h1 className={`font-display font-black text-[#cc2222] italic tracking-tighter text-glow drop-shadow-[0_0_20px_rgba(204,34,34,0.3)] ${isMobile ? 'text-5xl' : 'text-8xl'}`}>
              MISSION <span className="text-white">FAILED</span>
            </h1>
            <p className={`text-white/60 font-body font-bold ${isMobile ? 'text-[10px] tracking-[0.2em]' : 'text-sm tracking-[0.3em] uppercase'}`}>{Math.floor(score)}M ELIMINATED BY CROSSING</p>
            <div className={`flex flex-col ${isMobile ? 'items-center mt-8' : 'items-start mt-10'} gap-4`}>
              <button 
                onClick={startGame}
                className={`pointer-events-auto bg-white text-black font-display font-black hover:bg-primary hover:text-white transition-all hover:scale-105 skew-x-[-12deg] shadow-[0_0_40px_rgba(255,255,255,0.2)] ${isMobile ? 'px-8 py-3 text-lg' : 'px-14 py-5 text-xl'}`}
              >
                REBOOT SYSTEM
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function GameLoop({ gameState, setGameState, setScore, playerPosition, controls }) {
  const { camera } = useThree();
  const speed = 4.5; 
  const dodgeSpeed = 9.0;
  
  useFrame((state, delta) => {
    if (gameState !== 'PLAYING') return;

    if (controls.forward) {
        playerPosition.current.x += speed * delta;
    }
    
    // Move Player Sideways
    if (controls.up) playerPosition.current.z -= dodgeSpeed * delta;
    if (controls.down) playerPosition.current.z += dodgeSpeed * delta;
    
    // Clamp player Z
    playerPosition.current.z = THREE.MathUtils.clamp(playerPosition.current.z, -3.5, 3.5);
    
    // Update Score
    setScore(playerPosition.current.x);
    
    // Camera Follow
    const cameraTargetX = playerPosition.current.x;
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, cameraTargetX - 4, 0.1);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, playerPosition.current.z + 6, 0.1);
    camera.position.y = 5;
    camera.lookAt(playerPosition.current.x + 4, 0, playerPosition.current.z);

    // Collision Detection
    const chunkX = Math.round(playerPosition.current.x / 4);
    if (chunkX > 0 && chunkX % 3 === 0) {
        const roadX = chunkX * 4;
        const distToRoadCenter = Math.abs(playerPosition.current.x - roadX);
        
        if (distToRoadCenter < 0.8) {
             // We are on a road. Check common car positions
             // Car logic from Car.tsx: z = initialZ + (speed * direction * (t + index * 0.5)) % 12
             const t = state.clock.elapsedTime;
             
             // Car 1
             const car1Speed = (4 + (chunkX % 2)) * 0.5;
             const car1Dir = 1;
             const car1InitialZ = -6;
             let car1Z = car1InitialZ + (car1Speed * car1Dir * (t + chunkX * 0.5)) % 12;
             if (car1Z > 6) car1Z -= 12;
             
             // Car 2
             const car2Speed = (3 + (chunkX % 3)) * 0.5;
             const car2Dir = -1;
             const car2InitialZ = 6;
             let car2Z = car2InitialZ + (car2Speed * car2Dir * (t + chunkX * 0.5)) % 12;
             if (car2Z < -6) car2Z += 12;

             // Check distance between player Z and car Z
             if (Math.abs(playerPosition.current.z - car1Z) < 1.2 || 
                 Math.abs(playerPosition.current.z - car2Z) < 1.2) {
                 setGameState('GAMEOVER');
             }
        }
    }
  });

  return (
    <>
      <Player 
        position={[playerPosition.current.x, -1.2, playerPosition.current.z]} 
        rotation={[0, Math.PI / 2, 0]}
        isWalking={controls.forward} 
      />
      <World playerX={playerPosition.current.x} />
      <directionalLight position={[playerPosition.current.x + 5, 10, 5]} intensity={1} target-position={[playerPosition.current.x, 0, 0]} />
    </>
  );
}

function CameraEngine({ gameState, isMobile }) {
  const { camera } = useThree();
  
  useFrame(() => {
    if (gameState === 'START') {
      if (isMobile) {
        camera.position.lerp(new THREE.Vector3(0, 2.5, 10.5), 0.05);
        camera.lookAt(0, 1.2, 0);
      } else {
        camera.position.lerp(new THREE.Vector3(1.0, 1.8, 9.5), 0.05);
        camera.lookAt(2.0, 0.8, 0);
      }
    } else if (gameState === 'GAMEOVER') {
      if (isMobile) {
        camera.position.lerp(new THREE.Vector3(0, 2.5, 10.5), 0.05);
        camera.lookAt(0, 1.2, 0);
      } else {
        camera.position.lerp(new THREE.Vector3(1.0, 1.8, 9.5), 0.05);
        camera.lookAt(2.0, 0.8, 0);
      }
    }
  });

  return null;
}
