import { useEffect, useState } from 'react';

const StatBar = ({ label, value, delay }: { label: string; value: number; delay: number }) => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setWidth(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return (
    <div className="mb-4">
      <div className="mb-1 flex justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        <span>{label}</span>
        <span className="text-primary">{value}%</span>
      </div>
      <div className="h-[2px] w-full bg-white/5">
        <div 
          className="h-full bg-primary transition-all duration-1000 ease-out"
          style={{ width: `${width}%`, boxShadow: '0 0 10px hsl(var(--primary) / 0.5)' }}
        />
      </div>
    </div>
  );
};

export const TacticalStats = () => {
  return (
    <div className="flex flex-col gap-8 rounded-sm border border-white/5 bg-black/40 p-6 backdrop-blur-xl ring-1 ring-white/5">
      <div className="relative pl-6">
        {/* Vertical Accent Bar */}
        <div className="absolute left-0 top-0 h-full w-[3px] bg-primary shadow-[0_0_15px_1px_hsl(var(--primary)/0.5)]" />
        
        <div className="mb-2 flex items-center justify-between">
          <div className="font-display text-[9px] font-bold tracking-[0.4em] text-primary/80">
            UNIT IDENTIFICATION
          </div>
          <div className="flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-2 py-0.5">
            <div className="h-1 w-1 animate-pulse rounded-full bg-primary" />
            <span className="text-[8px] font-bold tracking-widest text-primary">ACTIVE</span>
          </div>
        </div>

        <div className="flex items-baseline gap-3">
          <div className="font-display text-3xl font-black tracking-[-0.05em] text-foreground">
            AX-01
          </div>
          <div className="font-display text-sm font-semibold tracking-[0.2em] text-white/40">
            STRIDER
          </div>
        </div>
        
        <div className="mt-2 font-body text-[10px] font-bold tracking-[0.2em] text-muted-foreground/60 uppercase">
          MK-I CROSSING SERIES // ALIEN_OS_4.2
        </div>
      </div>

      <div className="h-px w-full bg-gradient-to-r from-white/10 via-white/5 to-transparent" />

      <div>
        <div className="mb-4 font-display text-[10px] font-bold tracking-[0.3em] text-muted-foreground">
          TACTICAL DATA
        </div>
        <StatBar label="Attack Power" value={92} delay={500} />
        <StatBar label="Defense Shell" value={78} delay={700} />
        <StatBar label="Agility" value={85} delay={900} />
      </div>

      <div className="mt-4 flex items-center gap-3">
        <div className="flex h-1.5 w-1.5 items-center justify-center">
          <div className="h-full w-full animate-pulse rounded-full bg-primary" />
        </div>
        <span className="font-display text-[10px] font-bold tracking-[0.2em] text-foreground">
          SYSTEM STATUS: <span className="text-primary">OPTIMAL</span>
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-6">
        <div>
          <div className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
            Class
          </div>
          <div className="font-display text-xs font-bold text-foreground">VANGUARD</div>
        </div>
        <div>
          <div className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
            Affiliation
          </div>
          <div className="font-display text-xs font-bold text-foreground">ALIEN REGISTRY</div>
        </div>
      </div>
    </div>
  );
};

export default TacticalStats;
