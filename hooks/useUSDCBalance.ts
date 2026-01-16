'use client';

import { useReadContract, useAccount, useChainId } from 'wagmi';
import { ERC20_ABI, USDC_ADDRESSES } from '@/lib/contracts';
import { formatUnits } from 'viem';

export function useUSDCBalance() {
  const { address } = useAccount();
  const chainId = useChainId();
  
  const usdcAddress = USDC_ADDRESSES[chainId as keyof typeof USDC_ADDRESSES];

  const { data: balance, isLoading, refetch } = useReadContract({
    address: usdcAddress,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!usdcAddress,
      refetchInterval: 10000, // Poll every 10 seconds
    },
  });

  return {
    balance: balance ? formatUnits(balance, 6) : '0',
    isLoading,
    refetch,
    usdcAddress,
  };
}
