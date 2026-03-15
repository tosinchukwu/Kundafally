import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useAccount, useDisconnect } from "wagmi";
import { motion } from "framer-motion";

export default function WalletButton() {
  const { open } = useWeb3Modal();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const truncated = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : "";

  if (isConnected) {
    return (
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => disconnect()}
        className="flex items-center gap-2 rounded-lg bg-surface-elevated px-4 py-2 plate-border transition-all hover:glow-neon"
      >
        <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
        <span className="font-data text-xs text-foreground">{truncated}</span>
      </motion.button>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => open()}
      className="flex items-center gap-2 rounded-xl bg-accent/20 px-5 py-2.5 font-data text-xs text-accent plate-border transition-all hover:bg-accent/30 hover:glow-neon"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="6" width="20" height="14" rx="2" />
        <path d="M2 10h20" />
      </svg>
      CONNECT WALLET
    </motion.button>
  );
}
