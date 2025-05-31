import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import Landing from "@/pages/Landing";
import HomePage from "@/pages/HomePage";
import AnswersPage from "@/pages/AnswersPage";
import MyQuestionsPage from "@/pages/MyQuestionsPage";
import MyAnswersPage from "@/pages/MyAnswersPage";
import ArchivePage from "@/pages/ArchivePage";
import NotFound from "@/pages/NotFound";

import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { mainnet, polygonAmoy } from 'wagmi/chains';
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const config = getDefaultConfig({
    appName: 'Anonqa',
    projectId: import.meta.env.VITE_WAGMI_PROJECT_ID,
    chains: [mainnet, polygonAmoy],
    ssr: true,
});

const queryClient = new QueryClient();

const App = () => (
  <WagmiProvider config={config}>
    <QueryClientProvider client={queryClient}>
      <RainbowKitProvider 
      initialChain={polygonAmoy}
      >
          <TooltipProvider>
            <AppLayout>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Landing />} />
                  <Route path="/app" element={<HomePage />} />
                  <Route path="/app/question/:id" element={<AnswersPage />} />
                  <Route path="/app/my-questions" element={<MyQuestionsPage />} />
                  <Route path="/app/my-answers" element={<MyAnswersPage />} />
                  <Route path="/app/archives" element={<ArchivePage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </AppLayout>
          </TooltipProvider>
      </RainbowKitProvider>
    </QueryClientProvider>
  </WagmiProvider>
);

export default App;
