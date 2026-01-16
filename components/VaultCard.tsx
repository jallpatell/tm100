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
    badge: 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200',
    label: 'Low Risk',
  },
  Medium: {
    badge: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-200',
    label: 'Medium Risk',
  },
  High: {
    badge: 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200',
    label: 'High Risk',
  },
} as const;

export function VaultCard({ name, address, risk, apyMin, apyMax, description, onSelect }: VaultCardProps) {
  const { tvl, userBalance, isLoading } = useVault(address);
  const riskConfig = RISK_CONFIG[risk];
  const etherscanUrl = `https://sepolia.etherscan.io/address/${address}`;

  return (
    <div className="flex h-full flex-col rounded-xl border border-zinc-200 bg-white p-6 transition-shadow hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-4">
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">{name}</h3>
          <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${riskConfig.badge}`}>
            {riskConfig.label}
          </span>
        </div>
        <p className="line-clamp-2 min-h-[2.5rem] text-sm text-zinc-600 dark:text-zinc-400">{description}</p>
      </div>

      <div className="mb-4 flex-1 space-y-3">
        <div className="flex justify-between">
          <span className="text-sm text-zinc-600 dark:text-zinc-400">Target APY</span>
          <span className="font-semibold text-zinc-900 dark:text-zinc-50">{apyMin}-{apyMax}%</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-sm text-zinc-600 dark:text-zinc-400">TVL</span>
          <span className="font-medium text-zinc-900 dark:text-zinc-50">
            {isLoading ? '...' : `$${formatBalance(tvl)}`}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-sm text-zinc-600 dark:text-zinc-400">Your Balance</span>
          <span className="font-medium text-zinc-900 dark:text-zinc-50">
            {isLoading ? '...' : userBalance === '0' ? '—' : `$${formatBalance(userBalance)}`}
          </span>
        </div>

        <a
          href={etherscanUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          View on Etherscan ↗
        </a>
      </div>

      <button
        onClick={onSelect}
        className="w-full rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        Deposit
      </button>
    </div>
  );
}
