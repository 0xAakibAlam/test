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

import { createAppKit } from "@reown/appkit/react";
import { sepolia } from "@reown/appkit/networks";
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { cookieStorage, createStorage } from "wagmi";

// 1. Get projectId
const projectId = import.meta.env.VITE_WAGMI_PROJECT_ID

// 2. Set the networks
const networks = [sepolia] as [typeof sepolia];

const wagmiAdapter = new WagmiAdapter({
  projectId,
  networks,
  storage: createStorage({
    storage: cookieStorage
  })
})

// 3. Create a metadata object - optional
const metadata = {
  name: "Anonqa",
  description: "Decentralized Q&A Platform",
  url: "https://anonqa0.netlify.app/", // origin must match your domain & subdomain
  icons: [],
};

// 4. Create a AppKit instance
createAppKit({
  adapters: [wagmiAdapter],
  networks,
  metadata,
  projectId,
  features: {
    analytics: true, // Optional - defaults to your Cloud configuration
    email: false, // Disable email login
    socials: false, // Disable social logins
  }
});

const App = () => (
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
);

export default App;
