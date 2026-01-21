'use client';

import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export function WalletInfo() {
  const { address, isConnected } = useAccount();

  if (!isConnected || !address) {
    return <ConnectButton />;
  }

  return (
    <div className="flex items-center gap-3">
      <ConnectButton />
    </div>
  );
}
