import { motion } from "framer-motion";
import { useGame } from "@/context/GameContext";

export default function ResultsScreen() {
  const { state, dispatch } = useGame();

  const correctCount = state.history.filter((h) => h.correct).length;
  const totalLost = state.history.reduce((a, h) => a + h.tokensLost, 0);
  const totalBonus = state.history.reduce((a, h) => a + h.bonus, 0);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 spotlight">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
        className="w-full max-w-lg text-center"
      >
        <span className="font-data text-xs text-accent">SESSION COMPLETE</span>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-8"
        >
          <div className="flex items-center justify-center gap-3">
            <div className="h-4 w-4 rounded-full token-gradient" />
            <span className="font-display text-5xl font-black text-gold md:text-6xl">
              {state.tokens.toLocaleString()}
            </span>
          </div>
          <div className="mt-2 font-data text-xs text-muted-foreground">FINAL BALANCE</div>
        </motion.div>

        <div className="mt-10 grid grid-cols-3 gap-4">
          <div className="rounded-xl bg-surface p-4 plate-border">
            <div className="font-data text-lg text-foreground">{correctCount}/{state.history.length}</div>
            <div className="font-data mt-1 text-xs text-muted-foreground">STABLE</div>
          </div>
          <div className="rounded-xl bg-surface p-4 plate-border">
            <div className="font-data text-lg text-void">{totalLost.toLocaleString()}</div>
            <div className="font-data mt-1 text-xs text-muted-foreground">LOST</div>
          </div>
          <div className="rounded-xl bg-surface p-4 plate-border">
            <div className="font-data text-lg text-accent">{totalBonus.toLocaleString()}</div>
            <div className="font-data mt-1 text-xs text-muted-foreground">BONUS</div>
          </div>
        </div>

        <div className="mt-8 space-y-2 text-left">
          {state.history.map((h, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="flex items-center gap-3 rounded-lg bg-surface p-3 plate-border"
            >
              <span className={`font-data text-xs ${h.correct ? "text-accent" : "text-void"}`}>
                {h.correct ? "STABLE" : "VOID"}
              </span>
              <span className="flex-1 truncate font-display text-xs text-muted-foreground">
                {h.question}
              </span>
              <span className={`font-data text-xs ${h.correct ? "text-accent" : "text-void"}`}>
                {h.correct ? `+${h.bonus}` : `-${h.tokensLost}`}
              </span>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 font-data text-xs text-muted-foreground">
          TOKENS PROVIDED BY <span className="text-gold">{state.sponsor}</span>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => dispatch({ type: "RESET" })}
          className="mt-8 rounded-xl bg-primary px-10 py-4 font-display text-sm font-bold text-primary-foreground gold-border transition-all"
        >
          NEW SESSION
        </motion.button>
      </motion.div>
    </div>
  );
}
