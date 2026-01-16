'use client';

import { useAccount } from 'wagmi';
import { useVault } from '@/hooks/useVault';
import { VAULTS } from '@/lib/contracts';
import { formatBalance } from '@/lib/utils';

export function Portfolio() {
  const { address } = useAccount();
  
  const stableVault = useVault(VAULTS[0].address);
  const growthVault = useVault(VAULTS[1].address);
  const turboVault = useVault(VAULTS[2].address);

  if (!address) return null;

  const positions = [
    { name: VAULTS[0].name, balance: stableVault.userBalance, isLoading: stableVault.isLoading },
    { name: VAULTS[1].name, balance: growthVault.userBalance, isLoading: growthVault.isLoading },
    { name: VAULTS[2].name, balance: turboVault.userBalance, isLoading: turboVault.isLoading },
  ];

  const totalValue = positions.reduce((sum, pos) => sum + parseFloat(pos.balance || '0'), 0);
  const hasPositions = totalValue > 0;

  if (!hasPositions) return null;

  return (
    <div className="mb-6 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
        Your Portfolio
      </h2>
      
      <div className="mb-4 rounded-lg bg-zinc-50 p-4 dark:bg-zinc-800">
        <div className="text-sm text-zinc-600 dark:text-zinc-400">Total Value</div>
        <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          ${formatBalance(totalValue.toString())}
        </div>
      </div>

      <div className="space-y-3">
        {positions.map((position) => {
          const value = parseFloat(position.balance || '0');
          if (value === 0) return null;
          
          return (
            <div key={position.name} className="flex justify-between">
              <span className="text-sm text-zinc-600 dark:text-zinc-400">{position.name}</span>
              <span className="font-medium text-zinc-900 dark:text-zinc-50">
                {position.isLoading ? '...' : `$${formatBalance(position.balance)}`}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
