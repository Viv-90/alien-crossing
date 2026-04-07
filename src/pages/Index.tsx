import { GameEngine } from '@/components/game/GameEngine';

const Index = () => {
  return (
    <div className="h-screen w-full bg-black">
      <GameEngine />
      
      {/* Global scanning overlay for aesthetic consistency */}
      <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden opacity-[0.05]">
        <div className="h-full w-full bg-[linear-gradient(0deg,transparent,transparent_2px,hsl(0_0%_100%/_0.1)_2px,hsl(0_0%_100%/_0.1)_4px)] bg-[length:100%_4px] animate-scanline" />
      </div>
    </div>
  );
};

export default Index;
