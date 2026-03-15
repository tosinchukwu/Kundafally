import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { WagmiProvider } from "wagmi";
import { createWeb3Modal } from "@web3modal/wagmi/react";
import { wagmiConfig, projectId } from "@/config/web3";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";

createWeb3Modal({
  wagmiConfig,
  projectId,
  themeMode: "dark",
  themeVariables: {
    "--w3m-accent": "#8b5cf6",
    "--w3m-color-mix": "#1a0a2e",
    "--w3m-color-mix-strength": 40,
    "--w3m-border-radius-master": "2px",
  },
});

const queryClient = new QueryClient();

const App = () => (
  <WagmiProvider config={wagmiConfig}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </WagmiProvider>
);

export default App;
