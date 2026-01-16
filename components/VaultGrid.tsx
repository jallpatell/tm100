'use client';

import { useState } from 'react';
import { VaultCard } from './VaultCard';
import { DepositForm } from './DepositForm';
import { VAULTS } from '@/lib/contracts';

export function VaultGrid() {
  const [selectedVault, setSelectedVault] = useState<string | null>(null);

  if (selectedVault) {
    const vault = VAULTS.find(v => v.id === selectedVault);
    if (!vault) return null;

    return (
      <div className="space-y-6">
        <button
          onClick={() => setSelectedVault(null)}
          className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to vaults
        </button>
        <DepositForm vaultAddress={vault.address} vaultName={vault.name} />
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-50">Select a Vault</h2>
      <div className="grid gap-6 md:grid-cols-3">
        {VAULTS.map((vault) => (
          <VaultCard
            key={vault.id}
            name={vault.name}
            address={vault.address}
            risk={vault.risk}
            apyMin={vault.apyMin}
            apyMax={vault.apyMax}
            description={vault.description}
            onSelect={() => setSelectedVault(vault.id)}
          />
        ))}
      </div>
    </div>
  );
}
