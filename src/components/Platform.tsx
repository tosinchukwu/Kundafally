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
  onClick: () => void;
  index: number;
}

export default function Platform({ 
  label, 
  text, 
  tokens, 
  isSelected, 
  isFalling, 
  onClick, 
  index 
}: PlatformProps) {
  const tokenLabels = Array(Math.min(tokens, 5)).fill(label);

  return (
    <motion.div
      className={`platform-3d relative w-full ${isFalling ? "animate-fall" : ""}`}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6, ease: "easeOut" }}
    >
      <button
        onClick={onClick}
        className={`
          platform-top relative w-full p-6 text-left transition-transform duration-200
          ${isSelected ? "scale-[1.02] border-accent" : "hover:translate-y-[-2px]"}
        `}
      >
        <div className="flex items-center justify-between">
          <span className={`font-display text-4xl font-black ${isSelected ? "text-accent" : "text-white/40"}`}>
            {label}
          </span>
          {tokens > 0 && (
            <div className="flex -space-x-4">
              {tokenLabels.map((l, i) => (
                <Token key={i} label={l} className="scale-75" />
              ))}
              {tokens > 5 && (
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-yellow-300/20 bg-black/40 text-xs font-bold text-gold backdrop-blur-sm">
                  +{tokens - 5}
                </div>
              )}
            </div>
          )}
        </div>
        <p className="mt-4 font-display text-lg font-bold text-white neon-text-glow">
          {text}
        </p>
        
        {/* Answer Selection Indicator */}
        {isSelected && (
          <motion.div 
            layoutId="selection-glow"
            className="absolute -inset-1 rounded-xl bg-accent/20 blur-md pointer-events-none"
          />
        )}
      </button>
      
      {/* Platform side for 3D effect */}
      <div className="platform-side" />
      
      {/* Bottom shadow/glow */}
      <div className="absolute -bottom-10 left-1/2 h-4 w-3/4 -translate-x-1/2 bg-accent/20 blur-2xl opacity-50" />
    </motion.div>
  );
}
