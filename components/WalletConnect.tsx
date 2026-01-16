'use client';

import { useAccount, useDisconnect } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useUSDCBalance } from '@/hooks/useUSDCBalance';
import { truncateAddress, formatBalance } from '@/lib/utils';

export function WalletConnect() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { balance, isLoading } = useUSDCBalance();

  if (!isConnected) {
    return <ConnectButton />;
  }

  return (
    <div className="flex items-center gap-3">
      <div className="rounded-lg border border-zinc-200 bg-white px-4 py-2 dark:border-zinc-700 dark:bg-zinc-800">
        <div className="flex items-center gap-2">
          <div className="text-sm">
            <div className="font-medium text-zinc-900 dark:text-zinc-50">
              {isLoading ? '...' : `${formatBalance(balance)} USDC`}
            </div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400">
              {address && truncateAddress(address)}
            </div>
          </div>
        </div>
      </div>
      <button
        onClick={() => disconnect()}
        className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
      >
        Disconnect
      </button>
    </div>
  );
}
