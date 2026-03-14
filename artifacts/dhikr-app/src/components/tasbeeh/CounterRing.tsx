import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CounterRingProps {
  count: number;
  target: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  isComplete: boolean;
  color?: string;
}

export function CounterRing({ 
  count, 
  target, 
  size = 280, 
  strokeWidth = 10,
  className,
  isComplete,
  color = "hsl(var(--primary))"
}: CounterRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  // Prevent overflow if count > target for ring visual
  const safeCount = Math.min(count, target);
  const progress = safeCount / target;
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <div className={cn("relative flex items-center justify-center", className)} style={{ width: size, height: size }}>
      {/* Background Track */}
      <svg width={size} height={size} className="transform -rotate-90 absolute inset-0">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-black/5"
        />
        
        {/* Progress Fill */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={cn(isComplete && "drop-shadow-[0_0_8px_rgba(201,168,76,0.6)]")}
        />
      </svg>

      {/* Milestone Markers (e.g. at 33, 66) */}
      <div className="absolute inset-0 pointer-events-none">
         {[33, 66, 100].map(marker => {
           if (marker > target) return null;
           const rotation = (marker / target) * 360;
           const isPassed = count >= marker;
           return (
             <div 
               key={marker}
               className="absolute top-0 left-1/2 -translate-x-1/2"
               style={{ 
                 height: size, 
                 transform: `rotate(${rotation}deg)` 
               }}
             >
               <div className={cn(
                 "w-2.5 h-2.5 rounded-full transition-all duration-500",
                 isPassed ? "bg-secondary shadow-[0_0_10px_#C9A84C] scale-150" : "bg-black/10"
               )} />
             </div>
           );
         })}
      </div>

      {/* Inner Glow when complete */}
      <motion.div 
        className="absolute inset-0 rounded-full bg-secondary/10 pointer-events-none blur-xl"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: isComplete ? 1 : 0,
          scale: isComplete ? 1.1 : 0.8
        }}
        transition={{ duration: 0.8 }}
      />
    </div>
  );
}
