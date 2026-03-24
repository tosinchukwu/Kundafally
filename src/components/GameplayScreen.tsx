import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "@/context/GameContext";



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
    const maxPossible = Math.min(state.startingTokens, state.tokens - currentOtherDist);
    
    const finalVal = Math.max(0, Math.min(snappedVal, Math.floor(maxPossible / 100) * 100));
    
    dispatch({ type: "SET_DISTRIBUTION", label: selectedPlateLabel, amount: finalVal });
    setInputValue(finalVal.toString());
  };

  const updateBet = (label: string, delta: number) => {
    const currentAmount = state.distribution[label] || 0;
    const totalDist = Object.values(state.distribution).reduce((a: number, b: number) => a + b, 0);
    let newAmount = currentAmount + delta;
    
    const currentOtherDist = totalDist - (state.distribution[label] || 0);
    const maxPossible = Math.min(state.startingTokens, state.tokens - currentOtherDist);
    
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
    return num >= 100 && num <= state.startingTokens && num % 100 === 0;
  }, [inputValue, state.startingTokens]);

  const canLock = useMemo(() => {
    // 1. Current typing must be valid (or 0)
    if (inputValue !== "0" && !isInputValid) return false;
    
    // 2. All other platforms in state must be valid
    const othersValid = Object.entries(state.distribution).every(([label, val]) => {
      if (label === selectedPlateLabel) return true;
      return val === 0 || (val >= 100 && val % 100 === 0);
    });
    if (!othersValid) return false;

    // 3. MUST use current balance (100% distribution required)
    const currentNum = parseInt(inputValue) || 0;
    const totalOtherDist = Object.entries(state.distribution)
      .filter(([label]) => label !== selectedPlateLabel)
      .reduce((a, [_, b]) => a + b, 0);
    
    // Force full distribution
    return (currentNum + totalOtherDist) === state.tokens && state.tokens > 0;
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

        {/* Persistent Staking Bar */}
        <div className="w-full max-w-lg mt-8 mb-4 relative z-20 pointer-events-auto">
          <div className="glass-card border-white/10 bg-black/60 backdrop-blur-3xl p-6 rounded-[2rem] shadow-2xl">
            <div className="flex flex-col items-center gap-4">
              <div className="flex flex-col items-center gap-1">
                <span className="font-display text-[10px] md:text-sm font-black text-accent uppercase tracking-[0.3em] mb-2">
                  {selectedPlateLabel ? `STAKE ON OPTION ${selectedPlateLabel}` : "SELECT AN OPTION • STAKE YOUR FULL BUDGET"}
                </span>
                
                {/* Preset Buttons - Rebalanced for 100-500 */}
                <div className="flex flex-wrap justify-center gap-2 mt-2 w-full max-w-sm">
                  {[100, 200, 300, 400, 500].map((p) => {
                    const isPossible = p <= state.tokens;
                    const isCurrent = selectedPlateLabel && (state.distribution[selectedPlateLabel] || 0) === p;

                    return (
                      <button
                        key={p}
                        onClick={() => {
                          if (!selectedPlateLabel) return;
                          if (isPossible) {
                             dispatch({ type: "SET_DISTRIBUTION", label: selectedPlateLabel, amount: p });
                          }
                        }}
                        disabled={!isPossible || !selectedPlateLabel}
                        className={`
                          px-2 py-3 rounded-xl font-data text-[10px] md:text-xs font-black border transition-all relative overflow-hidden
                          ${isCurrent 
                            ? "bg-accent border-accent text-black shadow-[0_0_20px_rgba(34,211,238,0.5)] z-10 scale-110" 
                            : (isPossible && selectedPlateLabel) 
                              ? "bg-white/5 border-white/10 text-white/50 hover:bg-accent/20 hover:text-accent hover:border-accent" 
                              : "bg-white/5 border-white/5 text-white/5 cursor-not-allowed"
                          }
                          ${isPossible && selectedPlateLabel && !isCurrent ? "border-accent/30 text-accent/70 shadow-[inset_0_0_10px_rgba(34,211,238,0.1)]" : ""}
                        `}
                      >
                        <span className="relative z-10">${p}</span>
                        {isPossible && selectedPlateLabel && !isCurrent && (
                          <motion.div
                            animate={{ opacity: [0.1, 0.3, 0.1] }}
                            transition={{ duration: 3, repeat: Infinity }}
                            className="absolute inset-0 bg-accent/5 backdrop-blur-sm"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center gap-6">
                <button
                  onClick={() => selectedPlateLabel && updateBet(selectedPlateLabel, -100)}
                  disabled={!selectedPlateLabel || (state.distribution[selectedPlateLabel] || 0) <= 0}
                  className="w-12 h-12 rounded-2xl bg-white/5 text-2xl text-white border border-white/10 hover:bg-red-500/30 transition-all active:scale-95 disabled:opacity-20"
                >
                  -
                </button>
                
                <button
                  onClick={() => canLock && dispatch({ type: "LOCK_ANSWERS" })}
                  disabled={!canLock}
                  className={`px-8 py-4 rounded-2xl font-display text-lg font-black transition-all ${canLock ? "bg-red-600 text-white shadow-[0_10px_30px_rgba(220,38,38,0.4)] hover:scale-105 active:scale-95" : "bg-white/5 text-white/10 cursor-not-allowed"}`}
                >
                  LOCK SESSION
                </button>

                <button
                  onClick={() => selectedPlateLabel && updateBet(selectedPlateLabel, 100)}
                  disabled={!selectedPlateLabel || available < 100}
                  className="w-12 h-12 rounded-2xl bg-white/5 text-2xl text-white border border-white/10 hover:bg-accent/30 transition-all active:scale-95 disabled:opacity-20"
                >
                  +
                </button>
              </div>

              <div className="flex flex-col items-center gap-1.5 opacity-60">
                <div className="flex items-center gap-4 text-[8px] font-black uppercase tracking-widest leading-none">
                  <span className={available > 0 ? "text-yellow-500" : "text-white/40"}>
                    UNSTAKED: ${available}
                  </span>
                  <div className="w-1 h-1 rounded-full bg-white/20" />
                  <span className="text-white/40">
                    ROUND TOTAL: ${totalDistributed}
                  </span>
                </div>
                <div className="text-[7px] text-white/20 italic uppercase tracking-widest">
                  $100 = 1 TOKEN • FULL STAKE REQUIRED • 1% BONUS ACTIVE
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer className="mt-auto h-20" />
    </div>
  );
}
