import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "@/context/GameContext";
import WalletButton from "./WalletButton";

// Winning: Rise from Platform to Vault
const FlyingCoin = ({ startX, startY, onEnd }: { startX: number, startY: number, onEnd: () => void }) => {
  return (
    <motion.div
      initial={{ x: startX, y: startY, scale: 0, opacity: 1 }}
      animate={{ 
        x: [startX, startX + (Math.random() - 0.5) * 100, 80], 
        y: [startY, startY - 200, 80],
        scale: [0, 1.5, 0.8],
        rotate: [0, 360],
      }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      onAnimationComplete={onEnd}
      className="fixed z-[100] w-7 h-7 rounded-full bg-gradient-to-tr from-yellow-400 to-yellow-600 shadow-[0_0_20px_rgba(250,204,21,0.7)] flex items-center justify-center border-2 border-yellow-200/50 pointer-events-none"
    >
      <span className="text-[10px] font-bold text-yellow-900">$</span>
    </motion.div>
  );
};

// Losing: Fall from Vault to Void
const FallingCoin = ({ startX, startY, onEnd }: { startX: number, startY: number, onEnd: () => void }) => {
  return (
    <motion.div
      initial={{ x: startX, y: startY, scale: 1, opacity: 1 }}
      animate={{ 
        x: [startX, startX + (Math.random() - 0.5) * 50],
        y: [startY, startY + window.innerHeight],
        opacity: [1, 1, 0],
        rotate: [0, 360],
        scale: [1, 1.2, 0.8]
      }}
      transition={{ duration: 1.2, ease: "easeIn" }}
      onAnimationComplete={onEnd}
      className="fixed z-[110] w-7 h-7 rounded-full bg-gradient-to-tr from-gray-500 to-gray-800 shadow-2xl flex items-center justify-center border-2 border-white/20 pointer-events-none"
    >
      <span className="text-[12px] font-black text-white/40">$</span>
    </motion.div>
  );
};

export default function HUD() {
  const { state, currentToken } = useGame();
  const [coins, setCoins] = useState<{ id: number, x: number, y: number }[]>([]);
  const [lostCoins, setLostCoins] = useState<{ id: number, x: number, y: number }[]>([]);
  const [isVaultPulsing, setIsVaultPulsing] = useState(false);
  const [hasTriggeredReveal, setHasTriggeredReveal] = useState(false);

  const totalDistributed = useMemo(
    () => Object.values(state.distribution).reduce((a: number, b: number) => a + b, 0),
    [state.distribution]
  );
  
  const displayedBalance = (state.tokens - totalDistributed) + (state.phase === "reveal" ? state.lastWinAmount : 0);

  // Trigger animations
  useEffect(() => {
    if (state.phase === "reveal" && state.revealedAnswer && !hasTriggeredReveal) {
      setHasTriggeredReveal(true);

      // 1. Win Rise (Success)
      if (state.lastWinAmount > 0) {
        const optionMap: Record<string, {x: number, y: number}> = {
          'A': { x: window.innerWidth * 0.3, y: window.innerHeight * 0.6 },
          'B': { x: window.innerWidth * 0.7, y: window.innerHeight * 0.6 },
          'C': { x: window.innerWidth * 0.3, y: window.innerHeight * 0.8 },
          'D': { x: window.innerWidth * 0.7, y: window.innerHeight * 0.8 },
        };
        const pos = optionMap[state.revealedAnswer] || { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        const winEffectCount = Math.min(15, Math.ceil(state.lastWinAmount / 100));
        
        const newCoins = Array.from({ length: winEffectCount }).map((_, i) => ({
          id: Date.now() + i,
          x: pos.x + (Math.random() - 0.5) * 60,
          y: pos.y + (Math.random() - 0.5) * 60,
        }));
        setCoins(newCoins);
      } else {
        // 2. Loss Fall (Failure)
        // Spawns from Vault (left header)
        const vaultPos = { x: 80, y: 80 };
        // How much was lost? Everything distributed!
        const lostAmount = totalDistributed;
        const lossEffectCount = Math.min(20, Math.ceil(lostAmount / 100));

        if (lossEffectCount > 0) {
          const newLostCoins = Array.from({ length: lossEffectCount }).map((_, i) => ({
            id: Date.now() + 500 + i,
            x: vaultPos.x + (Math.random() - 0.5) * 100,
            y: vaultPos.y + (Math.random() - 0.5) * 50,
          }));
          setLostCoins(newLostCoins);
        }
      }
    }

    if (state.phase === "playing") {
      setHasTriggeredReveal(false);
      if (coins.length > 0) setCoins([]);
      if (lostCoins.length > 0) setLostCoins([]);
    }
  }, [state.phase, state.revealedAnswer, state.lastWinAmount, totalDistributed, hasTriggeredReveal]);

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <header className="flex w-full items-start justify-between p-4 md:p-8">
        <div className="pointer-events-auto flex flex-col items-start gap-1">
          <motion.div 
            animate={isVaultPulsing ? { scale: [1, 1.15, 1] } : {}}
            className="glass-card flex flex-col items-start px-3 py-2 md:px-6 md:py-3 border-white/20 bg-black/60 shadow-2xl backdrop-blur-none min-w-[130px] md:min-w-[180px]"
          >
            <span className="font-display text-[8px] md:text-[10px] font-black text-accent tracking-[0.4em] uppercase mb-1 md:mb-1.5 opacity-100">Mission Funds</span>
            <div className="flex items-center gap-2 md:gap-4">
              <div className="flex h-7 w-7 md:h-10 md:w-10 items-center justify-center rounded-full bg-gradient-to-tr from-accent to-accent/60 border-2 border-accent shadow-[0_0_20px_rgba(34,211,238,0.4)]">
                <span className="text-[9px] md:text-xs font-black text-black leading-none">{currentToken}</span>
              </div>
              <div className="flex flex-col">
                <span className="font-data text-xl md:text-3xl font-black text-white text-glow leading-none">${displayedBalance.toLocaleString()}</span>
                {state.totalBonus > 0 && (
                  <span className="font-data text-[10px] md:text-xs font-bold text-green-400 mt-1">
                    +${state.totalBonus.toLocaleString()} VAULTED BONUS
                  </span>
                )}
              </div>
            </div>
          </motion.div>
          
          <div className="h-6 ml-2">
            <AnimatePresence mode="wait">
              {totalDistributed > 0 && state.phase === "playing" ? (
                  <motion.div
                    key="status"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-3"
                  >
                    <span className="font-data text-[11px] font-black text-accent tracking-tighter">
                      -${totalDistributed} STAKED
                    </span>
                  </motion.div>
              ) : (
                state.phase === "reveal" && state.lastWinAmount > 0 ? (
                  <motion.div
                    key="win"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="font-data text-sm font-black text-green-400 ml-2"
                  >
                    +${state.lastWinAmount.toLocaleString()} WON
                  </motion.div>
                ) : null
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="pointer-events-auto flex items-center gap-4">
          <WalletButton />
        </div>
      </header>

      {/* Fly-to-Vault Animation Group */}
      {coins.map((coin) => (
        <FlyingCoin 
          key={coin.id} 
          startX={coin.x} 
          startY={coin.y} 
          onEnd={() => {
            setCoins(prev => prev.filter(c => c.id !== coin.id));
            setIsVaultPulsing(true);
            setTimeout(() => setIsVaultPulsing(false), 300);
          }} 
        />
      ))}

      {/* Fall-from-Vault Animation Group */}
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
