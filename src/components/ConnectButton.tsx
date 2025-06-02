import { Wallet } from "lucide-react";
import { Button } from "./ui/button"
import { useAppKitAccount, useAppKit } from "@reown/appkit/react";

function truncateAddress(address: string) {
  return address ? `${address.slice(0, 4)}...${address.slice(-6)}` : '';
}

export const CustomConnectButton = () => {
  const { address, isConnected } = useAppKitAccount();
  const { open } = useAppKit();

  return (
    <Button
      variant="default"
      onClick={() => open({ view: isConnected ? "Account" : "Connect" })}
      className="px-2 py-1 text-xs sm:px-4 sm:py-2 sm:text-sm flex items-center gap-1 sm:gap-2 min-w-0"
    >
      <Wallet className="w-4 h-4 sm:w-5 sm:h-5" />
      <span className="truncate">
        {isConnected ? truncateAddress(address) : "Connect Wallet"}
      </span>
    </Button>
  );
};