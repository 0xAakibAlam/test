import { createContext, useContext, ReactNode } from 'react';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

interface WalletContextType {
  wallet: {
    isConnected: boolean;
    address: string;
  };
  CustomConnectButton: React.FC;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const { address, isConnected } = useAccount();

  const CustomConnectButton: React.FC = () => {
    return (
      <ConnectButton.Custom>
        {({
          account,
          chain,
          openAccountModal,
          openChainModal,
          openConnectModal,
          mounted,
        }) => {
          const ready = mounted;
          const connected = ready && account && chain;

          return (
            <div
              {...(!ready && {
                'aria-hidden': true,
                style: {
                  opacity: 0,
                  pointerEvents: 'none',
                  userSelect: 'none',
                },
              })}
            >
              {(() => {
                if (isConnected && chain.unsupported) {
                  return (
                    <Button 
                      onClick={(e) => {
                        e.preventDefault();
                        openChainModal();
                      }} 
                      variant="destructive"
                    >
                      Wrong network
                    </Button>
                  );
                }

                if (!connected) {
                  return (
                    <Button 
                      onClick={(e) => {
                        e.preventDefault();
                        openConnectModal();
                      }} 
                      className="flex items-center gap-2"
                    >
                      <User className="h-4 w-4" />
                      <span>Connect Wallet</span>
                    </Button>
                  )
                } else {
                  return (
                    <Button
                      onClick={(e) => {
                        e.preventDefault();
                        openAccountModal();
                      }} 
                      variant="outline"
                      className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span className="hidden sm:inline">
                          {account.displayName}
                        </span>
                    </Button>
                  )
                }
              })()}
            </div>
          )
        }}
      </ConnectButton.Custom>
    );
  };

  return (
    <WalletContext.Provider 
      value={{ 
        wallet: { 
          isConnected: isConnected, 
          address: address || '' 
        },
        CustomConnectButton
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};