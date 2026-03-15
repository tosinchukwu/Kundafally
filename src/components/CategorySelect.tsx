import { useState } from "react";
import { motion } from "framer-motion";
import { categories, Category } from "@/data/quizData";
import { useGame } from "@/context/GameContext";

export default function CategorySelect() {
  const { dispatch } = useGame();
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const startGame = () => {
    if (selected.size === 0) return;
    const chosen: Category[] = categories.filter((c) => selected.has(c.id));
    dispatch({ type: "START_GAME", categories: chosen });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 spotlight">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
        className="w-full max-w-2xl"
      >
        <div className="mb-2 text-center">
          <span className="font-data text-accent">SELECT CATEGORIES</span>
        </div>
        <h2 className="font-display mb-10 text-center text-3xl font-bold text-foreground md:text-4xl">
          Choose your arena.
        </h2>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {categories.map((cat, i) => {
            const isSelected = selected.has(cat.id);
            return (
              <motion.button
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
                onClick={() => toggle(cat.id)}
                className={`
                  relative flex flex-col items-center gap-3 rounded-xl p-6 
                  transition-all duration-200 cursor-pointer
                  ${isSelected
                    ? "bg-surface-elevated neon-border"
                    : "bg-surface plate-border hover:bg-surface-elevated"
                  }
                `}
              >
                <span className="text-3xl">{cat.icon}</span>
                <span className={`font-data text-xs ${isSelected ? "text-accent" : "text-muted-foreground"}`}>
                  {cat.name}
                </span>
                {isSelected && (
                  <motion.div
                    layoutId="check"
                    className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent"
                  >
                    <span className="text-xs text-accent-foreground">✓</span>
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>

        <motion.div className="mt-10 flex justify-center">
          <button
            onClick={startGame}
            disabled={selected.size === 0}
            className={`
              rounded-xl px-10 py-4 font-display text-lg font-bold tracking-tight
              transition-all duration-200
              ${selected.size > 0
                ? "bg-primary text-primary-foreground gold-border hover:scale-[1.02] active:scale-[0.98]"
                : "bg-surface text-muted-foreground plate-border cursor-not-allowed"
              }
            `}
          >
            ENTER THE VAULT
          </button>
        </motion.div>

        <p className="mt-4 text-center font-data text-xs text-muted-foreground">
          {selected.size} {selected.size === 1 ? "CATEGORY" : "CATEGORIES"} · {selected.size * 3} QUESTIONS
        </p>
      </motion.div>
    </div>
  );
}
