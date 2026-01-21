'use client';

import { useVault } from '@/hooks/useVault';
import { formatBalance } from '@/lib/utils';
import type { RiskLevel } from '@/lib/contracts';

interface VaultCardProps {
  name: string;
  address: `0x${string}`;
  risk: RiskLevel;
  apyMin: number;
  apyMax: number;
  description: string;
  onSelect: () => void;
}

const RISK_CONFIG = {
  Low: {
    badge: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    label: 'Low Risk',
  },
  Medium: {
    badge: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    label: 'Medium Risk',
  },
  High: {
    badge: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    label: 'High Risk',
  },
} as const;

export function VaultCard({ name, address, risk, apyMin, apyMax, description, onSelect }: VaultCardProps) {
  const { tvl, userBalance, hasError } = useVault(address);
  const riskConfig = RISK_CONFIG[risk];
  const etherscanUrl = `https://sepolia.etherscan.io/address/${address}`;

  if (hasError) {
    return (
      <div className="flex h-full flex-col backdrop-blur-lg rounded-3xl p-6 bg-red-900/20 border border-red-500/30">
        <div className="text-center">
          <h3 className="text-xl font-bold text-red-300">{name}</h3>
          <p className="mt-2 text-sm text-red-400">Failed to connect to vault contract</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col backdrop-blur-lg hover:backdrop-blur-md border-1 transition hover:scale-102 duration-500 delay-100 rounded-3xl p-6 bg-black/20 border-b border-white/10">
      <div className="mb-4">
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="text-xl font-bold bg-white bg-clip-text text-transparent">{name}</h3>
          <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${riskConfig.badge}`}>
            {riskConfig.label}
          </span>
        </div>
        <p className="line-clamp-2 min-h-[2.5rem] text-sm text-gray-300">{description}</p>
      </div>

      <div className="mb-4 flex-1 space-y-3">
        <div className="flex justify-between rounded-xl bg-white/10 p-3 backdrop-blur-sm">
          <span className="text-sm font-medium text-gray-300">Target APY</span>
          <span className="font-bold text-white">{apyMin}-{apyMax}%</span>
        </div>
        
        <div className="flex justify-between rounded-xl bg-white/10 p-3 backdrop-blur-sm">
          <span className="text-sm font-medium text-gray-300">TVL</span>
          <span className="font-bold text-white">
            ${formatBalance(tvl)}
          </span>
        </div>

        <div className="flex justify-between rounded-xl bg-white/10 p-3 backdrop-blur-sm">
          <span className="text-sm font-medium text-gray-300">Your Balance</span>
          <span className="font-bold text-white">
            {userBalance === '0' ? '—' : `$${formatBalance(userBalance)}`}
          </span>
        </div>

        <a
          href={etherscanUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs font-medium text-blue-400 hover:text-blue-300"
        >
          View on Etherscan ↗
        </a>
      </div>

      <button
        onClick={onSelect}
        className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 px-4 py-3 text-sm font-bold text-white transition-all hover:scale-105 duration-300 active:scale-95"
      >
        Deposit
      </button>
    </div>
  );
}
