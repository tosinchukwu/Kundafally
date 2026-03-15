import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "@/context/GameContext";
import Platform from "./Platform";
import WalletButton from "./WalletButton";

const PRESETS = [10, 25, 50, 100];

export default function GameplayScreen() {
  const { state, dispatch, currentQuestion } = useGame();
  const [selectedPlate, setSelectedPlate] = useState<string | null>(null);

  const totalDistributed = useMemo(
    () => Object.values(state.distribution).reduce((a: number, b: number) => a + b, 0),
    [state.distribution]
  );
  const available = state.tokens - totalDistributed;

  if (!currentQuestion) return null;

  const addTokens = (label: string, amount: number) => {
    if (amount > available) amount = available;
    if (amount <= 0) return;
    dispatch({ type: "DISTRIBUTE_TOKENS", label, amount });
  };

  const canLock = totalDistributed > 0;

  return (
    <div className="game-container flex flex-col items-center">
      <div className="spotlight-main" />
      
      {/* Background Circuitry */}
      <div className="absolute inset-0 circuitry-bg opacity-30 pointer-events-none" />

      {/* Header Section */}
      <header className="relative z-10 flex w-full items-start justify-between p-6 md:p-10">
        {/* Score Display (Top Left) */}
        <div className="flex flex-col gap-1">
          <div className="glass-card flex items-center gap-3 px-4 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-yellow-600 to-yellow-400 border border-yellow-300/50">
              <span className="text-sm font-bold text-white">₿</span>
            </div>
            <span className="font-data text-2xl font-black text-white">{state.tokens.toLocaleString()}</span>
          </div>
          <AnimatePresence>
            {totalDistributed > 0 && (
              <motion.span 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="ml-2 font-data text-sm font-bold text-green-400"
              >
                +{totalDistributed}
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Branding (Center) */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="absolute -inset-4 bg-accent/20 blur-2xl rounded-full" />
            <div className="relative glass-card px-8 py-4 flex flex-col items-center border-t-2 border-accent/50">
              <h1 className="font-display text-4xl md:text-5xl font-black italic tracking-tighter text-white neon-text-glow">
                KUNDA
              </h1>
              <h1 className="font-display text-3xl md:text-4xl font-black italic tracking-tighter text-white/80 -mt-2">
                FALL
              </h1>
            </div>
          </div>
          <p className="mt-4 font-display text-sm font-bold text-white/60 uppercase tracking-widest">
            Protect Your Tokens • Let the Wrong Ones Fall
          </p>
        </div>

        {/* Utility Buttons (Top Right) */}
        <div className="flex flex-col gap-4">
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

      {/* Main Content Area */}
      <main className="relative z-10 flex w-full flex-1 flex-col items-center justify-center px-4 -mt-10">
        {/* Question Box */}
        <div className="group relative w-full max-w-4xl">
          <div className="absolute -inset-1 bg-gradient-to-r from-accent/50 to-primary/50 blur opacity-25 group-hover:opacity-40 transition" />
          <div className="glass-card flex items-center gap-4 p-6 md:p-10">
            <button className="hidden md:flex h-12 w-12 items-center justify-center rounded-full border border-white/10 hover:bg-white/5 text-white/40">
              <IconChevronLeft />
            </button>
            <h2 className="flex-1 text-center font-display text-2xl md:text-3xl font-bold text-white leading-tight">
              {currentQuestion.question}
            </h2>
            <button className="hidden md:flex h-12 w-12 items-center justify-center rounded-full border border-white/10 hover:bg-white/5 text-white/40">
              <IconChevronRight />
            </button>
          </div>
          {/* Navigation Dots */}
          <div className="mt-4 flex justify-center gap-2">
            <div className="h-1 w-8 rounded-full bg-accent" />
            <div className="h-1 w-8 rounded-full bg-white/10" />
            <div className="h-1 w-8 rounded-full bg-white/10" />
          </div>
        </div>

        {/* Platforms Area */}
        <div className="mt-16 grid w-full max-w-6xl grid-cols-1 md:grid-cols-4 gap-8 md:gap-4 items-end">
          {currentQuestion.options.map((opt, i) => (
            <Platform
              key={opt.label}
              label={opt.label}
              text={opt.text}
              tokens={state.distribution[opt.label] || 0}
              isSelected={selectedPlate === opt.label}
              isFalling={state.revealResult?.incorrectLabels.includes(opt.label)}
              index={i}
              onClick={() => setSelectedPlate(selectedPlate === opt.label ? null : opt.label)}
            />
          ))}
        </div>
      </main>

      {/* Footer Controls */}
      <footer className="relative z-20 w-full flex flex-col items-center p-6 bg-gradient-to-t from-background to-transparent pt-20">
        {/* Token Tray (Appears when platform selected) */}
        <AnimatePresence>
          {selectedPlate && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              className="glass-card mb-6 flex flex-wrap items-center justify-center gap-3 p-4 border-accent/20"
            >
              <div className="mr-4 px-3 py-1 bg-white/5 rounded-lg">
                <span className="font-data text-xs text-white/60">AVAILABLE:</span>
                <span className="ml-2 font-data text-lg font-bold text-gold">{available.toLocaleString()}</span>
              </div>
              {PRESETS.map((pct) => {
                const amt = Math.floor(state.tokens * (pct / 100));
                const actualAmt = Math.min(amt, available);
                return (
                  <button
                    key={pct}
                    onClick={() => addTokens(selectedPlate, actualAmt)}
                    disabled={available <= 0}
                    className="rounded-xl bg-white/5 px-6 py-3 font-data text-sm font-bold text-white border border-white/10 transition-all hover:bg-accent/20 hover:border-accent/40 disabled:opacity-30"
                  >
                    +{pct}%
                  </button>
                );
              })}
              <button
                onClick={() => addTokens(selectedPlate, available)}
                disabled={available <= 0}
                className="rounded-xl bg-accent px-8 py-3 font-display text-sm font-black text-black transition-all hover:scale-105 disabled:opacity-30"
              >
                ALL IN
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex w-full max-w-4xl items-center justify-between px-10">
          <div className="text-left">
            <span className="font-data text-xs text-white/40 block">COLLECTED</span>
            <span className="font-data text-2xl font-black text-white">{totalDistributed.toLocaleString()}</span>
          </div>

          <motion.button
            whileHover={canLock ? { scale: 1.05 } : {}}
            whileTap={canLock ? { scale: 0.95 } : {}}
            onClick={() => {
              if (canLock) {
                dispatch({ type: "LOCK_ANSWERS" });
                setSelectedPlate(null);
              }
            }}
            disabled={!canLock}
            className={`
              relative group flex items-center gap-3 rounded-full px-12 py-5 font-display text-xl font-black tracking-widest transition-all
              ${canLock
                ? "bg-accent text-black shadow-[0_0_30px_rgba(34,211,238,0.4)]"
                : "bg-white/5 text-white/20 cursor-not-allowed"
              }
            `}
          >
            {canLock && (
              <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition" />
            )}
            LOCK
          </motion.button>

          <div className="text-right">
            <span className="font-data text-xs text-white/40 block">TIME LEFT</span>
            <span className="font-data text-2xl font-black text-red-500">00:30</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Simple internal SVG icons to keep it self-contained for now
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

function IconChevronLeft() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function IconChevronRight() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

