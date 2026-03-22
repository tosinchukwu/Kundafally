import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "@/context/GameContext";
import WalletButton from "./WalletButton";

const FlyingCoin = ({ startX, startY, onEnd }: { startX: number, startY: number, onEnd: () => void }) => {
  return (
    <motion.div
      initial={{ x: startX, y: startY, scale: 0, opacity: 1 }}
      animate={{ 
        x: [startX, startX + (Math.random() - 0.5) * 100, window.innerWidth - 180], 
        y: [startY, startY - 150, 60],
        scale: [0, 1.5, 0.8],
        rotate: [0, 360],
      }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      onAnimationComplete={onEnd}
      className="fixed z-[100] w-6 h-6 rounded-full bg-gradient-to-tr from-yellow-400 to-yellow-600 shadow-[0_0_15px_rgba(250,204,21,0.6)] flex items-center justify-center border border-yellow-200/50 pointer-events-none"
    >
      <span className="text-[10px] font-bold text-yellow-900">$</span>
    </motion.div>
  );
};

const FallingCoin = ({ startX, startY, onEnd }: { startX: number, startY: number, onEnd: () => void }) => {
  return (
    <motion.div
      initial={{ x: startX, y: startY, scale: 1, opacity: 1 }}
      animate={{ 
        y: [startY, startY + 500],
        opacity: [1, 0],
        rotate: [0, 180],
      }}
      transition={{ duration: 1.5, ease: "easeIn" }}
      onAnimationComplete={onEnd}
      className="fixed z-[100] w-5 h-5 rounded-full bg-gradient-to-tr from-gray-400 to-gray-600 shadow-lg flex items-center justify-center border border-white/20 pointer-events-none"
    >
      <span className="text-[10px] font-bold text-white/50">$</span>
    </motion.div>
  );
};

export default function HUD() {
  const { state, currentToken } = useGame();
  const [coins, setCoins] = useState<{ id: number, x: number, y: number }[]>([]);
  const [lostCoins, setLostCoins] = useState<{ id: number, x: number, y: number }[]>([]);
  const [isVaultPulsing, setIsVaultPulsing] = useState(false);

  const totalDistributed = useMemo(
    () => Object.values(state.distribution).reduce((a: number, b: number) => a + b, 0),
    [state.distribution]
  );
  
  const displayedBalance = (state.tokens - totalDistributed) + (state.phase === "reveal" ? state.lastWinAmount : 0);

  // Trigger coins on reveal win
  useEffect(() => {
    if (state.phase === "reveal" && state.lastWinAmount > 0) {
      const optionMap: Record<string, {x: number, y: number}> = {
        'A': { x: window.innerWidth * 0.3, y: window.innerHeight * 0.6 },
        'B': { x: window.innerWidth * 0.7, y: window.innerHeight * 0.6 },
        'C': { x: window.innerWidth * 0.3, y: window.innerHeight * 0.8 },
        'D': { x: window.innerWidth * 0.7, y: window.innerHeight * 0.8 },
      };
      
      const pos = optionMap[state.revealedAnswer || 'A'] || { x: window.innerWidth / 2, y: window.innerHeight / 2 };
      
      const newCoins = Array.from({ length: 12 }).map((_, i) => ({
        id: Date.now() + i,
        x: pos.x + (Math.random() - 0.5) * 40,
        y: pos.y + (Math.random() - 0.5) * 40,
      }));
      
      setCoins(newCoins);
    }
    
    // Trigger falling coins on wrong platforms
    if (state.phase === "reveal" && state.revealedAnswer) {
      const optionMap: Record<string, {x: number, y: number}> = {
        'A': { x: window.innerWidth * 0.3, y: window.innerHeight * 0.6 },
        'B': { x: window.innerWidth * 0.7, y: window.innerHeight * 0.6 },
        'C': { x: window.innerWidth * 0.3, y: window.innerHeight * 0.8 },
        'D': { x: window.innerWidth * 0.7, y: window.innerHeight * 0.8 },
      };

      const wrongPlatforms = Object.entries(state.distribution)
        .filter(([label, amount]) => label !== state.revealedAnswer && amount > 0);

      const allLostCoins: { id: number, x: number, y: number }[] = [];
      
      wrongPlatforms.forEach(([label], idx) => {
        const pos = optionMap[label] || { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        const platformCoins = Array.from({ length: 8 }).map((_, i) => ({
          id: Date.now() + idx * 100 + i,
          x: pos.x + (Math.random() - 0.5) * 60,
          y: pos.y + (Math.random() - 0.5) * 60,
        }));
        allLostCoins.push(...platformCoins);
      });

      if (allLostCoins.length > 0) {
        setLostCoins(allLostCoins);
      }
    }
  }, [state.phase, state.lastWinAmount, state.revealedAnswer, state.distribution]);

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <header className="flex w-full items-start justify-between p-4 md:p-8">
        <div>{/* Empty let-side now */}</div>

        {/* Stable Vault & Utility Area */}
        <div className="pointer-events-auto flex items-start gap-4">
          <div className="flex flex-col items-end gap-1">
            <motion.div 
              animate={isVaultPulsing ? { scale: [1, 1.1, 1], filter: ["blur(0px)", "blur(2px)", "blur(0px)"] } : {}}
              className="glass-card flex flex-col items-end px-4 py-2 border-white/5 bg-white/5 min-w-[160px]"
            >
              <span className="font-display text-[8px] font-black text-accent tracking-[0.3em] uppercase mb-1">Stable Vault</span>
              <div className="flex items-center gap-3">
                <span className="font-data text-2xl font-black text-white">${displayedBalance.toLocaleString()}</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-accent/60 to-accent border border-accent/50 shadow-[0_0_15px_rgba(34,211,238,0.3)]">
                  <span className="text-[10px] font-black text-white leading-none tracking-tighter">{currentToken}</span>
                </div>
              </div>
            </motion.div>
            
            <div className="h-6 mr-1">
              <AnimatePresence mode="wait">
                {totalDistributed > 0 && state.phase === "playing" ? (
                    <motion.div
                      key="status"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-3"
                    >
                      {state.lastWinAmount > 0 && (
                        <span className="font-data text-xs font-bold text-green-400">
                          +${state.lastWinAmount} WON
                        </span>
                      )}
                      <span className="font-data text-[10px] font-bold text-accent">
                        -${totalDistributed} PLACED
                      </span>
                    </motion.div>
                ) : (
                  state.phase === "reveal" && state.lastWinAmount > 0 ? (
                    <motion.div
                      key="win"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="font-data text-sm font-black text-green-400"
                    >
                      +${state.lastWinAmount.toLocaleString()} WON
                    </motion.div>
                  ) : null
                )}
              </AnimatePresence>
            </div>
          </div>
          
          <WalletButton />
        </div>
      </header>

      {/* Animation Layer */}
      {coins.map((coin) => (
        <FlyingCoin 
          key={coin.id} 
          startX={coin.x} 
          startY={coin.y} 
          onEnd={() => {
            setCoins(prev => prev.filter(c => c.id !== coin.id));
            setIsVaultPulsing(true);
            setTimeout(() => setIsVaultPulsing(false), 200);
          }} 
        />
      ))}

      {/* Lost Coins Animation Layer */}
      {lostCoins.map((coin) => (
        <FallingCoin 
          key={coin.id} 
          startX={coin.x} 
          startY={coin.y} 
          onEnd={() => setLostCoins(prev => prev.filter(c => c.id !== coin.id))} 
        />
      ))}
    </div>
  );
}
