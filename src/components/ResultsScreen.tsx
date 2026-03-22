import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useGame } from "@/context/GameContext";

export default function ResultsScreen() {
  const { state, dispatch, currentToken } = useGame();

  useEffect(() => {
    try {
      const history = JSON.parse(localStorage.getItem("kunda_history") || "[]");
      const newEntry = {
        id: Date.now(),
        date: new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        score: state.totalScore,
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
        <div className="inline-block bg-slate-900 px-6 py-2 mb-10 border-l-4 border-safe">
          <span className="font-mono text-[10px] font-black tracking-[0.4em] text-safe uppercase">SESSION_DEBRIEF::ANALYSIS_COMPLETE</span>
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
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-4">
              <div className="flex h-20 w-20 md:h-24 md:w-24 items-center justify-center rounded-sm bg-slate-900 border border-safe shadow-safe">
                <span className="text-2xl font-mono font-black text-safe leading-none">RECO</span>
              </div>
              <span className="font-data text-7xl md:text-[10rem] font-black text-white tracking-widest leading-none drop-shadow-2xl">
                ${state.totalScore.toLocaleString()}
              </span>
            </div>
            <div className="font-mono text-[10px] font-black tracking-[0.6em] text-safe/30 uppercase mt-8 opacity-50">Vault_Integrity_Index: [SECURE]</div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-10">
          {[
            { label: "AVAILABILITY", value: `${correctCount}/${state.history.length}`, color: "text-safe" },
            { label: "LEAKAGE", value: `$${totalLost.toLocaleString()}`, color: "text-risk" },
            { label: "EFFICIENCY", value: `${Math.round((state.totalScore / (state.history.length * 1000 || 1)) * 100)}%`, color: "text-white" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.1 }}
              className="bg-slate-900 p-6 flex flex-row md:flex-col items-center justify-between border-l border-white/10 hover:border-safe/40 transition-all"
            >
              <div className="font-mono text-[9px] font-black text-white/20 tracking-[0.2em] uppercase order-first md:order-last md:mt-2">{stat.label}</div>
              <div className={`font-data text-xl md:text-2xl font-black ${stat.color} tracking-widest`}>{stat.value}</div>
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
                    className="flex items-center gap-4 border-b border-white/5 p-4 hover:bg-white/[0.02] transition-colors"
                    >
                    <span className={`font-mono text-[10px] font-black w-14 ${h.correct ? "text-safe" : "text-risk"}`}>
                        {h.correct ? "STABLE" : "VOID"}
                    </span>
                    <span className="flex-1 text-left font-mono text-xs font-bold text-white/40 truncate">
                        {h.question}
                    </span>
                    <span className={`font-data text-sm font-black ${h.correct ? "text-safe" : "text-risk"}`}>
                        {h.correct ? "0.00" : `-${h.tokensLost}`}
                    </span>
                    </motion.div>
                ))}
            </div>
        </div>

        <div className="mt-8 font-display text-[8px] md:text-xs font-bold text-white/20 tracking-wider">
          PROTECTED BY <span className="text-gold/60">{state.sponsor.toUpperCase()}</span> VAULT TECHNOLOGY
        </div>

        <motion.button
          whileHover={{ scale: 1.05, backgroundColor: "#fff", color: "#000" }}
          whileTap={{ scale: 0.95 }}
          onClick={() => dispatch({ type: "RESET" })}
          className="mt-12 border-2 border-safe px-16 py-6 font-mono text-xl font-black tracking-[0.4em] text-safe shadow-safe transition-all uppercase"
        >
          EXECUTE::REPLAY
        </motion.button>
      </motion.div>
    </div>
  );
}

