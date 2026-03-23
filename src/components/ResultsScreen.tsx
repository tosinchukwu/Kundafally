import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useGame } from "@/context/GameContext";

export default function ResultsScreen() {
  const { state, dispatch, currentToken } = useGame();

  useEffect(() => {
    try {
      const history = JSON.parse(localStorage.getItem("kunda_history") || "[]");
      const finalScore = state.tokens + state.totalBonus;
      const newEntry = {
        id: Date.now(),
        date: new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        score: finalScore,
        correct: state.history.filter(h => h.correct).length,
        total: state.history.length,
        token: currentToken
      };
      
      // Save it! (Limit to last 20)
      const updated = [newEntry, ...history].slice(0, 20);
      localStorage.setItem("kunda_history", JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save history", e);
    }
  }, []);

  const correctCount = state.history.filter((h) => h.correct).length;
  const totalLost = state.history.reduce((a, h) => a + h.tokensLost, 0);

  return (
    <div className="game-container flex flex-col items-center justify-center px-4 pointer-events-auto">
      <div className="spotlight-main" />
      <div className="absolute inset-0 circuitry-bg opacity-20 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-2xl text-center"
      >
        <div className="inline-block glass-card px-6 py-2 mb-10 border-accent/40">
          <span className="font-display text-xs font-black tracking-[0.3em] text-accent uppercase">Session Complete</span>
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6, type: "spring", stiffness: 100 }}
          className="glass-card p-8 md:p-12 mb-6 md:mb-10 overflow-hidden relative border-white/5 bg-white/[0.03] backdrop-blur-3xl shadow-[0_30px_60px_rgba(0,0,0,0.6)]"
        >
          {/* Decorative Glow */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-accent/20 blur-[80px] rounded-full" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-primary/20 blur-[80px] rounded-full" />
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 mb-2">
              <div className="flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-2xl md:rounded-[2rem] bg-gradient-to-tr from-accent/60 to-accent shadow-[0_20px_40px_rgba(34,211,238,0.3)] border border-white/20">
                <span className="text-xl md:text-2xl font-black text-white leading-none tracking-tighter">ALL</span>
              </div>
              <span className="font-data text-6xl md:text-9xl font-black text-white tracking-tighter drop-shadow-2xl">
                ${(state.tokens + state.totalBonus).toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-4 text-white/40 font-data text-[10px] md:text-xs">
              <span>BALANCE: ${state.tokens.toLocaleString()}</span>
              <span>+</span>
              <span>BONUS: ${state.totalBonus.toLocaleString()}</span>
            </div>
            <div className="font-display text-[8px] md:text-[10px] font-black tracking-[0.3em] md:tracking-[0.5em] text-accent/50 uppercase mt-4">Mission Success: Vault Reconciled</div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-10">
          {[
            { label: "STABILITY", value: `${correctCount}/${state.history.length}`, color: "text-accent" },
            { label: "VOIDS", value: `$${totalLost.toLocaleString()}`, color: "text-red-500" },
            { label: "EFFICIENCY", value: `${Math.round(((state.tokens + state.totalBonus) / 1000) * 100)}%`, color: "text-green-400" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.1 }}
              className="glass-card p-4 md:p-6 flex flex-row md:flex-col items-center justify-between md:justify-center border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-colors"
            >
              <div className="font-display text-[9px] font-black text-white/20 tracking-[0.2em] uppercase order-first md:order-last md:mt-2">{stat.label}</div>
              <div className={`font-data text-xl md:text-2xl font-black ${stat.color} tracking-tight`}>{stat.value}</div>
            </motion.div>
          ))}
        </div>

        <div className="glass-card p-4 md:p-6 overflow-hidden">
            <div className="max-h-48 md:max-h-60 overflow-y-auto space-y-2 md:space-y-3 pr-2 scrollbar-thin scrollbar-thumb-white/10">
                {state.history.map((h, i) => (
                    <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 + i * 0.05 }}
                    className="flex items-center gap-3 md:gap-4 rounded-xl bg-white/5 p-3 md:p-4 border border-white/5 hover:border-white/10 transition-colors"
                    >
                    <span className={`font-data text-[8px] md:text-[10px] font-black w-10 md:w-14 ${h.correct ? "text-accent" : "text-red-500"}`}>
                        {h.correct ? "STABLE" : "VOID"}
                    </span>
                    <span className="flex-1 text-left font-display text-xs md:text-sm font-bold text-white/70 truncate">
                        {h.question}
                    </span>
                    <span className={`font-data text-xs md:text-sm font-black ${h.correct ? "text-accent" : "text-red-500"}`}>
                        {h.correct ? "STABLE" : `-$${h.tokensLost}`}
                    </span>
                    </motion.div>
                ))}
            </div>
        </div>

        <div className="mt-8 font-display text-[8px] md:text-xs font-bold text-white/20 tracking-wider">
          PROTECTED BY <span className="text-gold/60">{state.sponsor.toUpperCase()}</span> VAULT TECHNOLOGY
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => dispatch({ type: "RESET" })}
          className="mt-10 md:mt-12 rounded-full bg-accent px-10 py-4 md:px-16 md:py-5 font-display text-lg md:text-xl font-black tracking-widest text-black shadow-[0_0_40px_rgba(34,211,238,0.3)] transition-all"
        >
          NEW SESSION
        </motion.button>
      </motion.div>
    </div>
  );
}

