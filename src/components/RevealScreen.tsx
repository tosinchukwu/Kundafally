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
  const wasCorrect = lastHistory?.correct;
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
        <div className="pointer-events-auto mb-6 inline-block bg-slate-900 px-6 py-2 border-l-4 border-safe">
          <span className="font-mono text-[10px] font-black tracking-[0.4em] text-safe uppercase">RECON_PROCESS::ACTIVE</span>
        </div>

        {/* Question text */}
        <h2
          className="font-display text-center text-2xl md:text-3xl font-bold text-white leading-tight mb-4"
          style={{ textWrap: "balance" } as React.CSSProperties}
        >
          {currentQuestion.question}
        </h2>

        {/* Status Badge */}
        {!wasCorrect && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mb-6 bg-risk/10 px-8 py-3 border-l-2 border-risk shadow-risk"
          >
            <span className="font-mono text-[10px] font-black tracking-[0.3em] text-risk uppercase">CRITICAL_BRCH::VOID_INTRUSION</span>
          </motion.div>
        )}
        {wasCorrect && (
           <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mb-6 bg-safe/10 px-8 py-3 border-l-2 border-safe shadow-safe"
          >
            <span className="font-mono text-[10px] font-black tracking-[0.3em] text-safe uppercase">SEC_SIGNAL::INTEGRITY_VERIFIED</span>
          </motion.div>
        )}

        {/* Correct Answer Badge */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, type: "spring", damping: 12 }}
          className="bg-slate-900 border-l border-white/10 px-10 py-6 relative overflow-hidden"
        >
          <span className="relative z-10 font-mono text-[10px] font-black tracking-[0.4em] text-white/40 uppercase flex items-center justify-center gap-4 leading-tight">
            TARGET_KEY: <span className="text-safe text-2xl md:text-3xl translate-y-0.5 inline-block font-data">{correctLabel}</span>
          </span>
        </motion.div>
      </motion.div>
      {/* Continue Button Area */}
      <div className="mt-auto mb-12 flex flex-col items-center gap-6 z-20">
        <motion.button
          whileHover={{ scale: 1.05, backgroundColor: "#fff", color: "#000" }}
          whileTap={{ scale: 0.95 }}
          onClick={() => dispatch({ type: "NEXT_QUESTION" })}
          className={`
            pointer-events-auto rounded-sm px-12 py-4 md:px-16 md:py-5 font-mono text-sm md:text-base font-black tracking-[0.3em] transition-all border-2
            ${state.isEliminated
              ? "border-risk text-risk shadow-risk"
              : "border-safe text-safe shadow-safe"
            }
          `}
        >
          {state.isEliminated ? "DEBRIEF::ANALYSIS" : "EXECUTE::NEXT"}
        </motion.button>
      </div>
    </div>
  );
}
