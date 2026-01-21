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
      <div className="space-y-8">
        <button
          onClick={() => setSelectedVault(null)}
          className="inline-flex items-center gap-2 backdrop-blur-lg hover:backdrop-blur-md border-1 transition hover:scale-102 duration-300 rounded-xl px-4 py-2.5 text-sm font-bold bg-black/20 border-white/10 text-white"
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
    <div className="mb-8">
      <h2 className="mb-6 lg:mb-8 text-2xl lg:text-3xl font-bold bg-white bg-clip-text text-transparent mt-8 lg:mt-10">Select a Vault</h2>
      <div className="grid gap-4 sm:gap-6 lg:gap-8 sm:grid-cols-2 lg:grid-cols-3">
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
