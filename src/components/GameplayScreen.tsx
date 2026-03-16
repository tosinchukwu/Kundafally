import React, { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "@/context/GameContext";
import WalletButton from "./WalletButton";

const PRESETS = [10, 25, 50, 100];

export default function GameplayScreen() {
  const { state, dispatch, currentQuestion } = useGame();
  const [prevTokens, setPrevTokens] = useState(state.tokens);
  const [showBonus, setShowBonus] = useState<{ amount: number; id: number } | null>(null);

  React.useEffect(() => {
    if (state.tokens > prevTokens) {
      const bonus = state.tokens - prevTokens;
      setShowBonus({ amount: bonus, id: Date.now() });
      const timer = setTimeout(() => setShowBonus(null), 1500);
      setPrevTokens(state.tokens);
      return () => clearTimeout(timer);
    } else if (state.tokens < prevTokens) {
      setPrevTokens(state.tokens);
    }
  }, [state.tokens, prevTokens]);

  const totalDistributed = useMemo(
    () => Object.values(state.distribution).reduce((a: number, b: number) => a + b, 0),
    [state.distribution]
  );
  const available = state.tokens - totalDistributed;

  console.log("GameplayScreen active. Current question:", currentQuestion?.id);
  
  if (!currentQuestion) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-10 text-center">
        <h1 className="text-4xl font-black text-white mb-4 italic">KUNDA FALL</h1>
        <div className="glass-card p-8 border-red-500/50">
          <p className="text-red-400 font-display mb-4">CRITICAL: No question data found.</p>
          <p className="text-white/60 text-xs font-data mb-6 truncate max-w-sm">
            Phase: {state.phase} | Categories: {state.selectedCategories.length} | Index: {state.currentCategoryIndex}
          </p>
          <button 
            onClick={() => dispatch({ type: "RESET" })}
            className="rounded-full bg-accent px-8 py-3 font-display font-black text-black"
          >
            RETURN TO MENU
          </button>
        </div>
      </div>
    );
  }

  const addTokens = (label: string, amount: number) => {
    if (amount > available) amount = available;
    if (amount <= 0) return;
    dispatch({ type: "DISTRIBUTE_TOKENS", label, amount });
  };

  const canLock = totalDistributed > 0;

  const selectedPlate = state.selectedPlatform;


  return (
    <div className="game-container flex flex-col items-center bg-transparent" style={{ overflow: "hidden" }}>


      {/* === HTML UI OVERLAY === */}

      {/* Header Section */}
      <header className="relative z-10 flex w-full flex-col md:flex-row items-center md:items-start justify-between p-4 md:p-6 pointer-events-none gap-4 md:gap-0">
        {/* Token Balance (Left on PC, Top on Phone) */}
        <div className="pointer-events-auto flex flex-col items-center md:items-start gap-1">
          <div className="glass-card flex items-center gap-3 px-3 py-1.5 md:px-4 md:py-2">
            <div className="flex h-6 w-6 md:h-8 md:w-8 items-center justify-center rounded-full bg-gradient-to-tr from-yellow-600 to-yellow-400 border border-yellow-300/50">
              <span className="text-xs md:text-sm font-bold text-white">₿</span>
            </div>
            <span className="font-data text-xl md:text-2xl font-black text-white">{state.tokens.toLocaleString()}</span>
          </div>
          <div className="relative h-6">
            <AnimatePresence>
              {showBonus && (
                <motion.span 
                   key={showBonus.id}
                   initial={{ opacity: 0, y: 5 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0 }}
                   className="absolute left-1/2 -translate-x-1/2 md:translate-x-0 md:left-4 font-data text-base md:text-lg font-bold text-bonus whitespace-nowrap"
                >
                  +{showBonus.amount} BONUS
                </motion.span>
              )}
              {totalDistributed > 0 && !showBonus && (
                <motion.span 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute left-1/2 -translate-x-1/2 md:translate-x-0 md:left-4 font-data text-xs font-bold text-accent whitespace-nowrap"
                >
                  -{totalDistributed} PLACED
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Branding (Center) */}
        <div className="flex flex-col items-center order-first md:order-none">
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="relative scale-75 md:scale-90"
          >
            <div className="logo-frame bg-gradient-to-br from-indigo-900/90 to-black/95 backdrop-blur-3xl border-t border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
              <h1 className="font-display text-4xl md:text-5xl font-black italic tracking-tighter text-white neon-text-glow">
                KUNDA
              </h1>
              <h1 className="font-display text-3xl md:text-4xl font-black italic tracking-tighter text-white/80 -mt-2">
                FALL
              </h1>
            </div>
          </motion.div>
          <p className="mt-2 md:mt-4 font-display text-[8px] md:text-[10px] font-black text-white/40 uppercase tracking-[0.4em] text-center pointer-events-auto">
            Protect the Stack • Let the Error Fall
          </p>
        </div>

        {/* Utility Buttons (Top Right) */}
        <div className="hidden md:flex pointer-events-auto flex-col gap-4">
          <WalletButton />
          <div className="flex gap-2 justify-end">
             <button className="h-10 w-10 flex items-center justify-center glass-card hover:bg-white/10 text-white">
                <IconSound />
             </button>
             <button className="h-10 w-10 flex items-center justify-center glass-card hover:bg-white/10 text-white border-accent/40">
                <IconSettings />
             </button>
          </div>
        </div>
      </header>

      {/* Question Box - pinned near top of the 3D scene */}
      <main className="pointer-events-none relative z-10 flex w-full flex-col items-center px-4 mt-2">
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="pointer-events-auto group relative w-full max-w-3xl"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-accent/30 to-primary/30 blur-2xl opacity-20 group-hover:opacity-40 transition" />
          <div className="glass-card flex items-center justify-center p-6 md:p-10 border-white/5 bg-white/[0.02] backdrop-blur-3xl shadow-2xl">
            <h2 className="text-center font-display text-xl md:text-3xl font-bold text-white leading-snug tracking-tight drop-shadow-sm">
              {currentQuestion.question}
            </h2>
          </div>
          {/* Question counter dots */}
          <div className="mt-6 flex justify-center gap-3">
            {[...Array(3)].map((_, i) => (
              <div 
                key={i} 
                className={`h-1.5 w-10 rounded-full transition-all duration-500 ${i === 0 ? "bg-accent shadow-[0_0_10px_rgba(34,211,238,0.5)]" : "bg-white/10"}`} 
              />
            ))}
          </div>
        </motion.div>
      </main>

      {/* Footer Controls       <footer className="pointer-events-none absolute bottom-0 left-0 right-0 z-20 flex flex-col items-center p-3 md:p-4 bg-transparent pt-12">
        {/* Token Tray (Appears when platform selected) */}
        <AnimatePresence>
          {selectedPlate && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              className="pointer-events-auto glass-card mb-2 md:mb-4 flex flex-wrap items-center justify-center gap-2 p-2 md:p-3 border-accent/20 max-w-[95vw]"
            >
              <div className="w-full md:w-auto mb-1 md:mb-0 md:mr-3 px-3 py-1 bg-white/5 rounded-lg flex items-center justify-center gap-2">
                <span className="font-display text-sm md:text-base font-black text-accent">{selectedPlate}</span>
                <span className="font-data text-xs text-white/50">|</span>
                <span className="font-data text-[10px] md:text-xs text-white/60">AVAIL:</span>
                <span className="ml-1 font-data text-sm md:text-base font-bold text-gold">{available.toLocaleString()}</span>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-1 md:gap-2">
                {PRESETS.map((pct) => {
                  const amt = Math.floor(state.tokens * (pct / 100));
                  const actualAmt = Math.min(amt, available);
                  return (
                    <button
                      key={pct}
                      onClick={() => addTokens(selectedPlate, actualAmt)}
                      disabled={available <= 0}
                      className="rounded-lg bg-white/5 px-3 py-1.5 md:px-5 md:py-2.5 font-data text-[10px] md:text-xs font-bold text-white border border-white/10 transition-all hover:bg-accent/20 disabled:opacity-30"
                    >
                      +{pct}%
                    </button>
                  );
                })}
                <button
                  onClick={() => addTokens(selectedPlate, available)}
                  disabled={available <= 0}
                  className="rounded-lg bg-accent px-5 py-1.5 md:px-7 md:py-2.5 font-display text-[10px] md:text-xs font-black text-black transition-all hover:scale-105 disabled:opacity-30"
                >
                  ALL IN
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="pointer-events-auto flex w-full max-w-4xl items-center justify-between px-4 md:px-6">
          <div className="text-left">
            <span className="font-data text-[8px] md:text-[10px] text-white/40 block">COLLECTED</span>
            <span className="font-data text-base md:text-xl font-black text-white">{totalDistributed.toLocaleString()}</span>
          </div>

          <motion.button
            whileHover={canLock ? { scale: 1.05, boxShadow: "0 0 50px rgba(34,211,238,0.3)" } : {}}
            whileTap={canLock ? { scale: 0.95 } : {}}
            onClick={() => {
              if (canLock) {
                dispatch({ type: "LOCK_ANSWERS" });
              }
            }}
            disabled={!canLock}
            className={`
              relative group flex items-center gap-2 md:gap-3 rounded-lg md:rounded-xl px-6 py-2 md:px-12 md:py-4 font-display text-xs md:text-lg font-black tracking-[0.1em] transition-all
              ${canLock
                ? "bg-accent text-black shadow-[0_0_20px_rgba(34,211,238,0.3)]"
                : "bg-white/5 text-white/20 border border-white/5"
              }
            `}
          >
            {canLock && (
              <motion.div 
                animate={{ opacity: [0.1, 0.4, 0.1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute inset-0 rounded-lg md:rounded-xl bg-white" 
              />
            )}
            <span className="relative z-10">LOCK SESSION</span>
          </motion.button>

          <div className="text-right">
            <span className="font-data text-[8px] md:text-[10px] text-white/40 block">QUEST</span>
            <span className="font-data text-base md:text-xl font-black text-white">{state.questionsAnswered + 1}</span>
          </div>
        </div>
      </footer>
er>
    </div>
  );
}

function IconSound() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 5L6 9H2v6h4l5 4V5zM15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  );
}

function IconSettings() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}
