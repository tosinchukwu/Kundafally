import React from "react";
import { motion } from "framer-motion";

interface TokenProps {
  key?: React.Key;
  label: string;
  className?: string;
  delay?: number;
}

export default function Token({ label, className = "", delay = 0 }: TokenProps) {
  return (
    <motion.div
      initial={{ scale: 0, y: -20, opacity: 0 }}
      animate={{ scale: 1, y: 0, opacity: 1 }}
      transition={{ 
        delay, 
        type: "spring", 
        stiffness: 260, 
        damping: 20 
      }}
      className={`relative flex h-10 w-10 items-center justify-center rounded-full border-2 border-yellow-300/50 token-bitcoin shadow-lg ${className}`}
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-yellow-600 to-yellow-400">
        <span className="font-display text-lg font-bold text-white drop-shadow-md">
          {label === "Bitcoin" ? "₿" : label.charAt(0)}
        </span>
      </div>
      {/* Glossy overlay */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/20 to-transparent pointer-events-none" />
    </motion.div>
  );
}
