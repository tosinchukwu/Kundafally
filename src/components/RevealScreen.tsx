import { motion } from "framer-motion";
import { useGame } from "@/context/GameContext";

export default function RevealScreen() {
  const { state, dispatch, currentQuestion } = useGame();

  if (!currentQuestion) return null;

  const correctLabel = state.revealedAnswer!;
  const lastHistory = state.history[state.history.length - 1];

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-2xl"
      >
        <div className="mb-8 text-center">
          <span className="font-data text-xs text-muted-foreground">RESULT</span>
        </div>

        {/* Question replay */}
        <h2 className="font-display mb-8 text-center text-xl font-bold text-muted-foreground md:text-2xl" style={{ textWrap: "balance" } as React.CSSProperties}>
          {currentQuestion.question}
        </h2>

        {/* Answer plates with reveal */}
        <div className="grid grid-cols-2 gap-4 md:gap-8">
          {currentQuestion.options.map((opt, i) => {
            const isCorrect = opt.label === correctLabel;
            const tokensOn = state.distribution[opt.label] || 0;
            const isWrong = !isCorrect && tokensOn > 0;

            return (
              <motion.div
                key={opt.label}
                initial={isWrong ? { y: 0, opacity: 1, rotateX: 0 } : {}}
                animate={
                  isWrong
                    ? { y: 300, opacity: 0, rotateX: 45 }
                    : isCorrect
                    ? { scale: [1, 1.03, 1] }
                    : {}
                }
                transition={
                  isWrong
                    ? { duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.5 }
                    : { duration: 0.6, delay: 1.2 }
                }
                className={`
                  relative flex flex-col items-start rounded-xl p-5 plate-border min-h-[100px]
                  ${isCorrect ? "bg-surface-elevated glow-cyan" : "bg-surface"}
                `}
              >
                <div className="flex w-full items-start justify-between">
                  <span className={`font-data text-xs ${isCorrect ? "text-cyan" : "text-muted-foreground"}`}>
                    {opt.label}
                  </span>
                  {tokensOn > 0 && (
                    <span className={`font-data text-xs ${isCorrect ? "text-cyan" : "text-void"}`}>
                      {isCorrect ? `+${tokensOn}` : `-${tokensOn}`}
                    </span>
                  )}
                </div>
                <span className={`mt-2 font-display text-sm font-semibold md:text-base ${isCorrect ? "text-foreground" : "text-muted-foreground"}`}>
                  {opt.text}
                </span>
                {isCorrect && (
                  <div className="absolute bottom-0 left-0 h-1 w-full rounded-b-xl bg-cyan" />
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Status readout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.5 }}
          className="mt-10 text-center"
        >
          {state.isEliminated ? (
            <>
              <div className="font-data text-sm text-void">VAULT EMPTY. SESSION TERMINATED.</div>
            </>
          ) : (
            <>
              {lastHistory.correct ? (
                <div className="font-data text-sm text-cyan">
                  STABLE. +{lastHistory.bonus} TOKENS APPLIED.
                </div>
              ) : (
                <div className="font-data text-sm text-void">
                  UNSTABLE. {lastHistory.tokensLost} TOKENS LOST.
                </div>
              )}
              <motion.div
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ delay: 1.6, duration: 0.3 }}
                className="mt-4 flex items-center justify-center gap-2"
              >
                <div className="h-3 w-3 rounded-full token-gradient" />
                <span className="font-data text-lg text-gold">{state.tokens.toLocaleString()}</span>
              </motion.div>
            </>
          )}

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => dispatch({ type: "NEXT_QUESTION" })}
            className="mt-8 rounded-xl bg-primary px-10 py-4 font-display text-sm font-bold text-primary-foreground plate-border glow-gold transition-all"
          >
            {state.isEliminated ? "VIEW RESULTS" : "CONTINUE"}
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}
