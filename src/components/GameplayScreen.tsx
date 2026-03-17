import React, { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "@/context/GameContext";
import WalletButton from "./WalletButton";

const PRESETS = [10, 25, 50, 100];

export default function GameplayScreen() {
  const { state, dispatch, currentQuestion } = useGame();
  const [prevTokens, setPrevTokens] = useState(state.tokens);
  const [showBonus, setShowBonus] = useState<{ amount: number; id: number } | null>(null);

  const [isSoundOn, setIsSoundOn] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

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
        <h1 className="text-4xl font-black text-white mb-4 italic text-glow">KUNDA FALL</h1>
        <div className="glass-card p-8 border-red-500/50">
          <p className="text-red-400 font-display mb-4 uppercase tracking-widest text-xs font-black">Critical Error</p>
          <p className="text-white font-display text-lg mb-6">No question data found.</p>
          <button 
            onClick={() => dispatch({ type: "RESET" })}
            className="rounded-full bg-accent px-8 py-3 font-display font-black text-black hover:scale-105 transition-transform"
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
    <div className="game-container relative flex flex-col items-center min-h-screen w-full bg-transparent overflow-hidden">
      
      {/* Settings Overlay */}
      <AnimatePresence>
        {showSettings && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-6"
          >
            <div className="glass-card w-full max-w-md p-8 relative border-white/10">
              <button 
                onClick={() => setShowSettings(false)}
                className="absolute top-4 right-4 text-white/40 hover:text-white"
              >
                ✕
              </button>
              <h3 className="font-display text-2xl font-black text-white mb-6 italic">SETTINGS</h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-white/60 font-display font-bold">SOUND EFFECTS</span>
                  <button 
                    onClick={() => setIsSoundOn(!isSoundOn)}
                    className={`h-6 w-12 rounded-full transition-colors relative ${isSoundOn ? "bg-accent" : "bg-white/10"}`}
                  >
                    <div className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all ${isSoundOn ? "right-1" : "left-1"}`} />
                  </button>
                </div>
                <div className="pt-6 border-t border-white/5 text-center">
                  <button 
                    onClick={() => dispatch({ type: "RESET" })}
                    className="text-red-400 hover:text-red-300 font-display text-xs font-black tracking-widest uppercase"
                  >
                    Quit Game Session
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Area */}
      <header className="relative z-10 flex w-full items-start justify-between p-4 md:p-8 pointer-events-none">
        {/* Token Balance */}
        <div className="pointer-events-auto flex flex-col items-start gap-1">
          <div className="glass-card flex items-center gap-3 px-4 py-2 border-white/5 bg-white/5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-yellow-600 to-yellow-400 border border-yellow-300/50">
              <span className="text-sm font-bold text-white">₿</span>
            </div>
            <span className="font-data text-2xl font-black text-white">{state.tokens.toLocaleString()}</span>
          </div>
          <div className="h-6 ml-2">
            <AnimatePresence mode="wait">
              {showBonus ? (
                <motion.span 
                   key={`bonus-${showBonus.id}`}
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: -10 }}
                   className="font-data text-sm font-bold text-bonus"
                >
                  +{showBonus.amount} BONUS
                </motion.span>
              ) : totalDistributed > 0 ? (
                <motion.span 
                  key="placed"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="font-data text-[10px] font-bold text-accent"
                >
                  -{totalDistributed} PLACED
                </motion.span>
              ) : null}
            </AnimatePresence>
          </div>
        </div>

        {/* Branding */}
        <div className="flex flex-col items-center">
          <div className="logo-frame bg-black/40 backdrop-blur-xl border border-white/5 px-6 py-2 shadow-2xl">
            <h1 className="font-display text-3xl font-black italic tracking-tighter text-white">KUNDA FALL</h1>
          </div>
          <p className="mt-2 font-display text-[8px] font-bold text-white/30 uppercase tracking-[0.4em]">
            Shield Your Stack
          </p>
        </div>

        {/* Utility Icons (Top Right) */}
        <div className="pointer-events-auto flex gap-2">
          <button 
            onClick={() => setIsSoundOn(!isSoundOn)}
            className={`h-10 w-10 flex items-center justify-center glass-card border-white/10 transition-all ${isSoundOn ? "text-accent" : "text-white/20"}`}
          >
            <IconSound muted={!isSoundOn} />
          </button>
          <button 
            onClick={() => setShowSettings(true)}
            className="h-10 w-10 flex items-center justify-center glass-card border-white/10 text-white/60"
          >
            <IconSettings />
          </button>
        </div>
      </header>

      {/* Main Content Area (Centralized) */}
      <main className="flex-1 flex flex-col items-center w-full max-w-4xl relative z-10 px-4 mt-2 pointer-events-auto">
        
        {/* Question Display */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="w-full mb-6"
        >
          <div className="glass-card border-white/5 bg-black/40 backdrop-blur-2xl shadow-2xl p-6 md:p-10">
            <h2 className="text-center font-display text-lg md:text-3xl font-bold text-white leading-relaxed tracking-tight group-hover:text-glow transition-all">
              {currentQuestion.question}
            </h2>
          </div>
        </motion.div>

        {/* Options Grid (Centered 2x2) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          {currentQuestion.options.map((opt) => {
            const isSelected = state.selectedPlatform === opt.label;
            const hasTokens = (state.distribution[opt.label] || 0) > 0;
            return (
              <button
                key={opt.label}
                onClick={() => dispatch({ type: "SELECT_PLATFORM", label: isSelected ? null : opt.label })}
                className={`
                  relative flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 group
                  ${isSelected 
                    ? "bg-accent/10 border-accent shadow-[0_0_20px_rgba(34,211,238,0.2)]" 
                    : "bg-white/5 border-white/10 hover:bg-white/10"
                  }
                `}
              >
                <div className={`
                   flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg font-display text-2xl font-black
                   ${isSelected ? "bg-accent text-black shadow-lg" : "bg-white/5 text-white/20"}
                `}>
                  {opt.label}
                </div>
                <div className="text-left">
                  <span className={`block text-[10px] font-black tracking-widest uppercase mb-0.5 ${isSelected ? "text-accent" : "text-white/20"}`}>
                    Option {opt.label}
                  </span>
                  <span className="font-display font-medium text-white/90 leading-snug">
                    {opt.text}
                  </span>
                </div>
                {hasTokens && (
                  <div className="ml-auto bg-gold/20 border border-gold/40 px-2 py-1 rounded text-[10px] font-mono font-bold text-gold">
                    {state.distribution[opt.label].toLocaleString()}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </main>

      {/* Footer Area - Bottom-Center Controls */}
      <footer className="relative z-20 w-full flex flex-col items-center p-6 gap-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
        
        {/* Token Distribution Tray */}
        <AnimatePresence>
          {selectedPlate && available > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="flex items-center gap-2 p-2 glass-card bg-black/60 backdrop-blur-xl border-white/10 shadow-2xl"
            >
              <div className="px-3 py-2 bg-accent/20 rounded-lg flex flex-col items-center min-w-[80px]">
                <span className="font-display text-[10px] font-black text-accent uppercase tracking-tighter">PLATFORM {selectedPlate}</span>
                <span className="font-data text-xs font-bold text-white">{available.toLocaleString()}</span>
              </div>
              <div className="flex gap-1.5">
                {PRESETS.map((pct) => (
                  <button
                    key={pct}
                    onClick={() => addTokens(selectedPlate, Math.min(Math.floor(state.tokens * (pct / 100)), available))}
                    className="rounded-lg bg-white/5 px-4 py-2 font-data text-xs font-bold text-white border border-white/5 hover:bg-white/20 hover:border-accent/40 transition-all"
                  >
                    {pct}%
                  </button>
                ))}
                <button
                  onClick={() => addTokens(selectedPlate, available)}
                  className="rounded-lg bg-accent px-6 py-2 font-display text-xs font-black text-black hover:scale-105 active:scale-95 transition-all shadow-lg"
                >
                  MAX
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* LOCK SESSION Button */}
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={() => canLock && dispatch({ type: "LOCK_ANSWERS" })}
            disabled={!canLock}
            className={`
              relative group flex items-center justify-center rounded-2xl px-16 py-5 font-display text-2xl font-black tracking-[0.2em] transition-all duration-500
              ${canLock 
                ? "bg-red-600 text-white shadow-[0_0_50px_rgba(220,38,38,0.4)] hover:scale-105 active:scale-95 cursor-pointer" 
                : "bg-white/5 text-white/10 border border-white/5 opacity-40 cursor-not-allowed"
              }
            `}
          >
            <span className="relative z-10">LOCK SESSION</span>
            {canLock && (
              <motion.div 
                animate={{ opacity: [0, 0.4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute inset-0 rounded-2xl bg-white" 
              />
            )}
            <div className="absolute -inset-1 bg-red-600/20 blur-xl group-hover:bg-red-600/30 transition-all duration-300" />
          </button>
          
          <p className="font-display text-[9px] font-bold text-white/20 uppercase tracking-[0.4em] text-glow italic">
             "Protect your stack. Divide wisely or lose it all."
          </p>
        </div>

        {/* Status Mini-Bar */}
        <div className="w-full max-w-4xl flex items-center justify-between mt-2 px-4 opacity-50">
           <div className="flex items-center gap-6">
              <div className="flex flex-col">
                <span className="font-data text-[7px] uppercase tracking-[0.2em]">Distributed</span>
                <span className="font-data text-sm font-bold text-accent">{totalDistributed.toLocaleString()} ₿</span>
              </div>
              <div className="w-px h-6 bg-white/10" />
              <div className="flex flex-col">
                <span className="font-data text-[7px] uppercase tracking-[0.2em]">Objective</span>
                <span className="font-data text-sm font-bold text-white">Q{state.questionsAnswered + 1}</span>
              </div>
           </div>
           <WalletButton />
        </div>
      </footer>
    </div>
  );
}

function IconSound({ muted }: { muted: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      {muted ? (
        <>
          <path d="M11 5L6 9H2v6h4l5 4V5z" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </>
      ) : (
        <>
          <path d="M11 5L6 9H2v6h4l5 4V5z" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        </>
      )}
    </svg>
  );
}

function IconSettings() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

function IconFall({ active }: { active: boolean }) {
  return (
    <svg 
      width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" 
      className={active ? "animate-bounce" : ""}
    >
      <path d="M12 5v14M5 12l7 7 7-7" />
    </svg>
  );
}
