import { useMemo } from 'react';
import { Car } from './Car';

export function World({ playerX }) {
  const visibleChunks = useMemo(() => {
    const start = Math.floor(playerX / 4) - 5;
    const end = start + 15;
    const items = [];
    for (let i = start; i < end; i++) {
        items.push(i);
    }
    return items;
  }, [playerX]);

  return (
    <group>
      {visibleChunks.map((i) => (
        <Chunk key={i} index={i} />
      ))}
    </group>
  );
}

function Chunk({ index }) {
  const isRoad = index > 0 && index % 3 === 0;
  
  return (
    <group position={[index * 4, -1.5, 0]}>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4, 12]} />
        <meshStandardMaterial color={isRoad ? '#111111' : '#050505'} roughness={0.8} />
      </mesh>
      
      {/* Road Markings */}
      {isRoad && (
        <>
          <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[4, 0.1]} />
            <meshStandardMaterial color="#ffffff" opacity={0.3} transparent />
          </mesh>
          <mesh position={[0, 0.01, 2]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[4, 0.1]} />
            <meshStandardMaterial color="#ffffff" opacity={0.3} transparent />
          </mesh>
           <mesh position={[0, 0.01, -2]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[4, 0.1]} />
            <meshStandardMaterial color="#ffffff" opacity={0.3} transparent />
          </mesh>
          {/* Deterministic Cars */}
          <DeterministicCars index={index} />
        </>
      )}
      
      {/* Grass/Safe side details */}
      {!isRoad && (
         <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <gridHelper args={[4, 2, '#ff3333', '#111111']} rotation={[Math.PI / 2, 0, 0]} />
         </mesh>
      )}
    </group>
  );
}

function DeterministicCars({ index }) {
    const car1Speed = (4 + (index % 2)) * 0.5;
    const car2Speed = (3 + (index % 3)) * 0.5;

    return (
        <group position={[0, 1.5, 0]}>
            <Car index={index} carId={1} speed={car1Speed} direction={1} />
            <Car index={index} carId={2} speed={car2Speed} direction={-1} />
        </group>
    );
}
