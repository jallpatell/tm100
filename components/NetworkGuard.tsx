'use client';

import { useAccount, useChainId, useSwitchChain } from 'wagmi';
import { sepolia } from 'wagmi/chains';

export function NetworkGuard({ children }: { children: React.ReactNode }) {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  const isWrongNetwork = isConnected && chainId !== sepolia.id;

  if (!isWrongNetwork) {
    return <>{children}</>;
  }

  return (
    <div className="rounded-xl border border-orange-200 bg-orange-50 p-6 dark:border-orange-900 dark:bg-orange-950">
      <div className="mb-4 flex items-start gap-3">
        <div className="text-2xl">⚠️</div>
        <div className="flex-1">
          <h3 className="mb-1 font-semibold text-orange-900 dark:text-orange-50">
            Wrong Network
          </h3>
          <p className="text-sm text-orange-700 dark:text-orange-300">
            Please switch to Sepolia testnet to use this app
          </p>
        </div>
      </div>
      <button
        onClick={() => switchChain({ chainId: sepolia.id })}
        className="w-full rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600"
      >
        Switch to Sepolia
      </button>
    </div>
  );
}
