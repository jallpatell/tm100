'use client';

import { useAccount } from 'wagmi';
import { VaultGrid } from '@/components/VaultGrid';
import { NetworkGuard } from '@/components/NetworkGuard';
import { Portfolio } from '@/components/Portfolio';
import { WalletInfo } from '@/components/WalletInfo';
import { ToastContainer } from '@/components/Toast';
import { RecentActivity } from '@/components/RecentActivity';

export default function Home() {
  const { isConnected } = useAccount();

  return (
    <div className="min-h-screen bg-black">
      <div className="fixed top-0 left-0 w-full z-50">
        <nav className="relative z-10 backdrop-blur-lg hover:backdrop-blur-md border-1 transition hover:scale-102 duration-500 delay-100 rounded-2xl lg:rounded-3xl p-0.2 mt-3 lg:mt-5 mx-3 lg:mx-5 bg-black/20 border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 lg:px-6 py-3 lg:py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-xl lg:text-3xl hover:cursor-pointer font-sans font-extrabold hover:bg-blue-500 hover:scale-105 duration-300 delay-130 bg-white bg-clip-text text-transparent">
                  TM100 Vault
                </span>
              </div>
              <WalletInfo />
            </div>
          </div>
        </nav>
      </div>

      <div className="pt-28 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <main className="space-y-8 lg:space-y-12">
          {!isConnected ? (
            <div className="backdrop-blur-lg backdrop-blur-md border-1 rounded-3xl p-8 bg-black/20 border-b border-white/10 text-center">
              <h2 className="mb-3 text-3xl font-bold bg-white bg-clip-text text-transparent">
                Welcome to TM100 Vault
              </h2>
              <p className="mb-8 text-lg text-gray-300">
                Connect your wallet to view vaults and make deposits
              </p>
              <div className="flex justify-center">
                <WalletInfo />
              </div>
            </div>
          ) : (
            <NetworkGuard>
              <VaultGrid />
              <RecentActivity />
              <Portfolio />
            </NetworkGuard>
          )}
        </main>
      </div>
      <ToastContainer />
    </div>
  );
}
