import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "@/context/GameContext";

const PRESETS = [10, 25, 50, 100];

export default function GameplayScreen() {
  const { state, dispatch, currentQuestion } = useGame();
  const [selectedPlate, setSelectedPlate] = useState<string | null>(null);

  const totalDistributed = useMemo(
    () => Object.values(state.distribution).reduce((a, b) => a + b, 0),
    [state.distribution]
  );
  const available = state.tokens - totalDistributed;

  if (!currentQuestion) return null;

  const cat = state.selectedCategories[state.currentCategoryIndex];
  const questionNum = state.currentQuestionIndex + 1;
  const totalQuestions = state.selectedCategories.reduce((a, c) => a + c.questions.length, 0);
  const globalQuestionNum = state.selectedCategories
    .slice(0, state.currentCategoryIndex)
    .reduce((a, c) => a + c.questions.length, 0) + questionNum;

  const addTokens = (label: string, amount: number) => {
    if (amount > available) amount = available;
    if (amount <= 0) return;
    dispatch({ type: "DISTRIBUTE_TOKENS", label, amount });
  };

  const canLock = totalDistributed > 0;

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 sm:px-8">
        <div>
          <span className="font-data text-xs text-muted-foreground">{cat.icon} {cat.name.toUpperCase()}</span>
          <span className="font-data ml-3 text-xs text-muted-foreground">
            Q{globalQuestionNum}/{totalQuestions}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full token-gradient" />
          <span className="font-data text-sm text-gold">{state.tokens.toLocaleString()}</span>
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 pt-[5vh]">
        <motion.h2
          key={currentQuestion.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
          className="font-display max-w-2xl text-center text-2xl font-bold text-foreground md:text-3xl"
          style={{ textWrap: "balance" } as React.CSSProperties}
        >
          {currentQuestion.question}
        </motion.h2>

        {/* Answer Plates */}
        <div className="mt-10 grid w-full max-w-2xl grid-cols-2 gap-4 md:gap-8">
          {currentQuestion.options.map((opt, i) => {
            const tokensOn = state.distribution[opt.label] || 0;
            const isSelected = selectedPlate === opt.label;

            return (
              <motion.button
                key={opt.label}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
                onClick={() => setSelectedPlate(isSelected ? null : opt.label)}
                className={`
                  relative flex flex-col items-start rounded-xl p-5 text-left
                  plate-border transition-all duration-200 cursor-pointer min-h-[100px]
                  ${isSelected
                    ? "bg-surface-elevated glow-gold"
                    : "bg-surface hover:bg-surface-elevated"
                  }
                `}
              >
                <div className="flex w-full items-start justify-between">
                  <span className="font-data text-xs text-muted-foreground">{opt.label}</span>
                  {tokensOn > 0 && (
                    <span className="font-data text-xs text-gold">{tokensOn}</span>
                  )}
                </div>
                <span className="mt-2 font-display text-sm font-semibold text-foreground md:text-base">
                  {opt.text}
                </span>
                {tokensOn > 0 && (
                  <div className="absolute bottom-0 left-0 h-1 rounded-b-xl token-gradient" style={{ width: `${Math.min((tokensOn / state.tokens) * 100, 100)}%` }} />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Token distribution controls */}
        <AnimatePresence>
          {selectedPlate && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mt-6 flex flex-wrap items-center justify-center gap-2"
            >
              {PRESETS.map((pct) => {
                const amt = Math.floor(state.tokens * (pct / 100));
                const actualAmt = Math.min(amt, available);
                return (
                  <button
                    key={pct}
                    onClick={() => addTokens(selectedPlate, actualAmt)}
                    disabled={available <= 0}
                    className="rounded-lg bg-surface-elevated px-4 py-2 font-data text-xs text-foreground plate-border transition-all hover:bg-muted disabled:opacity-30"
                  >
                    +{pct}%
                  </button>
                );
              })}
              <button
                onClick={() => addTokens(selectedPlate, available)}
                disabled={available <= 0}
                className="rounded-lg bg-primary/20 px-4 py-2 font-data text-xs text-gold plate-border transition-all hover:bg-primary/30 disabled:opacity-30"
              >
                ALL IN
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Token Tray (Bottom Bar) */}
      <div className="sticky bottom-0 flex h-28 items-center justify-between border-t border-border/50 bg-background/80 px-4 backdrop-blur-lg sm:px-8">
        <div>
          <div className="font-data text-xs text-muted-foreground">AVAILABLE</div>
          <div className="font-data text-xl text-gold">{available.toLocaleString()}</div>
        </div>
        <div className="text-center">
          <div className="font-data text-xs text-muted-foreground">DISTRIBUTED</div>
          <div className="font-data text-xl text-foreground">{totalDistributed.toLocaleString()}</div>
        </div>
        <motion.button
          whileHover={canLock ? { scale: 1.02 } : {}}
          whileTap={canLock ? { scale: 0.98 } : {}}
          onClick={() => {
            if (canLock) {
              dispatch({ type: "LOCK_ANSWERS" });
              setSelectedPlate(null);
            }
          }}
          disabled={!canLock}
          className={`
            rounded-xl px-8 py-3 font-display text-sm font-bold plate-border transition-all
            ${canLock
              ? "bg-primary text-primary-foreground glow-gold"
              : "bg-surface text-muted-foreground cursor-not-allowed"
            }
          `}
        >
          LOCK
        </motion.button>
      </div>
    </div>
  );
}
