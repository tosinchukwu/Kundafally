import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useGame } from "@/context/GameContext";

export default function RevealScreen() {
  const { state, dispatch, currentQuestion, currentToken } = useGame();
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch({ type: "OPEN_TRAPDOORS" });
    }, 1500);
    return () => clearTimeout(timer);
  }, [dispatch]);

  if (!currentQuestion) return null;

  const correctLabel = state.revealedAnswer!;
  const lastHistory = state.history[state.history.length - 1];
  const showTrapdoor = state.trapdoorsOpen;

  return (
    <div className="game-container flex flex-col items-center pointer-events-auto bg-transparent" style={{ overflow: "hidden" }}>
      {/* === HTML UI OVERLAY === */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="pointer-events-none relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center pt-10 px-4"
      >
        {/* Reveal badge */}
        <div className="pointer-events-auto mb-6 inline-block glass-card px-6 py-2 border-accent/40">
          <span className="font-display text-sm font-black tracking-[0.2em] text-accent uppercase">Reveal Phase</span>
        </div>

        {/* Question text */}
        <h2
          className="font-display text-center text-2xl md:text-3xl font-bold text-white leading-tight mb-4"
          style={{ textWrap: "balance" } as React.CSSProperties}
        >
          {currentQuestion.question}
        </h2>

        {/* Correct Answer Badge */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, type: "spring", damping: 12 }}
          className="glass-card px-6 py-4 md:px-10 md:py-5 border-green-400/50 bg-green-500/5 relative overflow-hidden"
        >
          {/* Internal Glow Pulse */}
          <motion.div
            animate={{ opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-green-400/20 blur-xl"
          />
          <span className="relative z-10 font-display text-[10px] md:text-sm font-black tracking-[0.15em] md:tracking-[0.25em] text-green-400 uppercase flex items-center gap-2 md:gap-3 leading-tight md:leading-normal">
            <span className="h-1.5 w-1.5 md:h-2 md:w-2 rounded-full bg-green-400 animate-pulse flex-shrink-0" />
            <span className="flex-1">
              Correct: <span className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">{correctLabel}</span>
              <span className="hidden md:inline">{" — "}{currentQuestion.options.find(o => o.label === correctLabel)?.text}</span>
            </span>
          </span>
        </motion.div>
      </motion.div>

      {/* Result Footer - slides up after trapdoors open */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={showTrapdoor ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
        transition={{ duration: 0.8 }}
        className="pointer-events-none absolute bottom-0 left-0 right-0 z-20 flex flex-col items-center p-6 md:p-8 bg-gradient-to-t from-background/95 via-background/60 to-transparent pt-16 md:pt-20"
      >
        {!state.isEliminated ? (
          <motion.div 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="pointer-events-auto glass-card px-8 py-6 md:px-12 md:py-8 flex flex-col items-center mb-6 md:mb-8 border-white/5 shadow-2xl backdrop-blur-3xl"
          >
            {lastHistory?.correct ? (
              <div className="font-display text-xl md:text-2xl font-black text-accent tracking-tight flex items-center gap-2">
                STABLE
              </div>
            ) : (
              <div className="font-display text-xl md:text-2xl font-black text-red-500 tracking-tight">
                UNSTABLE <span className="text-white/80">-{lastHistory?.tokensLost}</span>
              </div>
            )}
            
            <div className="mt-4 md:mt-6 flex flex-col items-center">
              <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-2">Vault Balance</span>
              <div className="flex items-center gap-3 md:gap-5">
                <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-xl md:rounded-2xl bg-gradient-to-tr from-accent/60 to-accent shadow-[0_0_20px_rgba(34,211,238,0.3)]">
                  <span className="text-[10px] md:text-sm font-black text-white leading-none tracking-tighter">{currentToken}</span>
                </div>
                <span className="font-data text-4xl md:text-5xl font-black text-white tracking-tighter">
                  ${state.tokens.toLocaleString()}
                </span>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="glass-card px-10 py-8 md:px-12 md:py-10 border-red-500/40 bg-red-500/5 mb-6 md:mb-8 flex flex-col items-center backdrop-blur-2xl">
            <div className="font-display text-2xl md:text-3xl font-black text-red-500 neon-text-glow tracking-tighter uppercase mb-1 md:mb-2">Vault Breach</div>
            <div className="text-white/60 font-medium tracking-wide text-xs">SESSION TERMINATED</div>
          </div>
        )}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => dispatch({ type: "NEXT_QUESTION" })}
          className={`
            pointer-events-auto rounded-full px-12 py-4 md:px-16 md:py-5 font-display text-lg md:text-xl font-black tracking-widest transition-all
            ${state.isEliminated
              ? "bg-red-500 text-white shadow-[0_0_30px_rgba(239,68,68,0.4)]"
              : "bg-accent text-black shadow-[0_0_30px_rgba(34,211,238,0.4)]"
            }
          `}
        >
          {state.isEliminated ? "VIEW RESULTS" : "CONTINUE"}
        </motion.button>
      </motion.div>
    </div>
  );
}
