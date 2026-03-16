import { motion } from "framer-motion";
import { useGame } from "@/context/GameContext";
import WalletButton from "./WalletButton";

export default function MenuScreen() {
  const { dispatch } = useGame();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 spotlight pointer-events-auto">
      {/* Top bar with wallet */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full token-gradient" />
          <span className="font-data text-xs text-gold">1,000 TOKENS</span>
        </div>
        <WalletButton />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
        className="text-center"
      >
        <div className="mb-6">
          <span className="font-data text-xs text-muted-foreground">TOKENS PROVIDED BY</span>
          <div className="mt-1 font-data text-sm text-gold">KUNDAFALL</div>
        </div>

        <h1 className="font-display text-5xl font-black text-foreground md:text-8xl">
          KUNDA
        </h1>
        <h1 className="font-display -mt-2 text-5xl font-black md:text-8xl bg-gradient-to-r from-accent via-neon-glow to-accent bg-clip-text text-transparent">
          FALL
        </h1>

        <p className="mx-auto mt-6 max-w-md font-display text-base md:text-lg text-muted-foreground px-4">
          Protect Your Tokens • Let the Wrong Ones Fall
        </p>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => dispatch({ type: "SET_PHASE", phase: "category" })}
          className="mt-10 rounded-xl bg-primary px-10 py-4 font-display text-lg font-bold text-primary-foreground gold-border transition-all md:px-12 md:py-5 md:text-xl"
        >
          BEGIN SESSION
        </motion.button>

        <div className="mt-12 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8">
          <div className="text-center">
            <div className="font-data text-[10px] md:text-xs text-muted-foreground">FORMAT</div>
            <div className="font-data text-xs md:text-sm text-foreground">STRATEGY QUIZ</div>
          </div>
          <div className="hidden md:block h-6 w-px bg-border" />
          <div className="text-center">
            <div className="font-data text-[10px] md:text-xs text-muted-foreground">BONUS</div>
            <div className="font-data text-xs md:text-sm text-foreground">+10% PER ROUND</div>
          </div>
          <div className="hidden md:block h-6 w-px bg-border" />
          <div className="text-center">
            <div className="font-data text-[10px] md:text-xs text-muted-foreground">RISK</div>
            <div className="font-data text-xs md:text-sm text-foreground">TOTAL LOSS</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
