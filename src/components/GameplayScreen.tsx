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
          <div className="glass-card flex items-center gap-3 px-4 py-2 border-white/5 bg-white/5 shadow-2xl">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-yellow-600 to-yellow-400 border border-yellow-300/50 shadow-[0_0_15px_rgba(234,179,8,0.3)]">
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
                   className="font-data text-sm font-bold text-bonus drop-shadow-[0_0_8px_rgba(34,197,94,0.4)]"
                >
                  +{showBonus.amount} BONUS
                </motion.span>
              ) : totalDistributed > 0 ? (
                <motion.span 
                  key="placed"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="font-data text-[10px] font-bold text-accent tracking-tighter"
                >
                  -{totalDistributed} PLACED
                </motion.span>
              ) : null}
            </AnimatePresence>
          </div>
        </div>

        {/* Logo/Branding */}
        <div className="flex flex-col items-center">
          <div className="logo-frame bg-gradient-to-br from-indigo-950/80 to-black/90 backdrop-blur-2xl border border-white/5 px-6 py-2 shadow-2xl">
            <h1 className="font-display text-3xl font-black italic tracking-tighter text-white neon-text-glow">KUNDA FALL</h1>
          </div>
          <p className="mt-2 font-display text-[8px] font-bold text-white/30 uppercase tracking-[0.6em]">
            Shield Your Stack
          </p>
        </div>

        {/* Empty space to balance layout */}
        <div className="w-40" />
      </header>

      {/* Main Gameplay HUD */}
      <main className="flex-1 flex w-full relative z-10 overflow-hidden">
        
        {/* Left/Center Space for 3D Scene */}
        <div className="flex-1 flex flex-col items-center pt-2 md:pt-6 pointer-events-none">
          {/* Question Display */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="w-full max-w-2xl px-4 mb-4"
          >
            <div className="glass-card relative overflow-hidden group border-white/5 bg-black/20 backdrop-blur-xl shadow-2xl p-6 md:p-8">
              <div className="absolute top-0 left-0 w-1 h-full bg-accent animate-pulse" />
              <h2 className="text-center font-display text-lg md:text-2xl font-bold text-white leading-relaxed tracking-tight underline-offset-4 decoration-accent/20">
                {currentQuestion.question}
              </h2>
            </div>
          </motion.div>

          {/* Token Tray / Percentage Dist - Moved UP for visibility */}
          <AnimatePresence>
            {selectedPlate && available > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="pointer-events-auto glass-card mb-4 flex items-center gap-2 p-2 border-accent/20 bg-accent/5 backdrop-blur-md"
              >
                <div className="px-3 py-1.5 bg-white/10 rounded-lg flex items-center gap-3">
                  <span className="font-display text-xs font-black text-accent uppercase tracking-widest">{selectedPlate}</span>
                  <span className="font-data text-xs font-bold text-gold">{available.toLocaleString()} AVAIL</span>
                </div>
                <div className="flex gap-1.5">
                  {PRESETS.map((pct) => (
                    <button
                      key={pct}
                      onClick={() => addTokens(selectedPlate, Math.min(Math.floor(state.tokens * (pct / 100)), available))}
                      className="rounded-lg bg-white/5 px-3 py-1.5 font-data text-[10px] font-bold text-white border border-white/5 hover:bg-accent/20 hover:border-accent/40 transition-all font-mono"
                    >
                      +{pct}%
                    </button>
                  ))}
                  <button
                    onClick={() => addTokens(selectedPlate, available)}
                    className="rounded-lg bg-accent px-4 py-1.5 font-display text-[10px] font-black text-black hover:scale-105 active:scale-95 transition-all"
                  >
                    MAX
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* RIGHT CONTROL PANEL */}
        <aside className="w-24 md:w-32 flex flex-col items-center justify-center p-4 gap-6 bg-black/10 backdrop-blur-sm border-l border-white/5 relative z-20">
          
          {/* Utility Icons */}
          <div className="flex flex-col gap-3 mb-auto">
            <button 
              onClick={() => setIsSoundOn(!isSoundOn)}
              className={`h-12 w-12 flex items-center justify-center glass-card border-white/10 transition-all ${isSoundOn ? "text-accent border-accent/30" : "text-white/20"}`}
            >
              <IconSound muted={!isSoundOn} />
            </button>
            <button 
              onClick={() => setShowSettings(true)}
              className="h-12 w-12 flex items-center justify-center glass-card border-white/10 hover:border-white/20 text-white/60 hover:text-white"
            >
              <IconSettings />
            </button>
          </div>

          {/* Option Selector (A, B, C, D) */}
          <div className="flex flex-col gap-3 py-8 border-y border-white/5">
            {currentQuestion.options.map((opt) => {
              const isSelected = state.selectedPlatform === opt.label;
              const hasTokens = (state.distribution[opt.label] || 0) > 0;
              return (
                <button
                  key={opt.label}
                  onClick={() => dispatch({ type: "SELECT_PLATFORM", label: isSelected ? null : opt.label })}
                  className={`
                    relative h-14 w-14 flex flex-col items-center justify-center rounded-xl border transition-all duration-300
                    ${isSelected 
                      ? "bg-accent text-black border-accent shadow-[0_0_20px_rgba(34,211,238,0.4)] scale-110 z-10" 
                      : "bg-white/5 border-white/10 hover:bg-white/10 text-white"
                    }
                  `}
                >
                  <span className="font-display text-xl font-black">{opt.label}</span>
                  {hasTokens && (
                    <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-gold border-2 border-black flex items-center justify-center">
                      <div className="h-1.5 w-1.5 rounded-full bg-black" />
                    </div>
                  )}
                  {/* Option Tooltip (Text) - Shows on right panel hover for desktop */}
                  <div className="absolute right-16 hidden md:group-hover:block transition-opacity pointer-events-none">
                    <div className="glass-card px-4 py-2 whitespace-nowrap bg-black text-xs font-bold border-white/10">
                      {opt.text}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* FALL (Confirm) Button */}
          <div className="mt-auto group">
             <button
              onClick={() => canLock && dispatch({ type: "LOCK_ANSWERS" })}
              disabled={!canLock}
              className={`
                relative h-16 w-16 md:h-20 md:w-20 rounded-2xl flex flex-col items-center justify-center transition-all duration-500
                ${canLock 
                  ? "bg-red-500 shadow-[0_0_30px_rgba(239,68,68,0.6)] cursor-pointer hover:scale-105 active:scale-95" 
                  : "bg-white/5 grayscale opacity-30 cursor-not-allowed border border-white/10"
                }
              `}
            >
              <div className="absolute -top-6 text-[10px] font-black text-white/40 tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                CONFIRM
              </div>
              <IconFall active={canLock} />
              <span className={`mt-1 font-display text-[10px] font-black ${canLock ? "text-white" : "text-white/20"}`}>
                FALL
              </span>
            </button>
          </div>
        </aside>
      </main>

      {/* Dynamic Status Bar (Footer) */}
      <footer className="w-full relative z-10 px-6 py-4 flex items-center justify-between border-t border-white/5 bg-black/10">
         <div className="flex items-center gap-6">
            <div className="flex flex-col">
              <span className="font-data text-[8px] text-white/30 uppercase tracking-widest mb-1">Total Placed</span>
              <span className="font-data text-lg font-black text-accent">{totalDistributed.toLocaleString()}</span>
            </div>
            <div className="h-8 w-px bg-white/5" />
            <div className="flex flex-col">
              <span className="font-data text-[8px] text-white/30 uppercase tracking-widest mb-1">Quest No.</span>
              <span className="font-data text-lg font-black text-white">{state.questionsAnswered + 1}</span>
            </div>
         </div>
         
         {/* Instruction / Tip */}
         <div className="hidden lg:block">
            <p className="font-display text-[10px] font-bold text-white/20 italic">
              "Divide your tokens carefully. Undistributed funds will be lost in the fall."
            </p>
         </div>
         
         <div className="flex items-center gap-3">
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
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
