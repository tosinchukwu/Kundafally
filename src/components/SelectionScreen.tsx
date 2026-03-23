import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { categories, Category, Difficulty } from "@/data/quizData";
import { useGame } from "@/context/GameContext";

const DIFFICULTIES: { id: Difficulty; label: string; Desc: string; color: string }[] = [
  { id: "easy", label: "EASY", Desc: "Standard rewards, basic questions", color: "from-green-500 to-emerald-600" },
  { id: "medium", label: "MEDIUM", Desc: "Higher challenge, increased focus", color: "from-blue-500 to-indigo-600" },
  { id: "hard", label: "HARD", Desc: "Expert level, maximum intensity", color: "from-purple-600 to-pink-600" },
];

export default function SelectionScreen() {
  const { dispatch } = useGame();
  const [selectedCats, setSelectedCats] = useState<string[]>([]);

  const toggleCategory = (id: string) => {
    setSelectedCats(prev => {
      if (prev.includes(id)) return prev.filter(c => c !== id);
      if (prev.length >= 2) return prev; // Max 2
      return [...prev, id];
    });
  };

  const handleStart = () => {
    if (selectedCats.length !== 2) return;
    const pickedCategories = categories.filter(c => selectedCats.includes(c.id));
    dispatch({ type: "START_GAME", categories: pickedCategories });
  };

  const canStart = selectedCats.length === 2;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-6 md:p-12 overflow-y-auto pointer-events-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl w-full space-y-6 md:space-y-12"
      >
        <div className="text-center space-y-4">
          <h1 className="font-display text-5xl md:text-7xl font-black italic text-white tracking-tighter text-glow">
            QUIZ SETUP
          </h1>
          <p className="font-display text-xs font-bold text-white/40 uppercase tracking-[0.5em]">
            Choose your path to glory
          </p>
        </div>

        {/* Subtitles/Breadcrumbs removed to simplify */}

        {/* Step 2: Categories */}
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <span className="h-px flex-1 bg-white/10" />
            <h2 className="font-display text-sm font-black text-accent tracking-widest uppercase">Choose 2 Categories ({selectedCats.length}/2)</h2>
            <span className="h-px flex-1 bg-white/10" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat) => {
              const isSelected = selectedCats.includes(cat.id);
              return (
                <button
                  key={cat.id}
                  onClick={() => toggleCategory(cat.id)}
                  className={`
                    flex flex-col items-center justify-center p-3 md:p-6 rounded-2xl border transition-all duration-500
                    ${isSelected 
                      ? "bg-accent/20 border-accent shadow-[0_0_30px_rgba(34,211,238,0.2)]" 
                      : "bg-white/5 border-white/5 hover:bg-white/10 hover:scale-105"
                    }
                  `}
                >
                  <span className="text-3xl md:text-4xl mb-2 md:mb-4 grayscale-[0.5] group-hover:grayscale-0 transition-all">{cat.icon}</span>
                  <span className={`font-display text-xs font-black uppercase tracking-widest ${isSelected ? "text-white" : "text-white/40"}`}>
                    {cat.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Start Button */}
        <div className="flex flex-col items-center pt-8">
          <button
            onClick={handleStart}
            disabled={!canStart}
            className={`
              relative group flex items-center justify-center rounded-2xl px-10 py-4 md:px-24 md:py-6 font-display text-xl md:text-3xl font-black tracking-[0.2em] italic transition-all duration-500
              ${canStart
                ? "bg-accent text-black shadow-[0_0_50px_rgba(34,211,238,0.4)] hover:scale-105 active:scale-95 translate-y-0"
                : "bg-white/5 text-white/10 border border-white/5 opacity-40 cursor-not-allowed translate-y-4"
              }
            `}
          >
            START QUIZ
            {canStart && (
              <motion.div
                animate={{ opacity: [0, 0.5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 rounded-2xl bg-white"
              />
            )}
          </button>
          {!canStart && (
            <p className="mt-4 font-display text-[9px] font-bold text-white/20 uppercase tracking-[0.4em] italic">
              "Select your focus areas to begin"
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
