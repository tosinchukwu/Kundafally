import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useGame } from "@/context/GameContext";
import GameScene from "./three/GameScene";

export default function RevealScreen() {
  const { state, dispatch, currentQuestion } = useGame();
  const [showTrapdoor, setShowTrapdoor] = useState(false);

  useEffect(() => {
    // Stage 2: After 1.5s, trigger trapdoor for incorrect answers
    const timer = setTimeout(() => {
      setShowTrapdoor(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (!currentQuestion) return null;

  const correctLabel = state.revealedAnswer!;
  const lastHistory = state.history[state.history.length - 1];
  const trapdoorPlatforms = showTrapdoor
    ? currentQuestion.options.map(o => o.label).filter(l => l !== correctLabel)
    : [];

  return (
    <div className="game-container flex flex-col items-center" style={{ overflow: "hidden" }}>
      {/* === FULL-SCREEN 3D CANVAS === */}
      <div className="absolute inset-0 z-0">
        <GameScene
          distribution={state.distribution}
          options={currentQuestion.options}
          revealedAnswer={correctLabel}
          trapdoorPlatforms={trapdoorPlatforms}
          onPlatformClick={undefined}
          selectedPlatform={null}
        />
      </div>

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
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, type: "spring" }}
          className="glass-card px-8 py-3 border-green-400/60 bg-green-400/10"
        >
          <span className="font-display text-sm font-black tracking-widest text-green-400 uppercase">
            ✓ Correct Answer: <span className="text-white">{correctLabel}</span>
            {" — "}
            {currentQuestion.options.find(o => o.label === correctLabel)?.text}
          </span>
        </motion.div>
      </motion.div>

      {/* Result Footer - slides up after trapdoors open */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={showTrapdoor ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
        transition={{ duration: 0.8 }}
        className="pointer-events-none absolute bottom-0 left-0 right-0 z-20 flex flex-col items-center p-8 bg-gradient-to-t from-background/95 via-background/60 to-transparent"
      >
        {!state.isEliminated ? (
          <div className="pointer-events-auto glass-card px-10 py-6 flex flex-col items-center mb-6">
            {lastHistory?.correct ? (
              <div className="font-display text-xl font-bold text-accent">
                STABLE. <span className="text-bonus">+{lastHistory.bonus}</span> BONUS APPLIED.
              </div>
            ) : (
              <div className="font-display text-xl font-bold text-red-400">
                UNSTABLE. <span className="text-white">-{lastHistory?.tokensLost}</span> TOKENS LOST.
              </div>
            )}
            <div className="mt-4 flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-yellow-600 to-yellow-400 border border-yellow-300/50">
                <span className="text-lg font-bold text-white">₿</span>
              </div>
              <span className="font-data text-4xl font-black text-white">{state.tokens.toLocaleString()}</span>
            </div>
          </div>
        ) : (
          <div className="glass-card px-10 py-6 border-red-500/50 bg-red-500/10 mb-6">
            <div className="font-display text-2xl font-black text-red-500 neon-text-glow">VAULT EMPTY. SESSION TERMINATED.</div>
          </div>
        )}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => dispatch({ type: "NEXT_QUESTION" })}
          className={`
            pointer-events-auto rounded-full px-16 py-5 font-display text-xl font-black tracking-widest transition-all
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
