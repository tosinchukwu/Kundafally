import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "@/context/GameContext";

const PRESETS = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];

export default function GameplayScreen() {
  const { state, dispatch, currentQuestion, currentToken } = useGame();
  const [timeLeft, setTimeLeft] = useState(45);
  const [timerActive, setTimerActive] = useState(true);
  
  // Betting Input Local State
  const [inputValue, setInputValue] = useState<string>("0");
  const [displayedQuestion, setDisplayedQuestion] = useState("");

  const selectedPlateLabel = state.selectedPlatform;

  // Typewriter effect
  useEffect(() => {
    if (!currentQuestion) return;
    setDisplayedQuestion("");
    let i = 0;
    const text = currentQuestion.question;
    const intervalId = setInterval(() => {
      setDisplayedQuestion(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(intervalId);
    }, 20);
    return () => clearInterval(intervalId);
  }, [currentQuestion?.question]);

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
      
      // If it's a valid multiple of 100, update global state immediately so LOCK can enable
      const num = parseInt(val) || 0;
      if (num >= 100 && num % 100 === 0 && selectedPlateLabel) {
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
    
    // Snap to nearest 100
    const snappedVal = Math.round(rawVal / 100) * 100;
    
    const totalDist = Object.values(state.distribution).reduce((a: number, b: number) => a + b, 0);
    const currentOtherDist = totalDist - (state.distribution[selectedPlateLabel] || 0);
    const maxPossible = Math.min(1000, state.tokens - currentOtherDist);
    
    const finalVal = Math.max(0, Math.min(snappedVal, Math.floor(maxPossible / 100) * 100));
    
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
    // Snap delta updates to 100 if they aren't already
    newAmount = Math.round(newAmount / 100) * 100;
    
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
      setTimeLeft(45);
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
    return num >= 100 && num <= 1000 && num % 100 === 0;
  }, [inputValue]);

  const canLock = useMemo(() => {
    // 1. Current typing must be valid (or 0)
    if (inputValue !== "0" && !isInputValid) return false;
    
    // 2. All other platforms in state must be valid
    const othersValid = Object.entries(state.distribution).every(([label, val]) => {
      if (label === selectedPlateLabel) return true; // Handled by isInputValid
      return val === 0 || (val >= 100 && val <= 1000 && val % 100 === 0);
    });
    if (!othersValid) return false;

    // 3. MUST use current balance (100% distribution required)
    const currentNum = parseInt(inputValue) || 0;
    const totalOtherDist = Object.entries(state.distribution)
      .filter(([label]) => label !== selectedPlateLabel)
      .reduce((a, [_, b]) => a + b, 0);
    
    return (currentNum + totalOtherDist) === state.tokens;
  }, [inputValue, isInputValid, state.distribution, selectedPlateLabel, state.tokens]);

  return (
    <div className="game-container relative flex flex-col items-center min-h-screen w-full bg-transparent overflow-hidden">
      <header className="relative z-10 w-full p-4 md:p-8 flex justify-center">
        <div className="flex flex-col items-center">
          <div className="logo-frame bg-black/40 backdrop-blur-xl border border-white/5 px-4 py-1.5 md:px-6 md:py-2 shadow-2xl">
            <h1 className="font-display text-2xl md:text-3xl font-black italic tracking-tighter text-white">KUNDA FALL</h1>
          </div>
          <p className="mt-1 md:mt-2 font-display text-[7px] md:text-[8px] font-bold text-white/30 uppercase tracking-[0.4em]">
            Shield Your Stack
          </p>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center w-full max-w-4xl relative z-10 px-4 mt-2 pointer-events-auto">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="w-full mb-4 md:mb-6 text-center">
          <div className="glass-card border-white/5 bg-black/40 backdrop-blur-2xl p-4 md:p-10 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-accent rounded-full z-10">
              <span className="text-[9px] md:text-[10px] font-black text-black">Question {state.questionsAnswered + 1} of 6</span>
            </div>
            <h2 className="font-display text-base md:text-3xl font-bold text-white mb-3 md:mb-4 min-h-[3em]">
              {displayedQuestion}
            </h2>
            <div className="flex flex-col items-center">
              <div className={`h-12 w-12 md:h-16 md:w-16 rounded-full border-4 flex items-center justify-center ${timeLeft <= 5 ? "border-red-500 text-red-500 animate-pulse" : "border-accent text-accent"}`}>
                <span className="font-data text-xl md:text-2xl font-black">{timeLeft}</span>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1 md:gap-y-0 mt-4 md:mt-8">
          {currentQuestion.options.map((opt) => {
            const isSelected = selectedPlateLabel === opt.label;
            const remains = state.distribution[opt.label] || 0;
            const isPlatformValid = remains > 0 && remains % 100 === 0;

            return (
              <button
                key={opt.label}
                onClick={() => dispatch({ type: "SELECT_PLATFORM", label: isSelected ? null : opt.label })}
                className={`relative flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl border transition-all mb-3 md:mb-4 ${isSelected ? "bg-accent/10 border-accent" : "bg-white/5 border-white/10"}`}
              >
                <div className={`h-10 w-10 md:h-12 md:w-12 flex items-center justify-center rounded-lg font-display text-xl md:text-2xl font-black ${isSelected ? "bg-accent text-black" : "bg-white/5 text-white/20"}`}>
                  {opt.label}
                </div>
                <div className="text-left flex-1 min-w-0">
                  <span className="font-display font-medium text-white/90 truncate block">{opt.text}</span>
                </div>
                {remains > 0 && (
                  <div className={`ml-auto px-2 py-1 rounded text-[10px] font-mono font-bold ${isPlatformValid ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400 animate-pulse"}`}>
                    ${remains}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <AnimatePresence>
          {selectedPlateLabel && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="mt-4 md:mt-8 flex flex-col items-center gap-4 md:gap-6 p-4 md:p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl w-full max-w-lg shadow-2xl">
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
                    <span className="text-[8px] font-black text-red-500 uppercase tracking-widest animate-pulse">Range: $100 - $1000 ($100 steps)</span>
                  )}
                </div>
                
                {/* Preset Buttons */}
                <div className="flex flex-wrap justify-center gap-2 mt-2 max-w-sm">
                  {PRESETS.map((p) => {
                    const totalDist = Object.values(state.distribution).reduce((a: number, b: number) => a + b, 0);
                    const currentOtherDist = totalDist - (state.distribution[selectedPlateLabel] || 0);
                    const maxPossible = Math.min(1000, state.tokens - currentOtherDist);
                    const isPossible = p <= maxPossible;

                    return (
                      <button
                        key={p}
                        onClick={() => isPossible && dispatch({ type: "SET_DISTRIBUTION", label: selectedPlateLabel, amount: p })}
                        disabled={!isPossible}
                        className={`px-2 py-1 rounded-md font-data text-[9px] font-black border transition-all ${isPossible ? "bg-white/5 border-white/10 text-white/40 hover:bg-accent/20 hover:text-accent hover:border-accent" : "bg-white/5 border-white/5 text-white/5 cursor-not-allowed"}`}
                      >
                        ${p}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center gap-4 md:gap-8">
                <button
                  onClick={() => updateBet(selectedPlateLabel, -100)}
                  disabled={(state.distribution[selectedPlateLabel] || 0) <= 0}
                  className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-white/5 text-2xl md:text-4xl text-white border border-white/10 hover:bg-red-500/30 transition-all active:scale-95"
                >
                  -
                </button>
                
                <button
                  onClick={() => canLock && dispatch({ type: "LOCK_ANSWERS" })}
                  disabled={!canLock}
                  className={`px-6 py-3 md:px-10 md:py-5 rounded-xl md:rounded-2xl font-display text-base md:text-xl font-black transition-all ${canLock ? "bg-red-600 text-white shadow-xl hover:scale-105 active:scale-95" : "bg-white/5 text-white/10 cursor-not-allowed"}`}
                >
                  {available > 0 ? "STAKE ALL TOKENS" : "LOCK SESSION"}
                </button>

                <button
                  onClick={() => updateBet(selectedPlateLabel, 100)}
                  disabled={available < 100}
                  className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-white/5 text-2xl md:text-4xl text-white border border-white/10 hover:bg-accent/30 transition-all active:scale-95"
                >
                  +
                </button>
              </div>
              <div className={`text-[8px] uppercase font-black tracking-[0.3em] leading-none text-center ${available > 0 ? "text-yellow-500 animate-pulse" : "opacity-30"}`}>
                {available > 0 ? `Alert: $${available} Tokens Not Staked` : "Status: Optimal Stake"}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <footer className="mt-auto h-20" />
    </div>
  );
}
