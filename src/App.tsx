import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import Landing from "@/pages/Landing";
import HomePage from "@/pages/HomePage";
import { PostInfoPage } from "@/pages/PostInfoPage";
import { MyPostsPage } from "@/pages/MyPostsPage";
import { MyCommentsPage } from "@/pages/MyCommentsPage";
import { AnnouncementPage } from "@/pages/AnnouncementPage";
import { ArchivePage } from "@/pages/ArchivePage";
import NotFound from "@/pages/NotFound";

import { sepolia } from "wagmi/chains"
import { WagmiProvider, createConfig, http } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const config = createConfig({
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(),
  },
});

const queryClient = new QueryClient();

const App = () => (
  <WagmiProvider config={config}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppLayout>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/app" element={<HomePage />} />
              <Route path="/app/post/:id" element={<PostInfoPage />} />
              <Route path="/app/my-posts" element={<MyPostsPage />} />
              <Route path="/app/my-comments" element={<MyCommentsPage />} />
              <Route path="/app/announcements" element={<AnnouncementPage />} />
              <Route path="/app/archives" element={<ArchivePage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AppLayout>
      </TooltipProvider>
    </QueryClientProvider>
  </WagmiProvider>
);

export default App;