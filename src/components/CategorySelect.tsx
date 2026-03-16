import { useState } from "react";
import { motion } from "framer-motion";
import { categories, Category } from "@/data/quizData";
import { useGame } from "@/context/GameContext";

export default function CategorySelect() {
  const { dispatch } = useGame();
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    console.log("Toggling category:", id);
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const startGame = () => {
    const chosen: Category[] = categories.filter((c) => selected.has(c.id));
    console.log("Chosen categories:", chosen.map(c => c.id), "Count:", chosen.length);
    if (chosen.length === 0) {
      console.warn("No categories selected after filter!");
      return;
    }
    dispatch({ type: "START_GAME", categories: chosen });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 spotlight pointer-events-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
        className="relative z-10 w-full max-w-2xl"
      >
        <div className="mb-2 text-center">
          <span className="font-data text-accent">SELECT CATEGORIES</span>
        </div>
        <h2 className="font-display mb-10 text-center text-3xl font-bold text-foreground md:text-4xl">
          Choose your arena.
        </h2>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          {categories.map((cat, i) => {
            const isSelected = selected.has(cat.id);
            return (
              <motion.button
                key={cat.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                onClick={() => toggle(cat.id)}
                className={`
                  relative flex flex-col items-center gap-2 rounded-xl p-4 md:p-6 
                  transition-all duration-200 cursor-pointer
                  ${isSelected
                    ? "bg-surface-elevated neon-border"
                    : "bg-surface plate-border hover:bg-surface-elevated"
                  }
                `}
              >
                <span className="text-2xl md:text-3xl">{cat.icon}</span>
                <span className={`font-data text-[10px] md:text-xs text-center ${isSelected ? "text-accent" : "text-muted-foreground"}`}>
                  {cat.name}
                </span>
                {isSelected && (
                  <motion.div
                    layoutId={`check-${cat.id}`}
                    className="absolute -top-1 -right-1 flex h-4 w-4 md:h-5 md:w-5 items-center justify-center rounded-full bg-accent"
                  >
                    <span className="text-[10px] md:text-xs text-accent-foreground">✓</span>
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>

        <motion.div className="mt-8 md:mt-10 flex justify-center">
          <button
            onClick={startGame}
            disabled={selected.size === 0}
            className={`
              rounded-xl px-8 py-3 md:px-10 md:py-4 font-display text-base md:text-lg font-bold tracking-tight
              transition-all duration-200
              ${selected.size > 0
                ? "bg-primary text-primary-foreground gold-border hover:scale-[1.02] "
                : "bg-surface text-muted-foreground plate-border cursor-not-allowed"
              }
            `}
          >
            ENTER THE VAULT
          </button>
        </motion.div>

        <p className="mt-4 text-center font-data text-[10px] md:text-xs text-white/30">
          {selected.size} {selected.size === 1 ? "CATEGORY" : "CATEGORIES"} · {selected.size * 3} QUESTIONS
        </p>
      </motion.div>
    </div>
  );
}
