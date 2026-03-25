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

  // Auto-advance to results if eliminated
  useEffect(() => {
    if (state.isEliminated && state.trapdoorsOpen) {
      const timer = setTimeout(() => {
        dispatch({ type: "NEXT_QUESTION" });
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [state.isEliminated, state.trapdoorsOpen, dispatch]);

  if (!currentQuestion) return null;

  const correctLabel = state.revealedAnswer!;
  const lastHistory = state.history[state.history.length - 1];
  const wasCorrect = lastHistory?.correct;
  const showTrapdoor = state.trapdoorsOpen;

  return (
    <div className="game-container flex flex-col items-center pointer-events-auto bg-transparent" style={{ overflow: "hidden" }}>
      {/* === HTML UI OVERLAY === */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="pointer-events-none relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center pt-6 md:pt-10 px-4"
      >
        {/* Reveal badge */}
        <div className="pointer-events-auto mb-4 md:mb-6 inline-block glass-card px-4 py-1.5 md:px-6 md:py-2 border-accent/40">
          <span className="font-display text-[10px] md:text-sm font-black tracking-[0.2em] text-accent uppercase">Reveal Phase</span>
        </div>

        {/* Question text */}
        <h2
          className="font-display text-center text-xl md:text-3xl font-bold text-white leading-tight mb-2 md:mb-4"
          style={{ textWrap: "balance" } as React.CSSProperties}
        >
          {currentQuestion.question}
        </h2>

        {/* Status Badge */}
        {!wasCorrect && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mb-4 glass-card px-6 py-2 border-red-500/50 bg-red-500/10"
          >
            <span className="font-display text-sm font-black tracking-widest text-red-500 uppercase">Incorrect Prediction</span>
          </motion.div>
        )}
        {wasCorrect && (
           <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mb-4 glass-card px-6 py-2 border-green-500/50 bg-green-500/10"
          >
            <span className="font-display text-sm font-black tracking-widest text-green-400 uppercase">
              Correct Platform {lastHistory?.bonus > 0 && <span className="text-white/60 ml-2">(+${lastHistory.bonus} Vaulted)</span>}
            </span>
          </motion.div>
        )}

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

        {/* MISSION TERMINATED OVERLAY */}
        {state.isEliminated && state.trapdoorsOpen && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md pointer-events-none"
          >
            <div className="glass-card border-red-500 bg-black/90 p-10 md:p-16 text-center shadow-[0_0_100px_rgba(239,68,68,0.4)] max-w-lg">
              <motion.div
                animate={{ opacity: [0.6, 1, 0.6], scale: [1, 1.05, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="font-display text-5xl md:text-7xl font-black text-red-500 italic tracking-tighter mb-6"
              >
                MISSION TERMINATED
              </motion.div>
              <div className="h-1 w-full bg-red-500/20 mb-6 overflow-hidden">
                <motion.div 
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="h-full w-1/3 bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.8)]"
                />
              </div>
              <p className="font-display text-sm md:text-xl font-bold text-white uppercase tracking-[0.3em] mb-2">
                Vault Integrity: 0%
              </p>
              <p className="font-display text-[10px] md:text-xs font-medium text-red-400/60 uppercase tracking-widest">
                Terminating Session... Generating Reports
              </p>
            </div>
          </motion.div>
        )}

      </motion.div>
      {/* Continue Button Area */}
      <div className="mt-8 md:mt-12 mb-8 flex flex-col items-center gap-6 z-20">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => dispatch({ type: "NEXT_QUESTION" })}
          className={`
            pointer-events-auto rounded-full px-10 py-3.5 md:px-16 md:py-5 font-display text-base md:text-xl font-black tracking-widest transition-all
            ${state.isEliminated
              ? "bg-red-500 text-white shadow-[0_0_30px_rgba(239,68,68,0.4)]"
              : "bg-accent text-black shadow-[0_0_30px_rgba(34,211,238,0.4)]"
            }
          `}
        >
          {state.isEliminated ? "VIEW RESULTS" : "CONTINUE"}
        </motion.button>
      </div>
    </div>
  );
}
