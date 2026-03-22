import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "@/context/GameContext";
import WalletButton from "./WalletButton";

export default function MenuScreen() {
  const { dispatch } = useGame();
  const [showHistory, setShowHistory] = useState(false);
  const [showHowTo, setShowHowTo] = useState(false);

  const getHistory = () => {
    try {
      return JSON.parse(localStorage.getItem("kunda_history") || "[]");
    } catch {
      return [];
    }
  };

  const history = getHistory();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 spotlight pointer-events-auto">
      {/* Top bar with wallet */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-accent animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
          <span className="font-data text-xs text-accent">1,000 STARTING TOKENS</span>
        </div>
        <WalletButton />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <div className="mb-6">
          <span className="font-data text-xs text-white/30 tracking-[0.3em] uppercase">Architecture By</span>
          <div className="mt-1 font-data text-sm text-accent tracking-widest font-black italic">KUNDAFALL</div>
        </div>

        <h1 className="font-display text-6xl font-black text-white md:text-9xl tracking-tighter italic">KUNDA</h1>
        <h1 className="font-display -mt-4 text-6xl font-black md:text-9xl bg-gradient-to-r from-accent via-white to-accent bg-clip-text text-transparent italic drop-shadow-[0_0_30px_rgba(34,211,238,0.3)]">FALL</h1>

        <div className="flex flex-col items-center gap-4 mt-12">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => dispatch({ type: "SET_PHASE", phase: "category" })}
            className="rounded-full bg-accent px-12 py-5 font-display text-xl font-black text-black shadow-[0_20px_40px_rgba(34,211,238,0.3)] transition-all"
          >
            BEGIN MISSION
          </motion.button>
          
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setShowHistory(true)}
              className="font-display text-[9px] font-black text-white/40 hover:text-accent tracking-[0.4em] transition-colors py-2 uppercase"
            >
              Session History
            </button>
            <div className="h-3 w-px bg-white/10" />
            <button 
              onClick={() => setShowHowTo(true)}
              className="font-display text-[9px] font-black text-white/40 hover:text-accent tracking-[0.4em] transition-colors py-2 uppercase"
            >
              How to Play
            </button>
          </div>
        </div>

        <div className="mt-16 flex items-center justify-center gap-10 opacity-40">
           <div className="text-center">
             <div className="font-data text-[10px] text-white/50 mb-1">STABILITY</div>
             <div className="font-data text-xs text-white font-black">6 ROUNDS</div>
           </div>
           <div className="h-4 w-px bg-white/10" />
           <div className="text-center">
             <div className="font-data text-[10px] text-white/50 mb-1">STAKE</div>
             <div className="font-data text-xs text-white font-black">$50 - $1000</div>
           </div>
           <div className="h-4 w-px bg-white/10" />
           <div className="text-center">
             <div className="font-data text-[10px] text-white/50 mb-1">RISK</div>
             <div className="font-data text-xs text-white font-black">TOTAL LOSS</div>
           </div>
        </div>
      </motion.div>

      {/* History Modal */}
      <AnimatePresence>
        {showHistory && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="glass-card w-full max-w-xl p-8 border-white/10 max-h-[80vh] overflow-hidden flex flex-col"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-display text-2xl font-black italic text-white">MISSION HISTORY</h3>
                <button onClick={() => setShowHistory(false)} className="text-white/40 hover:text-white transition-colors uppercase text-[10px] font-black tracking-widest">Close</button>
              </div>

              <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                {history.length > 0 ? history.map((h: any) => (
                  <div key={h.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                    <div className="flex flex-col">
                      <span className="font-data text-[10px] text-white/30 uppercase">{h.date}</span>
                      <span className="font-display text-sm font-bold text-white/80">{h.correct}/{h.total} STABLE</span>
                    </div>
                    <div className="text-right">
                       <div className="font-data text-xs text-accent/60 mb-0.5">{h.token} SESSION</div>
                       <div className="font-data text-lg font-black text-white">${h.score.toLocaleString()}</div>
                    </div>
                  </div>
                )) : (
                  <div className="py-20 text-center opacity-20 font-display text-sm font-black italic tracking-widest">NO DATA RECOVERED</div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* How to Play Modal */}
      <AnimatePresence>
        {showHowTo && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 backdrop-blur-2xl p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="glass-card w-full max-w-2xl p-8 md:p-12 border-white/10 max-h-[90vh] overflow-hidden flex flex-col relative pointer-events-auto"
            >
              <button 
                onClick={() => setShowHowTo(false)} 
                className="absolute top-8 right-8 text-accent font-black tracking-widest text-[10px] uppercase hover:scale-110 transition-transform"
              >
                [ CLOSE ]
              </button>

              <h3 className="font-display text-3xl md:text-4xl font-black italic text-white mb-8 tracking-tighter">OPERATIONAL PROTOCOL</h3>

              <div className="flex-1 overflow-y-auto pr-4 space-y-10 custom-scrollbar pb-6">
                <section>
                  <h4 className="font-display text-xs font-black text-accent tracking-[0.3em] uppercase mb-4">01. The Objective</h4>
                  <p className="font-display text-sm md:text-base text-white/70 leading-relaxed italic">
                    You begin with <span className="text-white font-bold">$1,000</span>. Your goal is to keep as much as possible through <span className="text-white font-bold">6 Rounds</span> of high-stakes questioning.
                  </p>
                </section>

                <section>
                  <h4 className="font-display text-xs font-black text-accent tracking-[0.3em] uppercase mb-4">02. Stable vs Void</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <div className="text-accent font-black text-[10px] mb-2">STABLE VAULT</div>
                      <p className="text-xs text-white/50 leading-loose">Money NOT placed on platforms is 100% safe. It stays with you no matter the answer.</p>
                    </div>
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                      <div className="text-red-500 font-black text-[10px] mb-2">THE VOID (RISK)</div>
                      <p className="text-xs text-white/50 leading-loose">Money placed on platforms is at risk. If the answer is wrong, it falls into the void forever.</p>
                    </div>
                  </div>
                </section>

                <section>
                  <h4 className="font-display text-xs font-black text-accent tracking-[0.3em] uppercase mb-4">03. Deployment Rules</h4>
                  <ul className="space-y-4 text-xs md:text-sm text-white/70 italic">
                    <li className="flex gap-4">
                      <span className="text-accent font-black">/</span>
                      <span>Min bet is <span className="text-white font-bold">$50</span>. Max bet is <span className="text-white font-bold">$1,000</span> per platform.</span>
                    </li>
                    <li className="flex gap-4">
                      <span className="text-accent font-black">/</span>
                      <span>All bets must be in <span className="text-white font-bold">multiples of $50</span>.</span>
                    </li>
                    <li className="flex gap-4">
                      <span className="text-accent font-black">/</span>
                      <span>You have exactly <span className="text-white font-bold">45 Seconds</span> per round to distribute your tokens.</span>
                    </li>
                  </ul>
                </section>

                <section>
                  <h4 className="font-display text-xs font-black text-accent tracking-[0.3em] uppercase mb-4">04. Game Over</h4>
                  <p className="font-display text-xs text-red-400 leading-relaxed">
                    If your balance falls below <span className="font-bold underline">$50</span> or you fail to place a valid bet before the timer expires, the mission is <span className="font-bold uppercase">Terminated</span>.
                  </p>
                </section>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
