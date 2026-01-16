'use client';

import { useAccount, useBalance } from 'wagmi';

export function useETHBalance() {
  const { address } = useAccount();
  
  const { data, isLoading } = useBalance({
    address,
    query: { enabled: !!address },
  });

  return {
    balance: data?.formatted || '0',
    symbol: data?.symbol || 'ETH',
    isLoading,
  };
}
