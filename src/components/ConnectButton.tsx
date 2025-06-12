import { createAppKit } from "@reown/appkit/react";
import { EthersAdapter } from "@reown/appkit-adapter-ethers";
import { sepolia } from "@reown/appkit/networks";

const projectId = import.meta.env.VITE_WAGMI_PROJECT_ID

const networks = [sepolia] as [typeof sepolia];

const metadata = {
  name: "dX",
  description: "Decentralized Q&A Platform",
  url: "https://anonqa0.netlify.app/", // origin must match your domain & subdomain
  icons: [],
};

createAppKit({
  adapters: [new EthersAdapter()],
  networks,
  metadata,
  projectId,
  features: {
    analytics: true,
    email: false,
    socials: false,
  },
  themeVariables: {
    '--w3m-accent': '#0059b3',
    '--w3m-font-family': "'Arial', sans-serif",
    '--w3m-color-mix': '#ffffff',
    '--w3m-color-mix-strength': 0,
    '--w3m-font-size-master': '11px',
    '--w3m-border-radius-master': '1px',
    '--w3m-z-index': 1000,
  },
});

export const CustomConnectButton = () => {
  return (
    <appkit-button 
      label="Connect Wallet"
      loadingLabel="Connecting..."
      size="md" 
      // balance="hide"
    />
  );
};