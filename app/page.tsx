'use client';

import { useAccount } from 'wagmi';
import { VaultGrid } from '@/components/VaultGrid';
import { NetworkGuard } from '@/components/NetworkGuard';
import { Portfolio } from '@/components/Portfolio';
import { WalletInfo } from '@/components/WalletInfo';

export default function Home() {
  const { isConnected } = useAccount();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="mx-auto max-w-6xl px-6 pt-6">
        <header className="mb-8 rounded-2xl border border-white/20 bg-white/60 backdrop-blur-lg dark:border-zinc-800/50 dark:bg-zinc-900/60">
          <div className="flex items-center justify-between px-6 py-4">
            <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">TM100 DApp</h1>
            <WalletInfo />
          </div>
        </header>

        <main>
          {!isConnected ? (
            <div className="rounded-lg border border-zinc-200 bg-white p-12 text-center dark:border-zinc-800 dark:bg-zinc-900">
              <h2 className="mb-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                Welcome to TM100 Vault DApp
              </h2>
              <p className="mb-6 text-zinc-600 dark:text-zinc-400">
                Connect your wallet to view vaults and make deposits
              </p>
              <div className="flex justify-center">
                <WalletInfo />
              </div>
            </div>
          ) : (
            <NetworkGuard>
              <Portfolio />
              <VaultGrid />
            </NetworkGuard>
          )}
        </main>
      </div>
    </div>
  );
}
