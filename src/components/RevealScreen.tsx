import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useGame } from "@/context/GameContext";
import Platform from "./Platform";

export default function RevealScreen() {
  const { state, dispatch, currentQuestion } = useGame();
  const [showTrapdoor, setShowTrapdoor] = useState(false);

  useEffect(() => {
    // Stage 1: Reveal correct answer (happens immediately on mount)
    
    // Stage 2: After 1.5s, trigger trapdoor for incorrect answers
    const timer = setTimeout(() => {
      setShowTrapdoor(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (!currentQuestion) return null;

  const correctLabel = state.revealedAnswer!;
  const lastHistory = state.history[state.history.length - 1];

  return (
    <div className="game-container flex flex-col items-center justify-center px-4">
      <div className="spotlight-main" />
      <div className="absolute inset-0 circuitry-bg opacity-20 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-6xl"
      >
        <div className="mb-12 text-center">
          <div className="inline-block glass-card px-6 py-2 border-accent/40">
            <span className="font-display text-sm font-black tracking-[0.2em] text-accent uppercase">Reveal Phase</span>
          </div>
        </div>

        <h2 className="font-display mb-16 text-center text-3xl font-bold text-white leading-tight md:text-4xl" style={{ textWrap: "balance" } as React.CSSProperties}>
          {currentQuestion.question}
        </h2>

        {/* Platforms Area - Semi-circle spatial layout */}
        <div className="mt-24 flex items-end justify-center gap-12 w-full max-w-7xl px-8 relative">
          {currentQuestion.options.map((opt, i) => {
            const isCorrect = opt.label === correctLabel;
            const tokensOn = state.distribution[opt.label] || 0;
            const isTrapdoorOpen = showTrapdoor && !isCorrect;
            const isOutside = i === 0 || i === 3;

            return (
              <div 
                key={opt.label} 
                className={`transition-all duration-500 ${isOutside ? "scale-110 mb-[-20px]" : "scale-90 opacity-80"}`}
              >
                <Platform
                  label={opt.label}
                  text={opt.text}
                  tokens={tokensOn}
                  isSelected={false}
                  isCorrect={isCorrect}
                  isTrapdoorOpen={isTrapdoorOpen}
                  isFalling={isTrapdoorOpen}
                  index={i}
                  onClick={() => {}}
                />
              </div>
            );
          })}
          
          {/* Abyss Pit Glow */}
          <div className="absolute bottom-[-150px] left-1/2 -translate-x-1/2 w-[120%] h-[400px] bg-gradient-to-t from-purple-600/30 to-transparent blur-[120px] pointer-events-none" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={showTrapdoor ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8 }}
          className="mt-20 flex flex-col items-center text-center"
        >
          {!state.isEliminated ? (
            <div className="glass-card px-12 py-8 flex flex-col items-center">
              {lastHistory?.correct ? (
                <div className="font-display text-xl font-bold text-accent">
                  STABLE. <span className="text-bonus">+{lastHistory.bonus}</span> BONUS APPLIED.
                </div>
              ) : (
                <div className="font-display text-xl font-bold text-red-400">
                  UNSTABLE. <span className="text-white">-{lastHistory?.tokensLost}</span> TOKENS LOST.
                </div>
              )}
              
              <div className="mt-6 flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-yellow-600 to-yellow-400 border border-yellow-300/50">
                  <span className="text-lg font-bold text-white">₿</span>
                </div>
                <span className="font-data text-4xl font-black text-white">{state.tokens.toLocaleString()}</span>
              </div>
            </div>
          ) : (
             <div className="glass-card px-10 py-6 border-red-500/50 bg-red-500/10">
               <div className="font-display text-2xl font-black text-red-500 neon-text-glow">VAULT EMPTY. SESSION TERMINATED.</div>
             </div>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => dispatch({ type: "NEXT_QUESTION" })}
            className={`
              mt-12 rounded-full px-16 py-5 font-display text-xl font-black tracking-widest transition-all
              ${state.isEliminated 
                ? "bg-red-500 text-white shadow-[0_0_30px_rgba(239,68,68,0.4)]" 
                : "bg-accent text-black shadow-[0_0_30px_rgba(34,211,238,0.4)]"
              }
            `}
          >
            {state.isEliminated ? "VIEW RESULTS" : "CONTINUE"}
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}
