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
    <div className="rounded-2xl border border-gray-100 bg-white/80 p-6 shadow-xl backdrop-blur-xl dark:border-gray-800 dark:bg-gray-800/80">
      <div className="mb-4 flex items-start gap-3">
        <div className="text-2xl">⚠️</div>
        <div className="flex-1">
          <h3 className="mb-1 text-lg font-bold text-gray-900 dark:text-white">
            Wrong Network
          </h3>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Please switch to Sepolia testnet to use this app
          </p>
        </div>
      </div>
      <button
        onClick={() => switchChain({ chainId: sepolia.id })}
        className="w-full rounded-xl bg-[#0D76FE] px-4 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-[#0D76FE]/90 hover:shadow-xl active:scale-95"
      >
        Switch to Sepolia
      </button>
    </div>
  );
}
