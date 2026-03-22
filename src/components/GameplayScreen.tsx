import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "@/context/GameContext";

const PRESETS = [10, 25, 50, 100];

export default function GameplayScreen() {
  const { state, dispatch, currentQuestion, currentToken } = useGame();
  const [timeLeft, setTimeLeft] = useState(45);
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
    return num >= 50 && num <= 1000 && num % 50 === 0;
  }, [inputValue]);

  // Calculate heartbeat frequency based on time left
  const pulseDuration = useMemo(() => {
    if (timeLeft > 30) return 2;
    if (timeLeft > 15) return 1.2;
    if (timeLeft > 5) return 0.6;
    return 0.3; // Rapid panic pulse below 5s
  }, [timeLeft]);

  const canLock = useMemo(() => {
    // 1. Current typing must be valid (or 0)
    if (inputValue !== "0" && !isInputValid) return false;
    
    // 2. All other platforms in state must be valid
    const othersValid = Object.entries(state.distribution).every(([label, val]) => {
      if (label === selectedPlateLabel) return true; // Handled by isInputValid
      return val === 0 || (val >= 50 && val <= 1000 && val % 50 === 0);
    });
    if (!othersValid) return false;

    // 3. Total (including current typing) must be >= 50
    const currentNum = parseInt(inputValue) || 0;
    const totalOtherDist = Object.entries(state.distribution)
      .filter(([label]) => label !== selectedPlateLabel)
      .reduce((a, [_, b]) => a + b, 0);
    
    return (currentNum + totalOtherDist) >= 50;
  }, [inputValue, isInputValid, state.distribution, selectedPlateLabel]);

  return (
    <div className="game-container relative flex flex-col items-center min-h-screen w-full bg-transparent overflow-hidden">
      {/* Risk Vignette Overlay */}
      <motion.div 
        animate={{ 
          opacity: timeLeft <= 10 ? [0.2, 0.5, 0.2] : 0,
          scale: timeLeft <= 10 ? [1, 1.05, 1] : 1 
        }}
        transition={{ duration: pulseDuration, repeat: Infinity }}
        className="fixed inset-0 pointer-events-none z-[5] bg-[radial-gradient(circle,transparent_40%,rgba(239,68,68,0.3)_100%)]"
      />

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
        <motion.div 
          animate={{ scale: [1, 1.01, 1] }}
          transition={{ duration: pulseDuration, repeat: Infinity, ease: "easeInOut" }}
          initial={{ y: 20, opacity: 0 }} 
          whileInView={{ y: 0, opacity: 1 }} 
          className="w-full mb-6 text-center"
        >
          <div className="glass-card border-white/5 bg-black/40 backdrop-blur-2xl p-6 md:p-10 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-accent rounded-full z-10">
              <span className="text-[10px] font-black text-black">Question {state.questionsAnswered + 1} of 6</span>
            </div>
            <h2 className="font-display text-lg md:text-3xl font-bold text-white mb-4">
              {currentQuestion.question}
            </h2>
          <div className="flex flex-col items-center">
            <div className={`
              h-20 w-20 rounded-sm border-2 flex items-center justify-center transition-all duration-300
              ${timeLeft > 20 ? "border-safe text-safe shadow-safe" : timeLeft > 10 ? "border-orange-400 text-orange-400" : "border-risk text-risk shadow-risk animate-pulse"}
            `}>
              <span className="font-data text-3xl font-black">{timeLeft}</span>
            </div>
            <div className="mt-2 font-mono text-[8px] font-black tracking-[0.4em] uppercase opacity-30">SEC_TIMER</div>
          </div>
          </div>
        </motion.div>

        <div className="w-full grid grid-cols-2 gap-x-8 mt-8">
          {currentQuestion.options.map((opt) => {
            const isSelected = selectedPlateLabel === opt.label;
            const hasTokens = (state.distribution[opt.label] || 0) > 0;

            return (
              <button
                key={opt.label}
                onClick={() => dispatch({ type: "SELECT_PLATFORM", label: isSelected ? null : opt.label })}
                className={`
                  relative flex items-center gap-6 p-6 rounded-sm border transition-all duration-200 mb-4
                  ${isSelected 
                    ? "bg-slate-900 border-safe shadow-safe scale-[1.02]" 
                    : hasTokens
                      ? "bg-slate-950 border-safe/40"
                      : "bg-slate-950/20 border-white/5 hover:border-white/20"}
                `}
              >
                <div className={`
                  h-10 w-10 flex items-center justify-center rounded-sm font-data text-xl font-black transition-colors
                  ${isSelected ? "bg-safe text-black" : "bg-slate-800 text-white/20 border border-white/5"}
                `}>
                  {opt.label}
                </div>
                <div className="text-left flex-1 min-w-0">
                  <p className={`font-mono text-sm md:text-base font-black truncate block tracking-tighter ${isSelected ? "text-safe" : "text-white/60"}`}>
                    {opt.text}
                  </p>
                </div>
                {hasTokens && (
                  <div className={`
                    px-2 py-1 rounded-sm text-[10px] font-data font-black border transition-all
                    ${isSelected ? "bg-safe/20 border-safe text-safe" : "bg-slate-800 border-white/10 text-white/40"}
                  `}>
                    ${state.distribution[opt.label]}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <AnimatePresence>
          {selectedPlateLabel && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="mt-8 flex flex-col items-center gap-6 p-8 rounded-none bg-slate-900 border-l-4 border-safe shadow-2xl w-full max-w-lg relative overflow-hidden">
              <div className="flex flex-col items-center gap-2">
                <span className="font-mono text-[9px] font-black text-safe/40 uppercase tracking-[0.4em]">AUTH://INPUT_NODE_{selectedPlateLabel}</span>
                <div className="flex flex-col items-center gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-data text-4xl font-black text-white/10 select-none">$</span>
                    <input
                      type="text"
                      value={inputValue}
                      onChange={handleBetChange}
                      onBlur={handleBetBlur}
                      className={`w-40 bg-transparent border-b border-white/10 text-4xl font-data font-black text-center outline-none transition-all duration-300 ${isInputValid || inputValue === "0" ? "focus:border-safe text-white" : "border-risk text-risk animate-flicker"}`}
                    />
                  </div>
                  {!isInputValid && inputValue !== "0" && (
                    <span className="text-[9px] font-mono font-black text-risk uppercase tracking-[0.2em] mt-2">Invalid Quantity</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4 w-full justify-center">
                <button
                  onClick={() => updateBet(selectedPlateLabel, -50)}
                  disabled={(state.distribution[selectedPlateLabel] || 0) <= 0}
                  className="w-12 h-12 rounded-sm bg-slate-800 text-xl text-white border border-white/5 hover:bg-risk/20 hover:border-risk/40 transition-all active:scale-95 disabled:opacity-5"
                >
                  -
                </button>
                
                <button
                  onClick={() => canLock && dispatch({ type: "LOCK_ANSWERS" })}
                  disabled={!canLock}
                  className={`flex-1 h-12 rounded-sm font-mono text-sm font-black tracking-[0.3em] transition-all ${canLock ? "bg-safe text-black shadow-safe hover:bg-white" : "bg-slate-800 text-white/5 cursor-not-allowed"}`}
                >
                  COMMIT
                </button>

                <button
                  onClick={() => updateBet(selectedPlateLabel, 50)}
                  disabled={available < 50}
                  className="w-12 h-12 rounded-sm bg-slate-800 text-xl text-white border border-white/5 hover:bg-safe/20 hover:border-safe/40 transition-all active:scale-95 disabled:opacity-5"
                >
                  +
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <footer className="mt-auto h-20" />
    </div>
  );
}
