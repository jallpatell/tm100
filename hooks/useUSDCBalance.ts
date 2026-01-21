'use client';

import { useReadContract, useAccount } from 'wagmi';
import { ERC20_ABI, USDC_ADDRESS } from '@/lib/contracts';
import { formatUnits } from 'viem';
import { sepolia } from 'wagmi/chains';

export function useUSDCBalance() {
  const { address } = useAccount();

  const { data: balance, isLoading, refetch, error } = useReadContract({
    address: USDC_ADDRESS,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
      refetchInterval: 10000,
    },
    chainId: sepolia.id,
  });

  return {
    balance: balance ? formatUnits(balance, 6) : '0', // USDC has 6 decimals
    isLoading,
    refetch,
    error,
    hasError: !!error,
  };
}
