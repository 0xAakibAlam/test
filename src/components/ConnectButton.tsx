import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

export const CustomConnectButton = () => {
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

        if (!ready) {
          return (
            <div
              aria-hidden="true"
              style={{
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              }}
            />
          );
        }

        if (connected && chain.id !== 11155111) {
          return (
            <Button 
              onClick={(e) => {
                e.preventDefault();
                openChainModal();
              }} 
              variant="destructive"
              className="flex items-center gap-2"
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
              variant="default"
              className="flex items-center gap-2"
            >
              <User className="h-4 w-4" />
              <span>Connect Wallet</span>
            </Button>
          );
        }

        return (
          <Button
            onClick={(e) => {
              e.preventDefault();
              openAccountModal();
            }} 
            variant="default"
            className="flex items-center gap-2"
          >
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">
              {account.displayName}
            </span>
          </Button>
        );
      }}
    </ConnectButton.Custom>
  );
};