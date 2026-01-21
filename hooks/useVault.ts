'use client';

import { useReadContract, useAccount } from 'wagmi';
import { VAULT_ABI, ERC20_ABI } from '@/lib/contracts';
import { formatUnits } from 'viem';
import { sepolia } from 'wagmi/chains';

export function useVault(vaultAddress: `0x${string}`) {
  const { address } = useAccount();

  const { data: totalAssets, error: totalError } = useReadContract({
    address: vaultAddress,
    abi: VAULT_ABI,
    functionName: 'totalSupply', // Using totalSupply instead of totalAssets for ERC20
    chainId: sepolia.id,
    query: {
      retry: false,
    },
  });

  const { data: userBalance, error: balanceError } = useReadContract({
    address: vaultAddress,
    abi: VAULT_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { 
      enabled: !!address,
      retry: false,
    },
    chainId: sepolia.id,
  });

  const { data: decimals } = useReadContract({
    address: vaultAddress, // Get decimals from the same contract
    abi: VAULT_ABI,
    functionName: 'decimals',
    chainId: sepolia.id,
    query: {
      retry: false,
    },
  });

  // Check if any critical call failed
  const hasError = !!totalError;
  
  // Only return real blockchain data, no fallbacks
  const tvl = totalAssets && decimals ? formatUnits(totalAssets, decimals) : '0';
  const balance = userBalance && decimals ? formatUnits(userBalance, decimals) : '0';

  return {
    tvl,
    userBalance: balance,
    error: totalError || balanceError,
    hasError,
  };
}
