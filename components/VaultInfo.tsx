'use client';

import { useVaultData } from '@/hooks/useVaultData';

export function VaultInfo() {
  const { totalAssets, userBalance, tokenBalance, symbol, isLoading, error } = useVaultData();

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="text-sm text-red-800">
          Failed to load vault data. Please check your connection.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Vault Overview
        </h2>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-zinc-600 dark:text-zinc-400">Total Vault Assets</span>
            <span className="font-medium text-zinc-900 dark:text-zinc-50">
              {isLoading ? '...' : `${totalAssets} ${symbol}`}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-zinc-600 dark:text-zinc-400">Your Vault Balance</span>
            <span className="font-medium text-zinc-900 dark:text-zinc-50">
              {isLoading ? '...' : `${userBalance} ${symbol}`}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-zinc-600 dark:text-zinc-400">Your Wallet Balance</span>
            <span className="font-medium text-zinc-900 dark:text-zinc-50">
              {isLoading ? '...' : `${tokenBalance} ${symbol}`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
