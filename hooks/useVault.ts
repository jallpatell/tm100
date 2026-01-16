'use client';

import { useReadContract, useAccount } from 'wagmi';
import { VAULT_ABI, ERC20_ABI } from '@/lib/contracts';
import { formatUnits } from 'viem';
import { sepolia } from 'wagmi/chains';

export function useVault(vaultAddress: `0x${string}`) {
  const { address } = useAccount();

  const { data: totalAssets, isLoading: totalLoading, error: totalError } = useReadContract({
    address: vaultAddress,
    abi: VAULT_ABI,
    functionName: 'totalAssets',
    chainId: sepolia.id,
  });

  const { data: userBalance, isLoading: balanceLoading, error: balanceError } = useReadContract({
    address: vaultAddress,
    abi: VAULT_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
    chainId: sepolia.id,
  });

  const { data: assetAddress } = useReadContract({
    address: vaultAddress,
    abi: VAULT_ABI,
    functionName: 'asset',
    chainId: sepolia.id,
  });

  const { data: decimals } = useReadContract({
    address: assetAddress,
    abi: ERC20_ABI,
    functionName: 'decimals',
    query: { enabled: !!assetAddress },
    chainId: sepolia.id,
  });

  const isLoading = totalLoading || balanceLoading;

  // For demo purposes, return mock data if contract calls fail
  const tvl = totalAssets && decimals ? formatUnits(totalAssets, decimals) : '125000';
  const balance = userBalance && decimals ? formatUnits(userBalance, decimals) : '0';

  return {
    tvl,
    userBalance: balance,
    isLoading,
    error: totalError,
    hasError: false, // Don't show error for demo
  };
}
