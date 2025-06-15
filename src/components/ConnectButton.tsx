import { ConnectKitButton } from "connectkit";
import { Wallet, Loader2 } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export const CustomConnectButton = () => {
  const { theme } = useTheme();

  return (
    <ConnectKitButton.Custom>
      {({ isConnected, isConnecting, show, truncatedAddress, ensName }) => (
        <button
          onClick={show}
          className={`
            flex items-center gap-2 px-3 py-2 rounded-lg transition text-xs
            ${theme === "dark"
              ? "bg-primary text-primary-foreground hover:bg-primary/80"
              : "bg-black text-white hover:bg-gray-800"}
            shadow-md
          `}
          style={{ minWidth: 100 }}
        >
          {isConnecting ? (
            <>
              <Loader2 className="animate-spin h-5 w-5" />
              Connecting...
            </>
          ) : isConnected ? (
            <>
              <Wallet className="h-5 w-5" />
              {ensName || truncatedAddress}
            </>
          ) : (
            <>
              <Wallet className="h-5 w-5" />
              Connect Wallet
            </>
          )}
        </button>
      )}
    </ConnectKitButton.Custom>
  );
};