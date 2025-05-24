import { ReactNode } from "react";
import { WalletProvider } from "@/context/WalletContext";
import { ThemeProvider } from "@/context/ThemeContext";
import Footer from "./Footer";

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <ThemeProvider>
      <WalletProvider>
        <div className="min-h-screen flex flex-col">
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </WalletProvider>
    </ThemeProvider>
  );
};

export default AppLayout;
