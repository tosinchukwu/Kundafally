import React, { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "@/context/GameContext";
import GameScene from "./three/GameScene";
import WalletButton from "./WalletButton";

const PRESETS = [10, 25, 50, 100];

export default function GameplayScreen() {
  const { state, dispatch, currentQuestion } = useGame();
  const [selectedPlate, setSelectedPlate] = useState<string | null>(null);
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

  if (!currentQuestion) return null;

  const addTokens = (label: string, amount: number) => {
    if (amount > available) amount = available;
    if (amount <= 0) return;
    dispatch({ type: "DISTRIBUTE_TOKENS", label, amount });
  };

  const canLock = totalDistributed > 0;

  const handlePlatformClick = useCallback((label: string) => {
    setSelectedPlate(prev => prev === label ? null : label);
  }, []);

  return (
    <div className="game-container flex flex-col items-center" style={{ overflow: "hidden" }}>

      {/* === FULL-SCREEN 3D CANVAS === */}
      <div className="absolute inset-0 z-0">
        <GameScene
          distribution={state.distribution}
          options={currentQuestion.options}
          revealedAnswer={null}
          trapdoorPlatforms={[]}
          onPlatformClick={handlePlatformClick}
          selectedPlatform={selectedPlate}
        />
      </div>

      {/* === HTML UI OVERLAY === */}

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
          <div className="relative h-6">
            <AnimatePresence>
              {showBonus && (
                <motion.span 
                  key={showBonus.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute left-4 font-data text-lg font-bold text-bonus"
                >
                  +{showBonus.amount} BONUS
                </motion.span>
              )}
              {totalDistributed > 0 && !showBonus && (
                <motion.span 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute left-4 font-data text-sm font-bold text-accent"
                >
                  -{totalDistributed} PLACED
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Branding (Center) */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="logo-frame">
              <h1 className="font-display text-4xl md:text-5xl font-black italic tracking-tighter text-white neon-text-glow">
                KUNDA
              </h1>
              <h1 className="font-display text-3xl md:text-4xl font-black italic tracking-tighter text-white/80 -mt-2">
                FALL
              </h1>
            </div>
          </div>
          <p className="mt-4 font-display text-sm font-bold text-white/60 uppercase tracking-widest text-center">
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

      {/* Question Box - pinned near top of the 3D scene */}
      <main className="relative z-10 flex w-full flex-col items-center px-4 mt-2">
        <div className="group relative w-full max-w-3xl">
          <div className="absolute -inset-1 bg-gradient-to-r from-accent/50 to-primary/50 blur opacity-25 group-hover:opacity-40 transition" />
          <div className="glass-card flex items-center gap-4 p-6 md:p-8">
            <h2 className="flex-1 text-center font-display text-xl md:text-2xl font-bold text-white leading-tight">
              {currentQuestion.question}
            </h2>
          </div>
          {/* Question counter dots */}
          <div className="mt-3 flex justify-center gap-2">
            <div className="h-1 w-8 rounded-full bg-accent" />
            <div className="h-1 w-8 rounded-full bg-white/10" />
            <div className="h-1 w-8 rounded-full bg-white/10" />
          </div>
        </div>
      </main>

      {/* Footer Controls */}
      <footer className="absolute bottom-0 left-0 right-0 z-20 flex flex-col items-center p-6 bg-gradient-to-t from-background/90 via-background/50 to-transparent pt-20">
        {/* Token Tray (Appears when platform selected) */}
        <AnimatePresence>
          {selectedPlate && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              className="glass-card mb-4 flex flex-wrap items-center justify-center gap-3 p-4 border-accent/20"
            >
              <div className="mr-4 px-3 py-1 bg-white/5 rounded-lg flex items-center gap-2">
                <span className="font-display text-lg font-black text-accent">{selectedPlate}</span>
                <span className="font-data text-xs text-white/50">|</span>
                <span className="font-data text-xs text-white/60">AVAILABLE:</span>
                <span className="ml-1 font-data text-lg font-bold text-gold">{available.toLocaleString()}</span>
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
            <span className="font-data text-xs text-white/40 block">QUESTION</span>
            <span className="font-data text-2xl font-black text-white">{state.questionsAnswered + 1}</span>
          </div>
        </div>
      </footer>
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
