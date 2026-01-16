'use client';

import { useReadContract, useAccount } from 'wagmi';
import { VAULT_ADDRESS, VAULT_ABI, ERC20_ABI } from '@/lib/contracts';
import { formatUnits } from 'viem';

export function useVaultData() {
  const { address } = useAccount();

  const { data: assetAddress, isLoading: assetLoading, error: assetError } = useReadContract({
    address: VAULT_ADDRESS,
    abi: VAULT_ABI,
    functionName: 'asset',
  });

  const { data: totalAssets, isLoading: totalLoading, error: totalError } = useReadContract({
    address: VAULT_ADDRESS,
    abi: VAULT_ABI,
    functionName: 'totalAssets',
  });

  const { data: userBalance, isLoading: balanceLoading, error: balanceError } = useReadContract({
    address: VAULT_ADDRESS,
    abi: VAULT_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const { data: tokenBalance, isLoading: tokenBalanceLoading } = useReadContract({
    address: assetAddress,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address && !!assetAddress },
  });

  const { data: decimals } = useReadContract({
    address: assetAddress,
    abi: ERC20_ABI,
    functionName: 'decimals',
    query: { enabled: !!assetAddress },
  });

  const { data: symbol } = useReadContract({
    address: assetAddress,
    abi: ERC20_ABI,
    functionName: 'symbol',
    query: { enabled: !!assetAddress },
  });

  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: assetAddress,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: address && assetAddress ? [address, VAULT_ADDRESS] : undefined,
    query: { enabled: !!address && !!assetAddress },
  });

  const isLoading = assetLoading || totalLoading || balanceLoading || tokenBalanceLoading;
  const error = assetError || totalError || balanceError;

  return {
    assetAddress,
    totalAssets: totalAssets ? formatUnits(totalAssets, decimals || 18) : '0',
    userBalance: userBalance ? formatUnits(userBalance, decimals || 18) : '0',
    tokenBalance: tokenBalance ? formatUnits(tokenBalance, decimals || 18) : '0',
    allowance: allowance || 0n,
    decimals: decimals || 18,
    symbol: symbol || 'TOKEN',
    isLoading,
    error,
    refetchAllowance,
  };
}
