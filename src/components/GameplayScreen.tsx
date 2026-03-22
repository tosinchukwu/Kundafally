import React, { useState, useMemo, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "@/context/GameContext";
import WalletButton from "./WalletButton";

const PRESETS = [10, 25, 50, 100];

export default function GameplayScreen() {
  const { state, dispatch, currentQuestion, currentToken } = useGame();
  const [timeLeft, setTimeLeft] = useState(15);
  const [timerActive, setTimerActive] = useState(true);

  // Timer logic
  useEffect(() => {
    let interval: any;
    if (timerActive && state.phase === "playing" && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && state.phase === "playing") {
      const totalDist = Object.values(state.distribution).reduce((a, b: any) => a + b, 0);
      if (totalDist >= 50) {
        dispatch({ type: "LOCK_ANSWERS" });
      } else {
        dispatch({ type: "LOCK_ANSWERS" }); // Reveal even if not enough bet
      }
    }
    return () => clearInterval(interval);
  }, [timeLeft, timerActive, state.phase, state.distribution, dispatch]);

  // Reset timer on new question
  useEffect(() => {
    if (state.phase === "playing") {
      setTimeLeft(15);
      setTimerActive(true);
    } else {
      setTimerActive(false);
    }
  }, [state.currentQuestionIndex, state.phase]);

  const totalDistributed = useMemo(
    () => Object.values(state.distribution).reduce((a: number, b: number) => a + b, 0),
    [state.distribution]
  );
  
  // Real-time Balance: Total - Distributed
  const displayedBalance = state.tokens - totalDistributed;
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

  const updateBet = (label: string, delta: number) => {
    const currentAmount = state.distribution[label] || 0;
    const newAmount = currentAmount + delta;
    dispatch({ type: "SET_DISTRIBUTION", label, amount: newAmount });
  };

  const canLock = totalDistributed > 0;
  const selectedPlate = state.selectedPlatform;

  return (
    <div className="game-container relative flex flex-col items-center min-h-screen w-full bg-transparent overflow-hidden">


      {/* Header Area */}
      <header className="relative z-10 flex w-full items-start justify-between p-4 md:p-8 pointer-events-none">
        {/* Token Balance */}
        <div className="pointer-events-auto flex flex-col items-start gap-1">
          <div className="glass-card flex items-center gap-3 px-4 py-2 border-white/5 bg-white/5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-accent/60 to-accent border border-accent/50">
              <span className="text-[10px] font-black text-white leading-none tracking-tighter">{currentToken}</span>
            </div>
            <span className="font-data text-2xl font-black text-white">${displayedBalance.toLocaleString()}</span>
          </div>
          <div className="h-6 ml-2">
            <AnimatePresence mode="wait">
              {totalDistributed > 0 ? (
                <motion.span
                  key="placed"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="font-data text-[10px] font-bold text-accent"
                >
                  -${totalDistributed} PLACED
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
        <div className="pointer-events-auto flex items-center gap-4">
          <WalletButton />
          {/* Sound and Settings removed for now */}
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
            <div className="flex flex-col items-center mt-4">
              <div className={`
                flex items-center justify-center h-16 w-16 rounded-full border-4 transition-all duration-300
                ${timeLeft <= 5 ? "border-red-500 text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.4)]" : "border-accent text-accent shadow-[0_0_15px_rgba(34,211,238,0.2)]"}
              `}>
                <span className="font-data text-2xl font-black">{timeLeft}s</span>
              </div>
              <span className="mt-1 font-display text-[8px] font-bold text-white/30 uppercase tracking-[0.3em]">Seconds Remaining</span>
            </div>
          </div>
        </motion.div>

        <div className="w-full grid grid-cols-2 gap-x-8 md:gap-x-24 relative z-20 mt-8">
          {/* Option Buttons */}
          {currentQuestion.options.map((opt) => {
            const isSelected = state.selectedPlatform === opt.label;
            const hasTokens = (state.distribution[opt.label] || 0) > 0;
            return (
              <button
                key={opt.label}
                onClick={() => dispatch({ type: "SELECT_PLATFORM", label: isSelected ? null : opt.label })}
                className={`
                  relative flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 group mb-4
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
                <div className="text-left flex-1 min-w-0">
                  <span className={`block text-[10px] font-black tracking-widest uppercase mb-0.5 ${isSelected ? "text-accent" : "text-white/20"}`}>
                    Option {opt.label}
                  </span>
                  <span className="font-display font-medium text-white/90 leading-snug truncate block">
                    {opt.text}
                  </span>
                </div>
                {hasTokens && (
                  <div className="ml-auto bg-green-500/20 border border-green-500/40 px-2 py-1 rounded text-[10px] font-mono font-bold text-green-400">
                    ${state.distribution[opt.label].toLocaleString()}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Center-Aligned Betting Controls (New Layout) */}
        <AnimatePresence>
          {selectedPlate && state.phase === "playing" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mt-8 flex flex-col items-center gap-6 p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl w-full max-w-lg shadow-2xl"
            >
              <div className="flex flex-col items-center gap-1">
                <span className="font-display text-[10px] font-black text-accent uppercase tracking-[0.3em]">MANAGING OPTION {selectedPlate}</span>
                <span className="font-data text-5xl font-black text-white text-glow">${(state.distribution[selectedPlate] || 0).toLocaleString()}</span>
              </div>

              <div className="flex items-center gap-8">
                <button
                  onClick={(e) => { e.stopPropagation(); updateBet(selectedPlate, -50); }}
                  disabled={(state.distribution[selectedPlate] || 0) <= 0}
                  className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-4xl font-black text-white border border-white/10 hover:bg-red-500/30 hover:border-red-500 transition-all active:scale-90 disabled:opacity-10"
                >
                  -
                </button>
                
                <button
                  onClick={() => canLock && dispatch({ type: "LOCK_ANSWERS" })}
                  disabled={!canLock}
                  className={`
                    px-10 py-5 rounded-2xl font-display text-xl font-black tracking-widest transition-all
                    ${canLock 
                      ? "bg-red-600 text-white shadow-[0_0_40px_rgba(220,38,38,0.5)] hover:scale-105 active:scale-95" 
                      : "bg-white/5 text-white/10 cursor-not-allowed"
                    }
                  `}
                >
                  LOCK SESSION
                </button>

                <button
                  onClick={(e) => { e.stopPropagation(); updateBet(selectedPlate, 50); }}
                  disabled={available < 50}
                  className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-4xl font-black text-white border border-white/10 hover:bg-accent/30 hover:border-accent transition-all active:scale-90 disabled:opacity-10"
                >
                  +
                </button>
              </div>

              <div className="flex flex-col items-center opacity-30">
                <span className="font-display text-[8px] font-bold uppercase tracking-[0.4em]">Current Status</span>
                <span className="font-data text-xs font-black italic">${totalDistributed.toLocaleString()} of ${state.tokens.toLocaleString()} Distributed</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>


      <footer className="mt-auto h-20" />
    </div>
  );
}
