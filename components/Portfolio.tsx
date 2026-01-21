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
    { name: VAULTS[0].name, balance: stableVault.userBalance },
    { name: VAULTS[1].name, balance: growthVault.userBalance },
    { name: VAULTS[2].name, balance: turboVault.userBalance },
  ];

  const totalValue = positions.reduce((sum, pos) => sum + parseFloat(pos.balance || '0'), 0);
  const hasPositions = totalValue > 0;

  if (!hasPositions) return null;

  return (
    <div className="mb-8 backdrop-blur-lg hover:backdrop-blur-md border-1 transition hover:scale-102 duration-500 delay-100 rounded-3xl p-6 bg-black/20 border-b border-white/10">
      <h2 className="mb-4 text-2xl font-bold bg-white bg-clip-text text-transparent">
        Your Portfolio
      </h2>
      
      <div className="mb-4 rounded-xl bg-white/10 p-5 backdrop-blur-sm">
        <div className="text-sm font-medium text-gray-300">Total Value</div>
        <div className="text-3xl font-bold text-white">
          ${formatBalance(totalValue.toString())}
        </div>
      </div>

      <div className="space-y-3">
        {positions.map((position) => {
          const value = parseFloat(position.balance || '0');
          if (value === 0) return null;
          
          return (
            <div key={position.name} className="flex justify-between rounded-xl bg-white/10 p-3 backdrop-blur-sm">
              <span className="text-sm font-medium text-gray-300">{position.name}</span>
              <span className="font-bold text-white">
                ${formatBalance(position.balance)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
