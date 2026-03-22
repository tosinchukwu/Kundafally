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
        className="max-w-4xl w-full space-y-12"
      >
        <div className="text-center space-y-6">
          <h1 className="font-display text-7xl md:text-9xl font-black text-white tracking-tighter drop-shadow-2xl">
            ANALYSIS <span className="text-safe lowercase opacity-60">_target</span>
          </h1>
          <p className="font-mono text-[10px] font-black text-safe/40 uppercase tracking-[0.6em] italic">
            Select authentication focus areas
          </p>
        </div>

        {/* Subtitles/Breadcrumbs removed to simplify */}

        {/* Step 2: Categories */}
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <span className="h-px flex-1 bg-white/10" />
            <h2 className="font-display text-[10px] font-black text-vault tracking-[0.4em] uppercase opacity-60">Selection Phase ({selectedCats.length}/2)</h2>
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
                    flex flex-col items-center justify-center p-8 rounded-sm border transition-all duration-300 relative group
                    ${isSelected 
                      ? "bg-slate-900 border-safe shadow-safe scale-105" 
                      : "bg-slate-950/20 border-white/5 hover:border-white/20"
                    }
                  `}
                >
                  <span className={`text-5xl mb-6 transition-all duration-700 ${isSelected ? "scale-110" : "grayscale opacity-10 group-hover:grayscale-0 group-hover:opacity-100"}`}>{cat.icon}</span>
                  <span className={`font-mono text-[10px] font-black uppercase tracking-[0.4em] ${isSelected ? "text-safe" : "text-white/20 group-hover:text-safe/40"}`}>
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
              relative group flex items-center justify-center rounded-sm px-24 py-6 font-mono text-xl font-black tracking-[0.4em] transition-all duration-500
              ${canStart
                ? "bg-safe text-black shadow-safe hover:bg-white translate-y-0"
                : "bg-slate-900 text-white/5 border border-white/5 opacity-40 cursor-not-allowed translate-y-4"
              }
            `}
          >
            EXECUTE::LOGIN
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
