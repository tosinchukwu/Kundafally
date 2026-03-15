import React from "react";
import { motion } from "framer-motion";
import Token from "./Token";

interface PlatformProps {
  key?: React.Key;
  label: string;
  text: string;
  tokens: number;
  isSelected: boolean;
  isFalling?: boolean;
  isCorrect?: boolean;
  isTrapdoorOpen?: boolean;
  onClick: () => void;
  index: number;
}

export default function Platform({ 
  label, 
  text, 
  tokens, 
  isSelected, 
  isFalling, 
  isCorrect,
  isTrapdoorOpen,
  onClick, 
  index 
}: PlatformProps) {
  const tokenLabels = Array(Math.min(tokens, 5)).fill(label);

  return (
    <motion.div
      className={`relative flex flex-col items-center ${isFalling ? "animate-fall" : ""}`}
      style={{ perspective: "1000px" }}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6, ease: "easeOut" }}
    >
      {/* Vertical Backboard */}
      <div className={`
        relative mb-[-10px] flex h-24 w-20 items-center justify-center rounded-lg border-2 bg-black/40 backdrop-blur-md transition-all duration-300
        ${isSelected ? "border-accent shadow-[0_0_20px_rgba(34,211,238,0.5)]" : "border-white/10"}
        ${isCorrect ? "border-green-400 shadow-[0_0_25px_rgba(74,222,128,0.6)]" : ""}
      `}>
        <span className={`font-display text-5xl font-black ${isSelected ? "text-accent" : isCorrect ? "text-green-400" : "text-white/40"}`}>
          {label}
        </span>
      </div>

      {/* Horizontal Base (Trapdoor) */}
      <div 
        onClick={onClick}
        className={`
          platform-top relative h-16 w-32 cursor-pointer transition-all duration-300
          ${isCorrect ? "correct-platform-glow" : ""}
          ${isTrapdoorOpen ? "trapdoor-animate" : ""}
        `}
        style={{ transform: "rotateX(60deg)" }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          {tokens > 0 && (
            <div className="relative h-12 w-12 -translate-y-6">
              {tokenLabels.map((l, i) => (
                <Token 
                  key={i} 
                  label={l} 
                  className="absolute scale-75 shadow-2xl" 
                  style={{ 
                    left: `${i * 4}px`, 
                    top: `${-i * 6}px`, 
                    zIndex: i,
                    transform: `rotate(${i * 5}deg)`
                  } as React.CSSProperties}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Side of the base for 3D look */}
      <div className="platform-side h-6 w-32 mt-[-8px]" style={{ transform: "rotateX(0deg)" }} />

      {/* Answer Text Label (Below) */}
      <p className="mt-4 max-w-[120px] text-center font-display text-sm font-bold text-white/80 neon-text-glow">
        {text}
      </p>

      {/* Bottom shadow/glow */}
      <div className="absolute -bottom-10 left-1/2 h-4 w-3/4 -translate-x-1/2 bg-accent/20 blur-2xl opacity-50" />
    </motion.div>
  );
}
