import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "@/context/GameContext";

const PRESETS = [10, 25, 50, 100];

export default function GameplayScreen() {
  const { state, dispatch, currentQuestion, currentToken } = useGame();
  const [timeLeft, setTimeLeft] = useState(60);
  const [timerActive, setTimerActive] = useState(true);
  
  // Betting Input Local State
  const [inputValue, setInputValue] = useState<string>("0");

  const selectedPlateLabel = state.selectedPlatform;

  // Sync local input with global state when selection changes
  useEffect(() => {
    if (selectedPlateLabel) {
      const val = state.distribution[selectedPlateLabel] || 0;
      setInputValue(val.toString());
    }
  }, [selectedPlateLabel, state.distribution]);

  const handleBetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === "" || /^\d+$/.test(val)) {
      setInputValue(val);
      
      // If it's a valid multiple of 50, update global state immediately so LOCK can enable
      const num = parseInt(val) || 0;
      if (num >= 50 && num % 50 === 0 && selectedPlateLabel) {
        const totalOtherDist = Object.entries(state.distribution)
          .filter(([label]) => label !== selectedPlateLabel)
          .reduce((a, [_, b]) => a + b, 0);
        
        if (num <= state.tokens - totalOtherDist) {
          dispatch({ type: "SET_DISTRIBUTION", label: selectedPlateLabel, amount: num });
        }
      }
    }
  };

  const handleBetBlur = () => {
    if (!selectedPlateLabel) return;
    const rawVal = parseInt(inputValue) || 0;
    
    // Snap to nearest 50
    const snappedVal = Math.round(rawVal / 50) * 50;
    
    const totalDist = Object.values(state.distribution).reduce((a: number, b: number) => a + b, 0);
    const currentOtherDist = totalDist - (state.distribution[selectedPlateLabel] || 0);
    const maxPossible = Math.min(1000, state.tokens - currentOtherDist);
    
    const finalVal = Math.max(0, Math.min(snappedVal, Math.floor(maxPossible / 50) * 50));
    
    dispatch({ type: "SET_DISTRIBUTION", label: selectedPlateLabel, amount: finalVal });
    setInputValue(finalVal.toString());
  };

  const updateBet = (label: string, delta: number) => {
    const currentAmount = state.distribution[label] || 0;
    const totalDist = Object.values(state.distribution).reduce((a: number, b: number) => a + b, 0);
    let newAmount = currentAmount + delta;
    
    const currentOtherDist = totalDist - (state.distribution[label] || 0);
    const maxPossible = Math.min(1000, state.tokens - currentOtherDist);
    
    newAmount = Math.max(0, Math.min(newAmount, maxPossible));
    // Snap delta updates to 50 if they aren't already
    newAmount = Math.round(newAmount / 50) * 50;
    
    dispatch({ type: "SET_DISTRIBUTION", label, amount: newAmount });
  };

  // Timer logic
  useEffect(() => {
    let interval: any;
    if (timerActive && state.phase === "playing" && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && state.phase === "playing") {
      dispatch({ type: "LOCK_ANSWERS" });
    }
    return () => clearInterval(interval);
  }, [timeLeft, timerActive, state.phase, dispatch]);

  useEffect(() => {
    if (state.phase === "playing") {
      setTimeLeft(60);
      setTimerActive(true);
    } else {
      setTimerActive(false);
    }
  }, [state.currentQuestionIndex, state.phase]);

  const totalDistributed = useMemo(
    () => Object.values(state.distribution).reduce((a: number, b: number) => a + b, 0),
    [state.distribution]
  );
  
  const available = state.tokens - totalDistributed;

  if (!currentQuestion) return null;

  const isInputValid = useMemo(() => {
    const num = parseInt(inputValue) || 0;
    return num >= 50 && num <= 1000 && num % 50 === 0;
  }, [inputValue]);

  const canLock = totalDistributed >= 50 && Object.values(state.distribution).every(val => val === 0 || (val >= 50 && val <= 1000 && val % 50 === 0));

  return (
    <div className="game-container relative flex flex-col items-center min-h-screen w-full bg-transparent overflow-hidden">
      <header className="relative z-10 w-full p-4 md:p-8 flex justify-center">
        <div className="flex flex-col items-center">
          <div className="logo-frame bg-black/40 backdrop-blur-xl border border-white/5 px-6 py-2 shadow-2xl">
            <h1 className="font-display text-3xl font-black italic tracking-tighter text-white">KUNDA FALL</h1>
          </div>
          <p className="mt-2 font-display text-[8px] font-bold text-white/30 uppercase tracking-[0.4em]">
            Shield Your Stack
          </p>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center w-full max-w-4xl relative z-10 px-4 mt-2 pointer-events-auto">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="w-full mb-6 text-center">
          <div className="glass-card border-white/5 bg-black/40 backdrop-blur-2xl p-6 md:p-10 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-accent rounded-full z-10">
              <span className="text-[10px] font-black text-black">Question {state.questionsAnswered + 1} of 6</span>
            </div>
            <h2 className="font-display text-lg md:text-3xl font-bold text-white mb-4">
              {currentQuestion.question}
            </h2>
            <div className="flex flex-col items-center">
              <div className={`h-16 w-16 rounded-full border-4 flex items-center justify-center ${timeLeft <= 5 ? "border-red-500 text-red-500 animate-pulse" : "border-accent text-accent"}`}>
                <span className="font-data text-2xl font-black">{timeLeft}</span>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="w-full grid grid-cols-2 gap-x-8 mt-8">
          {currentQuestion.options.map((opt) => {
            const isSelected = selectedPlateLabel === opt.label;
            const hasTokens = (state.distribution[opt.label] || 0) > 0;
            const isPlatformValid = (state.distribution[opt.label] || 0) % 50 === 0;

            return (
              <button
                key={opt.label}
                onClick={() => dispatch({ type: "SELECT_PLATFORM", label: isSelected ? null : opt.label })}
                className={`relative flex items-center gap-4 p-4 rounded-xl border transition-all mb-4 ${isSelected ? "bg-accent/10 border-accent" : "bg-white/5 border-white/10"}`}
              >
                <div className={`h-12 w-12 flex items-center justify-center rounded-lg font-display text-2xl font-black ${isSelected ? "bg-accent text-black" : "bg-white/5 text-white/20"}`}>
                  {opt.label}
                </div>
                <div className="text-left flex-1 min-w-0">
                  <span className="font-display font-medium text-white/90 truncate block">{opt.text}</span>
                </div>
                {hasTokens && (
                  <div className={`ml-auto px-2 py-1 rounded text-[10px] font-mono font-bold ${isPlatformValid ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400 animate-pulse"}`}>
                    ${state.distribution[opt.label]}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <AnimatePresence>
          {selectedPlateLabel && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="mt-8 flex flex-col items-center gap-6 p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl w-full max-w-lg shadow-2xl">
              <div className="flex flex-col items-center gap-1">
                <span className="font-display text-[10px] font-black text-accent uppercase tracking-widest">BET ON OPTION {selectedPlateLabel}</span>
                <div className="flex flex-col items-center gap-1">
                  <div className="flex items-center gap-1">
                    <span className="font-data text-4xl font-black text-white">$</span>
                    <input
                      type="text"
                      value={inputValue}
                      onChange={handleBetChange}
                      onBlur={handleBetBlur}
                      className={`w-40 bg-transparent border-b-2 text-4xl font-black text-center outline-none transition-colors ${isInputValid || inputValue === "0" ? "border-accent/30 focus:border-accent text-white" : "border-red-500 text-red-500"}`}
                    />
                  </div>
                  {!isInputValid && inputValue !== "0" && (
                    <span className="text-[8px] font-black text-red-500 uppercase tracking-widest animate-pulse">Range: $50 - $1000 ($50 steps)</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-8">
                <button
                  onClick={() => updateBet(selectedPlateLabel, -50)}
                  disabled={(state.distribution[selectedPlateLabel] || 0) <= 0}
                  className="w-16 h-16 rounded-2xl bg-white/5 text-4xl text-white border border-white/10 hover:bg-red-500/30 transition-all active:scale-95"
                >
                  -
                </button>
                
                <button
                  onClick={() => canLock && dispatch({ type: "LOCK_ANSWERS" })}
                  disabled={!canLock}
                  className={`px-10 py-5 rounded-2xl font-display text-xl font-black transition-all ${canLock ? "bg-red-600 text-white shadow-xl hover:scale-105 active:scale-95" : "bg-white/5 text-white/5 cursor-not-allowed"}`}
                >
                  LOCK SESSION
                </button>

                <button
                  onClick={() => updateBet(selectedPlateLabel, 50)}
                  disabled={available < 50}
                  className="w-16 h-16 rounded-2xl bg-white/5 text-4xl text-white border border-white/10 hover:bg-accent/30 transition-all active:scale-95"
                >
                  +
                </button>
              </div>
              <div className="opacity-30 text-[8px] uppercase font-black tracking-[0.3em] leading-none text-center">
                Min Bet $50 — Snaps to $50 on exit
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <footer className="mt-auto h-20" />
    </div>
  );
}
