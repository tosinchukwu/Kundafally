import { defaultWagmiConfig } from "@web3modal/wagmi";
import { mainnet, base, polygon, arbitrum, optimism, bsc } from "viem/chains";

export const projectId = "0ea293214c93b8a691e3411953009293";

const metadata = {
  name: "Kunda Fall",
  description: "Protect the stack. Strategy quiz game.",
  url: window.location.origin,
  icons: ["/favicon.ico"],
};

export const chains = [mainnet, base, polygon, arbitrum, optimism, bsc] as const;

export const wagmiConfig = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
});
